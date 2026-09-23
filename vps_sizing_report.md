# 🖥️ DriveIt — VPS Resource Sizing Report
> **Target Scale:** ~10,000 Users | **Deployment:** Vercel (Frontend) + VPS (Backend/API)

---

## 🏗️ What Is Running on the VPS?

This is a **monolithic Next.js + Payload CMS** app. Even though you're "splitting" frontend to Vercel, the VPS still runs the **entire Next.js server** because:

- Payload CMS must co-locate with Next.js (it uses Next.js API routes internally)
- SQLite database lives on the VPS filesystem
- All API routes (`/api/bookings`, `/api/checkout`, `/api/webhooks`, etc.) run server-side
- Media/file uploads are stored on the VPS (`public/media/`)
- The Payload Admin Panel (`/admin`) is served from the VPS

> [!IMPORTANT]
> Vercel can host the **static pages** (marketing, blog, cars listing), but all **dynamic API calls, admin panel, and Payload routes must point to your VPS**. This is a hybrid split, not a clean decoupling.

---

## 🔍 Tech Stack Analysis (What Drives Resource Needs)

| Component | Technology | Resource Impact |
|-----------|-----------|----------------|
| Framework | Next.js 16 (App Router) | High RAM (Node.js SSR) |
| CMS/Backend | Payload CMS 3 | Moderate CPU (admin queries) |
| Database | **SQLite** (file-based) | ⚠️ Single-threaded writes |
| Media Storage | Local filesystem (`public/media`) | Disk I/O intensive |
| PDF Generation | `@react-pdf/renderer` | CPU spike per booking |
| Image Processing | `sharp` | CPU spike on upload |
| Emails | Resend (external API) | Minimal (offloaded) |
| WhatsApp | Meta Graph API (external) | Minimal (offloaded) |
| Auth | NextAuth v5 | Minimal |

---

## ⚙️ VPS Resource Recommendations

### ✅ Recommended Tier: **4 vCPU / 8 GB RAM / 80 GB SSD**

This is the **sweet spot** for 10K users with SQLite + Payload CMS.

---

### 📊 Detailed Breakdown

#### 🧠 RAM

| Process | RAM Usage |
|---------|----------|
| Next.js production server (1 instance) | ~400–600 MB |
| Payload CMS runtime overhead | ~150–200 MB |
| Node.js base + OS | ~300–400 MB |
| SQLite (in-memory cache via WAL mode) | ~100–200 MB |
| Sharp image processing (burst) | ~50–100 MB |
| React PDF generation (burst) | ~100–150 MB |
| Buffer / headroom | ~1 GB |
| **Total** | **~2.5–3.5 GB active** |

> **Minimum viable:** 4 GB RAM. **Recommended:** 8 GB (allows PM2 clustering with 2–3 workers + OS headroom).

---

#### ⚡ CPU

| Workload | CPU Notes |
|---------|----------|
| Idle / low traffic | ~5–10% on 2 cores |
| Checkout + PDF generation | ~40–60% spike (1 core) |
| Image upload with `sharp` resizing | ~30–50% spike |
| 10K users (concurrent peak ~50–100) | Needs 4 vCPU to handle spikes |

> **Minimum:** 2 vCPU. **Recommended:** 4 vCPU for comfortable concurrency headroom.

---

#### 💾 Storage

| Data Type | Estimated Size |
|-----------|---------------|
| OS + Docker + App | ~5–8 GB |
| Node modules (in Docker image) | ~800 MB – 1.2 GB |
| SQLite DB (10K users, bookings, etc.) | ~500 MB – 1 GB |
| Media uploads (car photos, logos) | ~5–20 GB (highly variable) |
| Logs | ~1–2 GB/year |
| **Total** | **~15–30 GB** |

> **Minimum:** 40 GB SSD. **Recommended:** 80 GB SSD with expansion plan. Use a **separate volume** for `/app/data` (SQLite) and `/app/public/media` so you can expand independently.

---

#### 🌐 Bandwidth

