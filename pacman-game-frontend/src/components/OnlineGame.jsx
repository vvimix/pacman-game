import React, { useCallback, useEffect, useRef, useState } from 'react';
import Maze from './Maze';
import Pacman from './Pacman';
import Ghost from './Ghost';
import { sfx, isMuted, setMuted } from '../audio';
import { CELL_SIZE } from '../game/engine.mjs';
import '../styles/Game.css';

const DEFAULT_WS =
  process.env.REACT_APP_WS_URL ||
  `ws://${
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? '127.0.0.1'
      : window.location.hostname
  }:3001`;

const emptyState = {
  mode: 'coop',
  maze: [],
  players: [],
  ghosts: [],
  status: 'ready',
  paused: false,
  powerMode: false,
  powerEnding: false,
  lives: 3,
  teamLives: [0, 0],
  level: 1,
  message: 'CONNECTING…',
  fruit: null,
  popups: [],
  scores: [],
  winner: null,
  playerCount: 2,
};

const modeLabel = (m) =>
  m === 'ffa' ? 'FFA' : m === 'survive' ? 'SURVIVE' : m === 'teams' ? 'TEAMS' : 'CO-OP';

function OnlineGame({ mode, joinCode, hostOptions, onLeave }) {
  const [conn, setConn] = useState('connecting');
  const [roomCode, setRoomCode] = useState(joinCode || '');
  const [role, setRole] = useState(mode === 'host' ? 'P1' : 'P?');
  const [playerId, setPlayerId] = useState(mode === 'host' ? 1 : null);
  const [lobby, setLobby] = useState({
    filled: mode === 'host' ? 1 : 0,
    maxPlayers: hostOptions?.maxPlayers || 2,
    mode: hostOptions?.mode || 'coop',
    seats: [],
  });
  // Keep a stable copy of host create options for the socket effect
  const intendedMode = hostOptions?.mode || lobby.mode || 'coop';
  const [error, setError] = useState('');
  const [state, setState] = useState(emptyState);
  const [muted, setMutedState] = useState(isMuted);
  const wsRef = useRef(null);
  const roleRef = useRef(role);
  const roomCodeRef = useRef(roomCode);
  const hostOptsRef = useRef(hostOptions || { maxPlayers: 2, mode: 'coop' });

  useEffect(() => {
    roleRef.current = role;
  }, [role]);

  useEffect(() => {
    roomCodeRef.current = roomCode;
  }, [roomCode]);

  useEffect(() => {
    hostOptsRef.current = hostOptions || { maxPlayers: 2, mode: 'coop' };
  }, [hostOptions]);

  const send = useCallback((type, payload = {}) => {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, ...payload }));
    }
  }, []);

  const handleEvent = useCallback((event) => {
    if (!event) return;
    if (event.type === 'death' || event.type === 'eliminated') sfx.death();
    else if (
      event.type === 'levelClear' ||
      event.type === 'ffaWin' ||
      event.type === 'surviveWin' ||
      event.type === 'teamWin'
    ) {
      sfx.levelClear();
    } else if (event.type === 'pellet') sfx.pellet();
    else if (event.type === 'power') sfx.power();
    else if (event.type === 'fruit' || event.type === 'eatGhost') sfx.ghost();
  }, []);

  const applyLobby = useCallback((msg) => {
    setLobby({
      filled: msg.filled ?? 0,
      maxPlayers: msg.maxPlayers ?? 2,
      mode: msg.mode || 'coop',
      seats: msg.seats || [],
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    let ws = null;
    let retryTimer = null;
    let attempt = 0;

    const connect = () => {
      if (cancelled) return;
      setConn('connecting');
      ws = new WebSocket(DEFAULT_WS);
      wsRef.current = ws;

      ws.onopen = () => {
        if (cancelled) {
          ws.close();
          return;
        }
        attempt = 0;
        setConn('open');
        setError('');
        if (mode === 'host') {
          const opts = hostOptsRef.current || { maxPlayers: 2, mode: 'coop' };
          const createMode = opts.mode || 'coop';
          const createMax = opts.maxPlayers || 2;
          console.info('[OnlineGame] createRoom', { mode: createMode, maxPlayers: createMax });
          ws.send(
            JSON.stringify({
              type: 'createRoom',
              // Only reclaim after we already have a code from this session
              code: roomCodeRef.current || undefined,
              maxPlayers: createMax,
              mode: createMode,
            })
          );
        } else {
          ws.send(JSON.stringify({ type: 'joinRoom', code: joinCode }));
        }
      };

      ws.onmessage = (ev) => {
        if (cancelled) return;
        let msg;
        try {
          msg = JSON.parse(ev.data);
        } catch {
          return;
        }
        if (msg.type === 'room' || msg.type === 'lobby' || msg.type === 'roomReady') {
          if (msg.roomCode) setRoomCode(msg.roomCode);
          if (msg.role) setRole(msg.role);
          if (msg.playerId) setPlayerId(msg.playerId);
          applyLobby(msg);
          setError('');
        }
        if (msg.type === 'state') {
          setState(msg.state);
        } else if (msg.type === 'event') {
          handleEvent(msg.event);
        } else if (msg.type === 'error') {
          setError(msg.message || 'Server error');
          setConn('error');
        }
      };

      ws.onerror = () => {
        if (cancelled) return;
        setError('Could not connect to game server (is it running on :3001?)');
        setConn('error');
      };

      ws.onclose = () => {
        if (cancelled) return;
        setConn((c) => (c === 'error' ? c : 'closed'));
        if (attempt < 8) {
          attempt += 1;
          retryTimer = setTimeout(connect, 400 * attempt);
        }
      };
    };

    const startTimer = setTimeout(connect, 80);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      clearTimeout(retryTimer);
      if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;
        ws.close();
      }
      wsRef.current = null;
    };
  }, [mode, joinCode, handleEvent, applyLobby, hostOptions?.mode, hostOptions?.maxPlayers]);

  const canHostStart =
    role === 'P1' &&
    state.status === 'ready' &&
    lobby.filled >= 2 &&
    conn === 'open';

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'm') {
        const next = !isMuted();
        setMuted(next);
        setMutedState(next);
        return;
      }
      if (key === 'escape' && typeof onLeave === 'function') {
        onLeave();
        return;
      }
      if (key === 'p') {
        send('pause', { paused: !state.paused });
        return;
      }
      if (key === 'enter' || key === ' ') {
        if (canHostStart) {
          send('start');
          e.preventDefault();
        }
        return;
      }
      if (
        key === 'r' &&
        roleRef.current === 'P1' &&
        (state.status === 'lost' || state.status === 'won')
      ) {
        send('restart');
        return;
      }

      let dir = null;
      if (key === 'w' || key === 'arrowup') dir = 'up';
      else if (key === 's' || key === 'arrowdown') dir = 'down';
      else if (key === 'a' || key === 'arrowleft') dir = 'left';
      else if (key === 'd' || key === 'arrowright') dir = 'right';
      if (dir) {
        send('input', { dir });
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onLeave, send, state.paused, state.status, canHostStart]);

  const waitingForPlayers =
    state.status === 'ready' && lobby.filled < 2 && conn === 'open' && !error;
  const inLobbyReady =
    state.status === 'ready' && lobby.filled >= 2 && conn === 'open' && !error;

  const showOverlay =
    waitingForPlayers ||
    inLobbyReady ||
    conn === 'connecting' ||
    conn === 'error' ||
    conn === 'closed' ||
    !!error ||
    (state.status !== 'playing' &&
      state.status !== 'dying' &&
      state.status !== 'levelClear');

  const gameMode = state.mode || lobby.mode || intendedMode || 'coop';

  return (
    <div className="game-container">
      <div className="game">
        <div className="title-row">
          <div className="brand">PAC-MAN ONLINE</div>
          <div className="hud-block inline">
            <span className="hud-label">
              {modeLabel(gameMode)} · {lobby.filled}/{lobby.maxPlayers}
            </span>
            <span className="hud-value">{roomCode || '—'}</span>
          </div>
        </div>

        <div className="hud-bar hud-bar-party">
          <div className="hud-item">
            <span className="hud-label">Level</span>
            <span className="hud-value">{state.level}</span>
          </div>
          {gameMode === 'coop' && (
            <div className="hud-item lives">
              <span className="hud-label">Lives</span>
              <span className="life-icons">
                {Array.from({ length: state.lives || 0 }).map((_, i) => (
                  <span key={i} className="life-icon" aria-hidden="true" />
                ))}
              </span>
            </div>
          )}
          {gameMode === 'teams' && (
            <>
              <div className="hud-item">
                <span className="hud-label">Team A</span>
                <span className="hud-value">{state.teamLives?.[0] ?? 0}♥</span>
              </div>
              <div className="hud-item">
                <span className="hud-label">Team B</span>
                <span className="hud-value">{state.teamLives?.[1] ?? 0}♥</span>
              </div>
            </>
          )}
          <div className="hud-item">
            <span className="hud-label">You</span>
            <span className="hud-value">{role}</span>
          </div>
        </div>

        <div className="party-scoreboard">
          {(state.players || []).map((p) => (
            <div
              key={p.id}
              className={`party-score-chip ${!p.alive ? 'out' : ''} ${
                p.id === playerId ? 'you' : ''
              }`}
              style={{ borderColor: p.color }}
            >
              <span className="chip-swatch" style={{ background: p.color }} />
              <span>
                {p.label}
                {gameMode === 'teams' ? (p.team === 0 ? '·A' : '·B') : ''}
              </span>
              <span>{p.score}</span>
              {(gameMode === 'ffa' || gameMode === 'survive') && (
                <span>{p.lives ?? 0}♥</span>
              )}
            </div>
          ))}
        </div>

        <div
          className={[
            'maze-stage',
            state.powerMode ? 'power-active' : '',
            state.powerEnding ? 'power-ending' : '',
            state.status === 'dying' ? 'dying' : '',
            state.status === 'levelClear' ? 'level-clear' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {state.maze?.length > 0 && <Maze layout={state.maze} />}
          <div className="game-objects">
            {(state.players || [])
              .filter((p) => p.alive || state.status === 'won' || state.status === 'lost')
              .map((player) => (
                <Pacman
                  key={player.id}
                  position={player.pixel}
                  direction={player.direction}
                  powerMode={state.powerMode}
                  powerEnding={state.powerEnding}
                  color={player.color}
                  playerLabel={player.label}
                  dying={state.status === 'dying' && gameMode === 'coop'}
                  hidden={!player.alive || state.status === 'lost'}
                />
              ))}
            {(state.ghosts || []).map((ghost) => (
              <Ghost
                key={ghost.number}
                position={ghost}
                powerMode={state.powerMode}
                powerEnding={state.powerEnding}
                eaten={ghost.eaten}
                frozen={state.status === 'dying' || state.status === 'levelClear'}
              />
            ))}
            {state.fruit && (
              <div
                className="fruit"
                style={{
                  left: `${state.fruit.x * CELL_SIZE}px`,
                  top: `${state.fruit.y * CELL_SIZE}px`,
                }}
                aria-label="bonus fruit"
              />
            )}
            {(state.popups || []).map((popup) => (
              <div
                key={popup.id}
                className="score-popup"
                style={{ left: `${popup.x}px`, top: `${popup.y}px` }}
              >
                {popup.text}
              </div>
            ))}
          </div>

          {state.powerEnding && state.status === 'playing' && !state.paused && (
            <div className="power-warning" aria-live="polite">
              HURRY!
            </div>
          )}

          {state.paused && state.status === 'playing' && (
            <div className="status-overlay paused">
              <div className="status-message">PAUSED</div>
              <div className="status-sub">P to resume</div>
            </div>
          )}

          {state.status === 'dying' && gameMode === 'coop' && (
            <div className="death-veil" aria-hidden="true" />
          )}

          {state.status === 'levelClear' && (
            <div className="status-overlay levelClear" aria-live="polite">
              <div className="status-message">LEVEL CLEAR!</div>
              <div className="status-sub">{state.message || `LEVEL ${state.level}`}</div>
            </div>
          )}

          {showOverlay && (
            <div className={`status-overlay ${state.status || 'ready'}`}>
              <div className="status-message">
                {error ||
                  (conn === 'connecting' && 'CONNECTING…') ||
                  (waitingForPlayers && 'WAITING FOR PLAYERS') ||
                  state.message ||
                  'READY!'}
              </div>
              {!error && roomCode && (waitingForPlayers || inLobbyReady) && (
                <div className="status-sub">
                  {lobby.filled}/{lobby.maxPlayers} · {modeLabel(lobby.mode)} · code {roomCode} ·
                  you {role}
                </div>
              )}
              {inLobbyReady && (
                <div className="status-sub">
                  {canHostStart
                    ? 'Enter / Start to begin'
                    : 'Waiting for host to start'}
                </div>
              )}
              {canHostStart && (
                <button type="button" className="restart-btn" onClick={() => send('start')}>
                  Start
                </button>
              )}
              {(state.status === 'lost' || state.status === 'won') && role === 'P1' && (
                <button type="button" className="restart-btn" onClick={() => send('restart')}>
                  Play Again
                </button>
              )}
              {(error || conn === 'closed' || conn === 'error') && (
                <div
                  className="status-sub"
                  style={{
                    display: 'flex',
                    gap: 8,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    type="button"
                    className="restart-btn"
                    onClick={() => window.location.reload()}
                  >
                    Reconnect
                  </button>
                  <button type="button" className="restart-btn" onClick={onLeave}>
                    Back to lobby
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="controls-hint bottom">
          {modeLabel(gameMode)} · You {role} · M mute{muted ? ' (off)' : ''} · Esc leave
        </div>
      </div>

      <aside className="side-panel">
        <div className="player-legend party-legend">
          {(lobby.seats || [])
            .map((seat, i) =>
              seat ? (
                <div key={seat.role || i}>
                  <span
                    className="swatch"
                    style={{
                      background: state.players?.[i]?.color || '#888',
                      boxShadow: 'none',
                    }}
                  />{' '}
                  {seat.role}
                  {seat.connected ? '' : ' (out)'}
                  {seat.role === role ? ' (you)' : ''}
                  {lobby.mode === 'teams'
                    ? seat.team === 0
                      ? ' A'
                      : ' B'
                    : ''}
                </div>
              ) : null
            )
            .filter(Boolean)}
          {!lobby.seats?.length &&
            (state.players || []).map((p) => (
              <div key={p.id}>
                <span className="swatch" style={{ background: p.color }} /> {p.label}
                {p.id === playerId ? ' (you)' : ''}
              </div>
            ))}
        </div>
        <button type="button" className="lobby-leave-btn" onClick={onLeave}>
          Leave room
        </button>
      </aside>
    </div>
  );
}

export default OnlineGame;
