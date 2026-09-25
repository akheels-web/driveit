# 👑 DRIVEIT Luxury — Business Owner's Operational Guide & System Architecture Manual

> **Document Class:** Executive Operational Runbook & Business Guide  
> **Audience:** Business Owner, Managing Director, Operations Manager, and Lead Concierge  
> **Platform Version:** 2026.9 (Production Release)  
> **Target Domain:** `driveitluxury.com` (or your registered domain)

---

## 📑 Table of Contents

1. [Executive Overview: How Your Platform Works](#1-executive-overview-how-your-platform-works)
2. [The End-to-End Customer Reservation Journey](#2-the-end-to-end-customer-reservation-journey)
3. [Complete Platform Feature Directory](#3-complete-platform-feature-directory)
4. [Subdomain & Wildcard SSL Reality: Do You Need to Buy Anything?](#4-subdomain--wildcard-ssl-reality-do-you-need-to-buy-anything)
5. [Owner's Step-by-Step Operations Manual (How to Manage Daily)](#5-owners-step-by-step-operations-manual-how-to-manage-daily)
   - [5.1 Logging into the Command Center (`/admin`)](#51-logging-into-the-command-center-admin)
   - [5.2 Adding & Managing Fleet Vehicles & Pricing](#52-adding--managing-fleet-vehicles--pricing)
   - [5.3 Verifying Payments & Confirming Bookings](#53-verifying-payments--confirming-bookings)
   - [5.4 Customer Self-Drive KYC Document Verification](#54-customer-self-drive-kyc-document-verification)
   - [5.5 Inspecting Returns & Processing Security Deposit Refunds](#55-inspecting-returns--processing-security-deposit-refunds)
   - [5.6 Updating Website Content, Phone Numbers, Logos & Videos](#56-updating-website-content-phone-numbers-logos--videos)
   - [5.7 Managing Coupons & Seasonal Discounts](#57-managing-coupons--seasonal-discounts)
   - [5.8 Reviewing Consignment Partner Applications](#58-reviewing-consignment-partner-applications)
6. [Automated Omnichannel Notifications (Brevo, WhatsApp & Telegram)](#6-automated-omnichannel-notifications-brevo-whatsapp--telegram)
7. [SEO, LLMs & AI Engine Discoverability](#7-seo-llms--ai-engine-discoverability)
8. [Summary Reference & Emergency Contact Points](#8-summary-reference--emergency-contact-points)

---

## 1. Executive Overview: How Your Platform Works

DRIVEIT Luxury is built as an **ultra-fast, unified luxury car rental platform**. Unlike traditional rental sites that run on clunky WordPress plugins or stitch together 5 different SaaS subscriptions costing ₹50,000–₹1,00,000 every month, your platform runs as a **single high-performance engine**:

```
                                  ┌────────────────────────────────┐
                                  │      CUSTOMER BROWSER / PHONE   │
                                  └───────────────┬────────────────┘
                                                  │
                                                  ▼
                       ┌─────────────────────────────────────────────────────┐
                       │     CLOUDFLARE EDGE NETWORK (DDoS & Free SSL)       │
                       └──────────────────────────┬──────────────────────────┘
                                                  │
                                                  ▼
                       ┌─────────────────────────────────────────────────────┐
                       │        CONTABO VPS (Ubuntu 24.04 + Nginx)           │
                       │                                                     │
                       │   ┌──────────────────────────────────────────────┐  │
                       │   │ DRIVEIT UNIFIED APPLICATION (Next.js 16)     │  │
                       │   │  • Public Luxury Website (driveitluxury.com) │  │
                       │   │  • CMS Admin Panel (driveitluxury.com/admin) │  │
                       │   │  • Real-time Dynamic Quote & Hold Engine     │  │
                       │   └──────────────────────┬───────────────────────┘  │
                       │                          │                          │
                       │     ┌────────────────────┼────────────────────┐     │
                       │     ▼                    ▼                    ▼     │
                       │ ┌──────────┐       ┌───────────┐       ┌──────────┐ │
                       │ │PostgreSQL│       │   Redis   │       │Scheduler │ │
                       │ │ Database │       │  Limiter  │       │Cron Sweeper│
                       │ └──────────┘       └───────────┘       └──────────┘ │
                       └──────────────────────────┬──────────────────────────┘
                                                  │
                                                  ▼
                       ┌─────────────────────────────────────────────────────┐
                       │               EXTERNAL CLOUD ENGINES                │
                       │  • Cloudinary: Fast vehicle photos & KYC CDN       │
                       │  • Brevo: Automated PDF invoices & emails          │
                       │  • Zoho Mail: 5 free business email inboxes         │
                       │  • WhatsApp / Telegram: Instant concierge alerts   │
                       └─────────────────────────────────────────────────────┘
```

### Why This Architecture Wins for Your Business:
1. **Zero Double-Bookings (Advisory Locks):** If two customers try to book the Mercedes Maybach for the exact same wedding date, Postgres uses cryptographic transactional locks. Customer A gets a 10-minute hold; Customer B is immediately informed the vehicle is locked.
2. **Sub-Second Speed:** Built on Next.js 16 with instant page transitions and Cloudinary CDN caching, delivering a world-class luxury brand impression.
3. **No Revenue Leaks:** You do not pay commissions or platform fees to aggregators. You own 100% of your data, customer vault, and transactions.

---

## 2. The End-to-End Customer Reservation Journey

Here is what happens behind the scenes from the moment a VIP visitor arrives on your website:

```
[ Step 1: Browse & Filter ]
Customer selects passengers (4 vs 7), occasion (Wedding/Corporate), and vehicle (e.g. Fortuner / BMW).
         ▼
[ Step 2: Instant Quote & Date Selection ]
Custom obsidian date picker calculates exact duration. Base rate + add-on bundles (Photographer/VIP decor) are computed.
         ▼
[ Step 3: Temporary 10-Minute Hold (Concurrency Lock) ]
Customer clicks "Proceed to Checkout". The system places a 10-minute cryptographic hold on that vehicle in the database.
Nobody else on earth can book that car for those dates while the timer is running.
         ▼
[ Step 4: Verification & Payment Choice ]
Customer enters name, phone, email, and pickup address. They choose:
  Option A: UPI Scan & Pay (Instant QR code generated with exact amount).
  Option B: Pay at Pickup (Zero upfront, confirmed on arrival).
         ▼
[ Step 5: Instant Concierge Dispatch ]
• The hold converts to a confirmed reservation.
• Customer immediately receives an automated obsidian-gold email with an official PDF tax invoice attached.
• Your concierge WhatsApp & Telegram bot ping with the client itinerary, flight number, and contact info.
• Booking shows in the customer's personal dashboard (`/dashboard/bookings`).
         ▼
[ Step 6: Trip Delivery & Security Deposit Cycle ]
• 24 hours prior: Customer receives pickup reminder email.
• Driver arrives on time (or monitors flight delay at airport).
• 2 hours before return: Customer receives return reminder email with 1-tap WhatsApp extension option.
• Post-inspection: Admin issues refundable deposit via UPI/IMPS and records bank UTR. Customer tracks this live in their dashboard.
```

---

## 3. Complete Platform Feature Directory

Your platform comes fully loaded with enterprise-grade features out of the box:

### A. Customer Experience & Booking Interface
- **Obsidian-Gold Luxury Design:** Polished `#050505` asphalt background with `#d4af37` gold trim and glassmorphism cards.
- **Smart Passenger & Vehicle Workflow:** Selecting `4 Passengers` strictly shows 4/5-seaters (hiding 7-seaters). Selecting `7 Passengers` filters to luxury 7-seaters. Selecting `Toyota Fortuner` automatically locks passenger count to `7`.
- **Dynamic Occasion Filtering:** One-click filtering for Weddings, Corporate delegations, Airport transfers, Weekend getaways, and Self-drive tours.
- **Obsidian Date Picker:** Custom glassmorphic calendar popover replacing native OS blue pickers.
- **Luxury Dropdown Selectors:** Replaces standard OS blue highlight dropdowns with custom gold-accented floating menus.
- **Experience Packages & Bundles:**
  - *Wedding Package (+₹15,000):* Premium floral decoration + dedicated photographer + 50km complimentary buffer.
  - *Family Trip Package (+₹3,000):* Sanitized ISOFIX child seat + extra verified co-driver.
  - *VIP Arrival Package (+₹10,000):* Red carpet meet & greet + chilled champagne.
- **Clear Form Guidance & Zero Browser Alerts:** All old blocking `alert()` popups have been eradicated. Visitors receive sleek inline alert cards and required-field checklists.

### B. Security Deposit & Fleet Policies
- **Admin-Controlled Deposit:** You decide the exact deposit for every car in the fleet (e.g. ₹25,000 for self-drive Fortuner, ₹50,000 for Maybach, ₹0 for chauffeur-driven trips).
- **Transparent Fuel Policy:** Full-to-Full fuel policy displayed openly to build VIP trust.
- **Electronic FASTag Equipment:** All cars marked as FASTag-equipped for zero-wait expressway and airport toll plaza passage.
- **Live 4-Step Refund Tracker:** Customers see a transparent progress bar in their dashboard (`Deposit Held` → `Vehicle Inspected` → `Refund Initiated` → `Refunded`) with their bank UTR transaction reference.

### C. Self-Drive Customer KYC Document Vault
- **Digital License & ID Upload:** Customers upload high-resolution photos of their Driving License (Front & Back) and Aadhaar/Passport directly into their secure account vault (`/dashboard/profile`).
- **Cloudinary Security Vault:** Documents are stored in an encrypted private cloud folder (`driveit/kyc_vault/`).
- **One-Click Admin Approval:** Staff reviews the documents in the admin panel and marks them `verified` or `rejected`.
- **Corporate & GST Invoicing:** Customers can enter their Company Name and GSTIN to receive automatic GST tax invoices for corporate expense write-offs.

### D. VIP Airport Transfer & Flight Delay Guarantee
- **Flight Number & Terminal Capture:** Customers input their inbound flight number (e.g. `6E 5321` or `AI 839`) and terminal (e.g. `RGIA Shamshabad Terminal 1`).
- **Complimentary 60-Minute Delay Buffer:** Chauffeur monitors flight touchdown and waits up to 60 minutes free of charge if the flight is delayed.
- **Chauffeur Dossier Card:** Customer dashboard renders a driver card with the Chauffeur's Name, Vehicle Plate Number, Car Color, and 1-tap phone dialer.

### E. Fleet Partner Consignment Program (`/partner/list-fleet`)
- Allows high-net-worth vehicle owners in Hyderabad to list their idle luxury cars (Rolls-Royce, Mercedes, Porsche, Fortuner) into your fleet on a 70/30 revenue share.
- Captures manufacturing year, odometer reading, registration number, and owner contact details.

---

## 4. Subdomain & Wildcard SSL Reality: Do You Need to Buy Anything?

### ❓ Question 1: "Should I buy a Wildcard SSL certificate?"
> **Answer: NO! Absolutely not.**  
> You do **NOT** need to spend a single rupee or dollar on SSL certificates.  
> 1. **Public Traffic (Browsers to Cloudflare):** When you use Cloudflare's free DNS, Cloudflare automatically provisions and auto-renews a free SSL certificate covering BOTH `yourdomain.com` and all first-level subdomains (`*.yourdomain.com`).
> 2. **Origin Traffic (Cloudflare to your Contabo VPS):** Cloudflare provides a free **15-year Origin CA certificate** for `yourdomain.com` and `*.yourdomain.com`. You install this single certificate once on Nginx, and it automatically secures your main domain and all present or future subdomains for 15 years with zero maintenance.

---

### ❓ Question 2: "Does Payload CMS need its own subdomain (like `admin.yourdomain.com`)?"
> **Answer: No, it is not required, but optional.**  
> In Payload 3.0, Payload is **not** a separate app. It is compiled directly inside Next.js 16 as an internal route:  
> 👉 **Public Site:** `https://yourdomain.com`  
> 👉 **Payload Admin Panel:** `https://yourdomain.com/admin`  
> 
> Because they run together in the same container, your admin panel and frontend share the exact same database connection pool, memory cache, and session cookies. There is no need for a separate subdomain.  
> *However*, if you prefer having `admin.yourdomain.com` for executive branding, we have already added an Nginx block in [`deployment_guide.md`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/deployment_guide.md) that automatically routes `admin.yourdomain.com` to your admin panel.

---

### ❓ Question 3: "Does WhatsApp CRM (WACRM) or Twenty CRM need a subdomain?"
> **Answer: YES! A dedicated subdomain is strongly recommended.**  
> A WhatsApp CRM (or Twenty CRM) is an independent customer relationship software where your concierge sales agents chat on WhatsApp, track deals, and manage sales pipelines.  
> It runs as a separate container on your Contabo VPS (e.g. on port `3001`).  
> 
> Hosting it on a dedicated subdomain such as:  
> 👉 `https://crm.yourdomain.com` (or `https://wa.yourdomain.com`)  
> allows your sales staff to log into the CRM without mixing cookies or traffic with customer bookings.

---

### 📋 Where & How to Add Subdomains

Adding a subdomain takes less than 2 minutes using Cloudflare and Nginx:

#### Step 1: Add the DNS Record in Cloudflare Dashboard
1. Go to **Cloudflare Dashboard → DNS → Records**.
2. Click **Add record**:
   - **Type:** `A`
   - **Name:** `crm` (for `crm.yourdomain.com`) or `admin` (for `admin.yourdomain.com`)
   - **IPv4 address:** Your Contabo VPS IP address
   - **Proxy status:** 🟠 **Proxied** (Turned ON)
   - **TTL:** Auto
3. Click **Save**.

#### Step 2: Configure the Subdomain in Nginx (On VPS)
In your Nginx configuration (`sudo nano /etc/nginx/sites-available/driveit`), add the server block (already pre-written in [`deployment_guide.md`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/deployment_guide.md)):

```nginx
# Dedicated Subdomain for WhatsApp CRM / Twenty CRM
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name crm.yourdomain.com;

    # Reuses the exact same 15-year Cloudflare Wildcard Origin CA certificate!
    ssl_certificate     /etc/ssl/cloudflare/cert.pem;
    ssl_certificate_key /etc/ssl/cloudflare/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:3001; # CRM Container Port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Reload Nginx:
```bash
sudo nginx -t && sudo systemctl reload nginx
```
Done! `https://crm.yourdomain.com` is now live and fully protected by Cloudflare SSL.

---

## 5. Owner's Step-by-Step Operations Manual (How to Manage Daily)

### 5.1 Logging into the Command Center (`/admin`)
1. Open your browser and navigate to: `https://yourdomain.com/admin`.
2. Enter your master administrator credentials:
   - **Email:** `admin@yourdomain.com` (configured during deployment)
   - **Password:** Your master administrator password
3. Click **Login**. You will enter the dark obsidian Payload CMS command center.

---

### 5.2 Adding & Managing Fleet Vehicles & Pricing

#### How to Add a New Car:
1. In the left sidebar, click **Cars** → click **Create New**.
2. Fill in the vehicle profile:
   - **Vehicle Name:** e.g. `Mercedes-Maybach S-Class S680`
   - **Slug:** Auto-generated (e.g. `mercedes-maybach-s-class-s680`)
   - **Category:** Select `Super Luxury`, `Luxury SUV`, or `Premium Sedan`.
   - **Daily Rental Rate (₹):** Enter base rate per day (e.g. `75000`).
   - **Display Price Text:** e.g. `₹75,000 / day`.
   - **Seating Capacity:** Select `4 Seats`, `5 Seats`, or `7 Seats`.
   - **Transmission:** `Automatic` or `Manual`.
   - **Fuel Type:** `Petrol`, `Diesel`, `Hybrid`, or `Electric`.
   - **Security Deposit (₹):** Enter the refundable deposit for self-drive (e.g. `50000`). For chauffeur-only vehicles, enter `0`.
   - **Services Supported:** Check `Chauffeur`, `Self-Drive`, and/or `Airport Transfer`.
   - **Fuel Policy:** `Full-to-Full Fuel`.
   - **FASTag Equipped:** Check `Yes`.
   - **Cancellation Policy:** e.g. `Free cancellation up to 24 hours before pickup`.
3. **Upload Photos:**
   - Click **Media** or upload directly from your device. Photos are automatically optimized and served via Cloudinary CDN.
4. Click **Publish**.  
   *Result:* The new car appears instantly on the website, homepage carousel, and search feeds.

#### How to Temporarily Block a Car (Maintenance / Private Use):
- Open the car in CMS → Toggle **Status** from `Active` to `Inactive` (or change availability) → Click **Save**. The car will immediately disappear from the public catalog.

---

### 5.3 Verifying Payments & Confirming Bookings

When a customer makes a reservation, it shows in the **Bookings** collection:

1. Click **Bookings** in the left menu.
2. Click the latest booking (e.g. `DRV-849201`).
3. Check the **Trip Details**:
   - Vehicle reserved, pickup date & time, duration, pickup address, flight number.
4. Check **Payment Information**:
   - If payment method is **UPI**: Check the customer's submitted `paymentReference` (UPI Transaction ID / UTR). Verify this UTR in your bank or merchant app (PhonePe Business, Google Pay Business, or HDFC/ICICI).
   - Once verified, change **Payment Status** from `awaiting_verification` to **`verified`**.
   - Change **Booking Status** to **`confirmed`**.
5. Click **Save**.  
   *Result:* The system automatically triggers the `payment-verified.ts` luxury receipt email with the updated balance to the customer, and notifies them on their dashboard!

---

### 5.4 Customer Self-Drive KYC Document Verification

Before handing over a vehicle for self-drive, verify the driver's license:

1. In the CMS sidebar, click **Customers**.
2. Open the customer's record.
3. Scroll down to **Identity & Self-Drive KYC Vault**:
   - Inspect **Driving License Front** & **Driving License Back** photos.
   - Verify the license expiry date and name against the booking.
   - Inspect the **Aadhaar / ID Proof** document.
4. Set **KYC Status**:
   - Change from `pending` to **`verified`** (or `rejected` with notes if invalid).
5. Click **Save**.  
   *Result:* The customer's dashboard immediately updates with a green **"VIP Verified Driver"** badge.

---

### 5.5 Inspecting Returns & Processing Security Deposit Refunds

When a self-drive vehicle returns:
1. Conduct the 30-point check (fuel level, body condition, odometer km).
2. Check FASTag toll transactions incurred during the rental.
3. Open the booking in CMS under **Bookings**.
4. Scroll to **Security Deposit Management**:
   - If car is in pristine condition and fuel is full:
     - Transfer the deposit (e.g. ₹25,000) back to the customer's UPI ID / Bank Account.
     - Enter the **Refund Bank UTR** (e.g. `UTR492817492019`).
     - Set **Security Deposit Status** to **`refunded`**.
     - Set **Deposit Refunded At** to today's date.
   - If tolls or fuel need to be deducted:
     - Enter the deducted amount, refund the balance, and set status to **`deducted`**.
5. Click **Save**.  
   *Result:* The customer's live 4-step refund tracker on their dashboard instantly updates to show **"Refund Complete - UTR: UTR492817492019"**.

---

### 5.6 Updating Website Content, Phone Numbers, Logos & Videos

You never need to edit code to update your brand assets:

1. In the CMS sidebar, under **Globals**, click **Site Settings**.
2. **Contact Numbers:**
   - **Contact Phone:** Change the primary customer support phone (e.g. `+91 63000 41186`).
   - **WhatsApp Number:** Change your official WhatsApp concierge number.
   - **Contact Email:** Change support email.
   - *This updates across the site header, floating buttons, booking modals, footer, and emails instantly.*
3. **Logos & Brand Graphics:**
   - Upload new **Header Logo**, **Footer Logo**, **Favicon**, or **Apple Touch Icon**.
4. **Homepage Hero Video / Image:**
   - Update the **Hero Video URL** (direct MP4 link or YouTube embed) or upload a new high-definition hero photography banner.
5. **Stats & FAQs:**
   - Add, edit, or reorder frequently asked questions and counter stats.
6. Click **Save**.  
   *Result:* Next.js real-time cache purge (`revalidatePath`) purges the homepage, contact page, and header across all CDN edges within seconds!

---

### 5.7 Managing Coupons & Seasonal Discounts

Want to launch a 15% discount for wedding season or corporate partnerships?

1. Click **Coupons** in the CMS sidebar → click **Create New**.
2. Fill in the coupon parameters:
   - **Coupon Code:** e.g. `ROYALWEDDING` or `HYDEXPO` (uppercase).
   - **Discount Type:** Select `Percentage` (e.g. `15%`) or `Fixed Amount` (e.g. `₹5,000`).
   - **Value:** `15` (for 15%).
   - **Max Discount Cap:** e.g. `15000` (limits max discount to ₹15,000).
   - **Min Booking Value:** e.g. `30000`.
   - **Valid From & Expiry Date:** Choose promotion dates.
   - **Active:** `Yes`.
3. Click **Publish**.  
   *Result:* Customers entering `ROYALWEDDING` at checkout get real-time price discounts with emerald confirmation badges.

---

### 5.8 Reviewing Consignment Partner Applications

When luxury car owners apply to consign their vehicles (`/partner/list-fleet`):
1. In the CMS, click **Partner Applications**.
2. View the applicant's name, phone, email, vehicle model, manufacturing year, and odometer reading.
3. Call the owner to inspect the vehicle and sign the consignment agreement.

---

## 6. Automated Omnichannel Notifications (Brevo, WhatsApp & Telegram)

Your platform handles customer communications 24/7 automatically:

| Event | Channel | Template / Action | Content |
| :--- | :--- | :--- | :--- |
| **New Booking Hold** | Telegram | Concierge Bot | Pings your internal concierge group with car slug, dates, and customer phone. |
| **Checkout Confirmed** | Brevo Email | `booking-confirmed.ts` | Detailed luxury itinerary + **Generated PDF Tax Invoice** attachment. |
| **Payment Verified** | Brevo Email | `payment-verified.ts` | Official payment receipt with zero balance remaining. |
| **Payment Issue** | Brevo Email | `payment-failed.ts` | Courteous notice with 1-click update link before hold release. |
| **24h Before Pickup** | Brevo Email | `booking-reminder.ts` | Pickup checklist, chauffeur contact timeline, and vehicle inspection note. |
| **2h Before Return** | Brevo Email | `vehicle-return-reminder.ts` | Dropoff directions + 1-tap WhatsApp extension request button. |
| **Trip Completed** | Brevo Email | `trip-completed-review.ts` | Loyalty tier summary + 5-star Google review prompt. |
| **Customer Sign-Up** | Brevo Email | `account-welcome.ts` | VIP membership welcome + `WELCOME10` voucher. |
| **Direct Concierge** | WhatsApp | Deep wa.me Links | Pre-filled messages with booking reference for instant WhatsApp chat. |

---

## 7. SEO, LLMs & AI Engine Discoverability

Your platform is engineered to dominate Google Search and Generative AI engines (ChatGPT, Perplexity, Gemini):

1. **Dynamic XML Sitemap (`/sitemap.xml`):** Synthesizes all vehicle detail pages, luxury service routes, and blog articles dynamically. Automatically re-indexed upon CMS edits.
2. **Generative AI Whitelist (`/robots.txt`):** Explicitly whitelists 12 modern LLM crawlers (`GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Applebot-Extended`), allowing AI assistants to recommend DRIVEIT when users ask: *"Best luxury wedding car rental in Hyderabad"*.
3. **Machine-Readable AI Catalog (`/llms.txt` & `/llms-full.txt`):** Complies with the new global [llmstxt.org](https://llmstxt.org) standard. Perplexity and ChatGPT can ingest your exact vehicle catalog, daily rates, security deposits, and policies in structured markdown.
4. **Schema.org Rich Snippets (JSON-LD):** Implements Google LocalBusiness, Car Product, and Review structured data for gold star ratings and pricing badges directly in Google search results.

---

## 8. Summary Reference & Emergency Contact Points

### Key Access Links
- **Public Luxury Portal:** `https://driveitluxury.com`
- **CMS Admin Command Center:** `https://driveitluxury.com/admin`
- **Customer Account & KYC Vault:** `https://driveitluxury.com/dashboard`
- **Fleet Consignment Portal:** `https://driveitluxury.com/partner/list-fleet`
- **WhatsApp Concierge Hotline:** `+91 63000 41186`
- **Concierge Support Email:** `concierge@driveitluxury.com`

### Recommended Weekly Routine for the Owner / Operations Lead:
1. **Monday Morning:** Open `/admin` → Check **Bookings** for the week → Ensure all vehicles scheduled for dispatch have completed maintenance checks.
2. **Daily:** Check **Customers** KYC submissions → Verify submitted licenses so customers don't experience pickup delays.
3. **Post-Trip:** Verify return inspections → Process security deposit refunds and input bank UTRs within 24–48 hours to maintain your 5-star reputation.
4. **Bi-Weekly:** Check **Partner Applications** to scout new high-end consignment vehicles for the fleet.

---
*DRIVEIT Luxury System Architecture & Operations Manual — Authored for Maximum Reliability, Zero Double-Bookings & High Margins.*
