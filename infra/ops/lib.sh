#!/usr/bin/env bash
# Shared helpers for DRIVEIT Luxury production health check, security watch,
# boot alert, and weekly maintenance.
#
# Telegram credentials are read from /etc/driveit-ops.env (preferred, mode 600)
# or /root/driveit/.env at send time and are never printed or committed to Git.
# If unconfigured, alerts are logged locally without failing the caller.

OPS_DIR="${OPS_DIR:-/var/lib/driveit-ops}"
LOG_DIR="${LOG_DIR:-/var/log/driveit-ops}"
APP_DIR="${APP_DIR:-/root/driveit}"
OPS_ENV_FILE="${OPS_ENV_FILE:-/etc/driveit-ops.env}"
STATE_DIR="$OPS_DIR/state"

mkdir -p "$STATE_DIR" "$LOG_DIR"

env_value() {
  local key="$1" val=""
  if [ -r "$OPS_ENV_FILE" ]; then
    val=$(grep -m1 "^${key}=" "$OPS_ENV_FILE" 2>/dev/null | cut -d= -f2- | tr -d '\r"' | sed "s/^'//;s/'$//" || true)
  fi
  if [ -z "$val" ] && [ -r "$APP_DIR/.env" ]; then
    val=$(grep -m1 "^${key}=" "$APP_DIR/.env" 2>/dev/null | cut -d= -f2- | tr -d '\r"' | sed "s/^'//;s/'$//" || true)
  fi
  printf '%s' "$val"
}

log() {
  echo "$(date -u '+%F %T UTC') $*"
}

telegram() {
  if [ -n "${TELEGRAM_DRY_RUN:-}" ]; then
    printf -- '--- telegram (dry-run) ---\n%s\n' "$1"
    return 0
  fi

  local token chat code
  token="$(env_value TELEGRAM_OPS_BOT_TOKEN)"
  [ -n "$token" ] || token="$(env_value TELEGRAM_BOT_TOKEN)"
  chat="$(env_value TELEGRAM_OPS_CHAT_ID)"
  [ -n "$chat" ] || chat="$(env_value TELEGRAM_CHAT_ID)"

  if [ -z "$token" ] || [ -z "$chat" ]; then
    log "telegram not configured (logged only): $(printf '%s' "$1" | head -n 1)"
    return 0
  fi

  code=$(curl -sS --max-time 15 -o /dev/null -w '%{http_code}' \
    "https://api.telegram.org/bot${token}/sendMessage" \
    --data-urlencode "chat_id=${chat}" \
    --data-urlencode "text=$1" \
    --data-urlencode "disable_web_page_preview=true") || code=000

  [ "$code" = "200" ] || log "telegram send failed (HTTP $code)"
}

HOST_LABEL="DRIVEIT Luxury production"

nice_service() {
  case "$1" in
    driveit-app|app) echo "website & CMS app" ;;
    driveit-postgres|postgres) echo "PostgreSQL database" ;;
    driveit-redis|redis) echo "Redis cache" ;;
    driveit-nocodb|nocodb) echo "NocoDB ops portal" ;;
    driveit-scheduler|scheduler) echo "hold-expiry scheduler" ;;
    driveit-backup|backup) echo "nightly backup runner" ;;
    nginx) echo "Nginx reverse proxy" ;;
    *) echo "$1" ;;
  esac
}

problem_title() {
  case "$1" in
    mem_low) echo "Low memory" ;;
    swap_high) echo "Server short of memory (high swap)" ;;
    disk_high) echo "Disk nearly full" ;;
    missing_*) echo "Service missing: $(nice_service "${1#missing_}")" ;;
    restarting_*) echo "Service keeps restarting: $(nice_service "${1#restarting_}")" ;;
    unhealthy_*) echo "Service not healthy: $(nice_service "${1#unhealthy_}")" ;;
    nginx_down) echo "Nginx reverse proxy down" ;;
    origin_down) echo "Local app origin not answering" ;;
    site_down) echo "Public website not answering" ;;
    api_down) echo "Fleet API not answering" ;;
    backup_stale) echo "Nightly Postgres backup missing or stale" ;;
    reboot_required) echo "Security updates waiting for reboot" ;;
    *) echo "${1//_/ }" ;;
  esac
}
