# Test Plan

## Offline

- [ ] Lobby → Play offline; 1P/2P, WASD/IJKL, pause/mute, lives, fruit, cut-ins

## Classic online 2P

- [ ] Host online (2P) + Join with code; auto-starts; both move own Pac

## Party rooms

- [ ] Host party max 4 co-op; 3 clients join; waiting shows 3/4; host Start begins with 3 Pacs
- [ ] Full room auto-starts when filled === max
- [ ] FFA: ghost hits reduce personal lives; eliminated Pac hidden; last standing wins
- [ ] Survive: each Pac has 1 life; one hit eliminates; last Pac wins (`SURVIVES!`); clear continues if 2+ alive
- [ ] Teams: P1–4 / P5–8 colors; team lives HUD; team wipe or maze-clear score wins
- [ ] Guest disconnect mid-FFA eliminates that seat; match continues
- [ ] Host disconnect ends room after grace; reclaim works on remount
- [ ] Scoreboard shows all seats; “you” highlighted

## Server

- [ ] `npm run start:once` listens on :3001; leave Terminal open
