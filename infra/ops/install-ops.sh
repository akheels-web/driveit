#!/usr/bin/env bash
# Idempotent installer for DRIVEIT Luxury server ops & security monitoring.
# Run as root:
#   sudo bash /root/driveit/infra/ops/install-ops.sh
#
# Installs:
# - /opt/driveit-ops/{lib,healthcheck,weekly-maintenance,boot-alert,security-watch}.sh
# - /usr/local/sbin/driveit-telegram (used by fail2ban; no-ops if token unset)
# - /etc/cron.d/driveit-ops (5-min healthcheck + security-watch, weekly maintenance, @reboot boot-alert)
# - /etc/logrotate.d/driveit-ops
# - /etc/fail2ban/jail.d/driveit.local + action.d/driveit-telegram.conf (protecting trusted IPs)
# - /etc/driveit-ops.env.example (placeholder template; NEVER copies tokens from other projects)

set -euo pipefail
[ "$(id -u)" = 0 ] || { echo "Run as root (sudo bash $0)."; exit 1; }

SRC="$(cd "$(dirname "$0")" && pwd)"
DEST=/opt/driveit-ops
STATE_ROOT=/var/lib/driveit-ops
LOG_DIR=/var/log/driveit-ops
KNOWN_IPS="$STATE_ROOT/known-ssh-ips"

echo "== [1/5] Installing ops scripts to $DEST =="
install -d -m 755 "$DEST" "$STATE_ROOT" "$STATE_ROOT/state" "$LOG_DIR"
install -m 755 \
  "$SRC/lib.sh" \
  "$SRC/healthcheck.sh" \
  "$SRC/weekly-maintenance.sh" \
  "$SRC/boot-alert.sh" \
  "$SRC/security-watch.sh" \
  "$DEST/"

# Seed known SSH IPs from recent login history if missing.
if [ ! -s "$KNOWN_IPS" ]; then
  last -i -w 2>/dev/null \
    | awk '$1 != "reboot" && $1 != "wtmp" && $3 ~ /^[0-9a-f.:]+$/ && $3 != "0.0.0.0" {print $3}' \
    | sort -u > "$KNOWN_IPS" || true
  chmod 644 "$KNOWN_IPS"
fi
TRUSTED_IPS="$(grep -E '^[0-9a-f.:]+$' "$KNOWN_IPS" 2>/dev/null | sort -u | tr '\n' ' ' || true)"
echo "Trusted SSH IPs (never banned by fail2ban): ${TRUSTED_IPS:-none}"

echo "== [2/5] Creating Telegram env template (no token copied) =="
cat > /etc/driveit-ops.env.example <<'EOF'
# DRIVEIT Luxury Ops Telegram Alerts (create a dedicated bot via @BotFather)
# Copy to /etc/driveit-ops.env (chmod 600) and fill in your DriveIt-specific values:
#   sudo cp /etc/driveit-ops.env.example /etc/driveit-ops.env
#   sudo chmod 600 /etc/driveit-ops.env
#   sudo nano /etc/driveit-ops.env
TELEGRAM_OPS_BOT_TOKEN=
TELEGRAM_OPS_CHAT_ID=
EOF
chmod 644 /etc/driveit-ops.env.example
if [ -f /etc/driveit-ops.env ]; then
  chmod 600 /etc/driveit-ops.env
  echo "Existing /etc/driveit-ops.env preserved (mode 600)."
else
  echo "Note: /etc/driveit-ops.env not yet created — alerts will log to $LOG_DIR until configured."
fi

echo "== [3/5] Installing root Telegram helper & fail2ban jail =="
cat > /usr/local/sbin/driveit-telegram <<'EOF'
#!/bin/sh
# Sends its arguments (one per line) to DriveIt ops Telegram chat.
# Reads credentials at send time from /etc/driveit-ops.env or /root/driveit/.env.
# Silently no-ops if unconfigured.
read_var() {
  key="$1"
  val=""
  for f in /etc/driveit-ops.env /root/driveit/.env; do
    [ -r "$f" ] || continue
    val=$(grep -m1 "^${key}=" "$f" 2>/dev/null | cut -d= -f2- | tr -d '\r"' | sed "s/^'//;s/'$//")
    [ -n "$val" ] && { printf '%s' "$val"; return 0; }
  done
}
TOKEN=$(read_var TELEGRAM_OPS_BOT_TOKEN)
[ -n "$TOKEN" ] || TOKEN=$(read_var TELEGRAM_BOT_TOKEN)
CHAT=$(read_var TELEGRAM_OPS_CHAT_ID)
[ -n "$CHAT" ] || CHAT=$(read_var TELEGRAM_CHAT_ID)
[ -n "$TOKEN" ] && [ -n "$CHAT" ] || exit 0
TEXT=$(printf '%s\n' "$@")
curl -sS --max-time 15 -o /dev/null "https://api.telegram.org/bot${TOKEN}/sendMessage" \
  --data-urlencode "chat_id=${CHAT}" \
  --data-urlencode "text=${TEXT}" \
  --data-urlencode "disable_web_page_preview=true" || true
