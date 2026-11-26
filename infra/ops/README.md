# DRIVEIT Luxury — Production Server Ops & Monitoring

Self-contained server health, security monitoring, boot reporting, and weekly maintenance scripts installed on the production VPS (`13.140.56.180`).

## Scripts

| Script | Schedule | Purpose |
| :--- | :--- | :--- |
| `healthcheck.sh` | Every 5 min | Checks RAM (`<15%` free), swap (`>50%`), disk (`>80%`), Nginx, all 6 `driveit-*` Docker containers, local + public HTTPS (`driveitluxury.in` + `/api/fleet`), nightly Postgres dump freshness, and pending security reboots. Auto-restarts only stateless services (`driveit-app`, `driveit-nocodb`, `driveit-scheduler`, `nginx`) after 3 failed checks (15 min); never auto-restarts Postgres or Redis. |
| `security-watch.sh` | Every 5 min | Audits SSH logins against `/var/lib/driveit-ops/known-ssh-ips` and watches SHA-256 + mode fingerprints of `.env`, `/etc/driveit-ops.env`, `authorized_keys`, `/etc/sudoers.d`, `sudo`/`docker` groups, and login-capable users. |
| `weekly-maintenance.sh` | Sun 04:00 IST (Sat 22:30 UTC) | Prunes Docker build cache beyond newest 3 GB, dangling images, old rotated logs, `/tmp/driveit_*`, journald (`100M / 7d`), and APT cache. Preserves kernel page cache, Redis, volumes, and running services. |
| `boot-alert.sh` | `@reboot` | Waits up to 5 minutes after a server reboot for all containers, Nginx, and public endpoints to come online, then reports estimated downtime and recovery status. |
| `install-ops.sh` | Manual (`sudo`) | Idempotently installs all scripts to `/opt/driveit-ops`, configures `/etc/cron.d/driveit-ops`, logrotate, and `fail2ban` SSH jail with trusted IP whitelist. |

## Enabling Telegram Ops Alerts

No Telegram bot token is stored in Git or copied from other projects. Until configured, all scripts run normally and log to `/var/log/driveit-ops/*.log`.

To enable Telegram alerts with a dedicated DriveIt bot:

```bash
sudo cp /etc/driveit-ops.env.example /etc/driveit-ops.env
sudo chmod 600 /etc/driveit-ops.env
sudo nano /etc/driveit-ops.env
```

Set:

```env
TELEGRAM_OPS_BOT_TOKEN=<your-driveit-bot-token>
TELEGRAM_OPS_CHAT_ID=<your-driveit-ops-chat-id>
```

Test without waiting for a cron run:

```bash
sudo TELEGRAM_DRY_RUN=1 /opt/driveit-ops/weekly-maintenance.sh
sudo DRY_RUN=1 /opt/driveit-ops/boot-alert.sh
```
