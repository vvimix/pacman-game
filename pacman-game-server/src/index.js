import http from 'http';
import { WebSocketServer } from 'ws';
import {
  createGame,
  startGame,
  setInput,
  setPaused,
  restartGame,
  setPlayerCount,
  tick,
  getSnapshot,
  eliminatePlayer,
  PLAYER_DEFS,
  MODES,
} from '../../pacman-game-frontend/src/game/engine.mjs';

const PORT = Number(process.env.PORT) || 3001;
const TICK_MS = 50;
const HOST_GRACE_MS = 2500;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const rooms = new Map();

function generateCode() {
  let code = '';
  for (let i = 0; i < 5; i += 1) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  if (rooms.has(code)) return generateCode();
  return code;
}

function send(ws, type, payload = {}) {
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify({ type, ...payload }));
  }
}

function filledCount(room) {
  return room.seats.filter((s) => s?.ws).length;
}

function lobbyPayload(room) {
  return {
    roomCode: room.code,
    mode: room.mode,
    maxPlayers: room.maxPlayers,
    filled: filledCount(room),
    seats: room.seats.map((s, i) =>
      s
        ? {
            playerId: s.playerId,
            role: s.role,
            connected: !!s.ws,
            team: PLAYER_DEFS[i]?.team ?? 0,
          }
        : null
    ),
  };
}

function broadcast(room, type, payload = {}) {
  for (const seat of room.seats) {
    if (seat?.ws) send(seat.ws, type, payload);
  }
}

function broadcastLobby(room) {
  broadcast(room, 'lobby', lobbyPayload(room));
}

function broadcastState(room) {
  if (!room.game) return;
  try {
    broadcast(room, 'state', { state: getSnapshot(room.game) });
  } catch (err) {
    console.error('broadcastState failed', room.code, err);
  }
}

function stopLoop(room) {
  if (room.interval) {
    clearInterval(room.interval);
    room.interval = null;
  }
}

function clearHostTimer(room) {
  if (room.hostTimer) {
    clearTimeout(room.hostTimer);
    room.hostTimer = null;
  }
}

function destroyRoom(code, reason) {
  const room = rooms.get(code);
  if (!room) return;
  clearHostTimer(room);
  stopLoop(room);
  broadcast(room, 'error', { message: reason || 'Room closed' });
  for (const seat of room.seats) {
    if (seat?.ws) {
      try {
        seat.ws.close();
      } catch {
        /* ignore */
      }
      seat.ws.roomCode = null;
      seat.ws.role = null;
      seat.ws.playerId = null;
      seat.ws.seatIndex = null;
    }
  }
  rooms.delete(code);
}

function ensureLoop(room) {
  if (room.interval) return;
  room.interval = setInterval(() => {
    if (!room.game) return;
    try {
      const { events } = tick(room.game, Date.now());
      for (const event of events) {
        broadcast(room, 'event', { event });
      }
      broadcastState(room);
    } catch (err) {
      console.error('tick failed', room.code, err);
    }
  }, TICK_MS);
}

function maybeAutoStart(room) {
  if (filledCount(room) === room.maxPlayers && room.game?.status === 'ready') {
    syncRoster(room);
    if (startGame(room.game)) {
      broadcast(room, 'event', { event: { type: 'start' } });
      broadcastState(room);
    }
  }
}

function syncRoster(room) {
  const n = Math.max(2, filledCount(room));
  if (room.game.playerCount !== n || room.game.status === 'ready') {
    // Rebuild roster to match seated players before start / while ready
    if (room.game.status === 'ready') {
      setPlayerCount(room.game, n);
    }
  }
}

function assignSeat(room, ws) {
  const idx = room.seats.findIndex((s) => !s?.ws);
  if (idx < 0) return null;
  const def = PLAYER_DEFS[idx];
  const seat = {
    ws,
    playerId: def.id,
    role: def.label,
    seatIndex: idx,
  };
  room.seats[idx] = seat;
  ws.roomCode = room.code;
  ws.role = def.label;
  ws.playerId = def.id;
  ws.seatIndex = idx;
  return seat;
}

function resolveMode(mode) {
  if (mode == null || mode === '') return 'coop';
  if (!MODES.includes(mode)) return null;
  return mode;
}

