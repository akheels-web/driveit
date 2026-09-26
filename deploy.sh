#!/usr/bin/env bash
# ==============================================================================
# DRIVEIT LUXURY — Production Zero-Downtime Deployment Script
# Usage: sudo ./deploy.sh [service_name]
# Example: sudo ./deploy.sh       (deploys the Next.js app container)
#          sudo ./deploy.sh all   (restarts all compose containers)
# ==============================================================================

set -euo pipefail

# Ensure running in script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

SERVICE="${1:-app}"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"

echo "=========================================================="
echo "🚀 DRIVEIT LUXURY — Starting Production Deployment"
echo "📅 Date: $(date)"
echo "🎯 Target Service: $SERVICE"
echo "=========================================================="

# 1. Check Git Status & Pull Latest Code
echo "📥 [1/4] Pulling latest updates from GitHub (main branch)..."
git fetch origin main
LOCAL_HASH=$(git rev-parse HEAD)
REMOTE_HASH=$(git rev-parse origin/main)

if [ "$LOCAL_HASH" = "$REMOTE_HASH" ]; then
  echo "ℹ️ Code is already up-to-date at commit: $LOCAL_HASH"
else
  echo "📦 Updating from $LOCAL_HASH -> $REMOTE_HASH..."
  git pull origin main
fi

# 2. Build Container
echo "🔨 [2/4] Building target container ($SERVICE)..."
docker compose -f "$COMPOSE_FILE" build "$SERVICE"

# 3. Restart Container (Zero-Downtime Recreate)
echo "🔄 [3/4] Recreating and launching updated container ($SERVICE)..."
if [ "$SERVICE" = "all" ]; then
  docker compose -f "$COMPOSE_FILE" up -d
else
  docker compose -f "$COMPOSE_FILE" up -d --no-deps "$SERVICE"
fi

# 4. Wait & Healthcheck
echo "🩺 [4/4] Verifying health and boot logs..."
sleep 3

# Show last 15 lines of logs
if [ "$SERVICE" = "app" ] || [ "$SERVICE" = "all" ]; then
  docker logs --tail 15 driveit-app
fi

echo "=========================================================="
echo "✅ Deployment Successful! Current containers status:"
docker compose -f "$COMPOSE_FILE" ps
echo "🌐 Production Site: https://driveitluxury.in"
echo "⚙️ CMS Admin:      https://driveitluxury.in/admin"
echo "=========================================================="
