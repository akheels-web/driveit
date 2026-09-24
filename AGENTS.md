# DRIVEIT Luxury — Project Memory & Architecture Decisions

## 1. Media & Storage (Cloudinary)
- Cloudinary adapter is implemented in [`lib/cloudinary.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/lib/cloudinary.ts).
- Integrated with Payload CMS via `@payloadcms/plugin-cloud-storage` in [`payload.config.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/payload.config.ts).
- Enabled dynamically when `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are provided; falls back to local disk (`public/media`) when absent.
- `next.config.mjs` allows `res.cloudinary.com` remote patterns.
- Automated media tests exist in [`scripts/media-check.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/scripts/media-check.ts).
- Batch asset uploader: [`scripts/upload-fleet-cloudinary.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/scripts/upload-fleet-cloudinary.ts) (`npm run upload:fleet:cloudinary`) uploads static fleet assets from `public/` into Cloudinary under `driveit/fleet/` and generates `cloudinary-fleet-map.json`.

## 2. Booking Engine Architecture
- **Checkout Flow**: [`app/(site)/checkout/checkout-client.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/checkout/checkout-client.tsx).
- **Hold & Concurrency**:
  - [`app/api/checkout/init/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/checkout/init/route.ts) validates dates, queries car price from CMS, and calls [`createBookingHold()`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/lib/booking-holds.ts).
  - Uses Postgres transactional advisory locks (`pg_advisory_xact_lock`) keyed on car slug hash to eliminate race conditions.
  - Issues a 10-minute hold with a crypto-random `holdToken`.
- **Payment & Confirmation**:
  - [`app/api/checkout/confirm/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/checkout/confirm/route.ts) confirms the hold using constant-time token comparison.
  - Redeems coupon atomically.
  - Triggers invoice PDF, Resend email, WhatsApp notification, and Telegram concierge alert.
  - Stale hold cleanup cron: [`app/api/cron/expire-holds/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/cron/expire-holds/route.ts).
- **Booking Flow Unification (Fixed)**:
  - [`components/service-fleet-showcase.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/service-fleet-showcase.tsx) and [`components/car-card.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/car-card.tsx) now redirect directly to the unified `/checkout?carId=...` flow with promo codes, real-time quote calculation, and hold protection.
  - [`components/car-booking-modal.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/car-booking-modal.tsx) was fixed so "Pay at Pickup" confirms the booking on the backend (`updatePaymentStatus`), preventing the 10-minute hold sweep from cancelling it.

## 3. Cashfree Payments Integration — Phase 2 Roadmap
- Currently, checkout uses manual UPI reference input with status `awaiting_verification`.
- Cashfree is scheduled for Phase 2 implementation before production launch.
- **Phase 2 Implementation Plan**:
  1. **Dependencies & Env**:
     - Install `@cashfreepayments/cashfree-js`.
     - Configure `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_API_VERSION="2023-08-01"`, `CASHFREE_ENVIRONMENT="SANDBOX"` in `.env.local`.
  2. **Order Creation (`POST /api/payments/cashfree/create-order`)**:
     - Call Cashfree `POST https://sandbox.cashfree.com/pg/orders` using customer details, amount from hold, and booking ID as reference.
     - Store `cf_order_id` on the booking.
     - Return `payment_session_id` to client.
  3. **Checkout Modal**:
     - Mount Cashfree SDK via `load({ mode: 'sandbox' })` in [`checkout-client.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/checkout/checkout-client.tsx).
     - Call `cashfree.checkout({ paymentSessionId, redirectTarget: '_modal' })`.
  4. **Webhook Verification (`POST /api/webhooks/cashfree`)**:
     - Verify signature via `x-webhook-signature` & `x-webhook-timestamp` using HMAC-SHA256 with `CASHFREE_SECRET_KEY`.
     - On `PAYMENT_SUCCESS_WEBHOOK`, mark booking `status: 'confirmed'`, `paymentStatus: 'verified'`, and send confirmation invoice PDF + WhatsApp/Email.
  5. **Return Verification (`/checkout/verify`)**:
     - Query Cashfree `GET /pg/orders/{order_id}` as fallback to display instant confirmation to the returning user.