function createRoom(ws, { maxPlayers = 2, mode = 'coop' } = {}) {
  const max = Math.max(2, Math.min(8, Number(maxPlayers) || 2));
  const resolvedMode = resolveMode(mode);
  if (!resolvedMode) {
    send(ws, 'error', {
      message: `Unknown mode "${mode}". Restart the game server (supported: ${MODES.join(', ')})`,
    });
    return null;
  }
  const code = generateCode();
  const room = {
    code,
    maxPlayers: max,
    mode: resolvedMode,
    seats: Array.from({ length: max }, () => null),
    game: createGame({ playerCount: max, mode: resolvedMode }),
    interval: null,
    hostTimer: null,
  };
  rooms.set(code, room);
  const seat = assignSeat(room, ws);
  console.log(`room ${code} created mode=${resolvedMode} max=${max}`);
  send(ws, 'room', {
    ...lobbyPayload(room),
    role: seat.role,
    playerId: seat.playerId,
    waiting: true,
  });
  broadcastLobby(room);
  broadcastState(room);
  ensureLoop(room);
  return room;
}

function reclaimHost(ws, code, opts = {}) {
  const room = rooms.get(code);
  if (!room) return false;
  const hostSeat = room.seats[0];
  if (hostSeat?.ws) return false;
  clearHostTimer(room);

  // If host reconnects asking for a different mode/size while lobby is still empty, rebuild.
  const wantMode = resolveMode(opts.mode);
  const wantMax = opts.maxPlayers != null
    ? Math.max(2, Math.min(8, Number(opts.maxPlayers) || 2))
    : null;
  const alone = filledCount(room) === 0;
  if (
    alone &&
    room.game?.status === 'ready' &&
    ((wantMode && wantMode !== room.mode) || (wantMax && wantMax !== room.maxPlayers))
  ) {
    room.mode = wantMode || room.mode;
    room.maxPlayers = wantMax || room.maxPlayers;
    room.seats = Array.from({ length: room.maxPlayers }, () => null);
    room.game = createGame({ playerCount: room.maxPlayers, mode: room.mode });
    console.log(`room ${code} rebuilt mode=${room.mode} max=${room.maxPlayers}`);
  }

  const def = PLAYER_DEFS[0];
  room.seats[0] = {
    ws,
    playerId: def.id,
    role: def.label,
    seatIndex: 0,
  };
  ws.roomCode = room.code;
  ws.role = def.label;
  ws.playerId = def.id;
  ws.seatIndex = 0;
  send(ws, 'room', {
    ...lobbyPayload(room),
    role: def.label,
    playerId: def.id,
    waiting: filledCount(room) < 2 || room.game?.status === 'ready',
  });
  broadcastLobby(room);
  broadcastState(room);
  ensureLoop(room);
  return true;
}

function joinRoom(ws, code) {
  const normalized = String(code || '')
    .trim()
    .toUpperCase();
  const room = rooms.get(normalized);
  if (!room) {
    send(ws, 'error', { message: 'Room not found' });
    return null;
  }
  if (filledCount(room) >= room.maxPlayers) {
    send(ws, 'error', { message: 'Room is full' });
    return null;
  }
  if (room.game && room.game.status !== 'ready' && room.game.status !== 'playing') {
    // allow join only before end states mid-ready/playing — mid playing: reject
  }
  if (room.game && !['ready'].includes(room.game.status)) {
    send(ws, 'error', { message: 'Game already in progress' });
    return null;
  }

  const seat = assignSeat(room, ws);
  if (!seat) {
    send(ws, 'error', { message: 'Room is full' });
    return null;
  }

  syncRoster(room);
  send(ws, 'room', {
    ...lobbyPayload(room),
    role: seat.role,
    playerId: seat.playerId,
    waiting: filledCount(room) < 2,
  });
  broadcast(room, 'roomReady', { roomCode: room.code, ...lobbyPayload(room) });
  broadcastLobby(room);
  broadcastState(room);
  ensureLoop(room);

  // Classic 2P: auto-start when full. Party (max>2): wait for host Start or full auto-start.
  if (room.maxPlayers === 2 && filledCount(room) === 2 && room.game?.status === 'ready') {
    syncRoster(room);
    if (startGame(room.game)) {
      broadcast(room, 'event', { event: { type: 'start' } });
      broadcastState(room);
    }
  } else {
    maybeAutoStart(room);
  }
  return room;
}

