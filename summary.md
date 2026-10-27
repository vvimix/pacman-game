# Project Summary

- Pac-Man CRA frontend + Node WebSocket server
- Lobby: offline, Host 2P, **Host party (2–8, coop/FFA/survive/teams)**, Join by code
- Survive mode: 1 life each, last Pac wins; maze clear continues while 2+ remain
- Fix: unknown mode no longer silently falls back to coop (restart server required); reclaim applies requested mode
- GitHub: https://github.com/vvimix/pacman-game (`main` pushed via HTTPS + `gh`)
- Shared engine `engine.mjs`: P1–P8 defs, mode-aware lives/wins, snapshots
- Server seats[] (not p1/p2); host Start; classic 2P auto-start preserved
- OnlineGame: party scoreboard, lobby filled/max/mode, Start button
- WS URL defaults to `ws://127.0.0.1:3001`; run server in a real Terminal

## Earlier

- Offline polish: lives, AI, fruit, SFX, death/level-clear cut-ins
- Online 2P authoritative rooms; fixed CRA ESM / server keep-alive issues
