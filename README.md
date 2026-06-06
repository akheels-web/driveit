# 🚗 DRIVEIT Luxury Car Rental & Charter Services

DRIVEIT is a premium, state-of-the-art web application for luxury vehicle rentals, yacht charters, wedding car rentals, corporate travel services, and private jet chartering. Built using modern web practices and optimized for the ultimate premium customer experience.

---

## ✨ Features

- **🏆 Exquisite & Premium UI/UX:** A stunning interface featuring glassmorphic designs, harmonious gold-and-dark color palettes, custom animations, custom Google typography, and flawless responsiveness.
- **🚗 Smart Dynamic Vehicle Search & Filter:** A state-of-the-art booking engine with passenger-to-vehicle seating capacity logic and real-time availability filters.
- **💍 Premium Wedding Configurator:** Multi-step wizard to configure high-end wedding fleets (Primary Car, Escort Cars, Chauffeur Attire, Floral Themes).
- **💼 Growth & Retention Engine:**
  - **Loyalty & Membership:** Tiered reward system (Silver, Gold, Platinum) with dynamic dashboard cards and automatic point calculations (100 points per ₹10,000 spent).
  - **Personalized Social Proof:** Intelligent user-specific tracking ("You've booked this car X times") to drive engagement.
  - **Add-on Bundles:** Curated high-value packages (e.g., VIP Arrival, Family Trip, Wedding Package) that streamline checkout and boost AOV.
  - **Saved Fleet (Wishlists):** Direct one-click bookmarking of vehicles to the user's dashboard.
  - **Saved Addresses:** Autocompletes Saved Home, Office, and Airport locations in checkout for logged-in users.
- **📱 Real-time & Asynchronous Notifications:** 
  - **Unified Notification Engine:** Concurrently dispatches Email, SMS, and WhatsApp alerts with error boundary handling.
  - **WhatsApp Deep Linking:** Generates tailored WhatsApp booking tickets featuring a 1-click "Quick Re-book" deep link.
  - **Telegram Bot Integration:** Dispatches instant reservation summaries to admin channels for real-time order tracking.
- **🧾 Instant Invoice Generation:** Direct browser-to-print, elegantly formatted HTML invoices for finalized bookings.
- **💳 Direct UPI Payment Integration:** Seamless payment flow featuring dynamic QR code generation and direct UPI deep linking for instant verification.
- **🗄️ Backend powered by Supabase:** Secure user profiles, real-time database queries, and secure row-level policies.
- **📰 Elegant Blog Engine:** Dynamic SEO-optimized blog section for luxury travel tips, news, and features.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Server Components)
- **Styling:** Tailwind CSS v4, PostCSS, Glassmorphism design system
- **Animations:** Motion (Framer Motion), CSS transitions
- **Database & Auth:** Supabase (PostgreSQL, Client & Server SDK helpers)
- **Components:** Radix UI primitives, Lucide Icons
- **Forms & Validation:** React Hook Form, Zod

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have the following installed:
- Node.js (v18.x or later)
- npm or yarn

### 📥 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/akheels-web/driveit.git
   cd driveit
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```
   Open `.env.local` and configure the following parameters:

   | Variable | Description |
   | :--- | :--- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key (for secure server operations) |
   | `NEXT_PUBLIC_UPI_ID` | The business UPI ID for booking payments |
   | `NEXT_PUBLIC_UPI_NAME` | Display name for UPI transaction (e.g. DRIVEIT Luxury) |
   | `WACRM_WEBHOOK_URL` | WhatsApp CRM endpoint URL |
   | `WACRM_WEBHOOK_SECRET` | Secret key to verify webhook authorization |
   | `TELEGRAM_BOT_TOKEN` | Token for the admin notification Telegram bot |
   | `TELEGRAM_CHAT_ID` | Telegram chat/channel ID for bot alerts |
   | `NEXT_PUBLIC_SITE_URL` | Base site URL (e.g. `http://localhost:3000` locally) |

4. **Initialize Supabase Database Schemas:**
   Run the SQL scripts in your Supabase SQL Editor in the following order:
   - **Step 1: Core Database Schema**
     Execute the raw SQL code in `supabase/migrations/001_schema.sql` to set up initial tables (bookings, cars, services, reviews).
   - **Step 2: Phase 2 Growth Engine Setup**
     Execute the raw SQL code in [supabase_migrations.md](supabase_migrations.md) to set up profiles, user creation triggers, and user wishlists.

### 💻 Running Locally

Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📦 Project Structure

```text
├── app/                  # Next.js App Router (pages & API endpoints)
│   ├── api/              # API Webhooks & Routes (e.g. wishlist/notification endpoints)
│   ├── auth/             # Authentication callbacks
│   ├── blog/             # Blog page & dynamic slug page
│   ├── cars/             # Car listing & detail booking pages
│   ├── checkout/         # Payment checkout page
│   ├── dashboard/        # Customer dashboards (bookings, profile, wishlist)
│   └── services/         # Specialized services (luxury, corporate, wedding configurator)
├── components/           # Reusable UI component library
│   ├── booking-section.tsx # Dynamic booking search component
│   ├── upi-payment.tsx     # Direct UPI payment component
│   └── ...               # Premium design system components
├── hooks/                # Custom React Hooks
├── lib/                  # Shared utilities (Supabase, notification service, actions)
├── public/               # Static assets & public images
├── supabase/             # DB Migrations & Schemas
└── package.json          # Node dependencies & run scripts
```

---

## 📄 License

This project is proprietary and confidential. All rights reserved.
