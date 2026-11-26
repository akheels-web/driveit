#!/usr/bin/env bash
# Runs every 5 minutes via cron:
# Watches for suspicious SSH logins and unexpected changes to sensitive config,
# authorized_keys, sudo/docker groups, or login-capable users.
# Never modifies system state and never prints or transmits secret values.

set -uo pipefail
# shellcheck source=./lib.sh
. "$(dirname "$0")/lib.sh"

SEC_DIR="$STATE_DIR/security"
KNOWN_IPS="$OPS_DIR/known-ssh-ips"
mkdir -p "$SEC_DIR"

now=$(date +%s)
first_run=0
[ -f "$SEC_DIR/last-check" ] || first_run=1
since=$(cat "$SEC_DIR/last-check" 2>/dev/null || echo $((now - 600)))

# ── Seed known SSH IPs on first run from recent login history ──
if [ ! -s "$KNOWN_IPS" ]; then
  last -i -w 2>/dev/null \
    | awk '$1 != "reboot" && $1 != "wtmp" && $3 ~ /^[0-9a-f.:]+$/ && $3 != "0.0.0.0" {print $3}' \
    | sort -u > "$KNOWN_IPS" || true
  chmod 644 "$KNOWN_IPS"
fi

# ── SSH login audit ──
logins=""
if command -v journalctl >/dev/null 2>&1; then
  logins=$(journalctl -u ssh -u sshd --since "@$since" --until "@$now" -o short-iso --no-pager -q 2>/dev/null \
    | sed -nE 's/^([^ ]+) .*Accepted [a-z-]+ for ([^ ]+) from ([^ ]+) port.*/\2 \3 \1/p' || true)
fi

if [ -n "$logins" ] && [ "$first_run" = 0 ]; then
  while read -r user ip when; do
    [ -z "$ip" ] && continue
    if ! grep -qxF "$ip" "$KNOWN_IPS"; then
      when_ist=$(TZ=Asia/Kolkata date -d "$when" '+%-d %b, %-I:%M %p IST' 2>/dev/null || echo "$when")
      telegram "🚨 SSH login from an unknown IP
Server: ${HOST_LABEL}
User: ${user} · IP: ${ip}
Time: ${when_ist}
If this was not you, rotate SSH keys and check the server now.
If it was you: echo ${ip} | sudo tee -a ${KNOWN_IPS}"
      log "ALERT unknown ssh login user=$user ip=$ip"
    fi
  done <<< "$logins"
fi

# ── Fingerprints: settings files, SSH keys, sudoers, privileged users ──
check() {
  local id="$1" title="$2" current="$3" advice="$4" file="$SEC_DIR/$1.fp" previous
  previous=$(cat "$file" 2>/dev/null || true)
  if [ -n "$previous" ] && [ "$previous" != "$current" ] && [ "$first_run" = 0 ]; then
    telegram "${title}
Server: ${HOST_LABEL}
Changed around $(TZ=Asia/Kolkata date '+%-d %b, %-I:%M %p IST').
${advice}"
    log "ALERT $id changed"
  fi
  printf '%s' "$current" > "$file"
}

fp() {
  [ -e "$1" ] && echo "$(sha256sum "$1" | cut -c1-16) $(stat -c '%a %U' "$1")" || echo "missing"
}

keys_fp() {
  for p in /root/.ssh/authorized_keys /home/driveit/.ssh/authorized_keys /home/makheel/.ssh/authorized_keys; do
    echo "$p:$(fp "$p")"
  done | sha256sum | cut -c1-16
}

check env_file "⚠️ App settings file changed (.env)" "$(fp "$APP_DIR/.env")" \
  "Expected after editing .env. Otherwise check 'last -i' and rotate credentials."
check ops_env "⚠️ Ops settings file changed (/etc/driveit-ops.env)" "$(fp "$OPS_ENV_FILE")" \
  "Expected after updating Telegram ops alert credentials."
check ssh_keys "🚨 SSH authorized_keys changed" "$(keys_fp)" \
  "A key was added or modified in root/driveit/makheel authorized_keys. Verify immediately."
check sudoers "🚨 Sudoers configuration changed" \
  "$(ls -la /etc/sudoers /etc/sudoers.d/ 2>/dev/null | sha256sum | cut -c1-16)" \
  "Check /etc/sudoers.d/ for unexpected entries."
check admin_groups "🚨 Privileged groups changed (sudo/docker)" \
  "$(getent group sudo docker | sha256sum | cut -c1-16)" \
  "Check: getent group sudo docker"
check login_users "⚠️ Login-capable users changed" \
  "$(awk -F: '$7 !~ /(nologin|false|sync)$/ {print $1}' /etc/passwd | sort | sha256sum | cut -c1-16)" \
  "Check: awk -F: '\$7 !~ /(nologin|false|sync)\$/ {print \$1}' /etc/passwd"

echo "$now" > "$SEC_DIR/last-check"
exit 0
