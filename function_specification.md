# Function Specification

## game/engine.mjs

- `PLAYER_DEFS` (P1–P8), `MODES` (coop/ffa/survive/teams), `coopLivesForCount`, `FFA_LIVES`, `SURVIVE_LIVES`, `TEAM_LIVES`
- `isSoloLivesMode` / `personalLivesForMode`
- `createGame({ playerCount, mode })` / `setPlayerCount` / `restartGame`
- `startGame` / `setInput` / `setPaused` / `eliminatePlayer`
- `tick` / `getSnapshot` — mode-aware lives, winner, teamLives, scores[]
- Internal: `loseLife` (coop/ffa/survive/teams), `checkSoloWin`, team win checks, level-clear resolution

## pacman-game-server/src/index.js

- Seat-based rooms: `createRoom`, `joinRoom`, `assignSeat`, `syncRoster`, `maybeAutoStart`
- `lobbyPayload` / `broadcastLobby`
- Host-only `start` / `restart`; disconnect grace for seat 0

## App.js

- Lobby: offline, host 2P, host party (mode + max), join code

## OnlineGame.jsx

- WebSocket client with hostOptions; lobby filled/max/mode; Start; party scoreboard; up to 8 Pacs

## Game.jsx / audio / Maze / Pacman / Ghost

- Offline path unchanged; shared render components for online snapshots