function handleMessage(ws, raw) {
  let msg;
  try {
    msg = JSON.parse(raw);
  } catch {
    send(ws, 'error', { message: 'Invalid JSON' });
    return;
  }

  const type = msg.type;
  if (type === 'ping') {
    send(ws, 'pong', { t: Date.now() });
    return;
  }

  if (type === 'createRoom') {
    if (ws.roomCode) {
      send(ws, 'error', { message: 'Already in a room' });
      return;
    }
    const prefer = String(msg.code || '')
      .trim()
      .toUpperCase();
    if (
      prefer &&
      reclaimHost(ws, prefer, { maxPlayers: msg.maxPlayers, mode: msg.mode })
    ) {
      return;
    }
    createRoom(ws, {
      maxPlayers: msg.maxPlayers,
      mode: msg.mode,
    });
    return;
  }

  if (type === 'joinRoom') {
    if (ws.roomCode) {
      send(ws, 'error', { message: 'Already in a room' });
      return;
    }
    joinRoom(ws, msg.code);
    return;
  }

  const room = rooms.get(ws.roomCode);
  if (!room || !room.game) {
    send(ws, 'error', { message: 'Not in a room' });
    return;
  }

  if (type === 'start') {
    if (ws.seatIndex !== 0) {
      send(ws, 'error', { message: 'Only host can start' });
      return;
    }
    if (filledCount(room) < 2) {
      send(ws, 'error', { message: 'Need at least 2 players' });
      return;
    }
    if (room.game.status !== 'ready') {
      send(ws, 'error', { message: 'Cannot start now' });
      return;
    }
    syncRoster(room);
    if (startGame(room.game)) {
      broadcast(room, 'event', { event: { type: 'start' } });
      broadcastState(room);
      broadcastLobby(room);
    }
    return;
  }

  if (type === 'input') {
    setInput(room.game, ws.playerId, msg.dir);
    return;
  }

  if (type === 'pause') {
    setPaused(room.game, !!msg.paused);
    broadcastState(room);
    return;
  }

  if (type === 'restart') {
    if (ws.seatIndex !== 0) {
      send(ws, 'error', { message: 'Only host can restart' });
      return;
    }
    restartGame(room.game);
    syncRoster(room);
    broadcast(room, 'event', { event: { type: 'restart' } });
    broadcastState(room);
    broadcastLobby(room);
  }
}

function handleClose(ws) {
  const code = ws.roomCode;
  if (!code) return;
  const room = rooms.get(code);
  if (!room) return;

  const idx = ws.seatIndex;
  const isHost = idx === 0;

  if (isHost) {
    if (room.seats[0]?.ws === ws) {
      room.seats[0] = {
        ws: null,
        playerId: 1,
        role: 'P1',
        seatIndex: 0,
      };
    }
    ws.roomCode = null;
    clearHostTimer(room);
    room.hostTimer = setTimeout(() => {
      const current = rooms.get(code);
      if (current && !current.seats[0]?.ws) {
        destroyRoom(code, 'Host disconnected');
      }
    }, HOST_GRACE_MS);
    broadcast(room, 'event', { event: { type: 'hostReconnecting' } });
    broadcastLobby(room);
    return;
  }

  // Guest seat
  if (typeof idx === 'number' && room.seats[idx]?.ws === ws) {
    room.seats[idx] = null;
  }
  ws.roomCode = null;

  if (room.game && room.game.status === 'playing') {
    const events = eliminatePlayer(room.game, ws.playerId, []);
    for (const event of events) {
      broadcast(room, 'event', { event });
    }
    if (room.game.mode === 'coop') {
      // continue with remaining pacs — shrink not needed mid-match
    }
    broadcastState(room);
  } else if (room.game && room.game.status === 'ready') {
    syncRoster(room);
    broadcastState(room);
  }

  broadcast(room, 'event', { event: { type: 'guestLeft', playerId: ws.playerId } });
  broadcastLobby(room);
}

const server = http.createServer((_req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
  });
  res.end('Pac-Man multiplayer server\n');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.roomCode = null;
  ws.role = null;
  ws.playerId = null;
  ws.seatIndex = null;
  send(ws, 'hello', { ok: true });

  ws.on('message', (data) => {
    try {
      handleMessage(ws, data.toString());
    } catch (err) {
      console.error('message handler failed', err);
      send(ws, 'error', { message: 'Server error' });
    }
  });
  ws.on('close', () => handleClose(ws));
  ws.on('error', (err) => {
    console.error('socket error', err?.message || err);
    handleClose(ws);
  });
});

process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err);
});
process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection', err);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Pac-Man WS server listening on ws://0.0.0.0:${PORT}`);
});
