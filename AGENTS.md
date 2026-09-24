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

- **Twenty CRM (Sales & Concierge Deal Pipeline) — Phase 2 Roadmap**:
  - **Decision**: Keep Twenty CRM in the roadmap for post-launch concierge operations.
  - **Architecture**: Self-hosted on Contabo VPS via Docker Compose (~1.5 GB RAM footprint, fits comfortably within the 12 GB RAM allocation).
  - **Integration Strategy**:
    1. Run official Twenty Docker container alongside DriveIt on `driveit-net`.
    2. Sync high-value inquiries (wedding fleet bookings, corporate accounts, bespoke luxury chauffeur packages) into Twenty via GraphQL/REST API (`POST /rest/opportunities`).
    3. Concierge sales team manages the pipeline visually (Lead → Discovery → Proposal Sent → Contract Won) while DriveIt continues to handle automated payments, vehicle hold locks, and customer dashboard access.

## 4. Deployment Architecture & Fresher Runbook
- **Unified Full-Stack Deployment**: The app runs as a single unified Next.js 16 + Payload 3 standalone container via [`docker-compose.yml`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/docker-compose.yml).
  - Do NOT attempt a split Vercel frontend / VPS backend rewrite proxy: server components in `app/(site)/dashboard/*` rely on Payload's Local API (`getPayload()`), which requires direct database access and shared secrets (`PAYLOAD_SECRET`, `DATABASE_URI`).
- **Critical Mandatory Variables**:
  - `CRON_SECRET`: Required by the `scheduler` service in Docker compose. Without this set, compose crashes on boot.
  - `PAYLOAD_SECRET` & `AUTH_SECRET`: Hard requirement; app refuses to boot without them.
  - `CLOUDINARY_*`: Automatically routes CMS uploads and fleet media to Cloudinary CDN.
- **Detailed Step-by-Step Guide**: [`deployment_guide.md`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/deployment_guide.md) contains end-to-end instructions written for junior developers (freshers) on Contabo VPS (6 vCPU / 12 GB RAM) and Cloudflare DNS, including Cloudflare 15-year Origin CA SSL, Zoho Mail (5 free users), Brevo (transactional + marketing), Cloudinary CDN, Google OAuth 2.0, Nginx, smoke tests, and an 8-issue troubleshooting guide.

