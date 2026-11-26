#!/usr/bin/env bash
# Weekly maintenance (Sunday 04:00 IST / Saturday 22:30 UTC):
# Cleans genuine waste while preserving kernel page cache, Redis sessions,
# active images, volumes, and the newest 3 GB of Docker build cache for fast deploys.

set -uo pipefail
# shellcheck source=./lib.sh
. "$(dirname "$0")/lib.sh"

disk_before=$(df --output=used -B1 / | tail -1)

# Docker: keep newest 3 GB build cache; remove older cache and dangling images only.
docker builder prune --force --reserved-space 3gb >/dev/null 2>&1 || log "builder prune failed"
docker image prune --force >/dev/null 2>&1 || log "image prune failed"

# Trim ops logs over 5 MB.
for f in "$LOG_DIR"/*.log /var/log/vps-cleaner.log; do
  if [ -f "$f" ] && [ "$(stat -c %s "$f")" -gt 5242880 ]; then
    tail -n 2000 "$f" > "$f.tmp" && mv "$f.tmp" "$f"
  fi
done

# Clean old rotated logs in /var/log (>7 days) and /tmp leftovers (>7 days).
find /var/log -type f \( -name '*.gz' -o -name '*.old' \) -mtime +7 -delete 2>/dev/null || true
find /tmp -maxdepth 1 -name 'driveit_*' -mtime +7 -exec rm -rf {} + 2>/dev/null || true

# Systemd journal cap & APT cache cleanup.
journalctl --vacuum-size=100M --vacuum-time=7d >/dev/null 2>&1 || true
apt-get clean -y >/dev/null 2>&1 || true

disk_after=$(df --output=used -B1 / | tail -1)
freed_mb=$(( (disk_before - disk_after) / 1048576 ))
[ "$freed_mb" -lt 0 ] && freed_mb=0

# ── Weekly summary ──
disk_line=$(df -h --output=used,size,pcent / | tail -1 | awk '{print $1" of "$2" ("$3")"}')
mem_avail=$(awk '/^MemAvailable:/ {print int($2/1024)}' /proc/meminfo)
mem_total=$(awk '/^MemTotal:/ {print int($2/1024)}' /proc/meminfo)
swap_used=$(awk '/^SwapTotal:/ {t=$2} /^SwapFree:/ {f=$2} END {print int((t-f)/1024)}' /proc/meminfo)

pg_user="$(env_value POSTGRES_USER)"; pg_user="${pg_user:-driveit}"
pg_db="$(env_value POSTGRES_DB)"; pg_db="${pg_db:-driveit}"
db_size=$(docker exec driveit-postgres psql -U "$pg_user" -d "$pg_db" -Atc \
  "select pg_size_pretty(pg_database_size(current_database()))" 2>/dev/null || echo unknown)

build_cache=$(docker system df --format '{{.Type}} {{.Size}}' 2>/dev/null | awk '/Build Cache/ {print $3}')
containers=$(docker ps --format '{{.Names}}: {{.Status}}' | grep -E '^driveit-' | sort)

backup_age=$(docker exec driveit-backup sh -c '
  latest=$(ls -1t /backups/driveit_*.dump 2>/dev/null | head -n 1 || true)
  [ -n "$latest" ] || { echo "none found"; exit 0; }
  age=$(( ($(date +%s) - $(stat -c %Y "$latest")) / 3600 ))
  sz=$(du -h "$latest" | cut -f1)
  echo "${age}h ago (${sz})"
' 2>/dev/null || echo unknown)

release=$(git -C "$APP_DIR" rev-parse --short HEAD 2>/dev/null || echo unknown)

summary="🧹 Weekly server check (${HOST_LABEL})
Cleaned up: ${freed_mb} MB
Disk used: ${disk_line}
Memory free: ${mem_avail} of ${mem_total} MB · swap used: ${swap_used} MB
Database: ${db_size} · build cache: ${build_cache:-0B}
Last backup: ${backup_age}
Commit: ${release}
Services:
$(printf '%s\n' "$containers" | sed 's/^/• /')"

telegram "$summary"
log "weekly maintenance done, freed ${freed_mb} MB (disk: ${disk_line}, db: ${db_size})"
