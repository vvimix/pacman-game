# Pac-Man (offline + online party)

React arcade client and a Node WebSocket server for local/LAN multiplayer (2–8 players).

## Quick start

```bash
# Terminal 1 — game server (:3001)
cd pacman-game-server
npm install
npm run start:once

# Terminal 2 — UI (:3000)
cd pacman-game-frontend
npm install
npm start
```

Open http://localhost:3000

Lobby options: offline 1P/2P, Host online (2P), Host party (co-op / FFA / Survive / Teams), Join with room code.

See [user_guide.md](user_guide.md) for controls and modes.

## Stack

- Frontend: React 18 (Create React App)
- Server: Node.js + `ws` (authoritative ~20 Hz tick)
- Shared rules: `pacman-game-frontend/src/game/engine.mjs`

## Note

Fan / learning project inspired by Pac-Man. Not affiliated with Bandai Namco.
