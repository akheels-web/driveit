# 🚗 DRIVEIT Luxury Car Rental & Charter Services

DRIVEIT is a premium, state-of-the-art web application for luxury vehicle rentals, yacht charters, wedding car rentals, corporate travel services, and private jet chartering. Built using modern web practices and optimized for the ultimate premium customer experience.

---

## ✨ Features

- **🏆 Exquisite & Premium UI/UX:** A stunning interface featuring glassmorphic designs, harmonious gold-and-dark color palettes, custom animations, custom Google typography, and flawless responsiveness.
- **🚗 Smart Dynamic Vehicle Search & Filter:** A state-of-the-art booking engine with passenger-to-vehicle seating capacity logic and real-time availability filters.
- **💳 Direct UPI Payment Integration:** Seamless payment flow with integrated QR code generation and direct UPI deep linking for instant verification.
- **📱 Real-time Notifications:** 
  - **WhatsApp Integration:** Hooks into **WaCRM** for instant CRM updates and transactional messages.
  - **Telegram Bot Notifications:** Instant booking details dispatched directly to administrator Telegram channels.
- **🗄️ Backend powered by Supabase:** Multi-factor authentication, secure user profiles, booking management, and database migrations.
- **📰 Elegant Blog Engine:** Dynamic SEO-optimized blog section for luxury travel tips, news, and features.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Server Components)
- **Styling:** Tailwind CSS v4, PostCSS, Glassmorphism design tokens
- **Animations:** Motion (Framer Motion), CSS transitions
- **Database & Auth:** Supabase (PostgreSQL, Client & Server helpers)
- **Components:** Radix UI primitives, Lucide Icons
- **Forms & Validation:** React Hook Form, Zod
- **Carousel & Media:** Embla Carousel, Next.js Image optimization

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have the following installed:
- Node.js (v18.x or later)
- npm or yarn

### 📥 Installation

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
   Copy the example environment file and fill in your keys (Supabase keys, Telegram credentials, UPI IDs, etc.):
   ```bash
   cp .env.local.example .env.local
   ```

4. **Initialize Supabase Database:**
   Run the migration SQL files found in `supabase/migrations/001_schema.sql` on your Supabase Database SQL Editor.

### 💻 Running Locally

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📦 Project Structure

```text
├── app/                  # Next.js App Router (pages & API endpoints)
│   ├── api/              # API Webhooks & Routes
│   ├── auth/             # Authentication callbacks
│   ├── blog/             # Blog page & dynamic slug page
│   ├── cars/             # Car listing & detail booking pages
│   ├── checkout/         # Payment checkout page
│   ├── dashboard/        # Customer dashboards (bookings, profile)
│   └── services/         # Specialized services (luxury, corporate, jet, yacht, etc.)
├── components/           # Reusable UI component library
│   ├── booking-section.tsx # Dynamic booking search component
│   ├── upi-payment.tsx     # Direct UPI payment component
│   └── ...               # Premium design system components
├── hooks/                # Custom React Hooks
├── lib/                  # Shared utilities (Supabase, helper functions, types)
├── public/               # Static assets & public images
├── supabase/             # DB Migrations & Schemas
└── package.json          # Node dependencies & run scripts
```

---

## 📄 License

This project is proprietary and confidential. All rights reserved.
