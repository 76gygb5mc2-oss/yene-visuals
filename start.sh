#!/bin/bash
cd /opt/data/projects/yene-visuals

# Build if no .next directory exists
if [ ! -d ".next" ] || [ ! -f ".next/BUILD_ID" ]; then
  echo "Building Next.js..."
  NODE_OPTIONS="--max-old-space-size=2048" npx next build
fi

# Start the production server
exec npx next start -p 8765
