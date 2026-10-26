# User Guide

## Run

### Offline / UI

```bash
cd pacman-game-frontend
npm start
```

Open http://localhost:3000

### Online (required for Host / Join / Party)

Keep a **Terminal** open with the game server:

```bash
cd pacman-game-server
npm install
npm run start:once
```

Server listens on **ws://127.0.0.1:3001**. Then start the React app as above.

On LAN, set `REACT_APP_WS_URL=ws://HOST_IP:3001` before `npm start`.

## Lobby

1. **Play offline** — local 1P / 2P (WASD + IJKL).
2. **Host online (2P)** — classic 2-seat co-op; auto-starts when guest joins.
3. **Host party (2–8)** — choose **Co-op**, **FFA**, or **Teams** and max players; share the room code; press **Start** (or Enter) when at least 2 are in (auto-starts when the room is full).
4. **Join online** — enter the room code. You get the next free seat (P1–P8). Everyone uses **WASD / arrows**.

## Party modes

| Mode | Lives | Win |
|------|--------|-----|
| **Co-op** | Shared (scales with party size, max 6) | Clear levels together; game over when shared lives hit 0 |
| **FFA** | 3 per Pac | Last Pac standing, or highest score if the maze clears |
| **Survive** | **1 per Pac** | Last Pac standing wins; maze clear continues to next level while 2+ remain |
| **Teams** | Shared per team (P1–4 = A, P5–8 = B) | Wipe the other team, or higher team score on maze clear |

## Offline how to play

1. On **READY!**, choose **1P** or **2P** (`1` / `2`).
2. Enter / Space / movement to start.
3. P1 WASD/arrows; offline P2 uses IJKL.
4. Pellets, power pellets, fruit, lives, level-clear cut-ins — same as before.

## Extra controls

- **P** — pause
- **Esc** — leave online room / offline pause
- **M** — mute
- **R** / **Play Again** — host restart after game over
