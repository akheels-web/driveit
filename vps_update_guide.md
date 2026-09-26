# DRIVEIT Luxury — Production VPS Update & Deployment Guide

This guide establishes the **standard operating procedure (SOP)** and industry best practices for updating, deploying, and maintaining the **DRIVEIT Luxury** platform on the production Contabo VPS (`13.140.56.180`).

---

## 📑 Table of Contents
1. [Core Principles & The Golden Rule](#1-core-principles--the-golden-rule)
2. [Quick Reference Cheat Sheet (The 3-Minute Routine)](#2-quick-reference-cheat-sheet-the-3-minute-routine)
3. [The 1-Command Automated Deploy Script (`./deploy.sh`)](#3-the-1-command-automated-deploy-script-deploysh)
4. [Step-by-Step Scenarios](#4-step-by-step-scenarios)
   - [Scenario A: Everyday Code Changes (UI, Pages, API Routes, Logic)](#scenario-a-everyday-code-changes)
   - [Scenario B: Environment Variable Updates (`.env`)](#scenario-b-environment-variable-updates)
   - [Scenario C: Database Schema & Collection Changes (Payload CMS)](#scenario-c-database-schema--collection-changes)
   - [Scenario D: Adding New NPM Packages](#scenario-d-adding-new-npm-packages)
   - [Scenario E: Nginx, SSL, or Subdomain Routing Changes](#scenario-e-nginx-ssl-or-subdomain-routing-changes)
5. [Monitoring & Health Verification](#5-monitoring--health-verification)
6. [Emergency Rollback Procedure (10-Second Revert)](#6-emergency-rollback-procedure)
7. [Routine VPS Maintenance & Hygiene](#7-routine-vps-maintenance--hygiene)

---

## 1. Core Principles & The Golden Rule

> ⚠️ **THE GOLDEN RULE OF PRODUCTION DEPLOYMENT**  
> **Never modify files directly inside the production Docker container or directly edit code on the VPS filesystem.**  
> Always follow: **Local Machine → Git Push → Server Git Pull → Docker Build & Restart.**

### Why?
1. **Reproducibility & Safety**: If a container crashes or is recreated, any changes made inside the container are immediately wiped out.
2. **Version History**: Committing code to GitHub ensures every change is tracked, diffable, and can be reverted in seconds if a bug occurs.
3. **Zero Downtime**: Building the container while the old container is running ensures your website stays live 100% of the time. The switch takes less than 1 second.

---

## 2. Quick Reference Cheat Sheet (The 3-Minute Routine)

For 95% of your updates (fixing a bug, changing text, styling a component, adding an endpoint):

### On Your Local Machine (PowerShell / Terminal)
```powershell
# 1. Verify TypeScript compiles cleanly
npm run typecheck

# 2. Stage, commit, and push to GitHub
git add .
git commit -m "feat: description of your changes"
git push origin main
```

### On the Production VPS (via SSH)
```bash
# 1. Connect to VPS
ssh akheel@13.140.56.180

# 2. Pull the latest code
sudo git -C /root/driveit pull origin main

# 3. Build the updated Next.js application container
sudo docker compose -f /root/driveit/docker-compose.yml build app

# 4. Recreate and restart the container (Zero downtime)
sudo docker compose -f /root/driveit/docker-compose.yml up -d --no-deps app

# 5. Check logs to confirm clean boot
sudo docker logs --tail 25 driveit-app
```

---

## 3. The 1-Command Automated Deploy Script (`./deploy.sh`)

We have created an automated deployment script in `/root/driveit/deploy.sh` that bundles Git pulling, building, recreating, and verifying into a single command.

### How to use it:
```bash
# SSH into the VPS
ssh akheel@13.140.56.180

# Run the deployment script
sudo /root/driveit/deploy.sh
```

### What the script automatically does:
1. Compares your local git commit with GitHub `origin/main` and pulls any changes.
2. Runs `docker compose build app` using Docker cache for maximum speed.
3. Performs a zero-downtime container recreation (`docker compose up -d --no-deps app`).
4. Performs a healthcheck and prints the last 15 lines of container boot logs and container statuses.

---

## 4. Step-by-Step Scenarios

### Scenario A: Everyday Code Changes
*(Editing pages, updating React components, updating CSS styles, changing email templates, or adjusting API endpoints)*

1. **Develop & Test Locally**:
   Make sure you test locally and run `npm run typecheck` to verify no compile errors exist.
2. **Commit & Push**:
   ```bash
   git add .
   git commit -m "fix: header mobile navigation spacing"
   git push origin main
   ```
3. **Apply on Server**:
   ```bash
   ssh akheel@13.140.56.180 "sudo /root/driveit/deploy.sh"
   ```
   *(Or SSH in and run `sudo /root/driveit/deploy.sh`)*

---

### Scenario B: Environment Variable Updates
*(Adding a Brevo API key, updating Google OAuth secrets, updating WhatsApp tokens, or changing database passwords)*

Environment variables live in `/root/driveit/.env` on the VPS.

1. **Edit the `.env` file on the VPS**:
   ```bash
   sudo nano /root/driveit/.env
   ```
   *(Update your variable, e.g. `BREVO_API_KEY=xkeysib-...`, then press `Ctrl + O` to save and `Ctrl + X` to exit)*

2. **Understand Variable Types**:
   - **Server-Side Runtime Variables** (e.g., `BREVO_API_KEY`, `AUTH_SECRET`, `PAYLOAD_SECRET`, `DATABASE_URI`, `CRON_SECRET`):
     These are read at runtime. **No container rebuild is needed!** Simply restart the container:
     ```bash
     sudo docker compose -f /root/driveit/docker-compose.yml up -d --no-deps app
     ```
   - **Client-Side Build-Time Variables** (any variable starting with `NEXT_PUBLIC_*`):
     Next.js embeds `NEXT_PUBLIC_*` values directly into the browser JavaScript bundle during build.
     **You must rebuild the container:**
     ```bash
     sudo docker compose -f /root/driveit/docker-compose.yml build app
     sudo docker compose -f /root/driveit/docker-compose.yml up -d --no-deps app
     ```

---

### Scenario C: Database Schema & Collection Changes
*(Adding a new field to `collections/Cars.ts`, creating a new collection, or altering column definitions)*

When you add new fields in Payload CMS collections (like we did with `firstTimeOnly` and `assignedCustomer` in `Coupons.ts`):

1. **Apply the Code Changes**:
   Update your collection files in `collections/*.ts`, push to Git, and pull on the VPS.
2. **Sync the PostgreSQL Database**:
   In production, Payload does not automatically run destructive database migrations to preserve data safety.
   Execute the corresponding SQL on the live database container:
   ```bash
   sudo docker exec driveit-postgres psql -U driveit -d driveit -c '
     ALTER TABLE "coupons" ADD COLUMN IF NOT EXISTS "first_time_only" boolean DEFAULT false;
   '
   ```
3. **Rebuild & Restart the App**:
   ```bash
   sudo /root/driveit/deploy.sh
   ```

---

### Scenario D: Adding New NPM Packages
*(Installing a new npm dependency like `npm install lucide-react`)*

1. When adding dependencies locally, **always commit both `package.json` AND `package-lock.json`**:
   ```bash
   npm install package-name
   git add package.json package-lock.json
   git commit -m "chore: add package-name dependency"
   git push origin main
   ```
2. On the VPS, run the deploy script:
   ```bash
   sudo /root/driveit/deploy.sh
   ```
   Docker's multi-stage build will detect the updated `package-lock.json`, run `npm ci` inside the builder layer, and cache the new node_modules cleanly.

---

### Scenario E: Nginx, SSL, or Subdomain Routing Changes
*(Adding a new subdomain, tweaking SSL ciphers, or adjusting reverse proxy caching)*

Nginx runs natively on the Ubuntu host (outside of Docker) and proxies traffic to the Docker containers.

1. **Edit Nginx Configuration**:
   ```bash
   sudo nano /etc/nginx/sites-available/driveit
   ```
2. **ALWAYS Test the Syntax Before Reloading**:
   ```bash
   sudo nginx -t
   ```
   > ⚠️ **CRITICAL**: If `nginx -t` reports an error, **DO NOT RELOAD**. Fix the syntax in nano first.
3. **Reload Nginx (Zero Downtime)**:
   ```bash
   sudo systemctl reload nginx
   ```
   *(This applies changes instantly without dropping active visitor connections)*

---

## 5. Monitoring & Health Verification

Always verify that your deployment is healthy using these commands:

| Command | Purpose |
| :--- | :--- |
| `sudo docker compose -f /root/driveit/docker-compose.yml ps` | Check status of all 5 containers (`driveit-app`, `driveit-postgres`, `driveit-redis`, `driveit-backup`, `driveit-scheduler`). All should show `Up`. |
| `sudo docker logs --tail 50 driveit-app` | View the last 50 lines of Next.js / Payload logs. |
| `sudo docker logs -f driveit-app` | Stream live real-time server logs (press `Ctrl + C` to exit). |
| `curl -I https://driveitluxury.in` | Verify HTTPS HTTP/2 200 OK response from the public web. |
| `curl -I https://driveitluxury.in/admin` | Verify CMS admin portal accessibility. |

---

## 6. Emergency Rollback Procedure

If a bad commit was deployed and you need to immediately revert the website to the previous stable version:

### 10-Second Instant Rollback:
```bash
# 1. Go to project directory on VPS
cd /root/driveit

# 2. Reset git to the previous commit (HEAD~1)
sudo git reset --hard HEAD~1

# 3. Rebuild and restart the app container
sudo docker compose build app
sudo docker compose up -d --no-deps app
```
The site is now restored to the previous working build. Then debug the issue on your local machine before pushing again.

---

## 7. Routine VPS Maintenance & Hygiene

### Clean Up Old Docker Build Cache & Images
Over months of deployments, old unused Docker image layers take up disk space. Every few weeks, free up disk space by running:
```bash
sudo docker system prune -f
```
*(This safely removes dangling layers and unused build caches without touching your active containers, databases, or volumes)*

### Check Disk Space & Memory
```bash
df -h
free -m
```

### Manual Database Backup (On Demand)
While automated daily database backups run in the `driveit-backup` container, you can trigger an instant snapshot anytime before making major changes:
```bash
sudo docker exec driveit-postgres pg_dump -U driveit driveit > /root/driveit/backups/manual_backup_$(date +%F_%H%M%S).sql
```

---

## 📞 Support & Server Specifications
- **VPS Host**: Contabo VPS (`13.140.56.180`)
- **OS**: Ubuntu 24.04 LTS
- **Application Path**: `/root/driveit`
- **Official Domain**: `https://driveitluxury.in`
- **CMS Admin**: `https://driveitluxury.in/admin`
- **WhatsApp CRM**: `https://wa.driveitluxury.in`
