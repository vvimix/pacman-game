export const CELL_SIZE = 20;
export const MOVE_SPEED = 4;
export const POWER_DURATION_MS = 8000;
export const POWER_WARN_MS = 2500;
export const STARTING_LIVES = 3;
export const DEATH_CUTIN_MS = 1100;
export const LEVEL_CLEAR_CUTIN_MS = 1800;
export const FRUIT_AFTER_PELLETS = 70;
export const FRUIT_CELL = { x: 13, y: 17 };
export const CLYDE_SCATTER = { x: 1, y: 29 };
export const FRUIT_POINTS = [100, 300, 500];

export const MODES = ['coop', 'ffa', 'teams', 'survive'];

/** P1–P4 = Team A, P5–P8 = Team B (teams mode). Spawns spread across open corridors. */
export const PLAYER_DEFS = [
  { id: 1, label: 'P1', color: '#ffcc00', start: { x: 13, y: 23 }, startDir: 'left', team: 0 },
  { id: 2, label: 'P2', color: '#ff7ab8', start: { x: 14, y: 23 }, startDir: 'right', team: 0 },
  { id: 3, label: 'P3', color: '#7ad7ff', start: { x: 1, y: 23 }, startDir: 'right', team: 0 },
  { id: 4, label: 'P4', color: '#ffa64d', start: { x: 26, y: 23 }, startDir: 'left', team: 0 },
  { id: 5, label: 'P5', color: '#7cff7a', start: { x: 6, y: 26 }, startDir: 'right', team: 1 },
  { id: 6, label: 'P6', color: '#c07aff', start: { x: 21, y: 26 }, startDir: 'left', team: 1 },
  { id: 7, label: 'P7', color: '#ff6b6b', start: { x: 1, y: 29 }, startDir: 'right', team: 1 },
  { id: 8, label: 'P8', color: '#6bffd6', start: { x: 26, y: 29 }, startDir: 'left', team: 1 },
];

export const coopLivesForCount = (n) => Math.min(6, 3 + Math.floor((Math.max(1, n) - 1) / 2));
export const FFA_LIVES = 3;
export const SURVIVE_LIVES = 1;
export const TEAM_LIVES = 4;

export const isSoloLivesMode = (mode) => mode === 'ffa' || mode === 'survive';
export const personalLivesForMode = (mode) =>
  mode === 'survive' ? SURVIVE_LIVES : mode === 'ffa' ? FFA_LIVES : 0;

export const GHOST_STARTS = [
  { x: 13, y: 11, color: '#ff0000', name: 'Blinky', number: 1 },
  { x: 14, y: 14, color: '#ffb8ff', name: 'Pinky', number: 2 },
  { x: 13, y: 14, color: '#00ffff', name: 'Inky', number: 3 },
  { x: 15, y: 14, color: '#ffb852', name: 'Clyde', number: 4 },
];