| Traffic Estimate | Bandwidth |
|-----------------|----------|
| 10K users, ~20 page views/month each | ~200K requests/month |
| API calls (bookings, auth, etc.) | ~50K requests/month |
| Media served from VPS | ~50–100 GB/month |
| **Typical VPS allowance** | 1–5 TB/month (plenty) |

> Bandwidth is **not a concern** at this scale for most VPS providers.

---

## ⚠️ Critical Warnings: SQLite at 10K Users

> [!WARNING]
> **SQLite is the biggest bottleneck** in this stack. It is a file-based, single-writer database. Here's what that means:
> - Only **one write** can happen at a time (concurrent bookings will queue)
> - **No horizontal scaling** — you cannot run 2 VPS instances with the same SQLite file
> - Good for: up to ~500 concurrent users with read-heavy traffic
> - Risky for: high-concurrency checkouts (race conditions possible despite the 10-min hold lock)

**Mitigation options:**
1. Enable **WAL (Write-Ahead Logging)** mode in SQLite → allows concurrent reads
2. Consider migrating to **PostgreSQL** if you expect >100 concurrent active users
3. Keep the SQLite DB on a fast **NVMe SSD** volume

---

## 📦 Recommended VPS Specs (Summary)

| Spec | Minimum | Recommended |
|------|---------|-------------|
| **vCPU** | 2 cores | **4 cores** |
| **RAM** | 4 GB | **8 GB** |
| **Storage** | 40 GB SSD | **80 GB NVMe SSD** |
| **Bandwidth** | 1 TB/mo | 2 TB/mo |
| **OS** | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |

---

## 💰 Provider Comparison (Monthly Cost)

| Provider | Spec | Price/mo |
|---------|------|----------|
| **Hetzner CX32** | 4 vCPU / 8 GB / 80 GB | ~€9–12/mo (~₹900) ✅ Best value |
| **DigitalOcean** | 4 vCPU / 8 GB / 160 GB | ~$48/mo (~₹4,000) |
| **Vultr** | 4 vCPU / 8 GB / 160 GB | ~$40/mo (~₹3,300) |
| **AWS EC2 t3.large** | 2 vCPU / 8 GB | ~$60/mo (~₹5,000) |
| **Contabo VPS M** | 6 vCPU / 16 GB / 400 GB | ~€8/mo (~₹720) ✅ Overkill value |

> **Best recommendation for your budget:** [Hetzner](https://www.hetzner.com/cloud) CX32 (Europe/Ashburn) — outstanding price-to-performance for this workload.

---

## 🚀 Deployment Architecture

```
┌──────────────────────────────────────────────────────┐
│                   USER BROWSER                        │
└───────────────────┬──────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
         ▼                     ▼
  ┌─────────────┐      ┌──────────────────────┐
  │   VERCEL    │      │       VPS (Docker)    │
  │  (Static    │      │                       │
  │   pages,    │      │  Next.js Server       │
  │   CDN Edge) │      │  Payload CMS Admin    │
  │             │      │  API Routes           │
  │  /          │      │  SQLite DB (volume)   │
  │  /cars      │ ───▶ │  Media Files (volume) │
  │  /blog      │      │                       │
  │  /about     │      │  Port 3000 → Nginx    │
  └─────────────┘      └──────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │   External APIs     │
                    │  Resend (email)     │
                    │  Meta WhatsApp API  │
                    └────────────────────┘
```

---

## ✅ Quick Setup Checklist for VPS

- [ ] Run Docker or PM2 with 2–3 worker processes
- [ ] Mount SQLite DB to a **persistent volume** (`/app/data`)
- [ ] Mount media uploads to a **persistent volume** (`/app/public/media`)
- [ ] Set up **Nginx** as reverse proxy on port 80/443
- [ ] Configure **SSL via Let's Encrypt** (Certbot)
- [ ] Set up **daily SQLite backups** (cron job → cloud storage)
- [ ] Configure `PAYLOAD_SECRET` as a strong random string
- [ ] Enable SQLite WAL mode for better concurrency
