import React, { useState, useEffect, useCallback, useRef } from 'react';
import Maze from './Maze';
import Pacman from './Pacman';
import Ghost from './Ghost';
import { sfx, isMuted, setMuted } from '../audio';
import '../styles/Game.css';

const CELL_SIZE = 20;
const MOVE_SPEED = 4;
const POWER_DURATION_MS = 8000;
const POWER_WARN_MS = 2500;
const STARTING_LIVES = 3;
const DEATH_CUTIN_MS = 1100;
const LEVEL_CLEAR_CUTIN_MS = 1800;
const HIGH_SCORE_KEY = 'pacman-high-scores';
const FRUIT_AFTER_PELLETS = 70;
const FRUIT_CELL = { x: 13, y: 17 };
const CLYDE_SCATTER = { x: 1, y: 29 };
const FRUIT_POINTS = [100, 300, 500];

const PLAYER_DEFS = [
  {
    id: 1,
    label: 'P1',
    color: '#ffcc00',
    start: { x: 13, y: 23 },
    startDir: 'left',
  },
  {
    id: 2,
    label: 'P2',
    color: '#ff7ab8',
    start: { x: 14, y: 23 },
    startDir: 'right',
  },
];

const GHOST_STARTS = [
  { x: 13, y: 11, color: '#ff0000', name: 'Blinky', number: 1 },
  { x: 14, y: 14, color: '#ffb8ff', name: 'Pinky', number: 2 },
  { x: 13, y: 14, color: '#00ffff', name: 'Inky', number: 3 },
  { x: 15, y: 14, color: '#ffb852', name: 'Clyde', number: 4 },
];

const initialMazeLayout = [
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

const cloneMaze = (maze) => maze.map((row) => [...row]);

function countPellets(maze) {
  return maze.reduce(
    (total, row) => total + row.reduce((sum, cell) => sum + (cell === 2 || cell === 3 ? 1 : 0), 0),
    0
  );
}

const TOTAL_PELLETS = countPellets(initialMazeLayout);

const directionDelta = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };

const ghostSpeedForLevel = (level) => (level >= 3 ? 4 : 2);

const powerDurationForLevel = (level) => Math.max(4000, POWER_DURATION_MS - (level - 1) * 500);

const fruitPointsForLevel = (level) => FRUIT_POINTS[Math.min(level - 1, FRUIT_POINTS.length - 1)];

const loadHighScores = () => {
  try {
    const raw = localStorage.getItem(HIGH_SCORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed.slice(0, 5);
    }
  } catch {
    /* ignore */
  }
  return [
    { name: 'AAA', score: 1000 },
    { name: 'BBB', score: 800 },
    { name: 'CCC', score: 600 },
    { name: 'DDD', score: 400 },
    { name: 'EEE', score: 200 },
  ];
};

const makeGhosts = () =>
  GHOST_STARTS.map((g) => ({
    ...g,
    direction: 'up',
    eaten: false,
    respawnAt: 0,
    pixel: { x: g.x * CELL_SIZE, y: g.y * CELL_SIZE },
  }));

const makePlayerState = (def) => ({
  id: def.id,
  label: def.label,
  color: def.color,
  pixel: { x: def.start.x * CELL_SIZE, y: def.start.y * CELL_SIZE },
  direction: def.startDir,
  nextDirection: def.startDir,
  score: 0,
  alive: true,
});

const cellFromPixel = (pixel) => ({
  x: Math.floor((pixel.x + CELL_SIZE / 2) / CELL_SIZE),
  y: Math.floor((pixel.y + CELL_SIZE / 2) / CELL_SIZE),
});