export const initialMazeLayout = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 2, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 2, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1],
  [1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
  [1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const cloneMaze = (maze) => maze.map((row) => [...row]);

export function countPellets(maze) {
  return maze.reduce(
    (total, row) => total + row.reduce((sum, cell) => sum + (cell === 2 || cell === 3 ? 1 : 0), 0),
    0
  );
}

export const TOTAL_PELLETS = countPellets(initialMazeLayout);

export const directionDelta = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };

export const ghostSpeedForLevel = (level) => (level >= 3 ? 4 : 2);
export const powerDurationForLevel = (level) =>
  Math.max(4000, POWER_DURATION_MS - (level - 1) * 500);
export const fruitPointsForLevel = (level) =>
  FRUIT_POINTS[Math.min(level - 1, FRUIT_POINTS.length - 1)];

export const makeGhosts = () =>
  GHOST_STARTS.map((g) => ({
    ...g,
    direction: 'up',
    eaten: false,
    respawnAt: 0,
    pixel: { x: g.x * CELL_SIZE, y: g.y * CELL_SIZE },
  }));

export const makePlayerState = (def, mode = 'coop') => ({
  id: def.id,
  label: def.label,
  color: def.color,
  team: def.team ?? 0,
  pixel: { x: def.start.x * CELL_SIZE, y: def.start.y * CELL_SIZE },
  direction: def.startDir,
  nextDirection: def.startDir,
  score: 0,
  alive: true,
  lives: personalLivesForMode(mode),
});

export const cellFromPixel = (pixel) => ({
  x: Math.floor((pixel.x + CELL_SIZE / 2) / CELL_SIZE),
  y: Math.floor((pixel.y + CELL_SIZE / 2) / CELL_SIZE),
});

export function isWalkable(maze, x, y) {
  if (y < 0 || y >= maze.length) return false;
  const row = maze[y];
  if (x < 0 || x >= row.length) return y === 14;
  return row[x] !== 1;
}

function wrapTunnel(maze, entity, nextX, nextY, gridY) {
  const width = maze[0].length;
  if (gridY === 14 && nextX < 0) {
    entity.x = width - 1;
    entity.pixel = { x: entity.x * CELL_SIZE, y: entity.pixel.y };
    return true;
  }
  if (gridY === 14 && nextX >= width) {
    entity.x = 0;
    entity.pixel = { x: 0, y: entity.pixel.y };
    return true;
  }
  return false;
}

function ghostChaseTarget(game, ghost) {
  let bestPlayer = null;
  let bestDist = Infinity;
  for (const player of game.players) {
    if (!player.alive) continue;
    const cell = cellFromPixel(player.pixel);
    const dist = Math.abs(ghost.x - cell.x) + Math.abs(ghost.y - cell.y);
    if (dist < bestDist) {
      bestDist = dist;
      bestPlayer = player;
    }
  }
  if (!bestPlayer) return { x: 13, y: 23 };

  const cell = cellFromPixel(bestPlayer.pixel);
  const dd = directionDelta[bestPlayer.direction] || directionDelta.left;

  if (ghost.number === 1) return cell;
  if (ghost.number === 2) {
    return { x: cell.x + dd.x * 4, y: cell.y + dd.y * 4 };
  }
  if (ghost.number === 3) {
    const blinky = game.ghosts.find((g) => g.number === 1) || ghost;
    const ahead = { x: cell.x + dd.x * 2, y: cell.y + dd.y * 2 };
    return { x: 2 * ahead.x - blinky.x, y: 2 * ahead.y - blinky.y };
  }
  const dist = Math.abs(ghost.x - cell.x) + Math.abs(ghost.y - cell.y);
  if (dist > 8) return cell;
  return CLYDE_SCATTER;
}

function chooseGhostDirection(game, ghost, target) {
  const dirs = ['up', 'down', 'left', 'right'];
  const options = dirs.filter((d) => {
    if (d === opposite[ghost.direction]) return false;
    const dd = directionDelta[d];
    return isWalkable(game.maze, ghost.x + dd.x, ghost.y + dd.y);
  });
  const fallback = dirs.filter((d) => {
    const dd = directionDelta[d];
    return isWalkable(game.maze, ghost.x + dd.x, ghost.y + dd.y);
  });
  const pool = options.length ? options : fallback;
  if (!pool.length) return ghost.direction;

  if (ghost.y >= 12 && ghost.y <= 16 && ghost.x >= 11 && ghost.x <= 16) {
    if (pool.includes('up')) return 'up';
  }

  const fleeing = game.powerMode && !ghost.eaten;
  let best = pool[0];
  let bestScore = fleeing ? -Infinity : Infinity;
  for (const d of pool) {
    const dd = directionDelta[d];
    const nx = ghost.x + dd.x;
    const ny = ghost.y + dd.y;
    const dist = Math.abs(nx - target.x) + Math.abs(ny - target.y);
    if (fleeing ? dist > bestScore : dist < bestScore) {
      bestScore = dist;
      best = d;
    }
  }
  return best;
}

function pushPopup(game, x, y, text) {
  const id = game.popupId++;
  game.popups.push({ id, x, y, text, expiresAt: Date.now() + 700 });
}

function endPower(game) {
  game.powerMode = false;
  game.powerEnding = false;
  game.powerUntil = 0;
  game.ghostCombo = 0;
}

function livingPlayers(game) {
  return game.players.filter((p) => p.alive);
}

function teamScore(game, team) {
  return game.players.filter((p) => p.team === team).reduce((s, p) => s + p.score, 0);
}

function setWinner(game, events, type, payload) {
  endPower(game);
  game.status = 'won';
  game.winner = payload;
  game.message = payload.message || 'WIN!';
  events.push({ type, ...payload });
}

function resetActors(game, keepScores) {
  const defs = PLAYER_DEFS.slice(0, game.playerCount);
  game.players = defs.map((def, i) => {
    const prev = game.players[i];
    const base = makePlayerState(def, game.mode);
    if (keepScores) {
      base.score = prev?.score || 0;
      if (isSoloLivesMode(game.mode)) {
        base.lives = prev?.lives ?? 0;
        base.alive = base.lives > 0;
      }
    }
    return base;
  });
  game.ghosts = makeGhosts();
  game.fruit = null;
  game.fruitSpawned = false;
  game.invulnUntil = Date.now() + 1500;
}

function finishDeathCutin(game, events) {
  if (game.mode !== 'coop') {
    game.message = '';
    game.status = 'playing';
    game.invulnUntil = Date.now() + 800;
    events.push({ type: 'resume' });
    return;
  }
  if (game.lives <= 0) {
    endPower(game);
    game.status = 'lost';
    game.message = 'GAME OVER';
    game.winner = { kind: 'coopLose' };
    events.push({ type: 'gameOver' });
    return;
  }
  resetActors(game, true);
  game.message = 'READY!';
  game.status = 'ready';
  events.push({ type: 'ready' });
}

function resolveLevelClearWinner(game, events) {
  // Survive: keep going until last Pac — only end if one (or zero) left after clear.
  if (game.mode === 'survive') {
    const living = livingPlayers(game);
    if (living.length === 1) {
      setWinner(game, events, 'surviveWin', {
        kind: 'survive',
        playerId: living[0].id,
        message: `${living[0].label} SURVIVES!`,
      });
      return true;
    }
    if (living.length === 0) {
      endPower(game);
      game.status = 'lost';
      game.message = 'DRAW';
      game.winner = { kind: 'surviveDraw' };
      events.push({ type: 'gameOver' });
      return true;
    }
    return false; // multiple still alive → next level
  }
  if (game.mode === 'ffa') {
    const living = livingPlayers(game);
    const pool = living.length ? living : game.players;
    const best = [...pool].sort((a, b) => b.score - a.score)[0];
    setWinner(game, events, 'ffaWin', {
      kind: 'ffa',
      playerId: best?.id,
      message: `${best?.label || 'P?'} WINS!`,
    });
    return true;
  }
  if (game.mode === 'teams') {
    const a = teamScore(game, 0);
    const b = teamScore(game, 1);
    const team = a >= b ? 0 : 1;
    setWinner(game, events, 'teamWin', {
      kind: 'teams',
      team,
      message: team === 0 ? 'TEAM A WINS!' : 'TEAM B WINS!',
      scores: [a, b],
    });
    return true;
  }
  return false;
}

function finishLevelClear(game, events) {
  if (resolveLevelClearWinner(game, events)) return;
  game.maze = cloneMaze(initialMazeLayout);
  game.pelletsLeft = TOTAL_PELLETS;
  resetActors(game, true);
  // coop already bumped level in eatCell; survive bumps here when continuing
  if (game.mode === 'survive') {
    game.level += 1;
  }
  game.message = `LEVEL ${game.level}`;
  game.status = 'ready';
  events.push({ type: 'ready', level: game.level });
}

function checkSoloWin(game, events) {
  const living = livingPlayers(game);
  const winType = game.mode === 'survive' ? 'surviveWin' : 'ffaWin';
  const kind = game.mode === 'survive' ? 'survive' : 'ffa';
  if (living.length === 1) {
    setWinner(game, events, winType, {
      kind,
      playerId: living[0].id,
      message:
        game.mode === 'survive'
          ? `${living[0].label} SURVIVES!`
          : `${living[0].label} WINS!`,
    });
    return true;
  }
  if (living.length === 0) {
    endPower(game);
    game.status = 'lost';
    game.message = 'DRAW';
    game.winner = { kind: kind + 'Draw' };
    events.push({ type: 'gameOver' });
    return true;
  }
  return false;
}

function checkTeamsWin(game, events) {
  const aAlive = game.players.some((p) => p.team === 0 && p.alive);
  const bAlive = game.players.some((p) => p.team === 1 && p.alive);
  if (aAlive && !bAlive) {
    setWinner(game, events, 'teamWin', {
      kind: 'teams',
      team: 0,
      message: 'TEAM A WINS!',
      scores: [teamScore(game, 0), teamScore(game, 1)],
    });
    return true;
  }
  if (bAlive && !aAlive) {
    setWinner(game, events, 'teamWin', {
      kind: 'teams',
      team: 1,
      message: 'TEAM B WINS!',
      scores: [teamScore(game, 0), teamScore(game, 1)],
    });
    return true;
  }
  return false;
}

function loseLife(game, now, events, player) {
  if (game.status === 'dying' || game.status === 'won' || game.status === 'lost') return;
  if (now < game.invulnUntil) return;

  if (isSoloLivesMode(game.mode)) {
    if (!player || !player.alive) return;
    player.lives = Math.max(0, (player.lives || 0) - 1);
    endPower(game);
    if (player.lives <= 0) {
      player.alive = false;
      events.push({ type: 'eliminated', playerId: player.id });
      checkSoloWin(game, events);
    } else {
      // Soft respawn this player only (FFA with lives remaining)
      const def = PLAYER_DEFS.find((d) => d.id === player.id);
      if (def) {
        player.pixel = { x: def.start.x * CELL_SIZE, y: def.start.y * CELL_SIZE };
        player.direction = def.startDir;
        player.nextDirection = def.startDir;
      }
      game.invulnUntil = now + 1500;
      events.push({ type: 'death', playerId: player.id });
    }
    return;
  }

  if (game.mode === 'teams') {
    if (!player || !player.alive) return;
    const team = player.team;
    game.teamLives[team] = Math.max(0, (game.teamLives[team] || 0) - 1);
    endPower(game);
    if (game.teamLives[team] <= 0) {
      for (const p of game.players) {
        if (p.team === team) p.alive = false;
      }
      events.push({ type: 'eliminated', team });
      checkTeamsWin(game, events);
    } else {
      const def = PLAYER_DEFS.find((d) => d.id === player.id);
      if (def) {
        player.pixel = { x: def.start.x * CELL_SIZE, y: def.start.y * CELL_SIZE };
        player.direction = def.startDir;
        player.nextDirection = def.startDir;
      }
      game.invulnUntil = now + 1500;
      events.push({ type: 'death', playerId: player.id, team });
    }
    return;
  }

  // coop
  game.lives -= 1;
  endPower(game);
  game.message = '';
  game.status = 'dying';
  game.cutinUntil = now + DEATH_CUTIN_MS;
  events.push({ type: 'death' });
}

function eatFruit(game, player, events) {
  if (!game.fruit) return;
  const cell = cellFromPixel(player.pixel);
  if (cell.x !== game.fruit.x || cell.y !== game.fruit.y) return;
  const points = fruitPointsForLevel(game.level);
  player.score += points;
  pushPopup(game, game.fruit.x * CELL_SIZE, game.fruit.y * CELL_SIZE, `+${points}`);
  game.fruit = null;
  events.push({ type: 'fruit', points });
}

function maybeSpawnFruit(game) {
  if (game.fruitSpawned || game.fruit) return;
  const eaten = TOTAL_PELLETS - game.pelletsLeft;
  if (eaten >= FRUIT_AFTER_PELLETS) {
    game.fruitSpawned = true;
    game.fruit = { ...FRUIT_CELL };
  }
}

function eatCell(game, player, x, y, now, events) {
  const cell = game.maze[y]?.[x];
  if (cell !== 2 && cell !== 3) return;

  const points = cell === 2 ? 10 : 50;
  player.score += points;
  pushPopup(game, x * CELL_SIZE, y * CELL_SIZE, `+${points}`);
  events.push({ type: points === 10 ? 'pellet' : 'power' });

  const nextMaze = cloneMaze(game.maze);
  nextMaze[y][x] = 0;
  game.maze = nextMaze;
  game.pelletsLeft -= 1;
  maybeSpawnFruit(game);

  if (game.pelletsLeft <= 0) {
    if (game.status === 'levelClear' || game.status === 'won') return;
    player.score += 500;
    pushPopup(game, x * CELL_SIZE, y * CELL_SIZE - 12, '+500');
    endPower(game);
    if (game.mode === 'ffa' || game.mode === 'teams' || game.mode === 'survive') {
      game.status = 'levelClear';
      game.cutinUntil = now + LEVEL_CLEAR_CUTIN_MS;
      game.message = 'LEVEL CLEAR!';
      events.push({ type: 'levelClear', level: game.level });
      return;
    }
    game.level += 1;
    game.message = `LEVEL ${game.level}`;
    game.status = 'levelClear';
    game.cutinUntil = now + LEVEL_CLEAR_CUTIN_MS;
    events.push({ type: 'levelClear', level: game.level });
    return;
  }

  if (points === 50) {
    game.powerMode = true;
    game.powerEnding = false;
    game.ghostCombo = 0;
    game.powerUntil = now + powerDurationForLevel(game.level);
  }
}

function updateOnePacman(game, player, now, events) {
  if (!player.alive) return;
  const pixel = player.pixel;
  const onGrid = pixel.x % CELL_SIZE === 0 && pixel.y % CELL_SIZE === 0;

  if (onGrid) {
    const gridX = pixel.x / CELL_SIZE;
    const gridY = pixel.y / CELL_SIZE;
    eatCell(game, player, gridX, gridY, now, events);
    eatFruit(game, player, events);
    if (game.status !== 'playing') return;

    const wanted = player.nextDirection;
    const wantedDelta = directionDelta[wanted];
    if (wantedDelta && isWalkable(game.maze, gridX + wantedDelta.x, gridY + wantedDelta.y)) {
      player.direction = wanted;
    }

    const currentDelta = directionDelta[player.direction];
    const nextX = gridX + currentDelta.x;
    const nextY = gridY + currentDelta.y;
    if (wrapTunnel(game.maze, player, nextX, nextY, gridY)) return;
    if (!isWalkable(game.maze, nextX, nextY)) return;
  }

  const delta = directionDelta[player.direction];
  player.pixel = {
    x: player.pixel.x + delta.x * MOVE_SPEED,
    y: player.pixel.y + delta.y * MOVE_SPEED,
  };
}

function updateGhosts(game, now) {
  const speed = ghostSpeedForLevel(game.level);
  game.ghosts = game.ghosts.map((ghost) => {
    if (ghost.eaten) {
      if (now >= ghost.respawnAt) {
        const home = GHOST_STARTS.find((g) => g.number === ghost.number) || GHOST_STARTS[0];
        return {
          ...ghost,
          x: home.x,
          y: home.y,
          pixel: { x: home.x * CELL_SIZE, y: home.y * CELL_SIZE },
          eaten: false,
          direction: 'up',
        };
      }
      return ghost;
    }

    const onGrid = ghost.pixel.x % CELL_SIZE === 0 && ghost.pixel.y % CELL_SIZE === 0;
    if (onGrid) {
      ghost.x = ghost.pixel.x / CELL_SIZE;
      ghost.y = ghost.pixel.y / CELL_SIZE;
      const target = ghostChaseTarget(game, ghost);
      const dir = chooseGhostDirection(game, ghost, target);
      ghost.direction = dir;
      const dd = directionDelta[dir];
      const nx = ghost.x + dd.x;
      const ny = ghost.y + dd.y;
      if (wrapTunnel(game.maze, ghost, nx, ny, ghost.y)) return ghost;
      if (!isWalkable(game.maze, nx, ny)) return ghost;
    }

    const dd = directionDelta[ghost.direction];
    ghost.pixel = {
      x: ghost.pixel.x + dd.x * speed,
      y: ghost.pixel.y + dd.y * speed,
    };
    if (ghost.pixel.x % CELL_SIZE === 0 && ghost.pixel.y % CELL_SIZE === 0) {
      ghost.x = ghost.pixel.x / CELL_SIZE;
      ghost.y = ghost.pixel.y / CELL_SIZE;
    }
    return ghost;
  });
}

function collidesWithPac(ghost, pacPixel) {
  if (ghost.eaten) return false;
  return (
    Math.abs(pacPixel.x - ghost.pixel.x) < CELL_SIZE * 0.75 &&
    Math.abs(pacPixel.y - ghost.pixel.y) < CELL_SIZE * 0.75
  );
}

function checkCollisions(game, now, events) {
  if (now < game.invulnUntil) return false;
  if (game.status !== 'playing') return false;
  for (const player of game.players) {
    if (!player.alive) continue;
    for (const ghost of game.ghosts) {
      if (!collidesWithPac(ghost, player.pixel)) continue;
      if (game.powerMode) {
        game.ghostCombo += 1;
        const points = 200 * game.ghostCombo;
        player.score += points;
        pushPopup(game, ghost.pixel.x, ghost.pixel.y, `+${points}`);
        const home = GHOST_STARTS.find((g) => g.number === ghost.number) || GHOST_STARTS[0];
        ghost.eaten = true;
        ghost.x = home.x;
        ghost.y = home.y;
        ghost.pixel = { x: home.x * CELL_SIZE, y: home.y * CELL_SIZE };
        ghost.respawnAt = now + 3000;
        events.push({ type: 'eatGhost', points });
      } else {
        loseLife(game, now, events, player);
        return true;
      }
    }
  }
  return false;
}

function tickPower(game, now) {
  if (!game.powerMode) return;
  const remaining = game.powerUntil - now;
  if (remaining <= 0) {
    endPower(game);
    return;
  }
  game.powerEnding = remaining <= POWER_WARN_MS;
}

export function createGame({ playerCount = 2, mode = 'coop' } = {}) {
  const count = Math.max(1, Math.min(8, playerCount | 0));
  const resolvedMode = MODES.includes(mode) ? mode : 'coop';
  const defs = PLAYER_DEFS.slice(0, count);
  return {
    playerCount: count,
    mode: resolvedMode,
    maze: cloneMaze(initialMazeLayout),
    pelletsLeft: TOTAL_PELLETS,
    players: defs.map((d) => makePlayerState(d, resolvedMode)),
    ghosts: makeGhosts(),
    status: 'ready',
    paused: false,
    powerMode: false,
    powerEnding: false,
    powerUntil: 0,
    lives: resolvedMode === 'coop' ? coopLivesForCount(count) : 0,
    teamLives: resolvedMode === 'teams' ? [TEAM_LIVES, TEAM_LIVES] : [0, 0],
    level: 1,
    message: 'READY!',
    fruit: null,
    fruitSpawned: false,
    invulnUntil: 0,
    ghostCombo: 0,
    cutinUntil: 0,
    popups: [],
    popupId: 0,
    winner: null,
  };
}

export function startGame(game) {
  if (game.status !== 'ready') return false;
  game.message = '';
  game.status = 'playing';
  game.paused = false;
  game.invulnUntil = Date.now() + 800;
  return true;
}

export function setInput(game, playerId, direction) {
  if (!['up', 'down', 'left', 'right'].includes(direction)) return;
  const player = game.players.find((p) => p.id === playerId);
  if (player && player.alive) player.nextDirection = direction;
}

/** Mark a seat eliminated (disconnect mid-match). */
export function eliminatePlayer(game, playerId, events = []) {
  const player = game.players.find((p) => p.id === playerId);
  if (!player || !player.alive) return events;
  player.alive = false;
  if (isSoloLivesMode(game.mode)) {
    player.lives = 0;
    events.push({ type: 'eliminated', playerId });
    checkSoloWin(game, events);
  } else if (game.mode === 'teams') {
    events.push({ type: 'eliminated', playerId, team: player.team });
    checkTeamsWin(game, events);
  } else {
    events.push({ type: 'eliminated', playerId });
  }
  return events;
}

export function setPaused(game, paused) {
  if (game.status !== 'playing') return;
  game.paused = !!paused;
}

export function restartGame(game) {
  const next = createGame({ playerCount: game.playerCount, mode: game.mode });
  Object.keys(next).forEach((k) => {
    game[k] = next[k];
  });
}

/** Shrink/expand active roster before start (party lobby). */
export function setPlayerCount(game, playerCount) {
  if (game.status === 'playing' || game.status === 'dying' || game.status === 'levelClear') return;
  const next = createGame({ playerCount, mode: game.mode });
  Object.keys(next).forEach((k) => {
    game[k] = next[k];
  });
}

export function tick(game, now = Date.now()) {
  const events = [];
  game.popups = game.popups.filter((p) => p.expiresAt > now);

  if (game.status === 'dying' && now >= game.cutinUntil) {
    finishDeathCutin(game, events);
    return { events };
  }
  if (game.status === 'levelClear' && now >= game.cutinUntil) {
    finishLevelClear(game, events);
    return { events };
  }

  if (game.status !== 'playing' || game.paused) {
    return { events };
  }

  tickPower(game, now);
  for (const player of game.players) {
    updateOnePacman(game, player, now, events);
  }
  if (game.status !== 'playing') return { events };

  if (checkCollisions(game, now, events)) return { events };
  updateGhosts(game, now);
  checkCollisions(game, now, events);
  return { events };
}

export function getSnapshot(game) {
  return {
    mode: game.mode,
    maze: game.maze,
    players: game.players.map((p) => ({
      id: p.id,
      label: p.label,
      color: p.color,
      team: p.team,
      pixel: { ...p.pixel },
      direction: p.direction,
      score: p.score,
      alive: p.alive,
      lives: p.lives,
    })),
    ghosts: game.ghosts.map((g) => ({
      number: g.number,
      name: g.name,
      color: g.color,
      x: g.x,
      y: g.y,
      pixel: { ...g.pixel },
      direction: g.direction,
      eaten: g.eaten,
    })),
    status: game.status,
    paused: game.paused,
    powerMode: game.powerMode,
    powerEnding: game.powerEnding,
    lives: game.lives,
    teamLives: [...(game.teamLives || [0, 0])],
    level: game.level,
    message: game.message,
    fruit: game.fruit ? { ...game.fruit } : null,
    popups: game.popups.map((p) => ({ id: p.id, x: p.x, y: p.y, text: p.text })),
    scores: game.players.map((p) => p.score),
    winner: game.winner,
    playerCount: game.playerCount,
  };
}
