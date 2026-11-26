#!/usr/bin/env bash
# Runs once at boot (@reboot via /etc/cron.d/driveit-ops):
# Waits up to 5 minutes for all DriveIt containers, Nginx, and the public site
# to recover, estimates downtime, and logs/sends a boot notification.

set -uo pipefail
# shellcheck source=./lib.sh
. "$(dirname "$0")/lib.sh"

EXPECTED="driveit-app driveit-postgres driveit-redis driveit-nocodb driveit-scheduler driveit-backup"
URLS="http://127.0.0.1:3000/ https://driveitluxury.in/ https://driveitluxury.in/api/fleet"

last_seen=$(stat -c %Y "$STATE_DIR/driveit-app.restarts" 2>/dev/null || echo 0)
booted=$(date -d "$(uptime -s)" +%s)

deadline=$((SECONDS + 300))
while :; do
  down=""
  systemctl is-active --quiet nginx || down="$down nginx"
  for name in $EXPECTED; do
    st=$(docker inspect -f '{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{else}}ok{{end}}' "$name" 2>/dev/null || echo "missing -")
    case "$st" in
      "running healthy"|"running ok") ;;
      *) down="$down $name" ;;
    esac
  done

  bad=""
  for u in $URLS; do
    code=$(curl -sS -o /dev/null --max-time 10 -w '%{http_code}' "$u" 2>/dev/null || echo 000)
    [ "$code" = "200" ] || bad="$bad ${u#https://}"
  done

  [ -z "$down$bad" ] && break
  [ "$SECONDS" -ge "$deadline" ] && break
  sleep 10
done

when=$(TZ=Asia/Kolkata date -d "@$booted" '+%-d %b, %-I:%M %p IST')
if [ "$last_seen" -gt 0 ] && [ "$last_seen" -lt "$booted" ]; then
  mins=$(( (booted - last_seen + 59) / 60 ))
  downtime="Down for about ${mins} min (last check before reboot: $(TZ=Asia/Kolkata date -d "@$last_seen" '+%-I:%M %p IST'))."
else
  downtime="Downtime unknown (no earlier health check state found)."
fi

if [ -z "$down$bad" ]; then
  status="All 6 DriveIt services, Nginx, and the public website are back up."
  icon="🔄"
else
  status="Still not healthy after 5 minutes:${down:+
• services:$down}${bad:+
• endpoints:$bad}"
  icon="🚨"
fi

message="${icon} Server restarted
${HOST_LABEL} · ${when}
${downtime}
${status}"

if [ -n "${DRY_RUN:-}" ]; then
  echo "$message"
else
  telegram "$message"
fi
log "boot alert${DRY_RUN:+ (dry run)}: ${down:+down:$down }${bad:+bad:$bad}"
