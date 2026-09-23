# 🚀 DriveIt — Complete Production Deployment Guide
> **Stack:** Next.js 16 + Payload CMS 3 + SQLite · **VPS:** Hetzner CX32 (4 vCPU / 8 GB)  
> **Frontend:** Vercel · **Backend + Admin + API:** VPS (Docker)

---

## 📋 Table of Contents

1. [Prerequisites Checklist](#1-prerequisites-checklist)
2. [Provision Your VPS](#2-provision-your-vps)
3. [Initial Server Setup](#3-initial-server-setup)
4. [Install Docker & Docker Compose](#4-install-docker--docker-compose)
5. [Deploy the App](#5-deploy-the-app)
6. [Configure Environment Variables](#6-configure-environment-variables)
7. [Build & Run with Docker Compose](#7-build--run-with-docker-compose)
8. [Setup Nginx Reverse Proxy](#8-setup-nginx-reverse-proxy)
9. [SSL Certificate (HTTPS)](#9-ssl-certificate-https)
10. [Configure Vercel Frontend](#10-configure-vercel-frontend)
11. [Configure Google OAuth](#11-configure-google-oauth)
12. [Verify Deployment](#12-verify-deployment)
13. [Maintenance Runbook](#13-maintenance-runbook)
14. [Environment Variables Reference](#14-environment-variables-reference)

---

## 1. Prerequisites Checklist

Before you begin, have these ready:

- [ ] **Domain name** (e.g. `driveit.in`) with DNS access
- [ ] **Hetzner / DigitalOcean / Vultr** account
- [ ] **Resend account** → get API key at [resend.com](https://resend.com)
- [ ] **Google Cloud Console** → OAuth 2.0 credentials (Client ID + Secret)
- [ ] **Meta Developer account** → WhatsApp Business API token & Phone ID (optional)
- [ ] **Vercel account** for frontend hosting
- [ ] **GitHub repo** with this codebase pushed

---

## 2. Provision Your VPS

### Recommended: Hetzner Cloud CX32

1. Go to [console.hetzner.cloud](https://console.hetzner.cloud)
2. Create a new project → **Add Server**
3. Settings:
   - **Location:** Falkenstein (Europe) or Ashburn (US)
   - **Image:** Ubuntu 24.04 LTS
   - **Type:** CX32 (4 vCPU / 8 GB / 80 GB NVMe) — ~€13/mo
   - **SSH Key:** Add your public key (`~/.ssh/id_rsa.pub`)
   - **Firewall:** Create new firewall with these rules:

| Rule | Protocol | Port | Source |
|------|----------|------|--------|
| SSH  | TCP | 22 | Your IP only |
| HTTP | TCP | 80 | Any (0.0.0.0/0) |
| HTTPS | TCP | 443 | Any (0.0.0.0/0) |

4. Click **Create & Buy**
5. Note the server's **public IP address**

### Point Your Domain DNS

In your domain registrar (Cloudflare, GoDaddy, etc.):

```
Type    Name     Value              TTL
A       @        YOUR_VPS_IP        300
A       www      YOUR_VPS_IP        300
A       api      YOUR_VPS_IP        300   (optional subdomain)
```

> Wait 5–30 minutes for DNS to propagate. Test with: `ping yourdomain.com`

---

## 3. Initial Server Setup

SSH into your new server:

```bash
ssh root@YOUR_VPS_IP
```

### 3.1 Create a non-root user

```bash
# Create user
adduser driveit
usermod -aG sudo driveit

# Copy SSH keys to new user
rsync --archive --chown=driveit:driveit ~/.ssh /home/driveit

# Switch to new user
su - driveit
```

### 3.2 Update packages & basic hardening

```bash
sudo apt update && sudo apt upgrade -y

# Install essentials
sudo apt install -y curl git ufw fail2ban

# Configure firewall
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Enable fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

echo "✅ Server hardened"
```

---

## 4. Install Docker & Docker Compose

```bash
# Remove old Docker versions (if any)
sudo apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null

# Install Docker via official script
curl -fsSL https://get.docker.com | sudo sh

# Add your user to docker group (no sudo needed)
sudo usermod -aG docker $USER

# Apply group change (or logout & login again)
newgrp docker

# Verify Docker
docker --version
docker compose version
```

Expected output:
```
Docker version 27.x.x
Docker Compose version v2.x.x
```

---

## 5. Deploy the App

### 5.1 Clone the repository

```bash
cd ~
git clone https://github.com/YOUR_GITHUB_USERNAME/driveit.git
cd driveit
```

### 5.2 Create required directories

```bash
# These will be mounted as Docker volumes
mkdir -p ~/driveit/data
mkdir -p ~/driveit/backups
```

---

## 6. Configure Environment Variables

Create the production `.env` file. **Never commit this file to git.**

```bash
cd ~/driveit
nano .env
```

Paste and fill in the following:

```env
# =============================================
# DriveIt — Production Environment Variables
# =============================================

# ── App URL (your actual domain, no trailing slash) ──
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com

# ── Payload CMS Secret (generate with: openssl rand -hex 32) ──
PAYLOAD_SECRET=REPLACE_WITH_64_CHAR_RANDOM_STRING# ── Database ──
# Production runs Postgres. The compose file builds this URL from POSTGRES_* below,
# so you normally only set the password:
POSTGRES_USER=driveit
POSTGRES_PASSWORD=REPLACE_WITH_A_STRONG_PASSWORD
POSTGRES_DB=driveit
# SQLite remains available as a fallback for a rollback window:
# DATABASE_URI=file:/app/data/driveit.db

# ── Rate limiting (required once you run more than one app instance) ──
REDIS_URL=redis://redis:6379
TRUSTED_PROXY_HOPS=1

# ── NextAuth Secret (generate with: openssl rand -hex 32) ──
AUTH_SECRET=REPLACE_WITH_ANOTHER_64_CHAR_RANDOM_STRING

# ── Google OAuth ──
AUTH_GOOGLE_ID=your_google_client_id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your_google_client_secret

# ── Resend Email ──
RESEND_API_KEY=re_your_resend_api_key

# ── WhatsApp Meta API (optional) ──
WHATSAPP_TOKEN=EAALyour_whatsapp_token
WHATSAPP_PHONE_ID=your_phone_number_id

# ── Email sender identity ──
EMAIL_FROM_ADDRESS=concierge@yourdomain.com
EMAIL_FROM_NAME=DriveIt Luxury Concierge

# ── Concierge alerts (server-side only, never NEXT_PUBLIC_*) ──
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# ── WaCRM webhook bridge (inbound calls must match this secret) ──
WACRM_WEBHOOK_URL=
WACRM_WEBHOOK_SECRET=

# ── UPI payment details shown at checkout ──
NEXT_PUBLIC_UPI_ID=yourupi@upi
NEXT_PUBLIC_UPI_NAME=DRIVEIT Luxury
```

> **The app now refuses to boot without `PAYLOAD_SECRET` and `AUTH_SECRET`.** Older copies of this
> guide relied on the code having hardcoded fallbacks — those are gone on purpose. If a container
> starts and immediately exits, read the first lines of its logs: the missing variable is named there.

> **Schema management.** `PAYLOAD_SCHEMA_PUSH=true` lets Payload create/alter tables on boot, which
> is convenient for the very first deploy. For every deploy after that, run `npm run migrate`
> (`payload migrate`) so a release can never silently reshape the live database. Leave
> `PAYLOAD_SCHEMA_PUSH` unset in production once migrations exist.

### Generate secure secrets quickly:

```bash
# Generate PAYLOAD_SECRET
openssl rand -hex 32

# Generate AUTH_SECRET
openssl rand -hex 32
```

Copy each output into the respective `.env` field.

---

## 7. Build & Run with Docker Compose

### 7.1 Copy the docker-compose.yml

Save the `docker-compose.yml` file to `~/driveit/docker-compose.yml`.

### 7.2 Build the Docker image

This step compiles your Next.js app. Takes ~3–5 minutes on first build.

```bash
cd ~/driveit
docker compose build
```

Watch for: `=> exporting to image` at the end = success ✅

### 7.3 Start the containers

```bash
docker compose up -d
```

### 7.4 Check running containers

```bash
docker compose ps
```

Expected output:
```
NAME              STATUS          PORTS
driveit-app       Up (healthy)    0.0.0.0:3000->3000/tcp
driveit-backup    Up              
```

### 7.5 Check application logs

```bash
# Follow live logs
docker compose logs -f app

# Or check last 50 lines
docker compose logs --tail=50 app
```

Look for: `✓ Ready in Xms` or `started server on 0.0.0.0:3000`

### 7.6 Quick test

```bash
curl http://localhost:3000
```

Should return HTML. If so, the app is running. ✅

---

## 8. Setup Nginx Reverse Proxy

Nginx sits in front of your app, handles port 80/443, and forwards traffic to port 3000.

### 8.1 Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 8.2 Create site configuration

```bash
sudo nano /etc/nginx/sites-available/driveit
```

Paste the following (replace `yourdomain.com` with your actual domain):

```nginx
# HTTP → Redirect to HTTPS (fill in after Certbot runs)
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Allow Certbot challenges
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect all HTTP to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS — Main server block (uncomment after SSL setup)
# server {
#     listen 443 ssl http2;
#     server_name yourdomain.com www.yourdomain.com;
#
#     ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
#     ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
#     ssl_protocols TLSv1.2 TLSv1.3;
#     ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
#     ssl_prefer_server_ciphers on;
#
#     # Security headers
#     add_header X-Frame-Options "SAMEORIGIN";
#     add_header X-Content-Type-Options "nosniff";
#     add_header X-XSS-Protection "1; mode=block";
#
#     # Upload size limit (for media uploads in Payload)
#     client_max_body_size 50M;
#
#     # Proxy to Next.js app
#     location / {
#         proxy_pass         http://localhost:3000;
#         proxy_http_version 1.1;
#         proxy_set_header   Upgrade $http_upgrade;
#         proxy_set_header   Connection 'upgrade';
#         proxy_set_header   Host $host;
#         proxy_set_header   X-Real-IP $remote_addr;
#         proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
#         proxy_set_header   X-Forwarded-Proto $scheme;
#         proxy_cache_bypass $http_upgrade;
#         proxy_read_timeout 120s;
#     }
# }
```

### 8.3 Enable the site

```bash
sudo ln -s /etc/nginx/sites-available/driveit /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 9. SSL Certificate (HTTPS)

### 9.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 9.2 Obtain SSL certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com \
  --non-interactive --agree-tos -m your@email.com
```

Certbot will:
1. Verify domain ownership
2. Issue a Let's Encrypt certificate
3. **Automatically update your Nginx config** with SSL settings

### 9.3 Enable the HTTPS server block

After Certbot runs, uncomment the `server { listen 443 ... }` block in your Nginx config:

```bash
sudo nano /etc/nginx/sites-available/driveit
# Remove the comment markers (#) from the HTTPS block
sudo nginx -t && sudo systemctl reload nginx
```

### 9.4 Auto-renewal

Certbot sets up a cron automatically. Test it:

```bash
sudo certbot renew --dry-run
```

Your site is now live at `https://yourdomain.com` ✅

---

## 10. Configure Vercel Frontend

Since Vercel hosts the static frontend that calls your VPS for dynamic data:

### 10.1 Deploy to Vercel

```bash
# Install Vercel CLI (on your local machine)
npm i -g vercel

# In your project root
vercel --prod
```

### 10.2 Set Vercel Environment Variables

In [vercel.com/dashboard](https://vercel.com) → Your Project → **Settings → Environment Variables**:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SERVER_URL` | `https://yourdomain.com` |
| `AUTH_SECRET` | Same value as your VPS `.env` |
| `AUTH_GOOGLE_ID` | Your Google Client ID |
| `AUTH_GOOGLE_SECRET` | Your Google Client Secret |
| `RESEND_API_KEY` | Your Resend key |
| `WHATSAPP_TOKEN` | Your Meta token |
| `WHATSAPP_PHONE_ID` | Your phone ID |

> [!IMPORTANT]
> `PAYLOAD_SECRET` and `DATABASE_URI` should **only** be on the VPS, not on Vercel. The Vercel deployment will call your VPS API endpoints.

### 10.3 Configure `next.config.mjs` for split deployment

Make sure API routes and Payload routes are routed to the VPS. You may need to add rewrites to your `next.config.mjs`:

```js
// In next.config.mjs — add rewrites to proxy API calls to VPS
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/:path*`,
    },
    {
      source: '/admin/:path*',
      destination: `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/:path*`,
    },
  ]
},
```

---

## 11. Configure Google OAuth

In [Google Cloud Console](https://console.cloud.google.com):

1. Go to **APIs & Services → Credentials**
2. Click your OAuth 2.0 Client ID
3. Under **Authorized redirect URIs**, add:
   ```
   https://yourdomain.com/api/auth/callback/google
   https://your-vercel-app.vercel.app/api/auth/callback/google
   ```
4. Under **Authorized JavaScript origins**, add:
   ```
   https://yourdomain.com
   https://your-vercel-app.vercel.app
   ```
5. Click **Save**

---

## 12. Verify Deployment

Run these checks after going live:

```bash
# 1. Check HTTPS is working
curl -I https://yourdomain.com
# Expect: HTTP/2 200

# 2. Check admin panel
curl -I https://yourdomain.com/admin
# Expect: HTTP/2 200 or redirect

# 3. Check the public fleet feed (read-only, cached 5 min)
curl https://yourdomain.com/api/fleet | head -c 200

# 4. Confirm private data is NOT public (bookings/coupons/profile all require auth)
curl -o /dev/null -s -w '%{http_code}\n' https://yourdomain.com/api/bookings
# Expect: 403

# 5. Check container health
docker compose ps
# Expect: driveit-app Status = Up (healthy)

# 6. Check the database is reachable and has content
docker compose exec -T postgres psql -U driveit -d driveit -c "select count(*) from cars;"
# Expect: a count, and the app logs "[db] postgres · postgres://postgres:5432/driveit"
docker compose logs app | grep "\[db\]"

# 7. Check media volume
docker exec driveit-app ls /app/public/media/
```

### Payload First Admin Setup

Option A — from the CLI (also loads the starter fleet, services, reviews and journal
entries so the site is not blank):

```bash
cd ~/driveit
SEED_ADMIN_EMAIL=you@yourdomain.com \
SEED_ADMIN_PASSWORD='a-strong-password' \
SEED_BASE_URL=https://yourdomain.com \
npm run seed
```
The script is idempotent — re-running it skips anything that already exists.

Option B — visit `https://yourdomain.com/admin` and use the first-user form.

Either way you land in the Payload CMS dashboard, where every car, service, review,
article, coupon, booking and the global site settings are editable.

---

## 13. Maintenance Runbook

### 🔄 Updating the App (new code push)

```bash
cd ~/driveit

# Pull latest code
git pull origin main

# Rebuild and restart (zero-data-loss — volumes are preserved)
docker compose build app
docker compose up -d app

# Verify
docker compose logs -f app
```### 📦 Manual Database Backup
```bash
# Create an immediate compressed dump inside the backup volume
docker compose exec -T postgres pg_dump -U driveit -d driveit -Fc \
  -f /backups/manual_$(date +%Y%m%d).dump
docker compose exec -T backup ls -lh /backups

# Restore one (into an empty database) if you ever need to:
docker compose exec -T postgres pg_restore -U driveit -d driveit --clean --if-exists \
  /backups/driveit_YYYYMMDD_HHMMSS.dump
```

<details>
<summary>Legacy SQLite backup (only while the fallback volume is still in use)</summary>

```bash
docker exec driveit-app cp /app/data/driveit.db /app/data/manual_backup_$(date +%Y%m%d).db

# Copy backup to host machine
docker cp driveit-app:/app/data/manual_backup_$(date +%Y%m%d).db ~/backups/
```

</details>

### 📤 Download Backup to Your Local Machine

```bash
# From your local machine
scp driveit@YOUR_VPS_IP:~/driveit/backups/driveit_*.dump ./local-backups/
```

### 🔍 View Live Logs

```bash
docker compose logs -f app          # App logs
docker compose logs -f backup       # Backup cron logs
```

### ♻️ Restart Services

```bash
docker compose restart app          # Restart app only
docker compose down && docker compose up -d   # Full restart
```

### 🧹 Cleanup Old Docker Images

```bash
docker system prune -f              # Remove unused images/containers
docker volume ls                    # List volumes (do NOT prune these!)
```

### 📊 Monitor Resource Usage

```bash
# Real-time container stats
docker stats

# Disk usage
df -h
du -sh ~/driveit/data/
```

---

## 14. Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SERVER_URL` | ✅ Yes | Your full domain `https://yourdomain.com` |
| `PAYLOAD_SECRET` | ✅ Yes | 32+ char random string for Payload encryption |
| `DATABASE_URI` | ✅ Yes | `postgres://…@postgres:5432/driveit` (compose builds it from `POSTGRES_*`) |
| `POSTGRES_PASSWORD` | ✅ Yes | strong password shared by the `postgres` and `backup` services |
| `REDIS_URL` | ✅ Yes (staging/production) | `redis://redis:6379` — shared rate-limit store |
| `AUTH_SECRET` | ✅ Yes | 32+ char random string for NextAuth sessions |
| `AUTH_GOOGLE_ID` | ✅ Yes | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | ✅ Yes | Google OAuth Client Secret |
| `RESEND_API_KEY` | ⚠️ Optional | Email sending (booking confirmations, coupons) |
| `WHATSAPP_TOKEN` | ⚠️ Optional | Meta Graph API token for WhatsApp notifications |
| `WHATSAPP_PHONE_ID` | ⚠️ Optional | WhatsApp Business phone number ID |

> [!CAUTION]
> Never expose `PAYLOAD_SECRET` or `AUTH_SECRET` publicly. If compromised, rotate immediately and restart containers.

---

## ✅ Deployment Complete!

| Service | URL |
|---------|-----|
| 🌐 Public Site | `https://yourdomain.com` |
| 🔧 Admin Panel | `https://yourdomain.com/admin` |
| 📦 API | `https://yourdomain.com/api/*` |
| 🎨 Frontend (Vercel) | `https://your-app.vercel.app` |
