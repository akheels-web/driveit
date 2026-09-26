# 🚀 DriveIt Luxury — Complete Production Deployment Guide

> **Audience:** Junior Developers, DevOps Beginners, and First-Time Deployers ("Fresher Guide")  
> **Target Infrastructure:** Contabo VPS (6 vCPU / 12 GB RAM / 200 GB SSD) or Hetzner CX32 + Cloudflare DNS  
> **Stack:** Unified Full-Stack Container (Next.js 16 + Payload CMS 3 + Postgres 16 + Redis 7 + Cloudinary + Zoho Mail + Brevo + Nginx + Cloudflare SSL)  
> **Target OS:** Ubuntu 24.04 LTS (x64)

---

## 📖 Welcome & Introduction

If you are a fresher or junior engineer deploying this project for the first time: **welcome! Don't panic.** This guide was written specifically for your exact setup.

This guide assumes:
- You have a **Contabo VPS** (e.g. 6 vCPU, 12 GB RAM, 200 GB SSD) or any Ubuntu 24.04 server.
- Your domain DNS is managed by **Cloudflare** (Free plan).
- You want **Cloudflare 15-Year Free SSL** (no 90-day renewal headaches).
- You want **Zoho Free Business Mail** (5 free business mailboxes like `concierge@yourdomain.com`).
- You want **Cloudinary** (Free CDN for car photos and CMS media).
- You want **Brevo** (Free 300 emails/day for transactional booking invoices & email marketing).
- You want **Google Sign-In** (OAuth 2.0 customer login for dashboard & wishlists).

