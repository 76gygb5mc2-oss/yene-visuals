#!/bin/bash
# Check if Yene Visuals server is responding
if ! curl -s -o /dev/null -w "" --max-time 5 http://localhost:8765/ 2>/dev/null; then
  # Server is down - kill any zombies and restart
  pkill -f "run-forever.sh" 2>/dev/null
  pkill -f "next start.*8765" 2>/dev/null
  sleep 2
  
  cd /opt/data/projects/yene-visuals
  bash /opt/data/projects/yene-visuals/run-forever.sh &
  disown
  
  echo "Yene Visuals server was down — restarted at $(date)"
fi
