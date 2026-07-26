# 🚗 DriveIt: Luxury Concierge & Fleet Management System

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Payload CMS](https://img.shields.io/badge/Payload_CMS-3.0-white?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

DriveIt is a fully-featured, ultra-premium web application for luxury car rentals and concierge services. It features a stunning, highly animated frontend built with Next.js App Router and a powerful, deeply integrated headless backend powered by Payload CMS 3.0.

---

## ✨ Premium Features

### 🏢 Customer Experience (Frontend)
- **Ultra-Luxury UI/UX**: Dark-mode primary design with glassmorphism, Framer Motion animations, and beautiful typography.
- **Dynamic Secure Checkout**: Real-time QR Code payment integration with a completely frictionless UI.
- **Concurrency Locks**: "Movie-ticket style" checkout locks. When a customer initiates a checkout, the vehicle is temporarily reserved for 10 minutes to prevent double-booking.
- **Automated PDF Invoices**: Upon booking confirmation, a professionally branded PDF invoice is instantly generated and emailed to the customer.
- **Smart Loyalty Coupons**: Built-in promotional engine. The system automatically tracks a user's booking history and emails them a VIP discount code after hitting booking milestones.
- **WhatsApp Concierge**: Integrated Meta Graph API sends automated WhatsApp confirmations to clients for that ultra-premium touch.

### 🛡️ Fleet Management (Backend - Payload CMS)
- **Deep Content Management**: Manage Cars, Services, Testimonials, Blogs, and Bookings entirely from an intuitive admin panel (`/admin`).
- **Global Settings**: Update Site Branding (Logos), Contact Numbers, and Social Links dynamically without touching code.
- **Local SQLite Database**: Blazing fast, portable, and easy to back up.
- **Access Control**: Fully configured role-based access for Admins and regular users.

---

## 🛠️ Technology Stack

- **Framework**: Next.js (App Router, Turbopack)
- **CMS / Backend**: Payload CMS (v3)
- **Database**: SQLite (via Drizzle ORM)
- **Styling**: Tailwind CSS, Radix UI, Framer Motion
- **Emails**: Resend / Nodemailer
- **PDF Generation**: `@react-pdf/renderer`
- **Icons**: Lucide React & React Icons

---

## 🚀 Getting Started Locally

### 1. Clone & Install
```bash
git clone https://github.com/your-username/driveit.git
cd driveit
npm install --legacy-peer-deps
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
# Payload Secret (Generate a secure random string for production)
PAYLOAD_SECRET=your_secure_random_string

# SQLite Database Location
DATABASE_URI=file:./driveit.db

# Resend API for automated emails and PDF Invoices (Optional)
RESEND_API_KEY=re_your_api_key

# WhatsApp Meta API for concierge notifications (Optional)
WHATSAPP_TOKEN=EAALyour_meta_token
WHATSAPP_PHONE_ID=your_phone_id
```

### 3. Run the Development Server
```bash
npm run dev
```
- Open [http://localhost:3000](http://localhost:3000) for the main website.
- Open [http://localhost:3000/admin](http://localhost:3000/admin) to manage your fleet and bookings.

*(Note: On the first run, Payload will automatically initialize your SQLite database (`driveit.db`) based on the defined collections).*

---

## 🐳 VPS Deployment (Docker)

DriveIt includes a production-ready `Dockerfile` optimized for VPS deployments (like DigitalOcean, Hetzner, or AWS EC2).

### Building and Running with Docker

1. **Build the image**:
```bash
docker build -t driveit-app .
```

2. **Run the container (with a persistent volume for the database)**:
```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -e DATABASE_URI=file:/app/data/driveit.db \
  -e PAYLOAD_SECRET=your_secure_secret \
  -e RESEND_API_KEY=re_your_api_key \
  --name driveit-container \
  driveit-app
```

> **Important for SQLite**: By mounting the volume `-v $(pwd)/data:/app/data` and setting the `DATABASE_URI`, your database will persist even if the container is stopped, updated, or restarted.

### Using Docker Compose (Recommended)
For easier management, you can create a `docker-compose.yml`:
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
    environment:
      - DATABASE_URI=file:/app/data/driveit.db
      - PAYLOAD_SECRET=your_production_secret
      - RESEND_API_KEY=your_resend_key
    restart: unless-stopped
```
Then simply run: `docker-compose up -d`

---

## 📝 License
This project is licensed under the MIT License.
