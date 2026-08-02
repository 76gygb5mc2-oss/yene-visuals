#!/bin/bash
# Auto-restart wrapper for Yene Visuals
PIDFILE="/tmp/yene-visuals.pid"
LOGFILE="/opt/data/projects/yene-visuals/server.log"

echo $$ > "$PIDFILE"

while true; do
  echo "[$(date)] Starting Yene Visuals server..." >> "$LOGFILE"
  cd /opt/data/projects/yene-visuals
  PORT=8765 npx next start -p 8765 >> "$LOGFILE" 2>&1
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE. Restarting in 5s..." >> "$LOGFILE"
  sleep 5
done
