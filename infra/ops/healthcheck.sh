#!/usr/bin/env bash
# Runs every 5 minutes via cron:
# - Checks memory, swap, disk, Nginx, all DriveIt Docker containers, local
#   origin + public HTTPS endpoints, nightly Postgres backup freshness, and
#   pending security reboots.
# - Alerts once when a problem begins, repeats every 6 hours while active, and
#   sends one recovery notice when cleared.
# - Auto-restarts ONLY stateless app containers (driveit-app, driveit-nocodb,
#   driveit-scheduler) or Nginx after 3 consecutive failed checks (15 minutes).
#   PostgreSQL and Redis are never auto-restarted.

set -uo pipefail
# shellcheck source=./lib.sh
. "$(dirname "$0")/lib.sh"

REPEAT_SECONDS=$((6 * 3600))
EXPECTED="driveit-app driveit-postgres driveit-redis driveit-nocodb driveit-scheduler driveit-backup"
RESTARTABLE="driveit-app driveit-nocodb driveit-scheduler"
PUBLIC_URL="${PUBLIC_URL:-https://driveitluxury.in}"
LOCAL_URL="${LOCAL_URL:-http://127.0.0.1:3000}"

now=$(date +%s)
active=""

problem() {
  local id="$1" msg="$2" file="$STATE_DIR/$1.alert" last=0
  active="$active $id"
  [ -f "$file" ] && last=$(cat "$file" 2>/dev/null || echo 0)
  if [ $((now - last)) -ge "$REPEAT_SECONDS" ]; then
    telegram "⚠️ $(problem_title "$id")
${msg}"
    echo "$now" > "$file"
    log "ALERT $id: $msg"
  fi
}

# ── Memory, swap, disk ──
mem_total=$(awk '/^MemTotal:/ {print $2}' /proc/meminfo)
mem_avail=$(awk '/^MemAvailable:/ {print $2}' /proc/meminfo)
mem_pct=$((mem_avail * 100 / mem_total))
[ "$mem_pct" -lt 15 ] && problem mem_low "Only ${mem_pct}% RAM available ($((mem_avail / 1024)) MB free of $((mem_total / 1024)) MB)."

swap_total=$(awk '/^SwapTotal:/ {print $2}' /proc/meminfo)
swap_free=$(awk '/^SwapFree:/ {print $2}' /proc/meminfo)
if [ "$swap_total" -gt 0 ]; then
  swap_pct=$(((swap_total - swap_free) * 100 / swap_total))
  [ "$swap_pct" -gt 50 ] && problem swap_high "Swap is ${swap_pct}% used: the server is under memory pressure."
fi

disk_pct=$(df --output=pcent / | tail -1 | tr -dc '0-9')
[ "$disk_pct" -gt 80 ] && problem disk_high "Root filesystem is ${disk_pct}% full."

# ── Nginx reverse proxy ──
nginx_fail_file="$STATE_DIR/nginx.unhealthy"
if ! systemctl is-active --quiet nginx; then
  fails=$(( $(cat "$nginx_fail_file" 2>/dev/null || echo 0) + 1 ))
  echo "$fails" > "$nginx_fail_file"
  if [ "$fails" -ge 3 ]; then
    if systemctl restart nginx >/dev/null 2>&1; then
      result="restarted it"
    else
      result="restart FAILED"
    fi
    telegram "🔁 Restarted Nginx reverse proxy
Nginx was inactive for 15 minutes; ${result}."
    log "RESTART nginx: $result"
    echo 0 > "$nginx_fail_file"
  fi
  problem nginx_down "Nginx systemd service is not active."
else
  rm -f "$nginx_fail_file"
fi

