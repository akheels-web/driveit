# 🤖 Hermes Agent — Production Implementation Plan & Runbook

> **Target Environment:** Contabo VPS (Ubuntu 24.04 LTS · 6 vCPU · 12 GB RAM · 200 GB NVMe SSD)  
> **Isolation Status:** 100% Isolated from DriveIt Luxury (Separate directory, separate domain, separate Docker network, independent database & volumes)  
> **Source Platform:** [Nous Research / Hermes Agent](https://github.com/NousResearch/hermes-agent)  
> **Date:** October 1, 2026  

---

## 📋 Table of Contents
1. [Executive Summary & VPS Resource Impact](#1-executive-summary--vps-resource-impact)
2. [Architecture & Isolation Blueprint](#2-architecture--isolation-blueprint)
3. [Prerequisites & Accounts Checklist](#3-prerequisites--accounts-checklist)
4. [Step 1: Directory Setup & File Structure](#4-step-1-directory-setup--file-structure)
5. [Step 2: Docker Compose Deployment Configuration](#5-step-2-docker-compose-deployment-configuration)
6. [Step 3: Interactive Configuration Wizard (API Keys & LLM Routing)](#6-step-3-interactive-configuration-wizard-api-keys--llm-routing)
7. [Step 4: Nginx Reverse Proxy & SSL Configuration](#7-step-4-nginx-reverse-proxy--ssl-configuration)
8. [Step 5: Cloudflare DNS Configuration](#8-step-5-cloudflare-dns-configuration)
9. [Step 6: Enabling WebUI & Messaging Bot Integrations (Telegram/Discord)](#9-step-6-enabling-webui--messaging-bot-integrations-telegramdiscord)
10. [Step 7: Security Hardening & 2-Day Log Rotation Alignment](#10-step-7-security-hardening--2-day-log-rotation-alignment)
11. [Step 8: Verification & Smoke Tests](#11-step-8-verification--smoke-tests)
12. [Step 9: Day-2 Maintenance & Updates](#12-step-9-day-2-maintenance--updates)

---

## 1. Executive Summary & VPS Resource Impact

Hermes Agent is an autonomous, persistent AI assistant created by **Nous Research**. It runs 24/7 on your server, acquires custom tools and skills from [agentskills.io](https://agentskills.io), and connects to messaging apps or a browser WebUI.

### RAM & Hardware Consumption Analysis

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              HERMES AGENT RAM FOOTPRINT                                │
├──────────────────────┬─────────────────────────┬───────────────────────────────────────┤
│ Mode                 │ RAM Consumption         │ Suitability on Contabo VPS (12 GB)    │
├──────────────────────┼─────────────────────────┼───────────────────────────────────────┤
│ 1. Cloud API Mode    │ ~400 MB – 1.0 GB RAM    │ 🌟 RECOMMENDED (Optimal Choice)       │
│    (OpenRouter,      │ (Peaks at ~1.5 GB       │ • Uses <10% of remaining free RAM     │
│     Together AI,     │  during multi-agent /   │ • 6+ GB RAM buffer remains untouched  │
│     OpenAI, Claude,  │  code-sandbox runs)     │ • Fast response time, zero CPU lag    │
│     Fireworks, etc.) │                         │ • Fully reliable 24/7 background task │
├──────────────────────┼─────────────────────────┼───────────────────────────────────────┤
│ 2. Local LLM Weights │ 6.5 GB – 10+ GB RAM     │ ❌ NOT RECOMMENDED                    │
│    (Ollama / vLLM /  │ (e.g. Hermes-3-8B Q4    │ • VPS has no dedicated GPU            │
│     llama.cpp on CPU)│  takes ~6 GB RAM alone) │ • Slow CPU token generation (4–7 t/s) │
│                      │                         │ • Risks Out-Of-Memory (OOM) crashes   │
└──────────────────────┴─────────────────────────┴───────────────────────────────────────┘
```

### VPS Memory Allocation Breakdown
```
Total Physical Memory: 11.0 GiB
────────────────────────────────────────────────────────────
[██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░]  ~4.8 GB Used / 11 GB Total

  • Next.js 16 + Payload CMS 3: ~1.5 GB
  • PostgreSQL 16 + Redis 7:    ~1.2 GB
  • NocoDB Staff Operations:    ~0.2 GB
  • Chatwoot Web & Worker:      ~1.0 GB
  • Hermes Agent (Docker):      ~0.8 GB (New Addition)
  ───────────────────────────────────────
  • TOTAL PROJECTED USAGE:      ~4.7 – 4.9 GB
  • REMAINING HEALTHY HEADROOM: ~6.1 – 6.3 GB Available RAM
  • NVMe DISK USAGE:            11 GB Used / 183 GB Free (6% Used)
```

> [!NOTE]
> Running Hermes Agent in **Cloud API mode** ensures zero impact on DriveIt's checkout latency, database throughput, or staff operations portal.

---

## 2. Architecture & Isolation Blueprint

Hermes Agent runs as a **completely isolated application stack** on the server:

```
                                  INTERNET / USERS
                                         │
                                  Cloudflare Edge
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
         driveitluxury.in / ops.driveitluxury.in       hermes.yourdomain.com
                    │                                         │
           (Port 443 SSL)                            (Port 443 SSL)
                    │                                         │
         ┌──────────▼──────────┐                   ┌──────────▼──────────┐
         │     Host Nginx      │                   │     Host Nginx      │
         │  (driveit vhost)    │                   │   (hermes vhost)    │
         └──────────┬──────────┘                   └──────────┬──────────┘
                    │ (Proxy 127.0.0.1:3000/8080)             │ (Proxy 127.0.0.1:8642)
                    ▼                                         ▼
         ┌─────────────────────┐                   ┌─────────────────────┐
         │   DriveIt Stack     │                   │ Hermes Agent Stack  │
         │  /root/driveit/     │                   │  /opt/hermes-agent/ │
         │                     │                   │                     │
         │ • Next.js App       │                   │ • Hermes Gateway    │
         │ • Postgres (driveit)│                   │ • Hermes WebUI      │
         │ • Redis             │                   │ • SQLite / Files    │
         │ • NocoDB (ops)      │                   │ • Persistent Skills │
         │ Network: driveit-net│                   │ Network: hermes-net │
         └─────────────────────┘                   └─────────────────────┘
```

### Key Isolation Guarantees:
1. **Filesystem Isolation:** Hermes lives under `/opt/hermes-agent/` and stores data in `/opt/hermes-agent/data/`. It has zero access to DriveIt files.
2. **Network Isolation:** Runs on a dedicated Docker bridge network (`hermes-net`). It cannot query `driveit-postgres` or `driveit-redis`.
3. **Database Isolation:** Hermes uses its own embedded SQLite and file-based state store.
4. **Port Isolation:** Binds strictly to `127.0.0.1:8642` on loopback. Only Nginx can route traffic to it.

---

## 3. Prerequisites & Accounts Checklist

Before deployment, ensure you have:

* [ ] **A Dedicated Domain or Subdomain:** (e.g., `hermes.yourdomain.com` or `ai.yourdomain.com`).
* [ ] **Cloud Provider API Key:** At least one of the following:
  * **OpenRouter API Key** *(Recommended: gives access to Nous Hermes 3 405B/70B, Claude 3.5 Sonnet, DeepSeek-V3, and GPT-4o)*
  * **Together AI Key** *(Direct host of Nous Hermes models)*
  * **Anthropic API Key** or **OpenAI API Key**
* [ ] **Optional Bot Tokens:** Telegram Bot Token (from `@BotFather`) or Discord Bot Token if you want to chat with Hermes via messaging apps.

---

## 4. Step 1: Directory Setup & File Structure

SSH into the Contabo VPS and create the dedicated project directory:

```bash
# 1. Create dedicated directory under /opt
sudo mkdir -p /opt/hermes-agent/data
sudo mkdir -p /opt/hermes-agent/skills

# 2. Set ownership to driveit user (or root)
sudo chown -R driveit:driveit /opt/hermes-agent
cd /opt/hermes-agent
```

---

## 5. Step 2: Docker Compose Deployment Configuration

Create `/opt/hermes-agent/docker-compose.yml`:

```bash
nano /opt/hermes-agent/docker-compose.yml
```

Paste the following production configuration:

```yaml
# ============================================================
# Hermes Agent — Production Docker Compose
# ============================================================
services:
  hermes:
    image: nousresearch/hermes-agent:latest
    container_name: hermes-agent
    restart: unless-stopped
    ports:
      # Bound to loopback: only local Nginx can proxy to it
      - "127.0.0.1:8642:8642"
    environment:
      - PORT=8642
      - HOST=0.0.0.0
      - HERMES_HOME=/opt/data
      - HERMES_PUBLIC_URL=https://hermes.yourdomain.com
    volumes:
      - ./data:/opt/data
      - ./skills:/opt/data/skills
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "2"
    networks:
      - hermes-net

networks:
  hermes-net:
    driver: bridge
```

---

## 6. Step 3: Interactive Configuration Wizard (API Keys & LLM Routing)

Hermes provides a CLI wizard to securely configure your LLM providers, model preferences, and active skills:

```bash
cd /opt/hermes-agent

# Run the interactive configuration wizard
docker run -it --rm \
  -v /opt/hermes-agent/data:/opt/data \
  nousresearch/hermes-agent setup
```

### Wizard Prompts & Recommended Answers:
1. **Choose Model Provider:** Select `OpenRouter` (or `Together AI` / `Anthropic` / `OpenAI`).
2. **API Key:** Paste your API key.
3. **Primary Model:** 
   * `nousresearch/hermes-3-llama-3.1-405b` (For complex agentic tasks & coding)
   * `anthropic/claude-3.5-sonnet` (For high-precision workflows)
   * `nousresearch/hermes-3-llama-3.1-70b` (Fast, cost-effective daily driver)
4. **Enable WebUI:** Select `Yes` (binds to port 8642).
5. **Set WebUI Admin Password:** Enter a strong password for web dashboard access.

---

## 7. Step 4: Nginx Reverse Proxy & SSL Configuration

Create the isolated Nginx server configuration for your Hermes domain:

```bash
sudo nano /etc/nginx/sites-available/hermes
```

Paste the following Nginx block (replace `hermes.yourdomain.com` with your actual domain):

```nginx
# ============================================================
# HERMES AGENT — NGINX REVERSE PROXY CONFIGURATION
# Domain: hermes.yourdomain.com
# ============================================================

# 1. HTTP Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name hermes.yourdomain.com;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# 2. HTTPS Main Server Block
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name hermes.yourdomain.com;

    # SSL Certificate Paths:
    # Option A: Cloudflare Origin CA (if under *.driveitluxury.in or your Cloudflare zone)
    ssl_certificate     /etc/ssl/cloudflare/cert.pem;
    ssl_certificate_key /etc/ssl/cloudflare/key.pem;

    # Option B: If using a completely different apex domain with Let's Encrypt Certbot:
    # ssl_certificate     /etc/letsencrypt/live/hermes.yourdomain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/hermes.yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:8642;
        proxy_http_version 1.1;

        # WebSocket support (Crucial for streaming LLM tokens & real-time chat)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_cache_bypass $http_upgrade;

        # Extended timeouts for long-running LLM generation and tool execution
        proxy_read_timeout 600s;
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
    }
}
```

Enable the site and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/hermes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 8. Step 5: Cloudflare DNS Configuration

In your DNS provider (e.g., Cloudflare Dashboard):

| Record Type | Name / Host | Target / Content | Proxy Status | Notes |
|---|---|---|---|---|
| **A** (or **CNAME**) | `hermes` | `YOUR_CONTABO_VPS_IP` | 🟠 **Proxied** | Points `hermes.yourdomain.com` to VPS |

---

## 9. Step 6: Enabling WebUI & Messaging Bot Integrations (Telegram/Discord)

### Launching the Hermes Gateway
Once configured, boot the service in the background:

```bash
cd /opt/hermes-agent
docker compose up -d
```

### Accessing Hermes WebUI
Open your browser and navigate to:
👉 **`https://hermes.yourdomain.com`**
Log in with the credentials set during `docker run ... setup`.

### Optional: Connecting Telegram Bot
If you want Hermes to respond to you or your team on Telegram 24/7:
1. Message `@BotFather` on Telegram and create a new bot (e.g. `@MyHermesAgentBot`). Copy the token.
2. In `/opt/hermes-agent/data/config.json` (or via the setup wizard), add:
   ```json
   {
     "telegram": {
       "enabled": true,
       "bot_token": "YOUR_TELEGRAM_BOT_TOKEN",
       "allowed_users": ["YOUR_TELEGRAM_USER_ID"]
     }
   }
   ```
3. Restart the container:
   ```bash
   docker compose restart hermes
   ```

---

## 10. Step 7: Security Hardening & 2-Day Log Rotation Alignment

To ensure Hermes Agent conforms to your server's **2-day maximum log policy**:

1. **Docker Container Log Cap:**  
   The `docker-compose.yml` file already specifies `max-size: 10m` and `max-file: 2`, capping container logs at 20MB total.
2. **Automated Cleaner Alignment:**  
   Our existing master cleaner script (`/usr/local/bin/vps-cleaner.sh`) automatically scans all `/var/lib/docker/containers/` and truncates logs older than 48 hours. Hermes Agent will automatically be maintained by this script without requiring any modifications.

---

## 11. Step 8: Verification & Smoke Tests

Verify the deployment with these quick commands:

```bash
# 1. Check container health
docker ps -f name=hermes-agent

# 2. Check container memory usage in real time
docker stats --no-stream hermes-agent

# 3. Test local gateway response
curl -I http://127.0.0.1:8642/

# 4. Test public HTTPS endpoint via Nginx
curl -I https://hermes.yourdomain.com/
```

Expected output:
```
HTTP/2 200 (or HTTP/1.1 200 OK)
Upgrade: websocket
Server: nginx
```

---

## 12. Step 9: Day-2 Maintenance & Updates

### Updating Hermes Agent to Latest Version
```bash
cd /opt/hermes-agent

# 1. Pull latest image from Nous Research
docker compose pull

# 2. Re-create container cleanly (data & skills in ./data remain intact!)
docker compose up -d

# 3. View startup logs
docker compose logs -f hermes
```

### Backing Up Hermes Memory & Skills
```bash
# Create an archive of your agent's memory and skills
tar -czvf ~/hermes_backup_$(date +%Y%m%d).tar.gz /opt/hermes-agent/data /opt/hermes-agent/skills
```