const Game = () => {
  const [mazeState, setMazeState] = useState(() => cloneMaze(initialMazeLayout));
  const [ghostPositions, setGhostPositions] = useState(makeGhosts);
  const [status, setStatus] = useState('ready');
  const [paused, setPaused] = useState(false);
  const [playerCount, setPlayerCount] = useState(1);
  const [powerMode, setPowerMode] = useState(false);
  const [powerEnding, setPowerEnding] = useState(false);
  const [scores, setScores] = useState([0, 0]);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [topPlayers, setTopPlayers] = useState(loadHighScores);
  const [showNameInput, setShowNameInput] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [playersView, setPlayersView] = useState(() => [makePlayerState(PLAYER_DEFS[0])]);
  const [level, setLevel] = useState(1);
  const [message, setMessage] = useState('READY!');
  const [fruit, setFruit] = useState(null);
  const [popups, setPopups] = useState([]);
  const [muted, setMutedState] = useState(isMuted);

  const mazeRef = useRef(cloneMaze(initialMazeLayout));
  const pelletsLeftRef = useRef(TOTAL_PELLETS);
  const playersRef = useRef([makePlayerState(PLAYER_DEFS[0])]);
  const playerCountRef = useRef(1);
  const statusRef = useRef('ready');
  const pausedRef = useRef(false);
  const powerModeRef = useRef(false);
  const powerEndingRef = useRef(false);
  const powerUntilRef = useRef(0);
  const powerRemainingRef = useRef(0);
  const ghostRef = useRef(makeGhosts());
  const livesRef = useRef(STARTING_LIVES);
  const levelRef = useRef(1);
  const topPlayersRef = useRef(loadHighScores());
  const rafRef = useRef(null);
  const invulnUntilRef = useRef(0);
  const ghostComboRef = useRef(0);
  const fruitRef = useRef(null);
  const fruitSpawnedRef = useRef(false);
  const popupIdRef = useRef(0);
  const deathTimerRef = useRef(null);
  const levelClearTimerRef = useRef(null);

  const setGameStatus = useCallback((next) => {
    statusRef.current = next;
    setStatus(next);
    if (next !== 'playing') {
      pausedRef.current = false;
      setPaused(false);
    }
  }, []);

  const syncPlayersView = useCallback(() => {
    setPlayersView(playersRef.current.map((p) => ({ ...p, pixel: { ...p.pixel } })));
    setScores([
      playersRef.current[0]?.score || 0,
      playersRef.current[1]?.score || 0,
    ]);
  }, []);

  const isWalkable = useCallback((x, y, maze = mazeRef.current) => {
    if (y < 0 || y >= maze.length) return false;
    const row = maze[y];
    if (x < 0 || x >= row.length) return y === 14;
    return row[x] !== 1;
  }, []);

  const addPopup = useCallback((x, y, text) => {
    const id = popupIdRef.current++;
    setPopups((prev) => [...prev, { id, x, y, text }]);
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 700);
  }, []);

  const activePlayers = useCallback(() => {
    return playersRef.current.filter((p) => p.alive);
  }, []);

  const buildPlayers = useCallback((keepScores = false) => {
    const defs = PLAYER_DEFS.slice(0, playerCountRef.current);
    const prev = playersRef.current;
    return defs.map((def, i) => ({
      ...makePlayerState(def),
      score: keepScores ? prev[i]?.score || 0 : 0,
    }));
  }, []);

  const resetActors = useCallback(
    (keepScores = false) => {
      playersRef.current = buildPlayers(keepScores);
      syncPlayersView();
      const ghosts = makeGhosts();
      ghostRef.current = ghosts;
      setGhostPositions(ghosts);
      fruitRef.current = null;
      fruitSpawnedRef.current = false;
      setFruit(null);
      invulnUntilRef.current = performance.now() + 1500;
    },
    [buildPlayers, syncPlayersView]
  );

  const totalScore = () => playersRef.current.reduce((sum, p) => sum + p.score, 0);

  const endPower = useCallback(() => {
    powerModeRef.current = false;
    powerEndingRef.current = false;
    powerUntilRef.current = 0;
    powerRemainingRef.current = 0;
    setPowerMode(false);
    setPowerEnding(false);
    ghostComboRef.current = 0;
  }, []);

  const activatePowerMode = useCallback(() => {
    const duration = powerDurationForLevel(levelRef.current);
    powerModeRef.current = true;
    powerEndingRef.current = false;
    ghostComboRef.current = 0;
    powerUntilRef.current = performance.now() + duration;
    powerRemainingRef.current = duration;
    setPowerMode(true);
    setPowerEnding(false);
    sfx.power();
  }, []);

  const endGame = useCallback(
    (won) => {
      endPower();
      setGameStatus(won ? 'won' : 'lost');
      setMessage(won ? 'YOU WIN!' : 'GAME OVER');
      const lowest = topPlayersRef.current[topPlayersRef.current.length - 1]?.score ?? 0;
      if (totalScore() > lowest) {
        setShowNameInput(true);
      }
    },
    [endPower, setGameStatus]
  );

  const finishDeathCutin = useCallback(() => {
    deathTimerRef.current = null;
    if (livesRef.current <= 0) {
      endGame(false);
      return;
    }
    resetActors(true);
    setMessage('READY!');
    setGameStatus('ready');
  }, [endGame, resetActors, setGameStatus]);

  const loseLife = useCallback(() => {
    if (statusRef.current === 'dying') return;
    if (performance.now() < invulnUntilRef.current) return;
    sfx.death();
    livesRef.current -= 1;
    setLives(livesRef.current);
    endPower();
    setMessage('');
    setGameStatus('dying');
    if (deathTimerRef.current) clearTimeout(deathTimerRef.current);
    deathTimerRef.current = setTimeout(finishDeathCutin, DEATH_CUTIN_MS);
  }, [endPower, finishDeathCutin, setGameStatus]);

  const maybeSpawnFruit = useCallback(() => {
    if (fruitSpawnedRef.current || fruitRef.current) return;
    const eaten = TOTAL_PELLETS - pelletsLeftRef.current;
    if (eaten >= FRUIT_AFTER_PELLETS) {
      fruitSpawnedRef.current = true;
      fruitRef.current = { ...FRUIT_CELL };
      setFruit({ ...FRUIT_CELL });
    }
  }, []);

  const eatFruit = useCallback(
    (player) => {
      const fruitCell = fruitRef.current;
      if (!fruitCell) return;
      const cell = cellFromPixel(player.pixel);
      if (cell.x !== fruitCell.x || cell.y !== fruitCell.y) return;
      const points = fruitPointsForLevel(levelRef.current);
      player.score += points;
      addPopup(fruitCell.x * CELL_SIZE, fruitCell.y * CELL_SIZE, `+${points}`);
      sfx.fruit();
      fruitRef.current = null;
      setFruit(null);
    },
    [addPopup]
  );

  const eatCell = useCallback(
    (player, x, y) => {
      const maze = mazeRef.current;
      const cell = maze[y]?.[x];
      if (cell !== 2 && cell !== 3) return;

      const points = cell === 2 ? 10 : 50;
      player.score += points;
      addPopup(x * CELL_SIZE, y * CELL_SIZE, `+${points}`);
      if (points === 10) sfx.pellet();

      const nextMaze = cloneMaze(maze);
      nextMaze[y][x] = 0;
      mazeRef.current = nextMaze;
      setMazeState(nextMaze);

      pelletsLeftRef.current -= 1;
      maybeSpawnFruit();

      if (pelletsLeftRef.current <= 0) {
        if (statusRef.current === 'levelClear') return;
        player.score += 500;
        addPopup(x * CELL_SIZE, y * CELL_SIZE - 12, '+500');
        levelRef.current += 1;
        setLevel(levelRef.current);
        endPower();
        setMessage(`LEVEL ${levelRef.current}`);
        setGameStatus('levelClear');
        sfx.levelClear();
        if (levelClearTimerRef.current) clearTimeout(levelClearTimerRef.current);
        levelClearTimerRef.current = setTimeout(() => {
          levelClearTimerRef.current = null;
          const fresh = cloneMaze(initialMazeLayout);
          mazeRef.current = fresh;
          pelletsLeftRef.current = TOTAL_PELLETS;
          setMazeState(fresh);
          resetActors(true);
          setMessage(`LEVEL ${levelRef.current}`);
          setGameStatus('ready');
        }, LEVEL_CLEAR_CUTIN_MS);
        return;
      }

      if (points === 50) {
        activatePowerMode();
      }
    },
    [activatePowerMode, addPopup, endPower, maybeSpawnFruit, resetActors, setGameStatus]
  );

  const ghostChaseTarget = useCallback(
    (ghost) => {
      let bestPlayer = null;
      let bestDist = Infinity;
      for (const player of activePlayers()) {
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
        const blinky = ghostRef.current.find((g) => g.number === 1) || ghost;
        const ahead = { x: cell.x + dd.x * 2, y: cell.y + dd.y * 2 };
        return { x: 2 * ahead.x - blinky.x, y: 2 * ahead.y - blinky.y };
      }
      const dist = Math.abs(ghost.x - cell.x) + Math.abs(ghost.y - cell.y);
      if (dist > 8) return cell;
      return CLYDE_SCATTER;
    },
    [activePlayers]
  );

  const chooseGhostDirection = useCallback(
    (ghost, target) => {
      const dirs = ['up', 'down', 'left', 'right'];
      const options = dirs.filter((d) => {
        if (d === opposite[ghost.direction]) return false;
        const dd = directionDelta[d];
        return isWalkable(ghost.x + dd.x, ghost.y + dd.y);
      });

      const fallback = dirs.filter((d) => {
        const dd = directionDelta[d];
        return isWalkable(ghost.x + dd.x, ghost.y + dd.y);
      });
      const pool = options.length ? options : fallback;
      if (!pool.length) return ghost.direction;

      if (ghost.y >= 12 && ghost.y <= 16 && ghost.x >= 11 && ghost.x <= 16) {
        if (pool.includes('up')) return 'up';
      }

      const fleeing = powerModeRef.current && !ghost.eaten;
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
    },
    [isWalkable]
  );

  const setMode = useCallback(
    (count) => {
      if (statusRef.current !== 'ready') return;
      playerCountRef.current = count;
      setPlayerCount(count);
      playersRef.current = PLAYER_DEFS.slice(0, count).map((def, i) => ({
        ...makePlayerState(def),
        score: playersRef.current[i]?.score || 0,
      }));
      syncPlayersView();
    },
    [syncPlayersView]
  );

  const startPlaying = useCallback(() => {
    if (statusRef.current !== 'ready') return;
    setMessage('');
    setGameStatus('playing');
  }, [setGameStatus]);

  const togglePause = useCallback(() => {
    if (statusRef.current !== 'playing') return;
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    if (next) {
      if (powerModeRef.current) {
        powerRemainingRef.current = Math.max(0, powerUntilRef.current - performance.now());
      }
    } else if (powerModeRef.current) {
      powerUntilRef.current = performance.now() + powerRemainingRef.current;
    }
  }, []);

  const toggleMute = useCallback(() => {
    const next = !isMuted();
    setMuted(next);
    setMutedState(next);
  }, []);

  const restartGame = useCallback(() => {
    if (deathTimerRef.current) {
      clearTimeout(deathTimerRef.current);
      deathTimerRef.current = null;
    }
    if (levelClearTimerRef.current) {
      clearTimeout(levelClearTimerRef.current);
      levelClearTimerRef.current = null;
    }
    const fresh = cloneMaze(initialMazeLayout);
    mazeRef.current = fresh;
    pelletsLeftRef.current = TOTAL_PELLETS;
    setMazeState(fresh);
    livesRef.current = STARTING_LIVES;
    setLives(STARTING_LIVES);
    levelRef.current = 1;
    setLevel(1);
    endPower();
    setShowNameInput(false);
    setPlayerName('');
    setMessage('READY!');
    setGameStatus('ready');
    resetActors(false);
  }, [endPower, resetActors, setGameStatus]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key.toLowerCase();

      if (key === 'm') {
        toggleMute();
        return;
      }

      if (key === 'r' && (statusRef.current === 'won' || statusRef.current === 'lost')) {
        restartGame();
        return;
      }

      if ((key === 'p' || key === 'escape') && statusRef.current === 'playing') {
        e.preventDefault();
        togglePause();
        return;
      }

      if (statusRef.current === 'ready') {
        if (key === '1') {
          setMode(1);
          return;
        }
        if (key === '2') {
          setMode(2);
          return;
        }
        const startKeys = ['enter', ' ', 'w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
        if (playerCountRef.current === 2) {
          startKeys.push('i', 'j', 'k', 'l');
        }
        if (startKeys.includes(key) || startKeys.includes(e.key)) {
          startPlaying();
        }
      }

      if (pausedRef.current) return;
      if (statusRef.current !== 'playing' && statusRef.current !== 'ready') return;

      const p1 = playersRef.current[0];
      const p2 = playersRef.current[1];
      let handled = false;

      if (p1 && (key === 'w' || key === 'arrowup')) {
        p1.nextDirection = 'up';
        handled = true;
      } else if (p1 && (key === 's' || key === 'arrowdown')) {
        p1.nextDirection = 'down';
        handled = true;
      } else if (p1 && (key === 'a' || key === 'arrowleft')) {
        p1.nextDirection = 'left';
        handled = true;
      } else if (p1 && (key === 'd' || key === 'arrowright')) {
        p1.nextDirection = 'right';
        handled = true;
      } else if (p2 && key === 'i') {
        p2.nextDirection = 'up';
        handled = true;
      } else if (p2 && key === 'k') {
        p2.nextDirection = 'down';
        handled = true;
      } else if (p2 && key === 'j') {
        p2.nextDirection = 'left';
        handled = true;
      } else if (p2 && key === 'l') {
        p2.nextDirection = 'right';
        handled = true;
      }

      if (handled) e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [restartGame, setMode, startPlaying, toggleMute, togglePause]);

  useEffect(() => {
    const collidesWithPac = (ghost, pacPixel) => {
      if (ghost.eaten) return false;
      const ghostPx = ghost.pixel.x;
      const ghostPy = ghost.pixel.y;
      return (
        Math.abs(pacPixel.x - ghostPx) < CELL_SIZE * 0.75 &&
        Math.abs(pacPixel.y - ghostPy) < CELL_SIZE * 0.75
      );
    };

    const resolveCollision = (ghost, now, player) => {
      if (powerModeRef.current) {
        ghostComboRef.current += 1;
        const points = 200 * ghostComboRef.current;
        player.score += points;
        addPopup(ghost.pixel.x, ghost.pixel.y, `+${points}`);
        sfx.ghost();
        const home = GHOST_STARTS.find((g) => g.number === ghost.number) || GHOST_STARTS[0];
        ghost.eaten = true;
        ghost.x = home.x;
        ghost.y = home.y;
        ghost.pixel = { x: home.x * CELL_SIZE, y: home.y * CELL_SIZE };
        ghost.respawnAt = now + 3000;
        ghostRef.current = [...ghostRef.current];
        setGhostPositions(ghostRef.current.map((g) => ({ ...g, pixel: { ...g.pixel } })));
        return false;
      }
      loseLife();
      return true;
    };

    const checkCollisions = (now) => {
      if (now < invulnUntilRef.current) return false;
      if (statusRef.current !== 'playing') return false;
      for (const player of playersRef.current) {
        if (!player.alive) continue;
        for (const ghost of ghostRef.current) {
          if (collidesWithPac(ghost, player.pixel)) {
            if (resolveCollision(ghost, now, player)) return true;
          }
        }
      }
      return false;
    };

    const wrapTunnel = (entity, nextX, nextY, gridY) => {
      const width = mazeRef.current[0].length;
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
    };

    const updateGhosts = (now) => {
      const speed = ghostSpeedForLevel(levelRef.current);
      const nextGhosts = ghostRef.current.map((ghost) => {
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
          const target = ghostChaseTarget(ghost);
          const dir = chooseGhostDirection(ghost, target);
          ghost.direction = dir;
          const dd = directionDelta[dir];
          const nx = ghost.x + dd.x;
          const ny = ghost.y + dd.y;
          if (wrapTunnel(ghost, nx, ny, ghost.y)) return ghost;
          if (!isWalkable(nx, ny)) return ghost;
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

      ghostRef.current = nextGhosts;
      setGhostPositions(nextGhosts.map((g) => ({ ...g, pixel: { ...g.pixel } })));
    };

    const updateOnePacman = (player) => {
      if (!player.alive) return;
      const pixel = player.pixel;
      const onGrid = pixel.x % CELL_SIZE === 0 && pixel.y % CELL_SIZE === 0;

      if (onGrid) {
        const gridX = pixel.x / CELL_SIZE;
        const gridY = pixel.y / CELL_SIZE;
        eatCell(player, gridX, gridY);
        eatFruit(player);

        if (statusRef.current !== 'playing') return;

        const wanted = player.nextDirection;
        const wantedDelta = directionDelta[wanted];
        if (wantedDelta && isWalkable(gridX + wantedDelta.x, gridY + wantedDelta.y)) {
          player.direction = wanted;
        }

        const currentDelta = directionDelta[player.direction];
        const nextX = gridX + currentDelta.x;
        const nextY = gridY + currentDelta.y;

        if (wrapTunnel(player, nextX, nextY, gridY)) return;
        if (!isWalkable(nextX, nextY)) return;
      }

      const delta = directionDelta[player.direction];
      player.pixel = {
        x: player.pixel.x + delta.x * MOVE_SPEED,
        y: player.pixel.y + delta.y * MOVE_SPEED,
      };
    };

    const tickPower = (now) => {
      if (!powerModeRef.current) return;
      const remaining = powerUntilRef.current - now;
      powerRemainingRef.current = remaining;
      if (remaining <= 0) {
        endPower();
        return;
      }
      const ending = remaining <= POWER_WARN_MS;
      if (ending !== powerEndingRef.current) {
        powerEndingRef.current = ending;
        setPowerEnding(ending);
      }
    };

    const tick = (now) => {
      if (statusRef.current !== 'playing' || pausedRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      tickPower(now);

      for (const player of playersRef.current) {
        updateOnePacman(player);
      }

      syncPlayersView();

      if (statusRef.current !== 'playing') {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (checkCollisions(now)) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      updateGhosts(now);
      checkCollisions(now);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (deathTimerRef.current) clearTimeout(deathTimerRef.current);
      if (levelClearTimerRef.current) clearTimeout(levelClearTimerRef.current);
    };
  }, [
    addPopup,
    chooseGhostDirection,
    eatCell,
    eatFruit,
    endPower,
    ghostChaseTarget,
    isWalkable,
    loseLife,
    syncPlayersView,
  ]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const name = (playerName || 'YOU').toUpperCase().slice(0, 3);
    const combined = (scores[0] || 0) + (scores[1] || 0);
    const newTopPlayers = [...topPlayersRef.current, { name, score: combined }];
    newTopPlayers.sort((a, b) => b.score - a.score);
    const trimmed = newTopPlayers.slice(0, 5);
    topPlayersRef.current = trimmed;
    setTopPlayers(trimmed);
    try {
      localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(trimmed));
    } catch {
      /* ignore */
    }
    setShowNameInput(false);
  };

  const combinedScore = (scores[0] || 0) + (scores[1] || 0);
  const highScore = Math.max(combinedScore, topPlayers[0]?.score ?? 0);
  const visiblePlayers = playersView.filter((_, i) => i < playerCount);

  return (
    <div className="game-container">
      <div className="game">
        <div className="title-row">
          <div className="brand">PAC-MAN</div>
          <div className="hud-block inline">
            <span className="hud-label">High Score</span>
            <span className="hud-value">{highScore}</span>
          </div>
        </div>

        <div className="hud-bar">
          <div className="hud-item">
            <span className="hud-label">P1 (WASD)</span>
            <span className="hud-value p1-score">{scores[0]}</span>
          </div>
          <div className="hud-item">
            <span className="hud-label">Level</span>
            <span className="hud-value">{level}</span>
          </div>
          {playerCount === 2 && (
            <div className="hud-item">
              <span className="hud-label">P2 (IJKL)</span>
              <span className="hud-value p2-score">{scores[1]}</span>
            </div>
          )}
          <div className="hud-item lives">
            <span className="hud-label">Lives</span>
            <span className="life-icons">
              {Array.from({ length: lives }).map((_, i) => (
                <span key={i} className="life-icon" aria-hidden="true" />
              ))}
            </span>
          </div>
        </div>

        <div
          className={[
            'maze-stage',
            powerMode ? 'power-active' : '',
            powerEnding ? 'power-ending' : '',
            status === 'dying' ? 'dying' : '',
            status === 'levelClear' ? 'level-clear' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Maze layout={mazeState} />
          <div className="game-objects">
            {visiblePlayers.map((player) => (
              <Pacman
                key={player.id}
                position={player.pixel}
                direction={player.direction}
                powerMode={powerMode}
                powerEnding={powerEnding}
                color={player.color}
                playerLabel={player.label}
                dying={status === 'dying'}
                hidden={status === 'lost'}
              />
            ))}
            {ghostPositions.map((ghost) => (
              <Ghost
                key={ghost.number}
                position={ghost}
                powerMode={powerMode}
                powerEnding={powerEnding}
                eaten={ghost.eaten}
                frozen={status === 'dying' || status === 'levelClear'}
              />
            ))}
            {fruit && (
              <div
                className="fruit"
                style={{ left: `${fruit.x * CELL_SIZE}px`, top: `${fruit.y * CELL_SIZE}px` }}
                aria-label="bonus fruit"
              />
            )}
            {popups.map((popup) => (
              <div
                key={popup.id}
                className="score-popup"
                style={{ left: `${popup.x}px`, top: `${popup.y}px` }}
              >
                {popup.text}
              </div>
            ))}
          </div>

          {powerEnding && status === 'playing' && !paused && (
            <div className="power-warning" aria-live="polite">
              HURRY!
            </div>
          )}

          {paused && status === 'playing' && (
            <div className="status-overlay paused">
              <div className="status-message">PAUSED</div>
              <div className="status-sub">P or Esc to resume</div>
            </div>
          )}

          {status === 'dying' && <div className="death-veil" aria-hidden="true" />}

          {status === 'levelClear' && (
            <div className="status-overlay levelClear" aria-live="polite">
              <div className="status-message">LEVEL CLEAR!</div>
              <div className="status-sub">Next {message || `LEVEL ${level}`}</div>
              <div className="level-clear-bonus">+500</div>
            </div>
          )}

          {status !== 'playing' && status !== 'dying' && status !== 'levelClear' && (
            <div className={`status-overlay ${status}`}>
              <div className="status-message">{message || 'READY!'}</div>
              {status === 'ready' && (
                <>
                  <div className="mode-select">
                    <button
                      type="button"
                      className={playerCount === 1 ? 'active' : ''}
                      onClick={() => setMode(1)}
                    >
                      1P
                    </button>
                    <button
                      type="button"
                      className={playerCount === 2 ? 'active' : ''}
                      onClick={() => setMode(2)}
                    >
                      2P
                    </button>
                  </div>
                  <div className="status-sub">
                    {playerCount === 1
                      ? 'Press 2 for co-op · Enter or WASD to start'
                      : 'P1 WASD · P2 IJKL · Enter to start'}
                  </div>
                </>
              )}
              {(status === 'won' || status === 'lost') && (
                <button type="button" className="restart-btn" onClick={restartGame}>
                  Play Again
                </button>
              )}
            </div>
          )}
        </div>

        <div className="controls-hint bottom">
          1/2 players · P pause · M mute{muted ? ' (off)' : ''} · R restart after game over
        </div>
      </div>

      <aside className="side-panel">
        <div className="player-legend">
          <div>
            <span className="swatch p1" /> P1 yellow
          </div>
          {playerCount === 2 && (
            <div>
              <span className="swatch p2" /> P2 pink
            </div>
          )}
        </div>
        <div className="top-players">
          <h2>Top 5</h2>
          <ol>
            {topPlayers.map((player, index) => (
              <li key={`${player.name}-${index}`}>
                <span>{player.name}</span>
                <span>{player.score}</span>
              </li>
            ))}
          </ol>
        </div>
      </aside>

      {showNameInput && (
        <div className="name-input-overlay">
          <form onSubmit={handleNameSubmit}>
            <h3>New High Score!</h3>
            <p>{playerCount === 2 ? 'Team Score' : 'Score'}: {combinedScore}</p>
            <input
              type="text"
              maxLength="3"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="AAA"
              autoFocus
            />
            <button type="submit">Save</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Game;
