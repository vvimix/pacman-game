# Technical Specification

## Stack

- React 18 (CRA) — `pacman-game-frontend`
- Node + `ws` — `pacman-game-server`
- Shared engine: `pacman-game-frontend/src/game/engine.mjs`
- Web Audio (`src/audio.js`); Press Start 2P
- `REACT_APP_WS_URL` default `ws://127.0.0.1:3001`

## Online rooms

- Seats array size = `maxPlayers` (2–8); roles P1–P8 from `PLAYER_DEFS`
- `createRoom` `{ maxPlayers, mode }` where mode is `coop` | `ffa` | `survive` | `teams`
- Host `start` when filled ≥ 2; auto-start when filled === maxPlayers; classic max=2 also auto-starts on guest join
- Authoritative tick ~20 Hz; clients send `input` only
- Host disconnect grace + reclaim; mid-game guest → `eliminatePlayer`

## Engine modes

- **coop:** shared `lives` (`coopLivesForCount`), death cut-in, level progression
- **ffa:** per-player `lives` (3), eliminate at 0, `ffaWin` / maze-clear high score
- **survive:** per-player `lives` (1), eliminate at 0, `surviveWin` last Pac; maze clear continues if 2+ alive
- **teams:** `teamLives[2]`, P1–4 team A / P5–8 team B, `teamWin`

## Runtime

- Frontend :3000 · Server :3001
- Offline: `Game.jsx` RAF loop (unchanged 1P/2P)