Follow each phase sequentially. Do not skip steps. If you encounter any issue, refer to [Section 17: Fresher Troubleshooting & FAQ](#17-step-15-fresher-troubleshooting--faq).

---

## 📋 Table of Contents

1. [Architecture Overview (How Everything Works)](#1-architecture-overview)
2. [Prerequisites & Accounts Checklist](#2-prerequisites--accounts-checklist)
3. [Step 1: Provisioning Your VPS Server (Contabo / Hetzner)](#3-step-1-provisioning-your-vps-server-contabo--hetzner)
4. [Step 2: Initial Server Setup & Security Hardening](#4-step-2-initial-server-setup--security-hardening)
5. [Step 3: Installing Docker & Docker Compose](#5-step-3-installing-docker--docker-compose)
6. [Step 4: Cloning Code & Configuring Environment (.env)](#6-step-4-cloning-code--configuring-environment-env)
7. [Step 5: Starting Services & Initial Database Setup](#7-step-5-starting-services--initial-database-setup)
8. [Step 6: Setting Up Cloudinary (Free Fleet Asset CDN)](#8-step-6-setting-up-cloudinary-free-fleet-asset-cdn)
9. [Step 7: Seeding Initial Data & Managing Administrators (CMS, Dashboard & WaCRM)](#9-step-7-seeding-initial-data--managing-administrators-cms-dashboard--wacrm)
10. [Step 8: Configuring Nginx Reverse Proxy](#10-step-8-configuring-nginx-reverse-proxy)
11. [Step 9: Securing SSL (Cloudflare 15-Year Origin CA vs Let's Encrypt)](#11-step-9-securing-ssl-cloudflare-15-year-origin-ca-vs-lets-encrypt)
12. [Step 10: Setting Up Zoho Mail (Free 5 Business Inboxes)](#12-step-10-setting-up-zoho-mail-free-5-business-inboxes)
13. [Step 11: Setting Up Brevo (Transactional Emails & Marketing)](#13-step-11-setting-up-brevo-transactional-emails--marketing)
14. [Step 12: Configuring Google OAuth (Customer Login)](#14-step-12-configuring-google-oauth-customer-login)
15. [Step 13: Cloudflare DNS Master Reference Table](#15-step-13-cloudflare-dns-master-reference-table)
16. [Step 14: Post-Deployment Smoke Tests & Verification](#16-step-14-post-deployment-smoke-tests--verification)
17. [Step 15: Day-2 Maintenance & Updates Runbook](#17-step-15-day-2-maintenance--updates-runbook)
18. [Step 16: Production Environment Variables Reference](#18-step-16-production-environment-variables-reference)
19. [Step 17: Fresher Troubleshooting & FAQ](#19-step-17-fresher-troubleshooting--faq)

---

## 1. Architecture Overview

Before typing commands, let's understand how the DriveIt Luxury system is organized:

```
                  ┌─────────────────────────────────────────────────────────┐
                  │                 VISITORS / BROWSERS                     │
                  └────────────────────────────┬────────────────────────────┘
                                               │
                                      Cloudflare Edge SSL (HTTPS)
                                               ▼
                  ┌─────────────────────────────────────────────────────────┐
                  │           CLOUDFLARE GLOBAL NETWORK (Free Plan)         │
                  │  • DDoS Protection  • DNS Management  • Edge Caching    │
                  └────────────────────────────┬────────────────────────────┘
                                               │
                                    Origin SSL (Port 443)
                                               ▼
┌───────────────────────────────────────────────────────────────────────────┐
│ CONTABO VPS (6 vCPU / 12 GB RAM / 200 GB SSD · Ubuntu 24.04)              │
│                                                                           │
│   ┌───────────────────────────────────────────────────────────────────┐   │
│   │ Nginx Web Server (Reverse Proxy + Cloudflare Origin CA SSL)       │   │
│   └──────────────────────────────────┬────────────────────────────────┘   │
│                                      │ Passes traffic to 127.0.0.1:3000   │
│                                      ▼                                    │
│   ┌───────────────────────────────────────────────────────────────────┐   │
│   │ DOCKER COMPOSE INTERNAL NETWORK (driveit-net)                     │   │
│   │                                                                   │   │
│   │  ┌─────────────────────────┐        ┌──────────────────────────┐  │   │
│   │  │   driveit-app           │        │   driveit-postgres       │  │   │
│   │  │   (Next.js 16 +         ├───────►│   (PostgreSQL 16)        │  │   │
│   │  │    Payload CMS 3)       │        │   Port 5432 (Internal)   │  │   │
│   │  └───────────┬─────────────┘        └─────────────▲────────────┘  │   │
│   │              │                                    │               │   │
│   │              ├───────────────────┐                │               │   │
│   │              ▼                   ▼                │               │   │
│   │  ┌───────────────────────┐ ┌───────────────┐ ┌────┴────────────┐  │   │
│   │  │   driveit-redis       │ │ driveit-      │ │ driveit-backup  │  │   │
│   │  │   (Rate Limiting)     │ │ scheduler     │ │ (Nightly Dumps) │  │   │
│   │  │   Port 6379           │ │ (Hold Sweeper)│ └─────────────────┘  │   │
│   │  └───────────────────────┘ └───────────────┘                      │   │
│   └───────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│   EXTERNAL SERVICES:                                                      │
│   • Cloudflare: DNS & 15-Year Origin CA SSL                               │
│   • Cloudinary: Fast global CDN for car images and CMS media uploads      │
│   • Zoho Mail: 5 free custom business inboxes (concierge@yourdomain.com)  │
│   • Brevo: 300 free emails/day (booking PDF invoices + email marketing)   │
│   • Google Cloud: OAuth 2.0 customer sign-in                              │
└───────────────────────────────────────────────────────────────────────────┘
```

### Why Everything Runs Together (Unified Deployment)
Unlike setups that split frontends and backends across multiple hosting providers, **Next.js 16 + Payload CMS 3 is a unified full-stack application**.
- Customer pages (`/cars`, `/checkout`, `/dashboard`) and the admin CMS (`/admin`) run in the **exact same Node.js container**.
- Server components query the database in microseconds using Payload's Local API (`getPayload()`), eliminating network latency.
- Postgres and Redis run on an isolated internal Docker network, never exposed to the open internet.

---

## 2. Prerequisites & Accounts Checklist

Have these free accounts ready before you begin:

| Resource | Purpose | Provider | Free Tier Available? |
|---|---|---|---|
| **Domain Name** | Your brand web address (e.g. `driveitluxury.in`) | Any registrar | Must purchase domain (~₹800 - ₹1,000/yr) |
| **DNS Manager** | DNS, proxy, DDoS protection & free SSL | [Cloudflare](https://dash.cloudflare.com) | ✅ 100% Free Plan |
| **Linux VPS** | High-performance server (6 vCPU / 12 GB RAM) | [Contabo](https://contabo.com) / Hetzner | ~₹650 - ₹1,100 / month |
| **Cloudinary** | Fast global image CDN for vehicle fleet & CMS uploads | [Cloudinary](https://cloudinary.com) | ✅ Free (25 credits/mo) |
| **Zoho Mail** | 5 free custom email inboxes (`concierge@...`) | [Zoho Mail](https://www.zoho.com/mail) | ✅ Forever Free Plan (5 users) |
| **Brevo** | Outgoing booking receipts, PDF invoices & email marketing | [Brevo](https://www.brevo.com) | ✅ Free (300 emails/day) |
| **Google Cloud** | Customer Google Sign-In (OAuth 2.0) | [Google Cloud](https://console.cloud.google.com) | ✅ Free |
| **Git Repository** | Codebase pushed to GitHub or GitLab | [GitHub](https://github.com) | ✅ Free |

---

## 3. Step 1: Provisioning Your VPS Server (Contabo / Hetzner)

### 3.1 Your Contabo VPS Specs
Your Contabo VPS features:
- **6 vCPU Cores**
- **12 GB RAM** (Ample memory; builds will be lightning fast)
- **200 GB NVMe / SSD**
- **1 Static Public IPv4 Address** (e.g., `123.45.67.89`)

**OS Selection:** Make sure your Contabo VPS is installed with **Ubuntu 24.04 LTS (64-bit)**. (If needed, you can re-install Ubuntu 24.04 from the Contabo Customer Control Panel under *VPS Control → Reinstall*).

---

### 3.2 Generating an SSH Key on Your Laptop
Open your laptop's terminal (PowerShell on Windows, or Terminal on macOS/Linux):

```bash
# Press Enter to accept default location, and enter an optional passphrase
ssh-keygen -t ed25519 -C "deployer@driveit"
```

View and copy your public key:
- **Windows (PowerShell):** `cat ~/.ssh/id_ed25519.pub`
- **macOS / Linux:** `cat ~/.ssh/id_ed25519.pub`

---

### 3.3 Adding Initial A-Records in Cloudflare DNS
Log into your **[Cloudflare Dashboard](https://dash.cloudflare.com/)** → Select your domain → Navigate to **DNS → Records**. Add two **A Records**:

| Type | Name | IPv4 Address | Proxy Status | TTL |
|---|---|---|---|---|
| **A** | `@` | `YOUR_CONTABO_VPS_IP` | **Proxied (Orange Cloud)** 🟠 | Auto |
| **A** | `www` | `YOUR_CONTABO_VPS_IP` | **Proxied (Orange Cloud)** 🟠 | Auto |

**Test DNS Propagation:**
Wait 2 minutes, then in your laptop terminal run:
```bash
ping yourdomain.com
```
When it responds, your domain is pointing to Cloudflare!

---

## 4. Step 2: Initial Server Setup & Security Hardening

Connect to your Contabo server via SSH:

```bash
ssh root@YOUR_CONTABO_VPS_IP
```
*(Enter the root password provided by Contabo in your welcome email).*

### 4.1 Create a Dedicated Non-Root User
Never run production apps as `root`. Let's create a user named `driveit`:

```bash
# 1. Create user and set a strong password
adduser driveit

# 2. Grant sudo privileges
usermod -aG sudo driveit

# 3. Copy SSH authorization keys to the new user
mkdir -p /home/driveit/.ssh
cp ~/.ssh/authorized_keys /home/driveit/.ssh/ 2>/dev/null || true
chown -R driveit:driveit /home/driveit/.ssh
chmod 700 /home/driveit/.ssh
chmod 600 /home/driveit/.ssh/authorized_keys 2>/dev/null || true

# 4. Switch to the new driveit user
su - driveit
```

---

### 4.2 Update Packages & Configure UFW Firewall
```bash
# Update Ubuntu package lists and upgrade existing software
sudo apt update && sudo apt upgrade -y

# Install essential server packages
sudo apt install -y curl git ufw fail2ban unzip htop

# Configure Firewall (UFW)
# IMPORTANT: Allow OpenSSH first, so you don't lock yourself out!
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable Firewall
sudo ufw --force enable

# Check firewall status
sudo ufw status
```

---

## 5. Step 3: Installing Docker & Docker Compose

Docker packages the Next.js app, Postgres, Redis, and cron tasks into isolated containers.

```bash
# 1. Download and run the official Docker install script
curl -fsSL https://get.docker.com | sudo sh

# 2. Add 'driveit' user to the docker group
sudo usermod -aG docker $USER

# 3. Apply group membership immediately without logging out
newgrp docker

# 4. Verify Docker and Docker Compose
docker --version
docker compose version
```

Expected output:
```
Docker version 27.x.x
Docker Compose version v2.x.x
```

---

## 6. Step 4: Cloning Code & Configuring Environment (.env)

### 6.1 Clone the Code Repository
```bash
cd ~
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY.git driveit
cd ~/driveit
```

Create local volume folders:
```bash
mkdir -p ~/driveit/data
mkdir -p ~/driveit/backups
```

---

### 6.2 Generate Secure Production Secrets
Run these commands to generate cryptographically random 64-character hex strings:

```bash
# Generate PAYLOAD_SECRET
openssl rand -hex 32

# Generate AUTH_SECRET
openssl rand -hex 32

# Generate CRON_SECRET (Mandatory for the hold-sweeper container!)
openssl rand -hex 32

# Generate strong POSTGRES_PASSWORD
openssl rand -hex 24
```
Keep these values handy; you will paste them into `.env` next.

---

### 6.3 Create the Production `.env` File
```bash
nano .env
```

Paste the following configuration and fill in your values:

```env
# ============================================================
# DRIVEIT LUXURY — PRODUCTION CONFIGURATION
# ============================================================

# ── App Public URL (No trailing slash!) ──
NEXT_PUBLIC_SERVER_URL=https://yourdomain.com
AUTH_URL=https://yourdomain.com

# ── Cryptographic Secrets (Generated in Step 6.2) ──
PAYLOAD_SECRET=PASTE_GENERATED_PAYLOAD_SECRET_HERE
AUTH_SECRET=PASTE_GENERATED_AUTH_SECRET_HERE

# ── Housekeeping Secret (MANDATORY for Docker Scheduler) ──
CRON_SECRET=PASTE_GENERATED_CRON_SECRET_HERE

# ── Production PostgreSQL Database ──
POSTGRES_USER=driveit
POSTGRES_PASSWORD=PASTE_GENERATED_POSTGRES_PASSWORD_HERE
POSTGRES_DB=driveit
DATABASE_URI=postgres://driveit:PASTE_GENERATED_POSTGRES_PASSWORD_HERE@postgres:5432/driveit

# ── Redis (Rate Limiting & Advisory Locks) ──
REDIS_URL=redis://redis:6379
TRUSTED_PROXY_HOPS=1

# ── Cloudinary CDN (Vehicle Fleet & Uploads - Step 8) ──
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER=driveit

# ── Google OAuth 2.0 (Customer Sign-In - Step 12) ──
AUTH_GOOGLE_ID=your_google_client_id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your_google_client_secret

# ── Email Service (Brevo API for 8 automated templates + reminders) ──
BREVO_API_KEY=xkeysib-your_brevo_api_key_here
BREVO_SENDER_EMAIL=concierge@yourdomain.com
BREVO_SENDER_NAME=DriveIt Luxury Concierge
BREVO_MARKETING_LIST_ID=2
# Optional fallback if using Resend
RESEND_API_KEY=

# ── UPI Payment Details ──
NEXT_PUBLIC_UPI_ID=yourupi@bank
NEXT_PUBLIC_UPI_NAME=DRIVEIT Luxury
# ── GPS Telematics & Fleet Monitoring (Optional Secret for GPS SIM pings) ──
TELEMATICS_SECRET=PASTE_OPTIONAL_TELEMATICS_SECRET_OR_LEAVE_BLANK

# ── First Deploy Bootstrapping Flag ──
# Set to 'true' only on your very first boot so Payload creates database tables.
PAYLOAD_SCHEMA_PUSH=true
```

Save and exit in nano: `Ctrl + O` → `Enter` → `Ctrl + X`.

---

## 7. Step 5: Starting Services & Initial Database Setup

### 7.1 Start PostgreSQL and Redis
```bash
cd ~/driveit
docker compose up -d postgres redis
```

Wait 10 seconds and check their health:
```bash
docker compose ps
```
Both `driveit-postgres` and `driveit-redis` should show `Up (healthy)`.

---

### 7.2 Build the Application Container
On your 6-core / 12 GB RAM Contabo VPS, this build will finish in just 2–3 minutes:

```bash
docker compose build
```

---

### 7.3 Start All Containers
```bash
docker compose up -d
```

Verify all 5 containers are running:
```bash
docker compose ps
```

Expected output:
```
NAME                STATUS
driveit-app         Up (healthy)
driveit-postgres    Up (healthy)
driveit-redis       Up (healthy)
driveit-backup      Up
driveit-scheduler   Up
```

Test internal response:
```bash
curl -I http://127.0.0.1:3000
```
It should return `HTTP/1.1 200 OK` or `307 Temporary Redirect`. ✅

---

## 8. Step 6: Setting Up Cloudinary (Free Fleet Asset CDN)

Cloudinary hosts and optimizes all vehicle photos, hero banners, and CMS media uploads via a global CDN. The free plan includes **25 credits/month** (~25 GB storage), which is plenty for your luxury fleet.

### 8.1 Register and Get API Credentials
1. Go to **[cloudinary.com](https://cloudinary.com/users/register_free)** and create a free account.
2. After logging in, go to the **Dashboard** (Console Home).
3. Find the **Product Environment Credentials** box:
   - **Cloud Name** (e.g. `driveit-cdn`)
   - **API Key** (e.g. `483726194829104`)
   - **API Secret** (e.g. `XyZ9_aBcDeFgHiJkLmNoPqRsTuV`)
4. Add these keys into your VPS `.env` file (`nano ~/driveit/.env`):
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_FOLDER=driveit
   ```

---

### 8.2 Upload Fleet Images to Cloudinary
Sync all static car photos from `public/sadan`, `public/suv`, and `public/trending` directly to Cloudinary:

```bash
cd ~/driveit

# Install host node_modules so tsx utility scripts can run
npm install --no-audit

# Run the automated fleet uploader
npm run upload:fleet:cloudinary
```

Expected output:
```
[cloudinary-upload] Starting asset upload to cloud "driveit-cdn" folder "driveit/fleet"...
  ✓ Uploaded: sadan/mercedes-maybach.jpg → https://res.cloudinary.com/...
  ✓ Uploaded: suv/rolls-royce-cullinan.jpg → https://res.cloudinary.com/...
[cloudinary-upload] Finished. Upload mapping written to cloudinary-fleet-map.json
```

All fleet assets are now securely hosted on the CDN!

---

## 9. Step 7: Seeding Initial Data & Managing Administrators (CMS, Dashboard & WaCRM)

### 9.1 Initial Database Seeding
Populate the database with the initial 28 fleet vehicles, luxury services, pricing models, FAQs, and the primary CMS super-administrator account:

```bash
cd ~/driveit

SEED_BASE_URL=http://localhost:3000 \
SEED_ADMIN_EMAIL=admin@yourdomain.com \
SEED_ADMIN_PASSWORD='YourStrongAdminPassword123!' \
npm run seed
```

Expected output:
```
[seed] Connecting to http://localhost:3000...
[seed] Creating admin user: admin@yourdomain.com
[seed] Seeding 28 fleet vehicles...
[seed] Seeding services & experiences...
[seed] Seeding testimonials & journal articles...
[seed] Seeding site settings...
✅ Seed complete! You can now log in at /admin
```

> 💡 **Tip:** After seeding is complete, disable `PAYLOAD_SCHEMA_PUSH` in `.env` to prevent future schema auto-modifications:
> ```bash
> nano ~/driveit/.env
> # Change: PAYLOAD_SCHEMA_PUSH=
> docker compose restart app
> ```

---

### 9.2 Managing Administrators for the Executive Dashboard & CMS (`/admin`)

The `/admin` portal is the **DRIVEIT Executive Portal** (`components/cms/DashboardView.tsx`), where authorized staff monitor live gross revenue, approve booking holds, verify UPI UTR payments, configure vehicle daily rates (With Driver vs Without Driver), issue promo coupons, review customer KYC documents, and update global branding.

Staff accounts are managed in the `Users` collection (`collections/Users.ts`).

#### Method A: Command-Line (CLI) — Adding Admins & Emergency Password Resets
If you need to add an administrator directly from the server terminal (or if you are locked out):

```bash
cd ~/driveit

# 1. Add a new Super Administrator:
ADMIN_PASSWORD="YourSecurePassword123!" npm run create:admin -- --email manager@yourdomain.com

# 2. Add a Content Editor (fleet & blog management only):
ADMIN_PASSWORD="EditorPassword123!" npm run create:admin -- --email editor@yourdomain.com --role=editor

# 3. Reset an existing Administrator's password:
ADMIN_PASSWORD="BrandNewPassword123!" npm run create:admin -- --email admin@yourdomain.com --reset-password
```

#### Method B: Through the Web UI (For Adding Team Members)
Once you are logged into the CMS:
1. Navigate to **`https://yourdomain.com/admin`** (or `http://localhost:3000/admin`).
2. In the left navigation menu under **Admin**, click **Users**.
3. Click **Create New** (top right corner).
4. Fill in:
   - **Full Name:** e.g. `Rahul Sharma (Operations Lead)`
   - **Email:** Staff member's official email (e.g. `rahul@yourdomain.com`).
   - **Role:**
     - **`Admin — full access`**: Complete control over revenue, fleet pricing, booking approval/cancellation, customer KYC documents, global site settings, and adding/removing other staff members.
     - **`Editor — content only`**: Can add and edit vehicles, blog posts, and testimonials, but cannot modify site settings, staff roles, coupons, or user accounts (enforced via `lib/access.ts`).
   - **Password:** Minimum 8 characters.
5. Click **Save** / **Publish**. The team member can now sign in at `https://yourdomain.com/admin`.

---

### 9.3 How User Accounts Work for the Customer Dashboard (`/dashboard`)

The customer-facing portal at `/dashboard` (`/dashboard/bookings`, `/dashboard/profile`, `/dashboard/wishlist`, `/dashboard/invoices/:id`) is strictly for clients to track reservations and invoices.

* **Strict Architectural Separation:** Customers authenticate using NextAuth / Auth.js and their profiles are saved in the `Customers` collection (`collections/Customers.ts`). Customers **never** share credentials with or have access to `/admin`.
* **Automatic Self-Registration:** Customers automatically get an account when they sign in with Google OAuth or register at `/signup` during booking checkout.
* **Admin Management from CMS:** As an Administrator in `/admin` → **Customers**, you can:
  - View all registered customers, booking counts, and loyalty tiers.
  - Review submitted VIP Self-Drive documents (Driving License front/back, Aadhaar last 4) in the KYC Vault and set **KYC Status** to `verified` or `rejected`.
  - Enter or edit customer corporate billing details (Company Name & GSTIN).

---

### 9.4 Adding Admins, Agents & Connecting WhatsApp CRM (WACRM)

In the DRIVEIT architecture, the main booking platform and your WhatsApp CRM operate together through an authenticated webhook bridge (`lib/notifications.ts` and `app/api/webhooks/wacrm/route.ts`).

#### A. Deploying & Accessing WACRM
* **Subdomain Setup:** As configured in Nginx (Step 8) and Cloudflare DNS (Step 13), your WhatsApp CRM runs on its dedicated subdomain:
  👉 `https://crm.yourdomain.com` (or `https://wa.yourdomain.com`)
* Running on a subdomain keeps sales agents focused on chats without interfering with public booking traffic.

#### B. Adding Admins & Concierge Sales Agents in WACRM
To add staff members who handle live WhatsApp chats and lead pipelines:
1. Log into your CRM dashboard at `https://crm.yourdomain.com/login` using your CRM Super Admin credentials.
2. Navigate to **Settings** → **Users & Teams** (or **Agents / Staff**).
3. Click **Add Agent** / **Invite Team Member**.
4. Enter the agent's work email, mobile number, and role:
   - **CRM Administrator:** Manages WhatsApp Cloud API templates, bot flows, agent assignment rules, and analytics.
   - **Concierge Sales Agent:** Answers live incoming WhatsApp chats, responds to inquiries from the website booking widget, and shares customized vehicle quotation links.

#### C. Connecting DriveIt Webhook to WACRM
In your VPS `.env` file (`~/driveit/.env`), ensure the bridge variables are set:
```env
# Outbound webhook destination where DriveIt pushes hold & booking events
WACRM_WEBHOOK_URL=https://crm.yourdomain.com/api/webhooks/driveit

# Shared secret key used to HMAC-SHA256 sign all events for tamper-proof security
WACRM_WEBHOOK_SECRET=your_wacrm_shared_secret_key
```

When a customer creates a hold or confirms a booking on the website, DriveIt pushes real-time events (`booking.hold_created`, `booking.confirmed`) directly into your WACRM dashboard so your concierge agents can immediately follow up on WhatsApp.

#### D. Official Customer WhatsApp Support Number
The central concierge WhatsApp number is configured in `globals/SiteSettings.ts`:
* **Concierge WhatsApp:** `+91 63000 41186` (`wa.me/916300041186`)
* Inquiries submitted from the homepage booking section and vehicle detail modals automatically open a prefilled WhatsApp chat directly with this number.

---

## 10. Step 8: Configuring Nginx Reverse Proxy

Nginx listens on ports 80 and 443, handles SSL termination, and proxies traffic to the Next.js app on `127.0.0.1:3000`.

### 10.1 Install Nginx on Ubuntu
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

### 10.2 Create the Nginx Virtual Host File
```bash
sudo nano /etc/nginx/sites-available/driveit
```

Paste the following block (replace `yourdomain.com` with your actual domain):

```nginx
# 1. HTTP Redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

# 2. HTTPS Main Server Block
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificate Paths (Cloudflare Origin CA - see Step 9)
    ssl_certificate     /etc/ssl/cloudflare/cert.pem;
    ssl_certificate_key /etc/ssl/cloudflare/key.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Max body upload size for CMS media
    client_max_body_size 50M;

    # Proxy to Docker container on port 3000
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 120s;
    }
}

# 3. Optional Subdomain: admin.yourdomain.com (Dedicated CMS Admin Access)
# NOTE: Payload CMS is already built directly into the app at yourdomain.com/admin!
# This block is optional if you prefer a separate admin subdomain.
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name admin.yourdomain.com;

    # Reuses the exact same 15-year Cloudflare Wildcard Origin CA certificate!
    ssl_certificate     /etc/ssl/cloudflare/cert.pem;
    ssl_certificate_key /etc/ssl/cloudflare/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Clean 1-tap redirect to the integrated Next.js Payload admin
    return 301 https://yourdomain.com/admin$request_uri;
}

# 4. Dedicated Subdomain: crm.yourdomain.com (WhatsApp CRM / Twenty CRM)
# Use this when running Twenty CRM or WhatsApp CRM in a separate Docker container
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name crm.yourdomain.com wa.yourdomain.com;

    # Reuses the exact same 15-year Cloudflare Wildcard Origin CA certificate!
    ssl_certificate     /etc/ssl/cloudflare/cert.pem;
    ssl_certificate_key /etc/ssl/cloudflare/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    client_max_body_size 100M;

    location / {
        # Port for Twenty CRM or WhatsApp CRM microservice (e.g. 3001)
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 180s;
    }
}
```

Save and exit: `Ctrl + O` → `Enter` → `Ctrl + X`.

---

### 10.3 Understanding Subdomains & Wildcard SSL: Do You Need to Buy Anything?

> 💡 **Executive Summary for the Owner / DevOps Engineer:**
> - **Do I need to buy a Wildcard SSL certificate?**  
>   **NO.** You do **NOT** need to pay for any SSL certificate.
>   - **Public Browser Traffic (Cloudflare Edge):** Cloudflare's Universal SSL automatically issues and auto-renews a free SSL certificate for `yourdomain.com` AND all first-level subdomains (`*.yourdomain.com`).
>   - **Server Traffic (Origin to VPS):** When you generate a Cloudflare Origin CA certificate in Step 9, Cloudflare automatically covers `yourdomain.com` and `*.yourdomain.com` with a free **15-year certificate**. It will never expire, never costs a dime, and protects unlimited subdomains.
> - **Does Payload CMS need its own subdomain?**  
>   **No.** Payload 3.0 is compiled directly inside Next.js 16 as an App Router route at `https://yourdomain.com/admin`. The website and CMS share the same database connection pool, session engine, and cache.
> - **Does WACRM (WhatsApp CRM) or Twenty CRM need a subdomain?**  
>   **YES (Recommended).** A CRM is an independent microservice where your sales team manages leads, WhatsApp conversations, and deal pipelines. Hosting it on `crm.yourdomain.com` keeps the sales operations cleanly separated from public customer traffic while running on the exact same Contabo VPS server.

---

## 11. Step 9: Securing SSL (Cloudflare 15-Year Origin CA vs Let's Encrypt)

### Why Cloudflare Origin CA is the Best Choice
Because your domain is on Cloudflare:
- **Let's Encrypt** expires every 90 days and often fails automated renewal when Cloudflare's Orange Cloud proxy is active.
- **Cloudflare Origin CA** gives you a free **15-year SSL certificate** for your origin server. It never expires, never needs renewal scripts, and allows you to keep Cloudflare's Orange Cloud proxy permanently active!

---

### 11.1 Generating Your 15-Year Cloudflare Origin Certificate
1. Log in to your **[Cloudflare Dashboard](https://dash.cloudflare.com/)** and click your domain.
2. In the left navigation menu, go to **SSL/TLS → Origin Server**.
3. Click the **Create Certificate** button:
   - Key Type: **RSA (2048)** (Default)
   - Hostnames: `yourdomain.com`, `*.yourdomain.com` (Default)
   - Certificate Validity: Select **15 years**
   - Click **Create**.
4. You will see two text areas on your screen:
   - **Origin Certificate**
   - **Private Key**

---

### 11.2 Installing the Certificate on Your Contabo VPS
In your VPS terminal:

```bash
# Create directory for Cloudflare certificates
sudo mkdir -p /etc/ssl/cloudflare

# 1. Create cert.pem and paste the Origin Certificate:
sudo nano /etc/ssl/cloudflare/cert.pem

# 2. Create key.pem and paste the Private Key:
sudo nano /etc/ssl/cloudflare/key.pem

# 3. Secure the private key permissions
sudo chmod 600 /etc/ssl/cloudflare/key.pem
```

---

### 11.3 Enable Site and Reload Nginx
```bash
# Enable the driveit site
sudo ln -sf /etc/nginx/sites-available/driveit /etc/nginx/sites-enabled/

# Remove default boilerplate site
sudo rm -f /etc/nginx/sites-enabled/default

# Test configuration syntax
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

### 11.4 Set Cloudflare SSL/TLS Encryption Mode to Full (Strict)
1. In Cloudflare Dashboard, go to **SSL/TLS → Overview**.
2. Select **Full (strict)** encryption mode.
3. In **DNS → Records**, ensure the proxy status for both `@` and `www` is set to **Proxied (Orange Cloud)** 🟠.

Visit `https://yourdomain.com` in your browser. You now have end-to-end encrypted HTTPS that will remain valid for 15 years! 🔒

---

## 12. Step 10: Setting Up Zoho Mail (Free 5 Business Inboxes)

Zoho Mail provides a **Forever Free plan** for up to 5 users (5 GB per mailbox) on your custom domain (e.g. `concierge@yourdomain.com`, `bookings@yourdomain.com`, `support@yourdomain.com`).

### 12.1 Sign Up on Zoho Mail Free Plan
1. Go to **[zoho.com/mail](https://www.zoho.com/mail/)**.
2. Scroll to the bottom pricing comparison and click **Sign Up** under **Forever Free Plan**.
3. Select "Sign up with a domain that you already own" and enter `yourdomain.com`.

---

### 12.2 Verify Domain in Cloudflare DNS
Zoho will provide a TXT verification code. In Cloudflare **DNS → Records**, add:
- **Type:** `TXT`
- **Name:** `@`
- **Content:** `zoho-verification=zbXXXXXXXX.zmverify.zoho.com` (copy from Zoho)
- **TTL:** `Auto`

Click **Verify** in Zoho.

---

### 12.3 Add Zoho MX Records in Cloudflare DNS
Delete any existing MX records in Cloudflare, then add these 3 MX records:

| Type | Name | Mail Server | Priority | TTL |
|---|---|---|---|---|
| **MX** | `@` | `mx.zoho.in` (or `mx.zoho.com`)* | `10` | Auto |
| **MX** | `@` | `mx2.zoho.in` (or `mx2.zoho.com`)* | `20` | Auto |
| **MX** | `@` | `mx3.zoho.in` (or `mx3.zoho.com`)* | `50` | Auto |

*(Use `.in` if registered under Zoho India, or `.com` if international, as instructed in your Zoho setup wizard).*

---

### 12.4 Add Zoho SPF & DKIM Records (Spam Prevention)
- **SPF Record (Combined with Brevo in Step 11):**
  - **Type:** `TXT`
  - **Name:** `@`
  - **Content:** `v=spf1 include:zoho.in include:spf.brevo.com ~all`
- **DKIM Record:**
  - In Zoho Mail Admin Console → **Email Authentication → DKIM** → Add Selector named `zoho` → Copy TXT record.
  - In Cloudflare DNS, add:
    - **Type:** `TXT`
    - **Name:** `zoho._domainkey`
    - **Content:** `v=DKIM1; k=rsa; p=MIGfMA0GCSq...` (pasted from Zoho)

You can now create user accounts (e.g. `concierge@yourdomain.com`) in the Zoho Admin Console and access your webmail at [mail.zoho.in](https://mail.zoho.in).

---

## 13. Step 11: Setting Up Brevo (Transactional Emails & Marketing)

**Brevo (formerly Sendinblue)** offers **300 free emails per day forever**.
- Use Brevo's **SMTP Relay** to deliver booking receipts and PDF invoices with high deliverability.
- Use Brevo's **Marketing Campaigns** to design promotional newsletters and manage customer lists.

### 13.1 Register and Authenticate Domain in Brevo
1. Sign up at **[brevo.com](https://www.brevo.com/)**.
2. Go to **Settings (top right) → Senders, Domains & Dedicated IPs → Domains**.
3. Click **Add a Domain** → Enter `yourdomain.com`.
4. Brevo will provide 2 verification records for Cloudflare DNS:
   - **Brevo Code (TXT):**
     - Name: `@`
     - Content: `brevo-code:xxxxxxxxxxxxxxxxxxxx`
   - **Brevo DKIM (TXT):**
     - Name: `mail._domainkey`
     - Content: `k=rsa; p=MIGfMA0GCSq...` (from Brevo)
5. Click **Verify this domain** in Brevo.

---

### 13.2 Generate Brevo API Key (Powers Automated Templates & Reminders)
DriveIt is pre-wired with 8 luxury HTML email templates in `lib/email-templates/` and an automated Brevo client (`lib/brevo.ts`).

1. In your Brevo dashboard, go to **SMTP & API → API Keys tab**.
2. Click **Generate a new API key** → Name it `driveit-api`.
3. Copy the generated key (starts with `xkeysib-`).
4. In `nano ~/driveit/.env`, set:
   ```env
   BREVO_API_KEY=xkeysib-your_copied_api_key_here
   BREVO_SENDER_EMAIL=concierge@yourdomain.com
   BREVO_SENDER_NAME=DriveIt Luxury Concierge
   BREVO_MARKETING_LIST_ID=2
   ```

### 13.3 The 8 Built-in Luxury Email Templates in Code
DriveIt automatically dispatches responsive, obsidian-gold luxury email templates for these events:
1. **Booking Confirmed (`booking-confirmed.ts`):** Triggered immediately upon checkout completion with vehicle itinerary, dynamic pricing, and an attached official PDF tax invoice.
2. **Payment Verified (`payment-verified.ts`):** Triggered when staff marks `paymentStatus: 'verified'` in Payload CMS, delivering an official payment receipt.
3. **Payment Action Required (`payment-failed.ts`):** Triggered if a UPI reference is rejected, giving the customer a direct link to retry payment before hold release.
4. **24-Hour Pickup Reminder (`booking-reminder.ts`):** Dispatched 24 hours before trip start with vehicle inspection status, documents checklist, and chauffeur arrival timeline.
5. **2-Hour Return Reminder (`vehicle-return-reminder.ts`):** Dispatched 2 hours before trip end with dropoff instructions and 1-tap WhatsApp trip extension option.
6. **Reservation Cancelled (`booking-cancelled.ts`):** Dispatched upon booking cancellation with refund policy terms and re-booking incentive.
7. **VIP Club Welcome (`account-welcome.ts`):** Dispatched when a customer creates an account / signs in with Google, providing a `WELCOME10` 10% onboarding voucher.
8. **Trip Completed & Review Request (`trip-completed-review.ts`):** Dispatched when a booking is completed, showing loyalty points credited and a 5-star Google review prompt.

### 13.4 Automated Reminders Cron Endpoint
The reminder system runs automatically via:
```
POST /api/cron/reminders
Header: x-cron-secret: $CRON_SECRET
```
The Docker `scheduler` calls this along with `expire-holds` to scan upcoming pickups and scheduled returns.

### 13.5 VIP Contact Sync & Email Marketing in Brevo
Every new customer and confirmed booking automatically syncs to your Brevo Contacts List with booking metadata (`LAST_CAR_BOOKED`, `LAST_BOOKING_REF`), allowing you to create promotional email campaigns inside the Brevo web dashboard without manual exports!

---

## 14. Step 12: Configuring Google OAuth (Customer Login)

DriveIt allows customers to sign in with Google to view their bookings, wishlists, and loyalty tier under `/dashboard`.

### 14.1 Create Project in Google Cloud Console
1. Go to the **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Click the project dropdown at the top → **New Project**.
3. Name: `DriveIt Luxury` → Click **Create**, then select the project.

---

### 14.2 Configure OAuth Consent Screen
1. Go to **APIs & Services → OAuth consent screen**.
2. Select User Type: **External** → Click **Create**.
3. Enter:
   - **App name:** `DriveIt Luxury`
   - **User support email:** Your email address
   - **Developer contact info:** Your email address
4. Click **Save and Continue**.
5. Under **Scopes**, click **Add or Remove Scopes**:
   - Check `.../auth/userinfo.email`
   - Check `.../auth/userinfo.profile`
   - Check `openid`
6. Click **Save and Continue** → Click **Publish App** to make it live.

---

### 14.3 Create OAuth Client ID
1. In the left menu, go to **Credentials**.
2. Click **+ Create Credentials → OAuth client ID**.
3. Application type: Select **Web application**.
4. Name: `DriveIt Production Web`.
5. **Authorized JavaScript origins** (Add both):
   ```
   https://yourdomain.com
   https://www.yourdomain.com
   ```
6. **Authorized redirect URIs** (Add both):
   ```
   https://yourdomain.com/api/auth/callback/google
   https://www.yourdomain.com/api/auth/callback/google
   ```
7. Click **Create**.

---

### 14.4 Add to Contabo VPS `.env`
Google will show a modal with your **Client ID** and **Client Secret**.

Open `.env` on your Contabo server:
```bash
nano ~/driveit/.env
```
Paste the keys:
```env
AUTH_GOOGLE_ID=your_client_id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=GOCSPX-your_client_secret
```
Save (`Ctrl+O`, `Enter`, `Ctrl+X`) and restart the app:
```bash
docker compose restart app
```

---

## 15. Step 13: Cloudflare DNS Master Reference Table

Here is the single reference table of all DNS records to enter into your Cloudflare Dashboard:

| Record Type | Name / Host | Target / Content / Mail Server | Priority | Proxy Status | Notes |
|---|---|---|---|---|---|
| **A** | `@` | `YOUR_CONTABO_VPS_IP` | - | 🟠 Proxied | Main website address (driveitluxury.in) |
| **A** | `www` | `YOUR_CONTABO_VPS_IP` | - | 🟠 Proxied | WWW subdomain |
| **A** | `crm` | `YOUR_CONTABO_VPS_IP` | - | 🟠 Proxied | WhatsApp CRM / Twenty CRM Concierge Portal |
| **A** | `admin` | `YOUR_CONTABO_VPS_IP` | - | 🟠 Proxied | Optional Dedicated Admin Portal Subdomain |
| **MX** | `@` | `mx.zoho.in` (or `mx.zoho.com`) | `10` | ⚪ DNS Only | Zoho Mail Primary Server |
| **MX** | `@` | `mx2.zoho.in` (or `mx2.zoho.com`) | `20` | ⚪ DNS Only | Zoho Mail Backup 1 |
| **MX** | `@` | `mx3.zoho.in` (or `mx3.zoho.com`) | `50` | ⚪ DNS Only | Zoho Mail Backup 2 |
| **TXT** | `@` | `v=spf1 include:zoho.in include:spf.brevo.com ~all` | - | ⚪ DNS Only | Combined SPF for Zoho + Brevo |
| **TXT** | `zoho._domainkey` | `v=DKIM1; k=rsa; p=MIGf...` | - | ⚪ DNS Only | Zoho DKIM authentication key |
| **TXT** | `mail._domainkey` | `k=rsa; p=MIGf...` | - | ⚪ DNS Only | Brevo DKIM authentication key |
| **TXT** | `@` | `zoho-verification=zbXXXXXXXX...` | - | ⚪ DNS Only | Zoho domain ownership check |
| **TXT** | `@` | `brevo-code:xxxxxxxxxxxxxxxx...` | - | ⚪ DNS Only | Brevo domain ownership check |
| **TXT** | `_dmarc` | `v=DMARC1; p=none; sp=none;` | - | ⚪ DNS Only | DMARC email security policy |

---

## 16. Step 14: Post-Deployment Smoke Tests & Verification

Never announce a site to customers without running verification. DriveIt includes an automated, end-to-end smoke test script.

### 16.1 Run the Automated Smoke Suite
The smoke test checks page rendering, verifies that private API routes (`/api/bookings`) are protected, places a test booking, checks server-side pricing recalculation, tests concurrency locks, and verifies rate limiting:

```bash
cd ~/driveit
SMOKE_BASE_URL=https://yourdomain.com \
SEED_ADMIN_PASSWORD='YourStrongAdminPassword123!' \
npm run smoke -- --allow-remote
```

Expected output:
```
  ✓ homepage — 200, renders HTML
  ✓ fleet feed — returns cars array
  ✓ bookings private — 403 Forbidden for anonymous
  ✓ profile private — 401 Unauthorized for anonymous
  ✓ booking hold — created 10-minute hold with token
  ✓ server-side pricing — calculated accurately
  ✓ booking confirm — confirmed with hold token
  ✓ concurrency — 3 simultaneous holds resulted in exactly 1 winner
  ✓ rate limiter — returns 429 Too Many Requests on burst
  
✅ 14/14 checks passed! System is verified production-ready.
```

---

### 16.2 Manual Verification Checklist
1. **Visit Homepage:** `https://yourdomain.com` → Verify images load via Cloudflare/Cloudinary CDN.
2. **Visit Fleet Page:** `https://yourdomain.com/cars` → Verify luxury car inventory renders with daily pricing.
3. **Visit Admin Panel:** `https://yourdomain.com/admin` → Log in with `admin@yourdomain.com` and your seed password.
4. **Test Customer Login:** Click "Sign In" and test the Google OAuth flow.
5. **Place Test Booking:** Go through `/checkout`, enter a coupon code, submit booking, and verify receipt email.

---

## 17. Step 15: Day-2 Maintenance & Updates Runbook

### 🔄 Pushing an Application Update (New Git Commit)
```bash
cd ~/driveit

# 1. Pull latest code
git pull origin main

# 2. Run database migrations if any were added
npm run migrate

# 3. Rebuild app container
docker compose build app

# 4. Restart app container (Database and Redis remain unaffected!)
docker compose up -d app

# 5. Check logs
docker compose logs -f app
```

---

### 📦 Manual Database Backup
```bash
# Create immediate snapshot
docker compose exec -T postgres pg_dump -U driveit -d driveit -Fc \
  -f /backups/manual_backup_$(date +%Y%m%d_%H%M%S).dump

# List all backups
docker compose exec -T backup ls -lh /backups
```

To download a backup to your personal laptop:
```bash
# Run on your local laptop:
scp driveit@YOUR_CONTABO_VPS_IP:~/driveit/backups/manual_backup_*.dump ./
```

---

### 🔍 Viewing Live Logs
```bash
# App logs
docker compose logs -f app

# Hold-sweeper scheduler logs
docker compose logs -f scheduler

# Nginx access & error logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 18. Step 16: Production Environment Variables Reference

| Environment Variable | Required? | Example | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SERVER_URL` | ✅ Required | `https://yourdomain.com` | Base public URL for assets, links, and SEO |
| `AUTH_URL` | ✅ Required | `https://yourdomain.com` | NextAuth callback base URL |
| `PAYLOAD_SECRET` | ✅ Required | 64-char hex | Payload CMS encryption key for JWTs and sessions |
| `AUTH_SECRET` | ✅ Required | 64-char hex | NextAuth encryption secret for customer cookies |
| `CRON_SECRET` | ✅ Required | 64-char hex | Shared secret authorizing `POST /api/cron/expire-holds` |
| `DATABASE_URI` | ✅ Required | `postgres://user:pass@postgres:5432/driveit` | PostgreSQL connection string |
| `REDIS_URL` | ✅ Required | `redis://redis:6379` | Redis connection for rate limits & concurrency |
| `TRUSTED_PROXY_HOPS` | ✅ Required | `1` | Number of reverse proxies (1 for Nginx) |
| `CLOUDINARY_CLOUD_NAME` | ✅ Required | `driveit-cdn` | Cloudinary account name for vehicle asset hosting |
| `CLOUDINARY_API_KEY` | ✅ Required | `483726194829104` | Cloudinary API Key |
| `CLOUDINARY_API_SECRET` | ✅ Required | `XyZ9_aBcDeFgHi...` | Cloudinary API Secret |
| `CLOUDINARY_FOLDER` | Optional | `driveit` | Folder inside Cloudinary media library |
| `AUTH_GOOGLE_ID` | ⚠️ Recommended | `*.apps.googleusercontent.com` | Google OAuth Client ID for customer sign-in |
| `AUTH_GOOGLE_SECRET` | ⚠️ Recommended | `GOCSPX-*` | Google OAuth Client Secret |
| `BREVO_API_KEY` | ⚠️ Recommended | `xkeysib-*` | Brevo API key for 8 automated templates, reminders & contact sync |
| `BREVO_SENDER_EMAIL` | ⚠️ Recommended | `concierge@yourdomain.com` | Verified sender email in Brevo |
| `BREVO_SENDER_NAME` | Optional | `DriveIt Luxury Concierge` | Sender name for customer emails |
| `BREVO_MARKETING_LIST_ID` | Optional | `2` | Brevo contact list ID for syncing new VIP leads |
| `RESEND_API_KEY` | ⚠️ Optional | `re_*` | Resend API key (optional fallback) |
| `EMAIL_FROM_ADDRESS` | ⚠️ Recommended | `concierge@yourdomain.com` | Outgoing verified email address |
| `EMAIL_FROM_NAME` | Optional | `DriveIt Luxury Concierge` | Sender name shown in customer email inboxes |
| `NEXT_PUBLIC_UPI_ID` | ⚠️ Recommended | `yourcompany@upi` | UPI VPA displayed on the QR checkout modal |
| `NEXT_PUBLIC_UPI_NAME` | ⚠️ Recommended | `DRIVEIT Luxury` | Name displayed on customer UPI payment app |
| `TELEMATICS_SECRET` | ⚠️ Optional | 64-char hex | Shared secret authorizing direct GPS SIM tracker pings at `/api/telematics/ping` |

---

## 19. Step 17: Fresher Troubleshooting & FAQ

### 1. Error: `CRON_SECRET: Set CRON_SECRET in .env — the hold sweep endpoint requires it`
- **Why it happened:** Docker Compose requires `CRON_SECRET` to authorize the internal hold sweeper.
- **Fix:** Run `openssl rand -hex 32`, add `CRON_SECRET=generated_string` to `~/driveit/.env`, and run `docker compose up -d`.

---

### 2. Error: `502 Bad Gateway` when opening domain in browser
- **Why it happened:** Nginx is running, but the Next.js container on port 3000 is still booting or has crashed.
- **Fix:** Check app logs:
  ```bash
  docker compose logs --tail=50 app
  ```
  - If you see `Missing PAYLOAD_SECRET` or `Missing AUTH_SECRET`, fill them in `.env`.
  - If you see `database connection refused`, wait 10 seconds and run `docker compose restart app`.

---

### 3. Error: Google Login gives `Error 400: redirect_uri_mismatch`
- **Why it happened:** The Authorized Redirect URI in Google Cloud Console does not match your exact domain.
- **Fix:** In Google Cloud Console, ensure Authorized Redirect URIs includes:
  `https://yourdomain.com/api/auth/callback/google` (check for typos, `https` vs `http`, and trailing slashes).

---

### 4. Error: Cloudflare shows `Error 525: SSL Handshake Failed`
- **Why it happened:** Cloudflare SSL mode is set to "Full (Strict)" but Nginx does not have the Cloudflare Origin CA certificate installed.
- **Fix:** Follow Step 9 to generate the Origin Certificate in Cloudflare and save to `/etc/ssl/cloudflare/cert.pem` and `/etc/ssl/cloudflare/key.pem`, then reload Nginx (`sudo systemctl reload nginx`).

---

### 5. Error: `permission denied while trying to connect to the Docker daemon socket`
- **Why it happened:** Current user session does not have Docker permissions refreshed.
- **Fix:** Run `newgrp docker` or log out and SSH back in.

---

### 6. Error: Blank page or empty fleet on `/cars`
- **Why it happened:** The database was created, but no seed data was inserted into Payload.
- **Fix:** Run the seed command:
  ```bash
  cd ~/driveit
  SEED_BASE_URL=http://localhost:3000 npm run seed
  ```

---

## 🏁 Summary & Final Handoff

| Asset | Production URL |
|---|---|
| 🌐 **Customer Website** | `https://yourdomain.com` |
| 🔑 **Payload CMS Admin** | `https://yourdomain.com/admin` |
| 🏎️ **Fleet Catalog** | `https://yourdomain.com/cars` |
| 💼 **Customer Dashboard** | `https://yourdomain.com/dashboard` |
| 📧 **Zoho Webmail** | `https://mail.zoho.in` (or `.com`) |
| 📬 **Brevo Email Marketing** | `https://app.brevo.com` |
| ☁️ **Cloudinary Media Console** | `https://console.cloudinary.com` |

Keep your `.env` backed up securely on an encrypted password manager, keep Ubuntu packages updated regularly with `sudo apt update && sudo apt upgrade -y`, and monitor database backups in `~/driveit/backups`.