## 5. Brevo Transactional Email & Notifications Architecture
- **Client**: [`lib/brevo.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/lib/brevo.ts) communicates via Brevo REST API (`POST https://api.brevo.com/v3/smtp/email`) and contacts API (`POST https://api.brevo.com/v3/contacts`). Fails soft (logs warning, never crashes checkout or background tasks if `BREVO_API_KEY` is unset).
- **Templates**: [`lib/email-templates/`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/lib/email-templates/) contains 8 mobile-responsive obsidian-gold luxury email templates:
  1. `booking-confirmed.ts`: Sent on checkout confirmation with vehicle itinerary, dynamic pricing, and attached PDF invoice (`generateInvoicePDFBuffer`).
  2. `payment-verified.ts`: Sent when staff marks `paymentStatus: 'verified'` in Payload CMS.
  3. `payment-failed.ts`: Sent when staff marks payment failed or invalid reference, providing a 1-click update link.
  4. `booking-reminder.ts`: Sent 24 hours before pickup with inspection status, documents checklist, and chauffeur timeline.
  5. `vehicle-return-reminder.ts`: Sent 2 hours before scheduled dropoff with return instructions and 1-tap WhatsApp extension request.
  6. `booking-cancelled.ts`: Sent when booking status becomes `cancelled` with refund terms and re-book offer.
  7. `account-welcome.ts`: Sent when a customer creates an account / signs in with Google, with onboarding voucher `WELCOME10`.
  8. `trip-completed-review.ts`: Sent when booking status becomes `completed`, summarizing loyalty points earned and prompting for a 5-star Google review.
- **Hooks & Automations**:
  - `collections/Bookings.ts`: Attached `stampBookingEmailGuards` (`beforeChange`) and `onBookingEmailNotifications` (`afterChange` in [`lib/booking-email-hooks.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/lib/booking-email-hooks.ts)).
  - `lib/customers.ts`: `upsertCustomer` automatically dispatches `sendAccountWelcomeNotification` on first account creation.
  - `app/api/checkout/confirm/route.ts`: Dispatches `sendBookingConfirmedNotification` with base64 PDF attachment.
  - `app/api/cron/reminders/route.ts`: Protected endpoint called via `x-cron-secret` to scan and send 24h pickup and 2h return reminders.

## 6. Performance & Search Optimizations (Next.js 16 + Postgres)
- **Non-blocking Checkout with Next.js `after()`**: [`app/api/checkout/confirm/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/checkout/confirm/route.ts) wraps Brevo emails, WhatsApp alerts, Telegram concierge alerts, and `revalidatePath` inside `after()`. Checkout returns `<50ms` JSON immediately to the customer while notifications complete in the background.
- **Intelligent Fleet Search Endpoint**: [`app/api/fleet/search/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/fleet/search/route.ts) provides multi-token matching, occasion/vibe intent parsing (e.g., "wedding", "corporate", "airport transfer", "family"), and price/seat filters, returning ranked results with match metadata. Ready for `pgvector` embedding extensions.

## 7. Unified Concierge & Customer Contact
- **Primary Support Mobile / Voice**: `+91 63000 41186` (tel link: `tel:+916300041186`).
- **Official WhatsApp Concierge**: `+916300041186` (wa.me link: `https://wa.me/916300041186`).
- **Standardized Everywhere**:
  - `globals/SiteSettings.ts` default values (`contactPhone`, `whatsappNumber`).
  - `lib/content-seed.ts` (`SITE_DEFAULTS.contactPhone`, `SITE_DEFAULTS.whatsappNumber`, FAQ).
  - All 8 transactional email templates in `lib/email-templates/`.
  - Floating CTA buttons (`components/Sidectabtn.tsx`), booking modal, booking estimate forms, and car cards.
  - All public site pages, footer, service pages, and invoice preview.

## 8. Dark Theme, Navigation, Pagination & Mobile UX Architecture
- **Root Dark Tokens**:
  - `app/globals.css` declares obsidian luxury tokens (`#050505` background, `#0d0d0d` cards/popovers, `#d4af37` gold accents) in both `:root` and `.dark`.
  - `app/(site)/layout.tsx` enforces `className="dark"` on `<html>` so all Radix UI portals, sheets, and popovers inherit the dark theme.
  - Form controls globally enforce `color-scheme: dark;` with custom `select option` dark styling (`#121214`), `-webkit-autofill` dark background preservation, and `calendar-picker-indicator` invert filter.
- **Navigation & Mobile Drawer**:
  - `components/site-header.tsx`:
    - Auto-dismisses mobile drawer on route changes via `usePathname()`.
    - Mobile service sub-links properly close both drawer and accordion on tap.
    - Active link state highlighting on desktop and mobile.
    - Mobile drawer constrained with `max-h-[calc(100dvh-5rem)] overflow-y-auto` to prevent offscreen clipping on small devices.
    - All touch targets adhere to a minimum of 44px (`min-h-[44px]`).
- **Fleet Catalog & Carousel Pagination**:
  - `components/fleet-carousel.tsx`:
    - Fixed negative padding calculation glitch with `pl-4 md:pl-[max(1rem,calc((100vw-80rem)/2+1rem))]`.
    - Added scroll listener tracking `activeIndex` and rendered responsive gold pagination dots with slide index display.
  - `app/(site)/cars/page.tsx`:
    - Implemented client-side pagination (9 vehicles per page) with auto-scroll back to catalog top on page switch.
    - Reset to page 1 automatically when category, service filter, search query, or sort order changes.
    - Integrated `components/ui/pagination.tsx` with gold luxury active styling and accessible touch targets.
- **Modal & Floating CTA Layering**:
  - `components/compare-modal.tsx`: Backdrop and container elevated to `z-[100]` to avoid clipping beneath the `z-[60]` sticky header.
  - `components/Sidectabtn.tsx`: Elevated with responsive positioning (`right-4 bottom-4 sm:right-6 sm:bottom-6`) and 48px touch targets.
- **Luxury Custom Select Dropdowns**:
  - Replaced browser-native `<select>` with [`components/luxury-select.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/luxury-select.tsx) in [`components/booking-section.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/booking-section.tsx).
  - Eliminates the OS/Windows default blue highlight box (`#0066cc`) on options, replacing it with obsidian glass surfaces (`#0c0c0e`), 1px gold border (`var(--gold-400)`), rich gold hover background (`hover:bg-[var(--gold-400)]/15 hover:text-[var(--gold-400)]`), gold selected state with checkmark, and React Portal rendering.
  - Global CSS updated in [`app/globals.css`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/globals.css) and [`components/ui/select.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/ui/select.tsx) to enforce gold accents across all dropdown implementations.