# ── Docker containers ──
for name in $EXPECTED; do
  status=$(docker inspect -f '{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}} {{.RestartCount}}' "$name" 2>/dev/null) \
    || { problem "missing_$name" "Container ${name} does not exist."; continue; }
  read -r state health restarts <<< "$status"

  prev_file="$STATE_DIR/$name.restarts"
  prev=$(cat "$prev_file" 2>/dev/null || echo "$restarts")
  echo "$restarts" > "$prev_file"
  [ "$restarts" -gt "$prev" ] && problem "restarting_$name" "Container ${name} restarted $((restarts - prev)) time(s) in the last 5 minutes (total ${restarts})."

  fail_file="$STATE_DIR/$name.unhealthy"
  if [ "$state" != "running" ] || [ "$health" = "unhealthy" ]; then
    fails=$(( $(cat "$fail_file" 2>/dev/null || echo 0) + 1 ))
    echo "$fails" > "$fail_file"
    if [ "$fails" -ge 3 ] && [[ " $RESTARTABLE " == *" $name "* ]]; then
      if docker restart "$name" >/dev/null 2>&1; then
        result="restarted it"
      else
        result="restart FAILED"
      fi
      telegram "🔁 Restarted $(nice_service "$name")
Container ${name} was ${state} (health: ${health}) for 15 minutes; ${result}."
      log "RESTART $name ($state/$health): $result"
      echo 0 > "$fail_file"
    fi
    problem "unhealthy_$name" "Container ${name} is ${state} (health: ${health})."
  else
    rm -f "$fail_file"
  fi
done

# ── Origin & public HTTPS health (retry once after 15s to filter blips) ──
http_check() {
  local url="$1" code
  code=$(curl -sS -o /dev/null --max-time 10 -w '%{http_code}' "$url" 2>/dev/null || echo 000)
  if [ "$code" != "200" ]; then
    sleep 15
    code=$(curl -sS -o /dev/null --max-time 10 -w '%{http_code}' "$url" 2>/dev/null || echo 000)
  fi
  echo "$code"
}

origin_code=$(http_check "${LOCAL_URL}/")
[ "$origin_code" = "200" ] || problem origin_down "Local app origin ${LOCAL_URL}/ returned HTTP ${origin_code}."

site_code=$(http_check "${PUBLIC_URL}/")
[ "$site_code" = "200" ] || problem site_down "Public website ${PUBLIC_URL}/ returned HTTP ${site_code}."

if [ "$site_code" = "200" ]; then
  api_code=$(http_check "${PUBLIC_URL}/api/fleet")
  [ "$api_code" = "200" ] || problem api_down "Fleet API ${PUBLIC_URL}/api/fleet returned HTTP ${api_code}."
else
  [ -f "$STATE_DIR/api_down.alert" ] && active="$active api_down"
fi

# ── Nightly Postgres backup freshness (inside driveit-backup volume) ──
backup_info=$(docker exec driveit-backup sh -c '
  latest=$(ls -1t /backups/driveit_*.dump 2>/dev/null | head -n 1 || true)
  [ -n "$latest" ] || exit 1
  echo "$(stat -c %Y "$latest") $(stat -c %s "$latest") $(basename "$latest")"
' 2>/dev/null || true)

if [ -n "$backup_info" ]; then
  read -r b_mtime b_size b_name <<< "$backup_info"
  b_age_h=$(( (now - b_mtime) / 3600 ))
  if [ "$b_size" -lt 10240 ]; then
    problem backup_stale "Latest Postgres backup (${b_name}) is suspiciously small (${b_size} bytes)."
  elif [ "$b_age_h" -ge 26 ]; then
    problem backup_stale "Latest Postgres backup (${b_name}) is ${b_age_h} hours old (scheduled nightly at 02:00 UTC)."
  fi
else
  problem backup_stale "No Postgres dump found in driveit-backup:/backups."
fi

# ── Pending security reboot (alert only; never reboots automatically) ──
if [ -f /var/run/reboot-required ]; then
  problem reboot_required "Security updates require a reboot. At a quiet time run: sudo reboot"
fi

# ── Clear recovered alerts ──
for file in "$STATE_DIR"/*.alert; do
  [ -e "$file" ] || continue
  id=$(basename "$file" .alert)
  if [[ " $active " != *" $id "* ]]; then
    telegram "✅ Fixed: $(problem_title "$id")
Back to normal on ${HOST_LABEL}."
    log "RECOVERED $id"
    rm -f "$file"
  fi
done

exit 0