EOF
chmod 700 /usr/local/sbin/driveit-telegram

if command -v fail2ban-client >/dev/null 2>&1; then
  cat > /etc/fail2ban/action.d/driveit-telegram.conf <<'EOF'
[Definition]
actionban = /usr/local/sbin/driveit-telegram "🛡️ Blocked an SSH attacker (DRIVEIT)" "IP: <ip> · <failures> failed logins" "Blocked for <bantime>s (fail2ban)."
actionunban =
EOF
  cat > /etc/fail2ban/jail.d/driveit.local <<EOF
[DEFAULT]
ignoreip = 127.0.0.1/8 ::1 ${TRUSTED_IPS}

[sshd]
enabled = true
maxretry = 5
bantime = 1h
findtime = 10m
action = %(action_)s
         driveit-telegram
EOF
  if fail2ban-client -t >/dev/null 2>&1; then
    systemctl restart fail2ban
    echo "ok: fail2ban configured and restarted"
  else
    rm -f /etc/fail2ban/jail.d/driveit.local /etc/fail2ban/action.d/driveit-telegram.conf
    echo "WARN: fail2ban rejected config; reverted to previous jail config"
  fi
else
  echo "Note: fail2ban not installed; skipping jail configuration"
fi

echo "== [4/5] Installing cron schedule & logrotate =="
cat > /etc/cron.d/driveit-ops <<'CRON'
# DRIVEIT Luxury production health, security watch, weekly maintenance & boot alert
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin

# Every 5 minutes: container/HTTP/disk/RAM/backup healthcheck & self-heal
*/5 * * * * root flock -n /run/driveit-health.lock /opt/driveit-ops/healthcheck.sh >> /var/log/driveit-ops/health.log 2>&1

# Every 5 minutes: SSH login & config/key integrity watch
*/5 * * * * root flock -n /run/driveit-security.lock /opt/driveit-ops/security-watch.sh >> /var/log/driveit-ops/security.log 2>&1

# Weekly maintenance: Sunday 04:00 IST (Saturday 22:30 UTC)
30 22 * * 6 root flock -n /run/driveit-weekly.lock /opt/driveit-ops/weekly-maintenance.sh >> /var/log/driveit-ops/weekly.log 2>&1

# Once on boot: wait for services & report downtime
@reboot root /opt/driveit-ops/boot-alert.sh >> /var/log/driveit-ops/boot.log 2>&1
CRON
chmod 644 /etc/cron.d/driveit-ops

cat > /etc/logrotate.d/driveit-ops <<'ROT'
/var/log/driveit-ops/*.log {
  weekly
  rotate 8
  compress
  missingok
  notifempty
  create 0640 root adm
}
ROT
chmod 644 /etc/logrotate.d/driveit-ops

# Retire old aggressive 12h cache-dropping cleaner if present so page cache stays warm.
if [ -f /etc/cron.d/driveit-vps-cleaner ]; then
  mv /etc/cron.d/driveit-vps-cleaner /etc/cron.d/driveit-vps-cleaner.disabled
  echo "Disabled legacy /etc/cron.d/driveit-vps-cleaner (replaced by weekly-maintenance.sh)."
fi

echo "== [5/5] Seeding baseline security fingerprints & running initial healthcheck =="
/opt/driveit-ops/security-watch.sh >> "$LOG_DIR/security.log" 2>&1
/opt/driveit-ops/healthcheck.sh >> "$LOG_DIR/health.log" 2>&1

echo
echo "✅ DRIVEIT Ops suite installed successfully."
echo "   Scripts:  $DEST"
echo "   Cron:     /etc/cron.d/driveit-ops"
echo "   Logs:     $LOG_DIR"
echo "   Telegram: copy /etc/driveit-ops.env.example -> /etc/driveit-ops.env (chmod 600)"
