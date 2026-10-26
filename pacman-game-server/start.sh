#!/usr/bin/env bash
cd "$(dirname "$0")"
export PORT="${PORT:-3001}"
while true; do
  echo "[$(date '+%H:%M:%S')] starting pacman-game-server on :$PORT"
  node src/index.js
  code=$?
  echo "[$(date '+%H:%M:%S')] server exited ($code); restarting in 1s"
  sleep 1
done
