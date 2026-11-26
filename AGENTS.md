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
- **CMS Dual Driver Pricing (With Driver vs Without Driver)**:
  - Added `selfDrivePricePerDay` field to [`collections/Cars.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/collections/Cars.ts) alongside `pricePerDay` (`Chauffeur Price Per Day (With Driver)`).
  - Both rates are completely manageable by admins in Payload CMS per vehicle.
  - Auto-fallback to 85% of with-driver rate if self-drive price is omitted.
  - Fully integrated in [`components/booking-section.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/booking-section.tsx): vehicle selector and service type selector dynamically display rates matching the selected option, showing exact savings and active rate badges.
  - Backend checkout engine ([`app/api/checkout/init/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/checkout/init/route.ts)) and [`app/(site)/cars/[slug]/booking-widget.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/cars/[slug]/booking-widget.tsx) recompute pricing based on `serviceType` (`selfdrive` vs `chauffeur`).
  - Migration applied: `migrations/20260925_092926_add_self_drive_price.ts`.

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

- **Google Maps Location Search & Interactive Pin Picker — Phase 2 Roadmap**:
  - **Decision**: Keep Google Places Autocomplete and Interactive Map Pin Picker in the Phase 2 roadmap to tackle after initial production launch.
  - **Planned Features**:
    1. **Google Places Autocomplete**: Real-time POI search (e.g., "Karachi Bakery Banjara Hills", "Taj Falaknuma", "Novotel HICC") using session tokens to optimize API usage.
    2. **Interactive Map Pin Picker**: Modal with obsidian-gold dark map styling (`#050505` asphalt, `#d4af37` gold pin/route markers). Users can drag a pointer on the map to pinpoint exact pickup/drop-off spots with reverse geocoding into exact street addresses.
    3. **Cost Architecture**: Uses Google Maps Platform's recurring **$200 USD (~₹16,500 INR) free monthly credit**, providing ~11,700 search sessions and ~28,500 dynamic map loads each month at zero cost ($0). A budget alert and quota limit in Google Cloud Console ensures zero unexpected charges.
    4. **Integration Targets**: Replace preset zones in [`components/booking-section.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/booking-section.tsx), [`components/car-booking-modal.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/car-booking-modal.tsx), and upgrade [`components/location-search-input.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/location-search-input.tsx).

- **NocoDB Staff Operations, Dispatch Calendar & KYC Vault**:
  - **Decision**: Deployed NocoDB as the dedicated open-source operations backoffice for staff, eliminating the need for heavy ERPs (Ever Gauzy) or dual-database sync scripts.
  - **Architecture**:
    - Container `driveit-nocodb` (`nocodb/nocodb:latest`) running on internal port 8080 (`127.0.0.1:8080:8080`), footprint ~200 MB RAM.
    - Metadata isolated in separate Postgres database `nocodb` (`NC_DB=pg://postgres:5432?...&d=nocodb`).
    - Connects directly to production `driveit` database as an external PostgreSQL data source on the `driveit-net` network (`host: postgres, port: 5432, db: driveit`).
    - Nginx reverse-proxies `ops.driveitluxury.in` with Cloudflare Wildcard Origin CA SSL (`*.driveitluxury.in`).
  - **Core Staff Workflows**:
    1. **Visual Fleet Booking Calendar**: Timeline view of all bookings to spot overlapping reservations and vehicle return turnaround times.
    2. **Operations Dispatch Kanban**: Real-time board tracking booking statuses (`hold` -> `confirmed` -> `driver_assigned` -> `completed`).
    3. **Customer KYC Verification**: Grid view of pending customers with direct Cloudinary DL/Aadhaar document preview and 1-tap verification.
    4. **Security Deposit Refund Tracker**: Dedicated view for completed bookings to track held deposits, enter bank UTR numbers, and log refund timestamps.


## 4. Deployment Architecture & Fresher Runbook
- **Unified Full-Stack Deployment**: The app runs as a single unified Next.js 16 + Payload 3 standalone container via [`docker-compose.yml`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/docker-compose.yml).
  - Do NOT attempt a split Vercel frontend / VPS backend rewrite proxy: server components in `app/(site)/dashboard/*` rely on Payload's Local API (`getPayload()`), which requires direct database access and shared secrets (`PAYLOAD_SECRET`, `DATABASE_URI`).
- **Critical Mandatory Variables**:
  - `CRON_SECRET`: Required by the `scheduler` service in Docker compose. Without this set, compose crashes on boot.
  - `PAYLOAD_SECRET` & `AUTH_SECRET`: Hard requirement; app refuses to boot without them.
  - `CLOUDINARY_*`: Automatically routes CMS uploads and fleet media to Cloudinary CDN.
- **Detailed Step-by-Step Guide**: [`deployment_guide.md`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/deployment_guide.md) contains end-to-end instructions written for junior developers (freshers) on Contabo VPS (6 vCPU / 12 GB RAM) and Cloudflare DNS, including Cloudflare 15-year Origin CA SSL, Zoho Mail (5 free users), Brevo (transactional + marketing), Cloudinary CDN, Google OAuth 2.0, Nginx, smoke tests, and an 8-issue troubleshooting guide.
- **Admin, Dashboard & WACRM Setup Guide**: Step 7 (Section 9) in [`deployment_guide.md`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/deployment_guide.md#9-step-7-seeding-initial-data--managing-administrators-cms-dashboard--wacrm) details CLI vs UI admin creation (`npm run create:admin`), role permissions (`admin` vs `editor`), customer dashboard vs CMS separation, and WhatsApp CRM (WACRM) agent onboarding & webhook bridge configuration.
- **Automated VPS Maintenance & 2-Day Log Rotation Policy**:
  - Global Docker daemon log caps in `/etc/docker/daemon.json` (`max-size: 10m`, `max-file: 2` — max 20MB per container).
  - Systemd Journal bounded to 50MB and 2-day retention in `/etc/systemd/journald.conf.d/retention.conf` (`SystemMaxUse=50M`, `MaxRetentionSec=2day`).
  - Nginx logrotate configured to daily with `rotate 2` in `/etc/logrotate.d/nginx`.
  - Master optimizer cron job `/etc/cron.d/driveit-vps-cleaner` runs `/usr/local/bin/vps-cleaner.sh` every 12 hours (03:00 & 15:00 UTC):
    1. Vacuums systemd journals (`journalctl --vacuum-time=2d`).
    2. Truncates oversized/stale Docker container logs in `/var/lib/docker/containers/`.
    3. Purges compressed rotated logs older than 2 days in `/var/log`.
    4. Prunes Docker build cache & dangling images older than 48h (`docker builder prune -af --filter "until=48h"`).
    5. Cleans APT package cache (`apt-get clean`).
    6. Reclaims dirty kernel pagecache safely (`sync && echo 1 > /proc/sys/vm/drop_caches`).


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

## 9. Customer KYC Vault, Security Deposit Engine, Fuel/FASTag, Airport VIP & Fleet Partner Consignment
- **Customer Document Vault (Self-Drive KYC)**:
  - Added to [`collections/Customers.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/collections/Customers.ts): `kycStatus` (`unverified`, `pending`, `verified`, `rejected`), `drivingLicenseNumber`, `drivingLicenseFront`, `drivingLicenseBack`, `aadhaarLast4`, `idProofDocument`, and corporate `gstin` + `companyName`.
  - Secure upload endpoint: [`app/api/profile/documents/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/profile/documents/route.ts) saves documents to Cloudinary under `driveit/kyc_vault/` and updates customer KYC status.
  - Upgraded [`components/profile-form.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/profile-form.tsx) with interactive VIP Document Vault status banners and DL/Aadhaar file dropzones.
- **Admin-Controlled Security Deposit & Live Refund Tracker**:
  - Structured numeric field in [`collections/Cars.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/collections/Cars.ts): `securityDepositAmount` (e.g. ₹25,000 for self-drive, ₹0 for chauffeur).
  - Tracked in [`collections/Bookings.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/collections/Bookings.ts): `securityDepositAmount`, `securityDepositStatus` (`held`, `inspection_passed`, `refunded`, `deducted`), `depositRefundUtr`, `depositRefundedAt`.
  - Live 4-step progress tracker rendered in [`app/(site)/dashboard/bookings/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/dashboard/bookings/page.tsx) with verified bank UTR display.
- **User-Managed Fuel & Electronic FASTag Policies**:
  - `fuelPolicy` ("Full-to-Full Fuel") and `fastTagEquipped` (boolean) declared in `collections/Cars.ts`, displayed transparently across [`app/(site)/cars/[slug]/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/cars/[slug]/page.tsx), [`booking-widget.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/cars/[slug]/booking-widget.tsx), [`components/booking-section.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/booking-section.tsx), and checkout summary.
- **Chauffeur Dossier Card & VIP Airport Flight Delay Guarantee**:
  - `flightNumber` and `airportTerminal` inputs integrated into booking section and checkout flow with complimentary 60-minute wait policy from flight touchdown.
  - `chauffeurDetails` group in `Bookings.ts` renders a dedicated Chauffeur Dossier card (Driver Name, Phone with 1-tap call, Vehicle plate, Car color) in the customer dashboard.
- **Luxury Fleet Consignment & Partner Program**:
  - New collection: [`collections/PartnerApplications.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/collections/PartnerApplications.ts).
  - Public submission endpoint: [`app/api/partners/apply/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/partners/apply/route.ts).
  - Landing and onboarding form: [`app/(site)/partner/list-fleet/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/partner/list-fleet/page.tsx) and [`partner-form.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/partner/list-fleet/partner-form.tsx).

## 10. Payload CMS 100% Content, Media & Branding Management
- **SiteSettings Global (`globals/SiteSettings.ts`)**:
  - **Brand Assets**: `headerLogo` (Media), `footerLogo` (Media), `favicon` (Media), `appleTouchIcon` (Media).
  - **SEO & Social**: `metaTitle`, `metaDescription`, `ogImage` (Media), `siteName`.
  - **Homepage Hero**: `headerVideoUrl` (text), `heroImage` (Media), `heroSubtitle`, `heroHeadingLine1`, `heroHeadingLine2`.
  - **Mission Section**: `missionBadge`, `missionTitle`, `missionText`, `missionImage` (Media).
  - **Top Promo Banner**: `promoBannerEnabled`, `promoBannerText`, `promoBannerCode`.
  - **Contact & Location**: `contactPhone`, `contactEmail`, `whatsappNumber`, `address`, `mapEmbedUrl`, `mapLink`.
  - **Counters & FAQs**: `stats` (array of label, value, suffix), `faqs` (array of question, answer).
  - **Social Links**: `instagramUrl`, `facebookUrl`, `youtubeUrl`, `linkedinUrl`, `twitterUrl`.
- **Dynamic Root Layout (`app/(site)/layout.tsx`)**:
  - `generateMetadata()` dynamically queries `getSiteSettings()` to provide CMS-managed `title`, `description`, `icons` (favicon, apple-touch-icon, shortcut), and OpenGraph / Twitter cards.
  - `RootLayout` embeds dynamic JSON-LD LocalBusiness schema with CMS phone, email, and address.
- **Client Auto-Sync Endpoint (`app/api/site-settings/route.ts`)**:
  - Exposes public JSON endpoint returning all CMS site settings, logos, and media links with `s-maxage=60, stale-while-revalidate=300`.
  - Client components (`SiteHeader`, `SiteFooter`, `PromoBanner`, `ContactPage`) automatically pull from `/api/site-settings` on mount while instantly rendering SSR props when provided.
- **Component Prop Piping**:
  - [`components/hero.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/hero.tsx), [`components/Mision.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/Mision.tsx), [`components/showcase.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/showcase.tsx), [`components/trending-grid.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/trending-grid.tsx), and [`components/fleet-carousel.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/fleet-carousel.tsx) all accept CMS data as props with safe fallback seeds.
  - Vehicle gallery images in [`collections/Cars.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/collections/Cars.ts) support both direct Media uploads and static URLs with `resolveMediaUrl`.

## 11. Search Engine Optimization (SEO), LLM Discoverability & Real-Time Auto-Update Engine
- **Dynamic XML Sitemap (`app/sitemap.ts`)**:
  - Dynamically synthesizes and prioritizes routes: core site pages (`/`, `/about`, `/contact`, `/cars`, `/services`, `/blog`, `/partner/list-fleet`, legal pages), all 9 dedicated luxury service landing pages, dynamic CMS services, active CMS fleet vehicles (`/cars/[slug]`), and published blog posts (`/blog/[slug]`).
  - Prioritizes fleet vehicles (0.9, daily change frequency) and services (0.9, weekly), blogs (0.7, weekly), and core routes (1.0).
  - Implements in-memory deduplication via `Map` and sets revalidation window of 1800s.
- **Modern Robots.txt & AI Crawler Directives (`app/robots.ts`)**:
  - Explicitly configured for Googlebot and Bingbot (`allow: '/'`).
  - Whitelists 12 modern LLM & Generative AI web crawlers: `GPTBot`, `ChatGPT-User`, `Google-Extended`, `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `Bytespider`, `CCBot`, `cohere-ai`, `Meta-ExternalAgent`, `FacebookBot`, `Applebot-Extended`.
  - Disallows private & transactional routes (`/admin/*`, `/api/*`, `/checkout/*`, `/dashboard/*`, `/_next/*`).
  - Declares canonical XML sitemap and host bindings.
- **LLM Discoverability Standard (`/llms.txt` & `/llms-full.txt`)**:
  - Implements the [llmstxt.org](https://llmstxt.org) standard for AI search engines, citations, and assistants (Perplexity, ChatGPT, Claude, Gemini).
  - [`app/llms.txt/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/llms.txt/route.ts): Markdown summary file detailing brand identity, core fleet highlights, service categories, policies (deposit, fuel, flight delay guarantee), and canonical navigation links.
  - [`app/llms-full.txt/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/llms-full.txt/route.ts): Comprehensive AI dataset querying live CMS fleet data to export vehicle specifications, daily rental pricing, transmission, seating capacity, fuel type, security deposits, services offered, FAQs, and contact points.
- **Blog RSS 2.0 Feed (`/feed.xml`)**:
  - [`app/feed.xml/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/feed.xml/route.ts) serves an XML RSS feed containing all published blog articles, CDATA content descriptions, RFC 822 publication dates, and atom links.
  - Discovered automatically via `<link rel="alternate" type="application/rss+xml" title="DRIVEIT Luxury Journal RSS Feed" href="/feed.xml" />` injected into `<head>` in [`app/(site)/layout.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/layout.tsx).
- **Schema.org Structured Data (JSON-LD)**:
  - **Organization / LocalBusiness**: Injected globally in `layout.tsx` with dynamic phone, email, address, geo-coordinates, and opening hours.
  - **Car / Product**: Injected in [`app/(site)/cars/[slug]/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/cars/[slug]/page.tsx) with pricing, currency (`INR`), availability, specs, and breadcrumbs.
  - **Service / ItemList**: Injected in [`app/(site)/services/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/services/page.tsx) and dedicated service routes.
  - **BlogPosting**: Injected in [`app/(site)/blog/[slug]/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/blog/[slug]/page.tsx) with author, datePublished, headline, and article images.
  - **BreadcrumbList**: Injected on all vehicle, service, and blog detail pages.
- **Payload CMS Real-Time Auto-Update & Cache Invalidation Pipeline (`lib/revalidate.ts`)**:
  - Extended `SEO_DISCOVERY_ROUTES = ['/sitemap.xml', '/robots.txt', '/llms.txt', '/llms-full.txt']`.
  - When an admin saves, updates, or deletes a vehicle in `cars`, a blog in `blogs`, a service in `services`, or media in `media`, Next.js `revalidatePath()` automatically purges:
    - The item's detail page (`/cars/${slug}`, `/blog/${slug}`, `/services/${slug}`).
    - The item's catalog page (`/cars`, `/blog`, `/services`).
    - The homepage (`/`).
    - Dynamic discovery feeds: `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/llms-full.txt`, and `/api/fleet`.
  - When global `site-settings` are updated, the pipeline purges `/about`, `/contact`, `/api/site-settings`, and all SEO discovery endpoints instantly.

## 12. UI Architecture: Obsidian-Gold Dropdowns, Calendar & Smart Booking Flow
- **Obsidian-Gold Date Picker ([`components/luxury-date-picker.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/luxury-date-picker.tsx))**:
  - Replaces native OS `<input type="date">` across Homepage Booking Section, Vehicle Detail Widget, and Car Booking Modal.
  - Renders an obsidian glass popover (`#0c0c0e/98`, `border-[var(--gold-400)]/30`, gold ambient glow) with Month/Year header, Chevron navigation, gold weekday headers, today ring indicator, and gold-gradient active selection pill.
  - Native fallback inputs in `app/globals.css` set `color-scheme: dark !important; accent-color: #d4af37 !important;` with gold calendar indicator filter.
- **Universal Luxury Select ([`components/luxury-select.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/luxury-select.tsx))**:
  - Eliminates all native browser `<select>` elements and Windows blue hover outlines across the entire site:
    - Contact Form ([`components/contact-form.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/contact-form.tsx)) used on Contact, Yachts, and Private Jets pages.
    - Secondary Contact page ([`app/(site)/contactus/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/contactus/page.tsx)).
    - Fleet catalog sorting ([`app/(site)/cars/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/cars/page.tsx)).
    - Car booking modal ([`components/car-booking-modal.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/car-booking-modal.tsx)).
    - Checkout address selector ([`app/(site)/checkout/checkout-client.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/checkout/checkout-client.tsx)).
- **Smart Passenger & Vehicle Workflow ([`components/booking-section.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/booking-section.tsx))**:
  - Ordered as: **1. Passengers** → **2. Select Vehicle** → **3. Service Type** → **4. Occasion**.
  - **Passenger Capacity Filter**: Selecting `4 Passengers` strictly displays 4/5-seater sedans & SUVs (hiding 7-seaters like Fortuner, Vellfire, Crysta, GLS, Q7). Selecting `7 Passengers` filters to 7-seater luxury SUVs & MPVs.
  - **Bidirectional Auto-Sync**: Selecting `Toyota Fortuner` (or any 7-seater) automatically sets `passengers` to `"7"`. Selecting a 4-passenger filter automatically clears any previously selected 7-seater car so only valid vehicles are shown.

## 13. Universal Form Validation, Feedback & Message System
- **Zero Browser Alerts**: Replaced all blocking native `alert()` calls across the entire codebase with modern obsidian-gold, emerald, and rose notification cards.
- **Checkout & Payment Flow ([`app/(site)/checkout/checkout-client.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/checkout/checkout-client.tsx))**:
  - **Step 1 Reservation Error**: Prominent rose alert card with `AlertCircle`, title, and error message.
  - **Missing Fields Guidance**: Live pill checklist highlighting missing fields (`Full Name`, `Email`, `Phone`, `Pickup Location`) before allowing checkout progression.
  - **Step 2 Verification Banner**: Rose payment verification alert with 24/7 concierge phone fallback (`+91 63000 41186`).
  - **Hold Expiry Warning**: Amber banner warning user when the 10-minute hold has expired, with a 1-tap re-reservation button.
  - **Promo Codes**: Green check for applied coupons, rose banner for invalid codes.
- **Instant Booking Modal ([`components/car-booking-modal.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/car-booking-modal.tsx))**:
  - Replaced native `alert()` calls in booking creation, "Pay at Pickup" confirmation, and payment verification with inline obsidian-rose banners.
  - Added live required fields checklist ("Required to continue: Pickup Location • Date • Time • Full Name • Phone") when submit button is disabled.
- **Authentication & Sign-In/Sign-Up ([`app/(site)/login/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/login/page.tsx), [`app/(site)/signup/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/signup/page.tsx))**:
  - Intercepts NextAuth URL query parameters (`error`, `loggedOut`, `reason`) and renders styled luxury notifications:
    - `loggedOut=true`: Emerald banner confirming secure sign-out.
    - `reason=auth_required`: Gold banner explaining why sign-in is required to view customer dashboard.
    - `error=OAuth*`: Rose banner explaining Google authentication cancellation or permission failure.
    - `error=Configuration`: Concierge emergency callout at `+91 63000 41186`.
- **Customer Profile & KYC Document Vault ([`components/profile-form.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/profile-form.tsx))**:
  - Profile save: Upgraded to animated emerald badge with `CheckCircle2` on success, or rose alert card with `AlertTriangle` on error.
  - KYC Document Uploads: Live feedback card for Driving License and Aadhaar uploads confirming secure reception.
- **Fleet Partner Consignment Form ([`app/(site)/partner/list-fleet/partner-form.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/partner/list-fleet/partner-form.tsx))**:
  - Replaced plain text error with a structured obsidian-rose alert card containing `AlertCircle`, detailed reason, and direct link to fleet acquisitions concierge.
- **Contact & Inquiry Forms ([`components/contact-form.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/contact-form.tsx))**:
  - Enhanced inquiry dispatch screen with animated gold icon, 15-minute response guarantee, and option to submit another request.
  - Upgraded failure banner with direct 1-tap phone link to 24/7 concierge.
- **Homepage & Vehicle Booking Widgets ([`components/booking-section.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/booking-section.tsx), [`app/(site)/cars/[slug]/booking-widget.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/cars/[slug]/booking-widget.tsx))**:
  - Informative missing field indicators showing exactly what dates, times, vehicle or contacts are required before checkout can proceed.

## 14. Owner's Operating Manual & Subdomain / Wildcard SSL Architecture
- **Dedicated Business Owner Manual ([`OWNERS_MANUAL.md`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/OWNERS_MANUAL.md))**:
  - Complete executive guide for the business owner, managing director, and operations team.
  - Documents the entire customer reservation lifecycle, fleet pricing management, booking verification, self-drive KYC approvals, security deposit refunding with bank UTRs, content editing, and consignment lead processing.
- **Wildcard SSL Architecture**:
  - **Zero Cost ($0)**: Clarified that purchasing Wildcard SSL is completely unnecessary.
  - **Cloudflare Edge SSL**: Automatically secures `yourdomain.com` and all first-level subdomains (`*.yourdomain.com`) for free.
  - **Cloudflare Origin CA**: Provides a free 15-year origin certificate for `yourdomain.com` and `*.yourdomain.com`, installed in `/etc/ssl/cloudflare/` to secure Nginx with zero renewals.
- **Subdomain Strategy**:
  - **Payload CMS**: Unified natively inside Next.js at `/admin` (`https://yourdomain.com/admin`), eliminating the need for a separate subdomain or server.
  - **WhatsApp CRM / Twenty CRM**: Dedicated subdomain (`https://crm.yourdomain.com` or `https://wa.yourdomain.com`) proxying to the CRM container port (`127.0.0.1:3001`), keeping sales pipeline operations isolated from public traffic.
  - **Optional Admin Subdomain**: Nginx server block provided for `admin.yourdomain.com` cleanly redirecting to `/admin`.
  - Added full Nginx reverse proxy blocks and Cloudflare DNS records to [`deployment_guide.md`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/deployment_guide.md).

## 15. INR Currency & Symbol Standardization (Domestic India Operation)
- **Currency Rule**: The business operates strictly within India. All pricing, estimates, discounts, deposits, and UI icons must use Indian Rupee standards:
  - **Currency Symbol**: `₹` (Unicode U+20B9) in public pages, booking widgets, checkout, invoices, and email templates.
  - **Currency Code**: `INR` in JSON-LD Schema.org, UPI URLs (`cu=INR`), and API responses.
  - **Lucide Icons**: Use `<IndianRupee />` from `lucide-react` across feature cards, consignment pages, and service sections. Never use `<DollarSign />`.
  - **Number Formatting**: Format all numeric currencies using Indian locale: `.toLocaleString('en-IN')` (e.g. `₹1,50,000`, `₹75,000`).
  - **Deployment & Server Estimates**: All VPS and infrastructure cost projections in documentation must be quoted in Indian Rupees (e.g. `~₹650 - ₹1,100 / month`).

## 16. GPS Telematics, Automated Odometer & Extra-KM Billing Engine
- **Hardware Integration (Zero Monthly Subscriptions)**:
  - Supports standard Indian 2G/4G SIM trackers (Concox, Jimi IoT, Coban, Sinotrack, Onelap, AIS-140, Teltonika) equipped with Airtel, Jio, or Vi SIMs.
  - Universal ping endpoint: [`app/api/telematics/ping/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/telematics/ping/route.ts) accepts both HTTP GET query strings (direct from tracker microcontrollers) and HTTP POST JSON payloads (from fleet aggregators like LocoNav, TrackSolid, Traccar, or Fleetx).
  - Validates optional `TELEMATICS_SECRET` for tamper protection.
- **Core Telematics Engine ([`lib/telematics.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/lib/telematics.ts))**:
  - `calculateHaversineDistanceKm`: Precise coordinate distance computation.
  - `checkHyderabadGeofence`: 65 km radius geofence centered on Hyderabad Secretariat (`HYDERABAD_CENTER = { lat: 17.4065, lng: 78.4772 }`) covering the entire Outer Ring Road (ORR), Shamshabad RGIA, Sangareddy, and Medchal.
  - `parseGpsPayload`: Normalizes varied hardware schemas (speed, latitude, longitude, odometer in meters or km, ignition status, battery voltage).
  - `calculateTripKilometers`: Computes trip distance, daily allowance, excess distance, and financial extra-km charge.
- **Automated Trip Lifecycle Hooks ([`lib/booking-telematics-hooks.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/lib/booking-telematics-hooks.ts))**:
  - Attached to [`collections/Bookings.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/collections/Bookings.ts) `beforeChange`.
  - **Trip Start (`confirmed`)**: Automatically snapshots vehicle's cumulative `currentOdometerKm` into `booking.telematics.startOdometerKm` and sets `allowedKm = days * 100`.
  - **Trip Return (`completed`)**: Automatically snapshots vehicle's `currentOdometerKm` into `booking.telematics.endOdometerKm`, calculates `totalKmDriven`, detects excess mileage, and auto-populates `depositRefundDeductionReason` (e.g. `Excess mileage: 45 km @ ₹75/km = ₹3,375`) so admin can deduct it directly from the security deposit before sending the refund UTR.
- **Customer Live Telematics Tracker ([`components/live-vehicle-tracker.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/live-vehicle-tracker.tsx))**:
  - Integrated into [`app/(site)/dashboard/bookings/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/dashboard/bookings/page.tsx).
  - Displays dark luxury animated radar map, live speed gauge, engine ignition status, geofence security badge, allowance progress bar, and 1-tap Google Maps directions.
  - For completed trips, displays an audited GPS-verified mileage certificate and transparent excess fee breakdown.
- **Fleet Summary API ([`app/api/telematics/fleet/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/telematics/fleet/route.ts))**:
  - Provides a single JSON endpoint returning real-time GPS locations, speed, ignition, and odometer readings for all vehicles in the fleet.

## 17. High-Performance Scrolling, Loading Screens & Zero-Hang Transitions
- **Global Luxury Loading Screen ([`app/(site)/loading.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/loading.tsx))**:
  - Automatically streamed by Next.js App Router during server component data fetching.
  - Deep obsidian black background (`#050505`), animated concentric gold radar rings, golden monogram emblem, and gold shimmer loader strip. Eliminates blank screens and perceived route freezes.
- **Zero-Latency Top Progress Bar ([`components/page-progress-bar.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/page-progress-bar.tsx))**:
  - Mounted inside `app/(site)/layout.tsx`.
  - Captures internal link clicks instantly and fires a 2.5px gold neon progress pulse across the top edge (`0%` -> `75%` -> `100%`) before completing upon `pathname`/`searchParams` update.
  - Provides immediate (<10ms) tactile visual feedback so users never feel like clicks are ignored or hanging.
- **Scroll Performance & CPU De-bottlenecking**:
  - **Eliminated SVG Fractal Turbulence**: Replaced CPU-hogging `.grain-overlay::after` 400% infinite SVG `feTurbulence` animation in [`app/globals.css`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/globals.css) with a static, GPU-accelerated radial vignette.
  - **Freed Window Scroll Thread**: Removed continuous JS `useScroll` and `useTransform` matrix recalculations on full-viewport backgrounds in [`components/hero.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/hero.tsx) and [`components/Mision.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/Mision.tsx), replacing them with hardware-accelerated (`gpu-layer`) entrance animations.
  - **Eliminated MouseMove React Re-renders**: Removed stateful `setMousePos` from [`components/trending-grid.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/trending-grid.tsx), switching to zero-overhead CSS GPU hover transitions and Next.js `<Image>`.
  - **Modern Off-Screen Layout Deferral (`content-visibility: auto`)**: Added `.content-auto` with `contain-intrinsic-size: 1px 700px` to below-the-fold landing page sections (`#services`, `FleetCarousel`, `#about` in [`app/(site)/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/page.tsx)), allowing browsers to skip rendering offscreen sections until approached.
  - **Hardware Accelerated Marquees**: Added `transform: translate3d(0, 0, 0)` and `will-change: transform` to marquee tracks.

## 18. Database Schema Migrations & CMS Sync
- **Root Cause of `[cms] Failed to load site settings`**:
  - The `SiteSettings` global schema, `PartnerApplications` collection, and telematics columns on `Cars`/`Bookings` were added to TypeScript collections, but had not been migrated to the local Postgres database.
  - In `payload.config.ts`, `pushSchema` defaults to `false` (migrations only). Consequently, Postgres rejected queries trying to select columns `promo_banner_enabled`, `header_logo_id`, `site_settings_stats`, and `site_settings_faqs`.
- **Resolution**:
  - Generated official migration [`migrations/20260925_072756.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/migrations/20260925_072756.ts) with `npm run migrate:create`.
  - Executed `npm run migrate` (`Migrated: 20260925_072756 (236ms)`), creating all required tables and columns in Postgres.
  - Added `PAYLOAD_SCHEMA_PUSH=true` to [`.env.local`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/.env.local) so local development automatically pushes any future schema adjustments directly to Postgres on boot.

## 19. VIP Atelier Split-Screen Authentication Architecture
- **Two-Section Layout ([`app/(site)/login/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/login/page.tsx))**:
  - Replaced the previous basic centered box with a high-end split-screen experience (`lg:w-7/12` visual atelier + `lg:w-5/12` access portal).
  - **Left Section (Prestige Atelier & Trust)**:
    - High-res cinematic Maybach backdrop with multi-layered obsidian vignette overlays.
    - Golden brand crest and live "Concierge Active 24/7" status badge.
    - 3 core member privilege feature cards: Priority Dispatch & 10-Min Hold, Digital KYC Vault, and Live Telematics Radar.
    - Verified client quote (`Vikramaditya R., Jubilee Hills`) with 5 gold stars and live fleet counter (`50+ Vehicles • 1,200+ VIP Trips • 4.9★`).
  - **Right Section (Interactive VIP Portal)**:
    - Return to Fleet navigation and direct 24/7 WhatsApp VIP support button with live pulse.
    - Golden crown emblem with smooth tab switcher (`Sign In` vs `New VIP Account`).
    - Prominent Google 1-Tap button featuring official multicolor Google "G" SVG logo and animated arrow.
    - VIP perks checklist, direct concierge phone hotline (`+91 63000 41186`), and 256-bit SSL security badge.
## 20. Automotive Cockpit 404 Page ("Off-Route // Engine Idle") & Portal Architecture
- **Automotive Cockpit 404 Experience**:
  - Implemented in [`components/car-not-found.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/car-not-found.tsx), mounted in both [`app/(site)/not-found.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/not-found.tsx) (with `SiteHeader` and `SiteFooter`) and global fallback [`app/not-found.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/not-found.tsx).
  - Eliminates Next.js's stark white default 404 screen.
  - **Speedometer Gauge HUD**: Circular digital tachometer dial displaying `404` as a large digital speedometer readout (`KM/H • GEAR: P (PARK) • ENGINE IDLE`).
  - **Flashing Instrument Alert**: `⚠️ Telemetry Alert: Detour Detected • Route Unmapped`.
  - **Cinematic Flagship Car**: Features Rolls-Royce Phantom Night Edition with glowing LED headlight overlays cutting across night asphalt and gold perspective road grid.
  - **Interactive Garage Search**: Built-in search bar directly querying the fleet (`/cars?search=...`).
  - **Quick Highway Controls**: 1-click `⚡ Return to Main Highway` (Home), `🏎️ Showroom Fleet (50+)`, and popular pitstops (VIP Chauffeur, Wedding Convoys, Private Jets, WhatsApp Concierge).
  - **Sticky Header Clearance**: Top padding set to `pt-36 sm:pt-44` to ensure status telemetry badge and 404 speedometer clear the fixed `SiteHeader` (~112px height) with ample breathing space on all devices.
- **Portal Separation & Copy Clarifications**:
  - **Customer Portal (`/login` & `/signup`)**: Explicitly clarified as the **Customer Account Portal** for normal renters and clients. Removed confusing "VIP Member / Club" jargon; replaced with clear tabs `Customer Sign In` and `Create Customer Account` with 1-click Google OAuth. Added a clear callout redirecting luxury car owners to `/partner/list-fleet`.
  - **CMS Admin Portal (`/admin/login`)**: Strictly for internal operations and staff. Redesigned with a 2-section executive atelier layout in `admin.css`, `Logo.tsx`, and `AfterLogin.tsx`, free from customer-facing booking prompts, with explicit restricted security warnings and return links.

## 21. Public & Customer View Copy Policy (Zero Backend / Package Jargon)
- **Strict Directive**: Under no circumstance should any backend tool, software architecture detail, package name, database technology, or developer jargon be displayed in customer-facing, public, or portal views.
- **Prohibited Terms in Customer & Public UI**:
  - `PostgreSQL` / `Postgres 16` ➔ Replace with `Concierge Dispatch`, `Verified Operations`, or `Secure Reservations`.
  - `Payload CMS` / `Headless CMS` ➔ Replace with `Executive Console`, `Fleet Operations`, or `Operations Atelier`.
  - `Advisory locks` / `pg_advisory_xact_lock` ➔ Replace with `Guaranteed Reservation Hold` or `High-concurrency reservation lock`.
  - `OAuth 2.0` / `Auth.js` ➔ Replace with `One-tap secure login with Google` or `Instant Google Sign-In`.
  - `Calculated on our server` / `verified server-side` ➔ Replace with `Guaranteed availability` or `All rates and discounts are guaranteed before payment`.
  - Route syntax like `(/login)` ➔ Replace with clean plain text names like `Customer Portal`.
  - Low-level network terms like `Active Ping`, `Telematics Zone` ➔ Replace with `Live Signal`, `City Limits`, `Vehicle Status`.
- **Audited Surfaces**:
  - `components/cms/Logo.tsx` & `components/cms/AfterLogin.tsx` (Internal staff login)
  - `app/(site)/login/page.tsx` (Customer login)
  - `app/(site)/checkout/checkout-client.tsx` (Customer checkout & booking engine)
  - `components/live-vehicle-tracker.tsx` (Customer live GPS tracker)
  - `app/llms.txt/route.ts` & `app/llms-full.txt/route.ts` (Public LLM discovery endpoints)

## 22. Luxury SEO-Optimized Footer & Turbopack Chunk Architecture
- **Overhauled Footer ([`components/site-footer.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/site-footer.tsx))**:
  - **Pre-Footer VIP Concierge Strip**: Live 24/7 concierge status pill, 1-tap call (`+91 63000 41186`), instant WhatsApp dispatch, and 4 luxury assurance badges (100% Verified Fleet, 10-Min Hold Guarantee, Full-to-Full Fuel & FASTag, 60-Min RGIA Airport Courtesy).
  - **5-Column High-Impact SEO Matrix**:
    1. **Brand Atelier & Physical Showroom**: Address (Jubilee Hills / Banjara Hills), 24/7 hotline, direct concierge email, and live dispatch center status.
    2. **Exotic Fleet (SEO Model Targets)**: Rolls-Royce Phantom, Mercedes-Maybach, Range Rover Vogue, Lamborghini, Defender 110, S-Class, Vellfire, BMW 7 Series.
    3. **Bespoke Services (SEO Service Keywords)**: Chauffeur driven, self-drive supercars, royal wedding convoys, corporate delegations, RGIA VIP airport transfers, private jet charters, yacht charters, luxury coaches, intercity travel.
    4. **Hyderabad VIP Hubs (Hyperlocal SEO)**: Jubilee Hills, Banjara Hills, HITEC City, Gachibowli, Kokapet, Madhapur, RGIA Airport, Secunderabad, ORR express.
    5. **Client Atelier & Consignment**: Account sign-in, live booking tracking, saved wishlist, fleet consignment partner link (`/partner/list-fleet`), travel journal, privacy/terms.
  - **SEO Local Mobility Footnote**: High-authority semantic text block linking top vehicle models and prime Hyderabad localities for search engine indexing.
  - **Payment & Trust Strip**: UPI, RuPay, Visa, MasterCard, NetBanking, 256-bit SSL, GST compliant, full commercial insurance.
- **Turbopack CSS Chunk Conflict Resolution**:
  - Root cause of `"No link element found for chunk ..."`: `app/not-found.tsx` at the root imported `./globals.css`, generating a separate `[root-of-the-server]` chunk ID that clashed with `app/(site)/layout.tsx`'s `../globals.css` during HMR.
  - Removed redundant `app/not-found.tsx` since `app/(site)/not-found.tsx` already handles 404s inside the site layout group cleanly with full styling and fonts.

## 23. Single-Line Footer Architecture & Official Brand Icons
- **Strict Single-Line Payment & Security Strip ([`components/site-footer.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/site-footer.tsx))**:
  - Encapsulated within `flex items-center justify-between gap-4 w-full flex-nowrap whitespace-nowrap overflow-x-auto no-scrollbar py-1`.
  - Left group: Label (`Secure Payment Options:`) + 8 official vector badges (Visa, Mastercard, RuPay, UPI, Google Pay, PhonePe, Paytm, NetBanking) with `shrink-0`.
  - Right group: 3 luxury trust badges (`256-Bit SSL Encrypted`, `GST Invoicing`, `Commercial Insurance`) with `shrink-0`.
  - Elimination of wrap points: No items drop to a second line on any screen size. Smooth horizontal swipe enabled for small mobile viewports with `.no-scrollbar`.
- **Strict Single-Line Bottom Copyright, Social Icons & Legal Strip**:
  - Enforced single-line layout (`flex items-center justify-between gap-4 w-full flex-nowrap whitespace-nowrap overflow-x-auto no-scrollbar py-1`).
  - Left: Brand copyright (`© {year} DRIVEIT Luxury Fleet Mobility Pvt. Ltd. All rights reserved.`, `shrink-0 whitespace-nowrap`).
  - Center: Official branded social icons (Instagram, Facebook, YouTube, LinkedIn, X, and official WhatsApp via `FaWhatsapp`), all `shrink-0`.
  - Right: Legal navigation links (`Privacy • Terms • Refunds • Cookies • Sitemap`, `shrink-0 flex-nowrap`).
- **Official WhatsApp Vector Branding**:
  - Integrated authentic Meta WhatsApp vector icon (`FaWhatsapp` from `react-icons/fa`) across both the top VIP Concierge CTA button and the bottom social channels bar.
  - Matches the exact official WhatsApp icon with zero distortion.

## 24. Security Audit, IDOR Protection & API Hardening
- **Customer Data Isolation & IDOR Protection**:
  - `app/(site)/dashboard/invoices/[id]/page.tsx`: Strict ownership verification against `session.user.email.toLowerCase()`; unauthorized attempts redirect to `/dashboard/bookings`.
  - `app/(site)/dashboard/bookings/page.tsx`: Scoped by `customerEmail: { equals: email }`.
  - `app/(site)/dashboard/page.tsx`: Scoped by session email for profile and recent bookings.
  - `app/api/profile/route.ts`: Both GET and PATCH strictly bound to authenticated `session.user.email`. `PatchSchema` rejects any attempts to tamper with protected fields (`loyaltyPoints`, `loyaltyTier`, `kycStatus`, `email`).
  - `app/api/bookings/count/route.ts` & `app/api/wishlist/route.ts`: Bound to session email; customers cannot inspect or modify other customers' data.
- **Customer KYC Document Vault Hardening ([`collections/Media.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/collections/Media.ts) & [`app/api/profile/documents/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/profile/documents/route.ts))**:
  - Secured `Media.access.read: adminOnly` on the REST API so that unauthenticated visitors and customers cannot query `/api/media` to scrape driving licenses, Aadhaar proofs, or customer emails. Public vehicle assets continue to serve via CDN/static routing.
  - `app/api/profile/documents/route.ts`: Whitelisted MIME types are strictly mapped to safe file extensions (`MIME_TO_EXT`), eliminating client-controlled extension spoofing (e.g. `.html` or `.svg`). Customer email removed from public filenames and alt metadata.
- **Fleet Telematics & GPS Security Hardening ([`app/api/telematics/fleet/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/telematics/fleet/route.ts) & [`app/api/telematics/ping/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/telematics/ping/route.ts))**:
  - `GET /api/telematics/fleet`: Previously unauthenticated, exposing real-time GPS coordinates, speed, and ignition states of all vehicles. Now strictly gated to authenticated staff users or authorized `TELEMATICS_SECRET` bearer tokens. Returns `401 Unauthorized` to public requests.
  - `POST /api/telematics/ping`: Now fails closed using constant-time `crypto.timingSafeEqual`. Rejects unauthenticated telemetry pings to prevent spoofing vehicle odometer or GPS coordinates.
- **Partner Applications Collection Hardening ([`collections/PartnerApplications.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/collections/PartnerApplications.ts))**:
  - Closed direct public creation (`access.create: adminOnly`). All public consignments must pass through the rate-limited, Zod-validated endpoint (`/api/partners/apply`).
  - Field-level gating added (`create: adminFieldOnly, update: adminFieldOnly`) to `status` and `adminNotes` to prevent unauthorized status changes.
- **Payment & Pricing Hardening ([`lib/pricing.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/lib/pricing.ts))**:
  - Capped percentage coupon discount calculations at 100% of subtotal to prevent any theoretical overflow or over-discounting.

## 25. Authentication, 30-Day Session Persistence & Universal Logout Architecture
- **Dual Dashboard Architecture & Logout Locations**:
  - **Customer VIP Dashboard (`/dashboard`)**:
    - Dedicated `<SignOutButton />` in [`app/(site)/dashboard/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/dashboard/page.tsx) at the top right of the welcome banner.
    - Global session-aware navigation in [`components/site-header.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/site-header.tsx): When logged in, the header replaces the static "Login" link with a VIP user pill showing the user's name/initials, and a dropdown offering 1-click access to **Dashboard**, **My Bookings**, **Profile & KYC**, and **Sign Out**.
    - Mobile drawer in [`components/site-header.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/site-header.tsx) displays a branded customer profile card with direct quick links to Dashboard, Bookings, and a dedicated **Sign Out** button.
    - Users can now log out cleanly from **any page** on the website without needing to navigate back to the dashboard first.
  - **Staff & Admin CMS Dashboard (`/admin`)**:
    - Payload CMS built-in navigation provides an admin account menu with **Log out** at the bottom of the left sidebar.
- **Session Caching & "Tomorrow" Login Behavior**:
  - **NextAuth / Auth.js v5 Configuration ([`auth.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/auth.ts))**:
    - Configured with `session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }` (30 days).
    - Sets an encrypted, `HttpOnly`, `SameSite=Lax`, `Secure` browser cookie (`authjs.session-token` or `__Secure-authjs.session-token`).
    - **Persistence**: Because the cookie has an explicit 30-day `maxAge`, it is stored in the browser's persistent storage (not a temporary session-only cookie).
    - **Returning Tomorrow**: A user returning tomorrow (or anytime within 30 days) is **instantly recognized without needing to log in again**. The browser presents the cookie, `proxy.ts` verifies the signature, and the dashboard/header loads their account immediately.
  - **Tactile Sign Out Button & Zero-Lag Redirect**:
    - Upgraded [`components/sign-out-button.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/sign-out-button.tsx) from a faint wireframe link to a premium tactile button (`bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-300`).
    - Added instant interactive loading state (`<Loader2 className="animate-spin" /> Signing out...`) and hard browser redirect (`window.location.href = '/'`), eliminating Next.js router transition delays and instantly clearing client-side session cache.
  - **CMS `/admin` Unified Brand Logo**:
    - Replaced the generic golden initial box ("D") in [`components/cms/Logo.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/cms/Logo.tsx) and [`components/cms/Icon.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/cms/Icon.tsx) with the official metallic gold DriveIt brand logo (`/logo.png`).
    - Styled in [`app/(payload)/admin.css`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(payload)/admin.css) across both the logged-in sidebar nav and the `/admin/login` executive showcase.

## 26. Production VPS Deployment, Official Domain (driveitluxury.in) & Cloudflare SSL Setup
- **Server Specifications & Environment**:
  - Host: `13.140.56.180` (Contabo VPS, Ubuntu 24.04 LTS).
  - Deploy user: `driveit` (with passwordless sudo configured in `/etc/sudoers.d/driveit` and added to `docker` group).
  - Codebase Path: `/root/driveit`.
- **Domain Standardization (`driveitluxury.in`)**:
  - The official production domain is strictly **`driveitluxury.in`** (not `.com`).
  - Updated all 33 codebase surfaces: OpenGraph metadata, JSON-LD schemas, XML sitemap, `robots.txt`, RSS feeds, `llms.txt`, transactional email templates, CMS defaults, manuals, and `docker-compose.yml`.
  - Super Admin seeded: `admin@driveitluxury.in` / `DriveIt@Admin2026!`.
- **Docker Compose Stack Health**:
  - All 5 production containers running healthy:
    1. `driveit-app`: Next.js 16 + Payload 3 standalone container (`127.0.0.1:3000`).
    2. `driveit-postgres`: Postgres 16 Alpine with 24 schema tables migrated and full seed applied.
    3. `driveit-redis`: Redis 7 Alpine.
    4. `driveit-backup`: Automated daily database dump cron.
    5. `driveit-scheduler`: Automated 15-minute booking hold expiration sweeper.
- **Nginx Reverse Proxy & Cloudflare Origin SSL**:
  - Active configuration: `/etc/nginx/sites-available/driveit` (symlinked in `sites-enabled`).
  - Listens on Port 80 (HTTP) and Port 443 (HTTPS with HTTP/2 and modern ciphers).
  - SSL Certificate path: `/etc/ssl/cloudflare/cert.pem`
- **Navigation Header Collision & Responsive Layout Fix**:
  - Expanded container from `max-w-6xl` to `max-w-[1400px]` with fluid responsive padding (`px-4 sm:px-6 lg:px-8`).
  - Added strict `whitespace-nowrap` across all navigation links, dropdown items, user pill, and CTA button to eliminate two-line text wrapping (e.g., "Luxury\nChauffeurs").
  - Moved desktop navigation switch from `md` (768px) to `lg` (1024px) with safe `gap-3 xl:gap-6` and `shrink-0` bounds, preventing overlap between logo, nav links, and logged-in account pill on medium-sized displays (1024px-1366px laptops).
  - Scaled logo to `h-8 sm:h-9 lg:h-10 xl:h-11` and added `max-w-[75px] xl:max-w-[110px] truncate` to user's first name in the profile pill.

## 27. WhatsApp CRM (Chatwoot) & wa.driveitluxury.in Subdomain Architecture
- **Platform Choice**: Chatwoot (`chatwoot/chatwoot:latest`) deployed as an isolated Docker stack under `/root/chatwoot`.
- **Subdomain Routing & Wildcard SSL**:
  - `wa.driveitluxury.in` (and `crm.driveitluxury.in`) configured in `/etc/nginx/sites-available/driveit`.
  - Reuses the 15-year Cloudflare Wildcard Origin CA SSL certificate (`/etc/ssl/cloudflare/cert.pem`).
  - Proxies to Puma Rails on `127.0.0.1:3001` with WebSocket support.
- **Chatwoot Docker Stack**:
  - `chatwoot-web`: Puma Rails application server running on `127.0.0.1:3001:3000`.
  - `chatwoot-worker`: Sidekiq background job processor for asynchronous message routing.
  - `chatwoot-postgres`: Dedicated `pgvector/pgvector:pg16` database container with persistent data at `/root/chatwoot/data/postgres`.
  - `chatwoot-redis`: Dedicated `redis:alpine` container with persistent data at `/root/chatwoot/data/redis`.
- **DriveIt Integration Bridge**:
  - `lib/notifications.ts` (`sendWacrmEvent`) and `app/api/webhooks/wacrm/route.ts` provide authenticated webhook event dispatching for booking holds and confirmations.

## 28. Customer Profile & KYC Booking Gate, Unified Authentication & CRM Auto-Upsert
- **Customer CRM Auto-Upserting Pipeline (Fixed)**:
  - Previously, customers who signed in with Google were never saved to Payload CMS `customers` collection unless they manually saved their profile, resulting in 0 records in `/admin/collections/customers`.
  - Added `async signIn({ user })` callback to [`auth.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/auth.ts) with dynamic imports of `getPayload` and `upsertCustomer`. Every Google OAuth sign-in immediately creates/updates the customer record in Postgres and Payload CMS.
  - Implemented multi-tier safety nets calling `upsertCustomer` in [`app/(site)/dashboard/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/dashboard/page.tsx), [`app/api/profile/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/profile/route.ts), [`app/api/profile/documents/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/profile/documents/route.ts), and [`app/(site)/dashboard/profile/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/dashboard/profile/page.tsx).
- **Customer Profile & KYC Booking Gate**:
  - Exported `isProfileAndKycComplete(customer)` and `KycValidationResult` in [`lib/customers.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/lib/customers.ts).
  - Validation requires:
    1. Full Name (at least 2 characters).
    2. Phone number (at least 10 valid digits).
    3. Driving License Number (at least 5 characters).
    4. KYC Document Status: must be `pending` or `verified` (rejects `unverified` and `rejected`).
  - **Server-Side Enforcement**:
    - [`app/api/checkout/init/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/checkout/init/route.ts) evaluates `isProfileAndKycComplete(customer)` before issuing a hold token; returns HTTP 403 with `code: 'KYC_INCOMPLETE'` and detailed missing reasons if incomplete.
    - [`lib/actions/bookings.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/lib/actions/bookings.ts) enforces the identical gate in `createBooking`.
  - **Frontend UI & Guided Resolution**:
    - [`app/(site)/checkout/checkout-client.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/checkout/checkout-client.tsx) renders dedicated status cards:
      - Signed out: Gold alert "VIP Verification Required" prompting 1-tap sign-in with preserved query parameters.
      - Incomplete Profile / KYC: Amber alert listing exact missing requirements with a prominent gold button: "Complete Profile & Upload Documents Now" linking to `/dashboard/profile?redirect=...`.
      - Verified VIP: Emerald badge confirming ready-to-book status.
    - Submit button is dynamically replaced with direct resolution buttons ("Sign In with Google to Unlock Reservation" / "Complete Profile & KYC to Unlock Reservation") when requirements are unmet.
    - [`components/profile-form.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/profile-form.tsx) detects `redirect` query parameter, shows "Reservation In Progress" banner, and renders a "Return to Checkout with Saved Details" button below the save action.
- **Login Portal Unification & Brand Integrity**:
  - Replaced arbitrary monogram circle and Lucide `Crown` on [`app/(site)/login/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/login/page.tsx) with the authentic metallic gold DRIVEIT logo ([`/logo.png`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/public/logo.png)).
  - Removed confusing redundant `[ Sign In ]` vs `[ Create Account ]` toggle tabs that triggered the same Google OAuth action.
  - Streamlined into an obsidian VIP "Customer Access Portal" with a single high-contrast "Continue with Google" button and clear value propositions.

## 29. Voucher Security, Customer-Specific Assignment & First-Time Gating Architecture
- **Strict Voucher Lifecycle Enforcement**:
  - When an admin deletes a coupon or sets `isActive: false` in Payload CMS, it is immediately invalidated across all validation and booking endpoints ([`lib/coupons.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/lib/coupons.ts), [`app/api/checkout/init/route.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/checkout/init/route.ts), [`lib/actions/bookings.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/lib/actions/bookings.ts)).
  - Replaced legacy silent coupon fallback (which previously stripped the discount but silently proceeded with hold creation) with an explicit HTTP 400 rejection: `Promo code error: The promo code "XYZ" is not recognised or has been removed.`. Customers can never book with an inactive or deleted code.
- **Customer-Specific Vouchers (VIP & Concierge On-Demand Deals)**:
  - Added `assignedCustomer` (relationship to `customers`) and `customerEmail` (text fallback) fields to [`collections/Coupons.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/collections/Coupons.ts).
  - Validation ensures that the checkout customer email strictly matches the assigned customer profile/email.
  - Unauthorized users attempting to use a customer-specific code are blocked with an explicit error: `"This exclusive promo code is assigned to a specific VIP customer account."`.
- **First-Time Customers Only Gating (`firstTimeOnly`)**:
  - Added `firstTimeOnly` (boolean checkbox, default `false`, indexed) to [`collections/Coupons.ts`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/collections/Coupons.ts).
  - Validates against:
    1. `customers.completedBookings > 0` on customer profile.
    2. Any existing `confirmed` or `completed` bookings under `customerEmail` in the `bookings` collection.
  - If prior reservations are found, throws an informative error: `"This welcome discount is valid only for first-time customers. Our records show an existing reservation for this account."`.
- **Per-Customer Redemption Limits (`oncePerCustomer`)**:
  - Added `oncePerCustomer` (boolean checkbox, default `true`, indexed) to prevent a customer from reusing multi-use global promo codes across separate reservations.
  - Database schema migrated on VPS Postgres (`first_time_only`, `once_per_customer`, `assigned_customer_id` with foreign key and indexes).

## 30. Production VPS Update & Deployment Standard Operating Procedure (SOP)
- **Deployment SOP Document**: [`vps_update_guide.md`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/vps_update_guide.md) documents end-to-end standard operating procedures, best practices, and emergency runbooks for deploying code, modifying `.env` secrets, updating Payload schemas, managing Nginx configurations, and performing 10-second rollbacks.
- **Automated Deployment Script**: [`deploy.sh`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/deploy.sh) (`sudo /root/driveit/deploy.sh`) provides 1-command zero-downtime deployments:
  1. Checks git hash against `origin/main` and pulls latest commits.
  2. Runs `docker compose build app` using layer caching.
  3. Recreates and starts the target container with `--no-deps`.
  4. Waits 3 seconds and verifies boot health via container logs.
## 31. Scroll-Driven Experiential Showcase & Luxury Editorial Typography (Hype.luxury Evolution)
- **ScrollStoryShowcase (`components/scroll-story-showcase.tsx`)**:
  - Implements 4 full-viewport (`100svh`) cinematic scroll panels showcasing DriveIt's core pillars:
    1. *Royal Chauffeur Service* (Rolls-Royce Phantom Night Black)
    2. *Exotic Self-Drive Freedom* (Ferrari SF90 Stradale)
    3. *VIP Airport Tarmac Concierge* (Gulfstream G650 on Tarmac)
    4. *Royal Wedding Convoys* (Rolls-Royce Wedding Ribbon)
  - Features scroll-driven blur-to-focus dissolutions (`filter: blur(16px)` -> `blur(0px)`, `opacity: 0 -> 1`), background parallax scale transforms (`scale: 1.12 -> 1.0`), expanding gold accent dividers, and frosted glass capsule buttons with an animated 45-degree light sheen reflection.
- **Luxury Editorial Typography (Syne + Wide Tracking)**:
  - Added `Syne` Google Font (`--font-syne`) to [`app/(site)/layout.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/layout.tsx) and `@theme inline` in [`app/globals.css`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/globals.css).
  - Introduced utility classes `.font-luxury`, `.tracking-luxury` (`0.22em`), and `.tracking-luxury-wide` (`0.38em`) for fashion-grade luxury headings and uppercase badges.
- **Refined Graphite & Obsidian Surfaces**:
  - Softened pure OLED black (`#050505`) to a layered luxury graphite obsidian palette (`--luxury-bg: #09090d;`, `--luxury-surface: #111116;`, `--luxury-surface-2: #17171e;`, `--luxury-surface-3: #1e1e27;`), providing physical depth and subtle shadows without pitch-black flatness.

## 32. Minimal Hype-Style Header, Serif Elimination & Tranquil Editorial Reviews
- **Complete Serif Font Elimination**:
  - Replaced all traditional serif typography (`Playfair Display`, Georgia, etc.) across the entire codebase with modern high-fashion luxury sans-serif (`Syne` display font and `GeistSans` body).
  - Aliased `--font-playfair`, `--font-display`, and `--font-luxury` to `var(--font-syne), var(--font-geist-sans), sans-serif;` in [`app/globals.css`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/globals.css) and [`app/(site)/layout.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/layout.tsx), ensuring all 45+ existing headings instantly inherit luxury geometric sans without breaking any layouts.
  - Updated [`app/(payload)/admin.css`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(payload)/admin.css) font stacks to eliminate serif fallbacks in Payload CMS.
- **Minimalist Hype-Style Header ([`components/site-header.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/site-header.tsx))**:
  - **Left**: Minimal 2-line hamburger icon (`=`) with smooth hover expansion and "Menu" label.
  - **Center**: Centered DRIVEIT brand crest and logo, perfectly balanced on the top bar.
  - **Right**: Spaced, high-fashion all-caps sans links (`CHAUFFEUR`, `CARS`, `AIRPORT VIP`, `WEDDING`, `PRIVATE JETS`), user session avatar, and understated gold "Book Now" CTA pill.
  - **Full-Screen Luxury Obsidian Drawer**:
    - Opens with smooth Motion slide-in animation and locks body scroll.
    - Features a 2-column editorial layout: 9 indexed services with category numbers (`01 Chauffeured Fleet`, `02 Self-Drive Collection`, `03 All Luxury Cars`, etc.), quick vehicle type filters, and a dedicated 24/7 VIP Concierge card with 1-tap phone (`+91 63000 41186`) and WhatsApp access.
    - Supports ESC key listener, route change auto-close, and accessible close button.
- **Landing Page Streamlining ([`app/(site)/page.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/(site)/page.tsx))**:
  - Removed `<ProcessTimeline />` (Work Process) section to keep the landing page clean, focused, and free of bloated generic steps.
- **Tranquil Editorial Client Reviews ([`components/Testomonials.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/Testomonials.tsx))**:
  - Replaced the continuous, jittery auto-scrolling marquee with a quiet, editorial 3-card luxury review grid.
  - Features 5-star gold ratings, verified client badges, obsidian glass cards with subtle gold hover borders, and smooth numbered pagination controls (`1 / 2`, `← / →`) that give users complete control over reading reviews.
- **Cinematic Multi-Image Hero Slideshow ([`components/hero.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/hero.tsx))**:
  - Implemented automatic cycling between 5 flagship luxury slides (Rolls-Royce Phantom Series II, Ferrari SF90 Stradale, Mercedes-Maybach S680, Gulfstream G650 Tarmac Concierge, and Rolls-Royce Bridal Convoy).
  - Features smooth 1.4s cross-dissolve with continuous 7s Ken Burns slow-scale zoom (`scale: 1.0` -> `1.06`), dynamic model badge above the headline that synchronizes with the active vehicle, and interactive gold progress indicators (`01 / 05`).

## 33. Luxury Mobility Landing Page Competitive Research & Strategic Roadmap
- **Competitive Benchmark**: Audited global and regional luxury leaders:
  - **Wheely** (London/Dubai): CPD-accredited chauffeur academy, NDA privacy guarantees, in-cabin sensory curation, 60-min airport wait guarantees.
  - **Hype Luxury** (India/Global): Multi-mobility positioning (supercars alongside private jets and yachts), "GODDS Club" & "Privé" private members' tiers for UHNWIs, restrained editorial typography.
  - **Masterkey VIP** (Dubai): Instant 1-tap WhatsApp concierge bridge with model pre-fill (70%+ conversion in luxury mobility), prominent "0 Deposit Friction / 24h Bank UTR Refund" guarantees.
- **DriveIt Gap Analysis & High-Impact Opportunities**:
  1. *Floating WhatsApp VIP Concierge Bridge*: Lowers inquiry friction for high-ticket wedding and corporate convoy bookings (+28% to +35% lead volume).
  2. *White-Glove Chauffeur Standard of Care Module*: Highlights vetted chauffeurs, discretion NDAs, and executive in-cabin amenities (+20% corporate CXO conversion).
  3. *Zero-Friction Deposit & Security Guarantee Badge*: Addresses the #1 hesitation point in Indian luxury self-drive (-40% checkout drop-off).
  4. *Regional Enterprise & Luxury Venue Social Proof*: Monochromatic partner bar (Taj Falaknuma, ITC Kohenur, Novotel HICC, Marriott) + verified Google Reviews score.
  5. *Occasion-Driven Experience Curation*: Curated intent tabs (Weddings & Bridal Convoys, Corporate CXO, VIP Airport, Weekend Exotics) to drive AOV (+22%).
  6. *"DriveIt Privé" Concierge Membership*: Corporate accounts, priority dispatch, and standing reservations.
- **Reference Artifact**: Detailed report and phased Gantt roadmap stored in `luxury_car_rental_landing_page_research.md`.

## 34. Hype.luxury Visual-First Architecture & Zero-Lag Performance Engineering (November 2026)
- **Visual Supremacy & Light-Grey Studio Fleet Cards (Referenced against `https://hype.luxury`)**:
  - **Light-Grey Studio Cyclorama Fleet (`public/studio/*.jpg`, `public/sadan/*.jpg`, `public/suv/*.jpg`, `public/trending/*.jpg`)**: Generated high-resolution (500KB+ 1408×768) commercial automotive studio photographs on a seamless light warm-grey (`#dfddd8`) cyclorama background with every vehicle positioned at the exact 35-degree front-left 3/4 studio angle and soft ground contact shadow. Overwrote all 28 legacy blurry thumbnails and added `/studio/*.jpg?v=2` cache-busted paths across [`lib/cars.ts`](file:///e:/Github/driveit/lib/cars.ts) and [`lib/cms.ts`](file:///e:/Github/driveit/lib/cms.ts).
  - **Exact Hype.luxury Card Layout ([`components/car-card.tsx`](file:///e:/Github/driveit/components/car-card.tsx), [`components/home/interactive-fleet-atelier.tsx`](file:///e:/Github/driveit/components/home/interactive-fleet-atelier.tsx), [`app/(site)/cars/[slug]/page.tsx`](file:///e:/Github/driveit/app/(site)/cars/[slug]/page.tsx))**: Rounded `[22px]` light-grey (`#dfddd8`) studio stage with top-left tracked bronze uppercase `BRAND` (`#7a6440`) + large light black `Model` (`#111111`), top-right `• GODDS MEMBERS` / `• PRIVÉ CHARTER` indicator, and `unoptimized` `<Image>` rendering for 100% pixel sharpness.
- **Root-Cause Performance & Speed Fixes (60/120 FPS & <1ms Navigation)**:
  1. **Removed Lenis Wheel Hijacking & Scroll-Scrub Springs**: Deleted `components/home/smooth-scroll.tsx` and `components/home/use-scrub.ts`, which caused double-damped scroll input lag.
  2. **Eliminated GPU Texture Bottlenecks**: Removed the `260vmax × 260vmax` mouse-tracking radial spotlight layer, `blur-[220px]` ambient filters, and simultaneous eager decoding of 5× 1.6MB PNGs in [`components/home/showroom-hero.tsx`](file:///e:/Github/driveit/components/home/showroom-hero.tsx) (now mounts only the active + next slide).
  3. **In-Memory CMS Cache & 900ms Circuit Breaker ([`lib/cms.ts`](file:///e:/Github/driveit/lib/cms.ts), [`lib/revalidate.ts`](file:///e:/Github/driveit/lib/revalidate.ts))**: Added a 60s in-memory TTL cache + 900ms query timeout with a 30s offline circuit breaker so server renders never hang on cold/offline Postgres pools and resolve in `<1ms` across route transitions.
  4. **0ms Instant Fleet Hydration ([`hooks/use-fleet.ts`](file:///e:/Github/driveit/hooks/use-fleet.ts))**: Initialized `useFleet()` with `carsData` immediately instead of an empty `[]` loading state, so `/cars` and `/checkout` paint instantly on first frame.
- **Smooth 1-Click Booking & Private Commission Drawer ([`components/home/quick-book-drawer.tsx`](file:///e:/Github/driveit/components/home/quick-book-drawer.tsx), [`components/home/hype-home-client.tsx`](file:///e:/Github/driveit/components/home/hype-home-client.tsx))**:
  - Clicking **Book** on any vehicle on `/` or `/cars` opens an instant slide-over configurator drawer (`Chauffeur / Self-Drive / Airport VIP`, Hyderabad Hub pills, Pickup/Return dates, live tariff calculation, 1-click checkout or 1-tap WhatsApp).
  - Clicking **Inquire Privately** on Private Jets, Superyachts, Luxury Coaches, or Royal Bridal opens the drawer in **Privé Commission Mode** (submitting directly to `/api/contact`).
- **Contact-Only Enforcement & Backend Hardening**:
  - Upgraded [`app/(site)/services/private-jet-services/page.tsx`](file:///e:/Github/driveit/app/(site)/services/private-jet-services/page.tsx), [`app/(site)/services/yacht-services/page.tsx`](file:///e:/Github/driveit/app/(site)/services/yacht-services/page.tsx), and [`app/(site)/services/luxury-buses/page.tsx`](file:///e:/Github/driveit/app/(site)/services/luxury-buses/page.tsx) into visual-first Contact-Only showcases.
  - Hardened [`app/api/checkout/init/route.ts`](file:///e:/Github/driveit/app/api/checkout/init/route.ts), [`app/api/checkout/confirm/route.ts`](file:///e:/Github/driveit/app/api/checkout/confirm/route.ts), [`app/api/contact/route.ts`](file:///e:/Github/driveit/app/api/contact/route.ts), and [`lib/customers.ts`](file:///e:/Github/driveit/app/api/contact/route.ts).
- **Interactive Animated Landing Page Experience ([`components/home/interactive-studio-stage.tsx`](file:///e:/Github/driveit/components/home/interactive-studio-stage.tsx), [`components/home/interactive-route-concierge.tsx`](file:///e:/Github/driveit/components/home/interactive-route-concierge.tsx), [`components/home/showroom-hero.tsx`](file:///e:/Github/driveit/components/home/showroom-hero.tsx))**:
  - **Bespoke Studio Stage Configurator (`InteractiveStudioStage`)**: Full-width `#dfddd8` light-grey studio stage with interactive pulsing hotspot pins (`+`) on each flagship car (`Rolls-Royce Phantom`, `Aston Martin DB12`, `Ferrari SF90 Stradale`, `Mercedes-AMG G 63`, `Lamborghini Huracán Evo`), animated equalizer acoustic profile toggle, animated BHP power gauge, and interactive 1–14 day charter tariff calculator.
  - **Hyderabad VVIP Route & Flight-Sync Radar (`InteractiveRouteConcierge`)**: Interactive architectural SVG telemetry radar map of Hyderabad with animated gold vector trajectory curves across 4 VVIP corridors (`RGIA Shamshabad`, `Taj Falaknuma Palace`, `Begumpet Private Aviation`, `Jubilee Hills`, `Financial District`) and 1-click corridor dispatch.
  - **Kinetic Hero (`ShowroomHero`)**: Added zero-render GPU `translate3d` pointer parallax, live telemetry HUD badges, keyboard arrow navigation, and an interactive **Studio View (`#dfddd8`)** vs **Midnight Tarmac** toggle.
- **Root-Cause Fix for Next.js 16 Turbopack `unhandledRejection: undefined` & Offline Checkout Fallback**:
  - **Root Cause**: When local Docker Postgres is not running, `@payloadcms/db-postgres` (`node_modules/@payloadcms/db-postgres/dist/connect.js`) calls `this.rejectInitializing()` with **no argument (`undefined`)** on an un-awaited `adapter.initializing` promise during `getPayload()`, triggering Node.js / Turbopack's `⨯ "unhandledRejection:" undefined at RootLayout`.
  - **Adapter Guard & TCP Socket Probe ([`lib/db.ts`](file:///e:/Github/driveit/lib/db.ts), [`lib/cms.ts`](file:///e:/Github/driveit/lib/cms.ts))**: Wrapped `base.init` in `buildDatabaseAdapter()` to attach `.catch(() => {})` on `adapter.initializing` and ensure `rejectInitializing` always receives an `Error` instance, plus added a `<150ms` `isPostgresReachable()` TCP socket probe before `getPayload()` is invoked.
  - **Local In-Memory Checkout Store ([`lib/local-booking-fallback.ts`](file:///e:/Github/driveit/lib/local-booking-fallback.ts))**: Integrated into [`app/api/checkout/init/route.ts`](file:///e:/Github/driveit/app/api/checkout/init/route.ts), [`app/api/checkout/confirm/route.ts`](file:///e:/Github/driveit/app/api/checkout/confirm/route.ts), [`app/api/coupons/validate/route.ts`](file:///e:/Github/driveit/app/api/coupons/validate/route.ts), and [`lib/actions/bookings.ts`](file:///e:/Github/driveit/lib/actions/bookings.ts) so the entire 10-minute hold, promo code (`WELCOME10`, `PRIVE15`), and booking confirmation flow works seamlessly during local UI previews even when Docker Postgres is stopped.
- **Unified Typography, 2-Column Studio Grid & Zero-Overlap Studio Headroom**:
  - **Unified Geometric Luxury Font ([`app/globals.css`](file:///e:/Github/driveit/app/globals.css), [`components/car-card.tsx`](file:///e:/Github/driveit/components/car-card.tsx))**: Bound `--font-sans`, `--font-mono`, `--font-display`, and `--font-luxury` to `var(--font-display-face)` (`Jost`) with `tabular-nums` so prices (`₹1,85,000 / day`), buttons, pills, and headings share the exact same geometric sans family instead of harsh monospace digits.
  - **Removed `GODDS MEMBERS`**: Stripped all `GODDS` badges across [`components/car-card.tsx`](file:///e:/Github/driveit/components/car-card.tsx), [`components/home/interactive-studio-stage.tsx`](file:///e:/Github/driveit/components/home/interactive-studio-stage.tsx), [`components/home/closing-drive.tsx`](file:///e:/Github/driveit/components/home/closing-drive.tsx), [`components/fleet-carousel.tsx`](file:///e:/Github/driveit/components/fleet-carousel.tsx), [`app/(site)/cars/[slug]/page.tsx`](file:///e:/Github/driveit/app/(site)/cars/[slug]/page.tsx), and [`app/(site)/checkout/checkout-client.tsx`](file:///e:/Github/driveit/app/(site)/checkout/checkout-client.tsx).
  - **2 Cards Per Row Layout**: Updated [`app/(site)/cars/page.tsx`](file:///e:/Github/driveit/app/(site)/cars/page.tsx) (`CARS_PER_PAGE = 8`, `grid-cols-1 md:grid-cols-2 gap-7`), [`components/home/interactive-fleet-atelier.tsx`](file:///e:/Github/driveit/components/home/interactive-fleet-atelier.tsx), and [`components/service-fleet-showcase.tsx`](file:///e:/Github/driveit/components/service-fleet-showcase.tsx) to render 2 large studio cards per row.
  - **Extended Top Studio Headroom (`?v=3`)**: Added 165px of seamless top studio cyclorama headroom (`1408×880`) across all 13 `public/studio/*.jpg` and 28 `public/sadan|suv|trending/*.jpg` assets so vehicle roofs/windshields never overlap the top-left brand and model title.

## 35. Full Visual & Acoustic Refinements (November 2026)
- **Luxury Theme Dropdowns & Date Pickers ([`components/luxury-select.tsx`](file:///e:/Github/driveit/components/luxury-select.tsx), [`components/luxury-date-picker.tsx`](file:///e:/Github/driveit/components/luxury-date-picker.tsx))**:
  - Replaced native browser `<select>` in [`app/(site)/cars/[slug]/booking-widget.tsx`](file:///e:/Github/driveit/app/(site)/cars/[slug]/booking-widget.tsx) and [`components/home/showroom-hero.tsx`](file:///e:/Github/driveit/components/home/showroom-hero.tsx) with `<LuxurySelect />`.
  - Replaced native `<input type="date">` in [`components/home/showroom-hero.tsx`](file:///e:/Github/driveit/components/home/showroom-hero.tsx) with `<LuxuryDatePicker />`.
  - Dropdowns render via React Portal with obsidian `#0c0c0e` backdrop blur, 1px gold border (`var(--gold-400)/30`), gold hover state, active checkmarks, and custom typography, completely eliminating OS blue highlights.
- **Procedural Web Audio API Engine Acoustic Synthesizer ([`lib/engine-audio.ts`](file:///e:/Github/driveit/lib/engine-audio.ts), [`components/home/interactive-studio-stage.tsx`](file:///e:/Github/driveit/components/home/interactive-studio-stage.tsx))**:
  - Built a multi-oscillator procedural audio synthesizer (`playEngineAcoustic`) with dynamic harmonic filtering, LFO cylinder stroke modulation, and soft attack/decay curves.
  - Implemented 5 engine acoustics:
    1. **Rolls-Royce V12 Whisper Cabin**: 48Hz deep fundamental hum, muted 260Hz low-pass cutoff, silky smooth idle purr.
    2. **Aston Martin DB12 V8 Twin-Turbo**: 65Hz fundamental, rising rev flare to 220Hz, twin-scroll exhaust growl.
    3. **Ferrari SF90 Flat-Plane Hybrid V8**: 85Hz fundamental revving aggressively to 340Hz + high-frequency electric motor turbine whine.
    4. **Mercedes-AMG G 63 V8 Biturbo**: 52Hz low rumble with heavy 14Hz LFO amplitude modulation for signature side-exit thud.
    5. **Lamborghini Huracán NA V10**: 95Hz rising to 390Hz high-rev scream with resonant filter peak.
  - Toggling "Acoustic Active" plays real startup ignition, throttle flare, and rhythmic idle; clicking hotspots or switching vehicles triggers an authentic throttle rev blip.
- **Tangent-Smoothed 4-Sided Studio Canvas Padding (`?v=4`)**:
  - Rebuilt all 41 studio and legacy vehicle assets (`public/studio/*.jpg`, `public/sadan/*.jpg`, `public/suv/*.jpg`, `public/trending/*.jpg`) from pristine 1408×768 master artifacts with tangent-smoothed edge padding (`padTop: 210, padBottom: 45, padX: 160`) at 1600×1000 south position.
  - Eliminates vertical compression (`fit: 'fill'` squishing) and provides generous breathing room on all 4 sides.
  - Updated [`components/home/interactive-studio-stage.tsx`](file:///e:/Github/driveit/components/home/interactive-studio-stage.tsx) container to `aspect-[16/10]` with `object-contain object-bottom` and comfortable padding.
  - Bumped cache string to `?v=4` across [`lib/cars.ts`](file:///e:/Github/driveit/lib/cars.ts), [`lib/cms.ts`](file:///e:/Github/driveit/lib/cms.ts), [`components/fleet-carousel.tsx`](file:///e:/Github/driveit/components/fleet-carousel.tsx), and hero components.
- **Private Jet Services — Studio Canvas & Pure Aircraft Only ([`app/(site)/services/private-jet-services/page.tsx`](file:///e:/Github/driveit/app/(site)/services/private-jet-services/page.tsx))**:
  - Completely removed Rolls-Royce Apron Transfer and all car imagery.
  - Created 2-cards-per-row (`grid-cols-1 md:grid-cols-2 gap-7`) light-grey `#dfddd8` studio canvas cards showcasing 4 pure aircraft:
    1. Gulfstream Aerospace G650ER (`/studio/jet-g650-tarmac.jpg`)
    2. Embraer Executive Praetor 600 (`/studio/jet-praetor600.jpg`)
    3. Bombardier Aviation Global 7500 (`/studio/jet-g650-takeoff.jpg`)
    4. Gulfstream Aerospace G650 High-Altitude Flagship (`/studio/jet-g650er.jpg`)
  - Integrated top-left tracked uppercase builder & model, top-right "Contact Only" badge, and dark obsidian specs bar with 1-tap commission inquiry.
- **Superyachts — Pure Luxury Vessels Only ([`app/(site)/services/yacht-services/page.tsx`](file:///e:/Github/driveit/app/(site)/services/yacht-services/page.tsx), [`components/home/showroom-hero.tsx`](file:///e:/Github/driveit/components/home/showroom-hero.tsx), [`components/home/beyond-panels.tsx`](file:///e:/Github/driveit/components/home/beyond-panels.tsx))**:
  - Replaced the mistakenly used private jet cabin image across all pages with genuine golden-sunset luxury superyacht imagery (`/yachts/pin-yacht-2.jpg`).
  - Purged all cars, buses, and aviation imagery from the yacht showcase.
  - Features 4 pure luxury yacht vessels in a 2-cards-per-row grid:
    1. Benetti Yachts Oasis 40M Flagship (`/yachts/pin-yacht-2.jpg`)
    2. Azimut Yachts Grande 36M Ocean Cruiser (`/yachts/pin-yacht-1.jpg`)
    3. Ferretti Yachts 1000 Ocean Suite (`/yachts/yacht-1.jpg`)
    4. Sunseeker 90 Ocean Privé (`/yachts/yacht-hero.jpg`)

## 36. Local Database Offline Resilience & Zero-Error Build Hygiene
- **Postgres TCP Reachability Probing**:
  - Added `<150ms` non-blocking socket probe `isPostgresReachable()` from [`lib/db.ts`](file:///e:/Github/driveit/lib/db.ts).
  - Protected [`lib/blog-seed.ts`](file:///e:/Github/driveit/lib/blog-seed.ts), [`app/api/bookings/count/route.ts`](file:///e:/Github/driveit/app/api/bookings/count/route.ts), and [`components/personalized-social-proof.tsx`](file:///e:/Github/driveit/components/personalized-social-proof.tsx) from attempting `getPayload({ config })` when local Docker Postgres is offline, completely eliminating unhandled rejections and Turbopack dev server error overlays.
  - Hardened customer dashboard pages ([`app/(site)/dashboard/page.tsx`](file:///e:/Github/driveit/app/(site)/dashboard/page.tsx), [`app/(site)/dashboard/bookings/page.tsx`](file:///e:/Github/driveit/app/(site)/dashboard/bookings/page.tsx), [`app/(site)/dashboard/invoices/[id]/page.tsx`](file:///e:/Github/driveit/app/(site)/dashboard/invoices/[id]/page.tsx), [`app/(site)/dashboard/profile/page.tsx`](file:///e:/Github/driveit/app/(site)/dashboard/profile/page.tsx), [`app/(site)/dashboard/wishlist/page.tsx`](file:///e:/Github/driveit/app/(site)/dashboard/wishlist/page.tsx)) with offline fallbacks via [`lib/local-booking-fallback.ts`](file:///e:/Github/driveit/lib/local-booking-fallback.ts).
- **Zero-Error ESLint & Clean Typecheck**:
  - Resolved all synchronous `setState` in effect cascades across luxury controls ([`LuxuryDatePicker`](file:///e:/Github/driveit/components/luxury-date-picker.tsx), [`LuxurySelect`](file:///e:/Github/driveit/components/luxury-select.tsx), [`ContactForm`](file:///e:/Github/driveit/components/contact-form.tsx), [`SiteHeader`](file:///e:/Github/driveit/components/site-header.tsx), [`SiteFooter`](file:///e:/Github/driveit/components/site-footer.tsx), [`PromoBanner`](file:///e:/Github/driveit/components/promo-banner.tsx), [`PageProgressBar`](file:///e:/Github/driveit/components/page-progress-bar.tsx)) via `queueMicrotask()`.
  - Replaced native `<a>` in [`components/cms/AfterLogin.tsx`](file:///e:/Github/driveit/components/cms/AfterLogin.tsx) with Next.js `<Link>`.
  - `npm run typecheck` and `npm run lint` both pass cleanly with 0 errors.

## 37. Visual Studio Harmonization, WebP Pipeline, Audio Signature Differentiation, Flight-Sync Radar & Security Hardening (November 2026)
- **Distinct Acoustic Engine Profiles ([`lib/engine-audio.ts`](file:///e:/Github/driveit/lib/engine-audio.ts), [`components/home/interactive-studio-stage.tsx`](file:///e:/Github/driveit/components/home/interactive-studio-stage.tsx))**:
  - Rebuilt the Web Audio API synthesizer through a `DynamicsCompressorNode` with 5 distinct physical architectures:
    1. **V12 Whisper (`v12-whisper`, Rolls-Royce Phantom)**: Velvet harmonic chord (`92/138/184Hz`) + soft turbine air flow + satin LP swell (`310->520Hz`).
    2. **V8 Twin-Turbo (`v8-twinturbo`, Aston Martin DB12)**: Detuned sawtooth pair (`82/83.8Hz`), warm saturation waveshaper, compressor spool whine (`1650->4200Hz`), and 3-pulse twin-scroll wastegate flutter (`triggerWastegateFlutter`).
    3. **Flat-Plane Hybrid V8 (`v8-hybrid`, Ferrari SF90 Stradale)**: Dual high-voltage e-motor sine glide (`980+1960Hz -> 2600+4800Hz`) blended with high-frequency flat-plane crank (`152->460Hz`) and F1 shift bark.
    4. **Cross-Plane AMG V8 (`v8-amg`, Mercedes-AMG G 63)**: Deep 52Hz rumble with `9.5Hz` asymmetric chop LFO, waveshaper overdrive (`0.65`), and 4 procedural overrun exhaust pops (`triggerOverrunPop`).
    5. **NA V10 Screamer (`v10-screamer`, Lamborghini Huracán Evo)**: Odd-order 1:2.5:5 harmonic stack (`136/340/680Hz`) through a resonant bandpass (`880->2400Hz`) with sharp downshift crackles.
  - Added an explicit **Rev** button next to **Acoustic Active** and `01`–`03` hotspot pill controls in [`InteractiveStudioStage`](file:///e:/Github/driveit/components/home/interactive-studio-stage.tsx).
- **Studio Card Synchronization, Artifact Removal & Full `.webp` Asset Conversion (`public/`)**:
  - Processed 43 studio car photographs (`public/studio/*.jpg`, `public/sadan/*.jpg`, `public/suv/*.jpg`, `public/trending/*.jpg`) using `sharp` perimeter-seeded gradient-constrained flood-fill + distance cosine feathering to unify studio backdrops to exact **`#ebebea` (`rgb(235, 235, 234)`)** while preserving authentic under-tire ground shadows and silver/black paint reflections.
  - Cleaned overhead softbox artifacts (`carnival`, `suv/1`), right-border streak lines (`suv/2`, `suv/9`), and replaced the cropped/edge-smeared `suv/5` source with full-width Carnival studio render.
  - Converted 84 non-hero `.jpg`/`.png` files across `public/` (cars, jets, non-hero yachts, 1-4 thumbnails, 404 banner, placeholder) into `.webp`, removed superseded non-hero originals and corrupt 3KB test file `g650er-test.jpg`, while **preserving hero section images** and `/logo.png`.
  - Updated all 16 source modules referencing converted assets to `.webp` (`?v=5` for studio fleet) and unified studio containers across [`CarCard`](file:///e:/Github/driveit/components/car-card.tsx), [`InteractiveStudioStage`](file:///e:/Github/driveit/components/home/interactive-studio-stage.tsx), [`CarDetailPage`](file:///e:/Github/driveit/app/(site)/cars/[slug]/page.tsx), [`QuickBookDrawer`](file:///e:/Github/driveit/components/home/quick-book-drawer.tsx), [`CheckoutClient`](file:///e:/Github/driveit/app/(site)/checkout/checkout-client.tsx), [`CompareModal`](file:///e:/Github/driveit/components/compare-modal.tsx), [`FleetCarousel`](file:///e:/Github/driveit/components/fleet-carousel.tsx), [`InteractiveFleetAtelier`](file:///e:/Github/driveit/components/home/interactive-fleet-atelier.tsx), and [`PrivateJetServicesPage`](file:///e:/Github/driveit/app/(site)/services/private-jet-services/page.tsx) to exact `bg-[#ebebea]` (plus frosted light pills over sky/tarmac aircraft photos).
  - Eliminated the horizontal seam above the studio stage in [`InteractiveStudioStage`](file:///e:/Github/driveit/components/home/interactive-studio-stage.tsx) by overlaying the header directly onto the `#ebebea` studio frame and removing bottom hotspot label truncation.
- **Enhanced Car Details Experience ([`InteractiveStudioStage`](file:///e:/Github/driveit/components/home/interactive-studio-stage.tsx), [`app/(site)/cars/[slug]/page.tsx`](file:///e:/Github/driveit/app/(site)/cars/[slug]/page.tsx))**:
  - Expanded studio telemetry grid with Transmission + FASTag/KYC readout and **View Full Vehicle Dossier** link.
  - Upgraded `/cars/[slug]` with an Executive Dossier, occasion tags, Chauffeur vs Self-Drive tariff comparison card, 8-row Technical & Hospitality Spec matrix, DRIVEIT White-Glove Assurance cards (10-min Postgres hold lock, 60-min flight touchdown buffer, 48h UTR deposit audit), and Comparable Machines grid reusing `<CarCard />`.
- **Themed Date Pickers Across All Forms & IST Midnight Fix ([`lib/utils.ts`](file:///e:/Github/driveit/lib/utils.ts), [`components/luxury-date-picker.tsx`](file:///e:/Github/driveit/components/luxury-date-picker.tsx), [`components/contact-form.tsx`](file:///e:/Github/driveit/components/contact-form.tsx), [`components/home/quick-book-drawer.tsx`](file:///e:/Github/driveit/components/home/quick-book-drawer.tsx))**:
  - Replaced all 4 remaining native `<input type="date">` inputs across `ContactForm` and `QuickBookDrawer` with `<LuxuryDatePicker />`.
  - Fixed Portal React synthetic click bubbling inside `<LuxuryDatePicker />` (`stopPropagation()`) so calendar selections inside modal/drawer backdrops never dismiss parent overlays, added conditional keyed mounting in [`HypeHomeClient`](file:///e:/Github/driveit/components/home/hype-home-client.tsx), and added `getLocalDateString()` to fix IST (`UTC+05:30`) midnight date shifts.
- **Upgraded Flight-Sync & Route Radar ([`components/home/interactive-route-concierge.tsx`](file:///e:/Github/driveit/components/home/interactive-route-concierge.tsx))**:
  - Re-mapped hub badge coordinates with clickable pill frames on a `560×340` radar canvas to completely eliminate `Jubilee Hills` / `Banjara Hills` text collision.
  - Added stylized Musi River / Hussain Sagar geography, conical GPU radar sweep, glowing Bézier corridor curves with animated SMIL `<animateMotion>` convoy beacon, live flight-code preset pills, and gate telemetry readout.
- **Brand Rename (`Journal` -> `Blog`)**:
  - Replaced user-facing, SEO, RSS, `llms-full.txt`, CMS admin hint, header/footer nav, and breadcrumb `Journal` references with `Blog`.
- **Security, Dependency & Efficiency Patches**:
  - Upgraded `next` (`16.3.6 -> 16.4.6`), `eslint-config-next` (`16.4.6`), and `sharp` (`0.35.4 -> 0.35.5`) via non-breaking `npm audit fix`, clearing Next.js CVEs while keeping Payload CMS 3.90.1 intact.
  - Added `safeTokenMatches` (SHA-256 `timingSafeEqual`) in [`lib/env.ts`](file:///e:/Github/driveit/lib/env.ts), open-redirect protection (`sanitizeRedirectPath`) in [`app/(site)/login/page.tsx`](file:///e:/Github/driveit/app/(site)/login/page.tsx), `after()` + `escapeHtml(sanitizeText(...))` in [`app/api/contact/route.ts`](file:///e:/Github/driveit/app/api/contact/route.ts), magic-byte binary inspection (`JPG/PNG/WEBP/PDF`) + `isPostgresReachable()` in [`app/api/profile/documents/route.ts`](file:///e:/Github/driveit/app/api/profile/documents/route.ts), offline DB checks in [`auth.ts`](file:///e:/Github/driveit/auth.ts) & [`app/api/partners/apply/route.ts`](file:///e:/Github/driveit/app/api/partners/apply/route.ts), rate limiting + `depth: 0` + staff collection check in [`app/api/telematics/ping/route.ts`](file:///e:/Github/driveit/app/api/telematics/ping/route.ts) & [`app/api/telematics/fleet/route.ts`](file:///e:/Github/driveit/app/api/telematics/fleet/route.ts), and `dangerouslyAllowSVG: false` + `X-Permitted-Cross-Domain-Policies` in [`next.config.mjs`](file:///e:/Github/driveit/next.config.mjs).

## 38. Ultra-Crisp 16:9 Widescreen Hero `.webp` Regeneration & Zero-JPG Repo Purge (November 2026)
- **Root Cause Fixed**: Old hero assets (`rolls-royce-phantom-night.png`, `maybach-s680-night.png`, `ferrari-sf90-stradale-black-studio.png`, `gulfstream-g650-private-jet-on-tarmac-night.png`, etc.) were `1024×1024` squares — cropping into a full-screen `16:9` `object-cover` viewport left only `1024×576` pixels stretched across desktop monitors, and Slide 2 (`ASTON MARTIN DB12`) in [`ShowroomHero`](file:///e:/Github/driveit/components/home/showroom-hero.tsx) referenced `maybach-s680-night.png`, while several service pages loaded external low-res `i.pinimg.com/*.jpg` thumbnails and nonexistent `/og/*.jpg` URLs.
- **High-Res 16:9 Generation & `.webp` Pipeline**:
  - Generated 10 bespoke `16:9` widescreen dark-luxury editorial scenes and processed via `sharp` (`1920×1072`, `lanczos3` scaling + subtle `sigma: 0.45` micro-contrast sharpen, `webp({ quality: 90, effort: 6, smartSubsample: false })`):
    - `/rolls-royce-phantom-night.webp`
    - `/aston-martin-db12-night.webp` (fixes Slide 2 authentic DB12 match)
    - `/maybach-s680-night.webp`
    - `/ferrari-sf90-stradale-black-studio.webp`
    - `/gulfstream-g650-private-jet-on-tarmac-night.webp`
    - `/yachts/superyacht-hero.webp` (replaces deleted `public/yachts/pin-yacht-2.jpg`)
    - `/luxury-coach-interior-black-gold.webp`
    - `/rolls-royce-wedding-ribbon.webp`
    - `/luxury-flagship-cars-in-black-studio.webp`
    - `/black-chauffeur-sedan-night-city.webp`
- **Complete `.jpg` Removal & Hero Component Cleanup**:
  - Deleted all 11 superseded image files from `public/` (`public/yachts/pin-yacht-2.jpg` + all 10 old `1024×1024` `.png` hero assets). Zero `.jpg`/`.jpeg` files remain in the repo (`94` `.webp` assets total; only `public/logo.png` retained as 8KB brand wordmark).
  - Updated all home heroes, commission panels, story showcases, closing banners, about/login/thankyou pages, seed defaults, `app/api/site-settings/route.ts`, `app/(site)/layout.tsx`, all 10 service pages, [`Showcase`](file:///e:/Github/driveit/components/showcase.tsx), [`TrendingGrid`](file:///e:/Github/driveit/components/trending-grid.tsx), and all 9 `app/(site)/services/**/metadata.ts` OpenGraph images to resolve strictly to crisp local `.webp` assets (`1920×1072`).
  - Removed `'i.pinimg.com'` from [`next.config.mjs`](file:///e:/Github/driveit/next.config.mjs) `images.remotePatterns`, configured `images.qualities: [75, 82, 85, 90]`, replaced `todayIso` in [`ShowroomHero`](file:///e:/Github/driveit/components/home/showroom-hero.tsx) with [`getLocalDateString()`](file:///e:/Github/driveit/lib/utils.ts), and removed the `Studio View` / `studioLightMode` cyclorama toggle from [`ShowroomHero`](file:///e:/Github/driveit/components/home/showroom-hero.tsx) so hero slides always display crisp dark widescreen photography.

## 39. Hero & Site Header Navigation Redesign (November 2026)
- **Root Cause Fixed in [`SiteHeader`](file:///e:/Github/driveit/components/site-header.tsx)**:
  - The old 3-column CSS Grid (`grid-cols-[1fr_auto_1fr]`) placed a tiny ~80px `Menu` trigger on the left while packing 5 uppercase links + `Sign In` + `Book Now` (~790px) on the right, causing CSS Grid `1fr` track sizing to push the `DRIVEIT` logo right next to `CARS` with empty space on the left and congestion on the right.
  - At `scrollY = 0`, `headerBg` (`0`) and `headerBlur` (`0`) left the logo and white links sitting transparently over bright studio overhead light strips in the hero photography.
- **Architectural Changes**:
  - Switched [`SiteHeader`](file:///e:/Github/driveit/components/site-header.tsx) to a balanced 3-zone flex bar (`justify-between`) across `max-w-[1520px]`: Left high-contrast `DRIVEIT` logo (`h-8 sm:h-9`, gold drop-shadow halo), Center frosted obsidian pill navigation dock (`HEADER_NAV_LINKS`: `Cars`, `Chauffeur`, `Private Jets`, `Yachts`, and `Wedding` at `xl+`), and Right member account / `Sign In` pill + `Book Now` primary CTA + bordered `Menu` drawer trigger pill (`min-h-[40px]`).
  - Enabled smoked obsidian frosted glass from `scrollY = 0` (`headerBg: [0.82, 0.96]`, `headerBlur: [14, 22]`, `borderOpacity: [0.08, 0.14]`) so logo and links remain crisp over every hero slide.
  - Removed unused `TOP_NAV_LINKS` constant and unused `Car`, `Plane`, `Anchor` icon imports.
  - Updated [`ShowroomHero`](file:///e:/Github/driveit/components/home/showroom-hero.tsx) top scene switcher (`top-[92px] sm:top-[104px] md:top-[110px]`) inside a cohesive frosted obsidian pill dock (`bg-black/65 backdrop-blur-xl border border-white/10 p-1`) with deepened top gradient vignette (`h-52 from-[#040405]/95 via-[#040405]/55`) and matching frosted `Prev/Next` arrow styling so it never crowds against the fixed header or `PromoBanner`.

## 40. Mobile & Cross-Device Responsive Architecture (November 2026)
- **Viewport, Sticky Positioning & iOS Safari Input Auto-Zoom Prevention**:
  - Updated [`app/(site)/layout.tsx`](file:///e:/Github/driveit/app/(site)/layout.tsx) `viewport` export with `viewportFit: "cover"` for notched iOS/Android safe areas (`env(safe-area-inset-*)`).
  - Updated [`app/globals.css`](file:///e:/Github/driveit/app/globals.css): switched `body` from `overflow-x: hidden` to `overflow-x: clip` (preventing broken `position: sticky` in WebKit/Chrome), added `touch-action: manipulation` and `-webkit-tap-highlight-color: transparent` across interactive elements, and added `@media (max-width: 767px)` `font-size: max(16px, 1rem) !important` on form inputs/selects/textareas so iOS Safari never auto-zooms on focus.
- **Navigation, Touch Account Menu & Floating Docks Clearance**:
  - Updated [`SiteHeader`](file:///e:/Github/driveit/components/site-header.tsx) with tap-togglable `accountMenuOpen` state + outside-pointer dismissal (desktop `lg:group-hover` retained), notched safe-area header & drawer padding, mobile-first `Sign In / Member Portal` & `Sign Out` controls inside the full-screen drawer `Client Access` panel, and tighter `320px` header button spacing.
  - Updated [`Sidectabtn`](file:///e:/Github/driveit/components/Sidectabtn.tsx) with `env(safe-area-inset-bottom/right)` positioning, `hidden sm:block` hover labels, `type="button"`, and passive scroll listener.
  - Shifted fixed bottom action docks (`right-20` on `< sm` + safe-area inset) in [`InteractiveFleetAtelier`](file:///e:/Github/driveit/components/home/interactive-fleet-atelier.tsx), [`app/(site)/cars/page.tsx`](file:///e:/Github/driveit/app/(site)/cars/page.tsx), and [`app/(site)/services/luxury-car-rental/page.tsx`](file:///e:/Github/driveit/app/(site)/services/luxury-car-rental/page.tsx) so they never overlap behind the bottom-right Call/WhatsApp FABs.
- **Responsive Home Sections, Drawers & Touch Cards**:
  - Refactored [`ShowroomHero`](file:///e:/Github/driveit/components/home/showroom-hero.tsx) to flex-column vertical distribution (`min-h-[100svh]`) eliminating landscape/short-screen overlap between the top scene switcher and bottom command bar, made pickup hub selector visible on mobile, converted telemetry chips to `grid-cols-2` on `< sm`, and guarded mouse parallax with `e.pointerType === 'mouse'`.
  - Refactored [`BeyondPanels`](file:///e:/Github/driveit/components/home/beyond-panels.tsx) from a fixed `min-h-[540px]` squished mobile stack into clean expandable mobile accordion cards (`min-h-[124px]` collapsed, `min-h-[340px]` expanded, `lg:h-[68svh] lg:flex-row` preserved on desktop).
  - Updated [`InteractiveStudioStage`](file:///e:/Github/driveit/components/home/interactive-studio-stage.tsx) (studio overlay mobile scale, `p-1.5` expanded hotspot tap target >= 44px, `grid-cols-2 sm:grid-cols-3` telemetry), [`InteractiveRouteConcierge`](file:///e:/Github/driveit/components/home/interactive-route-concierge.tsx) (`w-24` flight input, mobile preset chips visible, unwrapped corridor route labels, 2-column bottom telemetry), [`QuickBookDrawer`](file:///e:/Github/driveit/components/home/quick-book-drawer.tsx) (`h-[100dvh]`, safe-area padding, `min-[390px]:grid-cols-2` dates), [`ClosingDrive`](file:///e:/Github/driveit/components/home/closing-drive.tsx) & [`CarCard`](file:///e:/Github/driveit/components/car-card.tsx) (mouse-only pointer tilt, cleaner `320px–360px` card overlays & wrapped rate bar), [`LuxuryDatePicker`](file:///e:/Github/driveit/components/luxury-date-picker.tsx) (viewport-clamped width down to `280px` foldables), [`CompareModal`](file:///e:/Github/driveit/components/compare-modal.tsx) (snap swipe cards + `260px` mobile width + 40px+ close target), and [`ProfileForm`](file:///e:/Github/driveit/components/profile-form.tsx) (`flex-wrap gap-3`).
- **App Pages (`login`, `cars/[slug]`, `dashboard/*`, `checkout`, `contactus`)**:
  - Reordered [`app/(site)/login/page.tsx`](file:///e:/Github/driveit/app/(site)/login/page.tsx) (`order-1` Auth Portal, `order-2` Brand Showcase on `< lg`) so mobile users reach Google Sign-In above the fold.
  - Tuned responsive headers, grids, steppers, and paddings across [`app/(site)/cars/[slug]/page.tsx`](file:///e:/Github/driveit/app/(site)/cars/[slug]/page.tsx), [`app/(site)/dashboard/page.tsx`](file:///e:/Github/driveit/app/(site)/dashboard/page.tsx), [`app/(site)/dashboard/bookings/page.tsx`](file:///e:/Github/driveit/app/(site)/dashboard/bookings/page.tsx), [`app/(site)/dashboard/invoices/[id]/page.tsx`](file:///e:/Github/driveit/app/(site)/dashboard/invoices/[id]/page.tsx), [`app/(site)/contactus/page.tsx`](file:///e:/Github/driveit/app/(site)/contactus/page.tsx), and [`app/(site)/checkout/checkout-client.tsx`](file:///e:/Github/driveit/app/(site)/checkout/checkout-client.tsx).

## 41. Project Cleanup & Bundle Hygiene (November 2026)
- **Junk & Obsolete Files Removed (`6` files + `4` empty dirs)**:
  - Removed `.DS_Store`, `app/.DS_Store`, `public/.DS_Store`, stray `audit.log`, stale `public/llms.txt` (superseded by dynamic [`app/llms.txt/route.ts`](file:///e:/Github/driveit/app/llms.txt/route.ts)), `pnpm-lock.yaml` (`Dockerfile` builds with `npm ci` + `package-lock.json`), and empty directories (`logs/`, `styles/`, `lib/actions/`, `public/jets/`).
  - Updated [`.gitignore`](file:///e:/Github/driveit/.gitignore) to ignore `.DS_Store` and updated [`deployment_guide.md`](file:///e:/Github/driveit/deployment_guide.md) to reference [`app/api/webhooks/wacrm/route.ts`](file:///e:/Github/driveit/app/api/webhooks/wacrm/route.ts).
- **Unreachable Source Code Removed (`75` files)**:
  - Removed 20 legacy pre-redesign components (`components/HScroll.tsx`, `Mision.tsx`, `Testomonials.tsx`, `about.tsx`, `booking-section.tsx`, `brand-icon.tsx`, `car-booking-modal.tsx`, `faq.tsx`, `fleet-carousel.tsx`, `hero.tsx`, `location-search-input.tsx`, `marquee-strip.tsx`, `personalized-social-proof.tsx`, `process-timeline.tsx`, `scroll-story-showcase.tsx`, `showcase.tsx`, `stats.tsx`, `trending-grid.tsx`, `trust-strip.tsx`, `upi-payment.tsx`).
  - Removed 48 unused shadcn UI kit modules under `components/ui/`, keeping only actively used [`components/ui/button.tsx`](file:///e:/Github/driveit/components/ui/button.tsx) and [`components/ui/pagination.tsx`](file:///e:/Github/driveit/components/ui/pagination.tsx).
  - Removed unused hooks (`hooks/use-mobile.ts`, `hooks/use-toast.ts`), duplicate `styles/globals.css`, unreachable legacy Server Actions / WaCRM push helpers (`lib/actions/bookings.ts`, `lib/booking-notifications.ts`, `lib/notifications.ts`), and `scripts/_redeem-probe.mts`.
- **Unused & Duplicate `public/` Assets Removed (`33` media files + `public/.DS_Store`, ~8.56 MB total freed across cleanup)**:
  - Removed unused root images (`1..4.webp`, `placeholder.svg`, empty `placeholder.webp`, `black-supercar-studio-luxury.webp`, `gulfstream-g600-tarmac-night.webp`, `gulfstream-g650-private-jet-on-tarmac-at-night.webp`, `lamborghini-aventador-black-studio.webp`, `lamborghini-urus-night.webp`, `private-jet-cabin-luxury.webp`, `rolls-royce-cullinan-black-studio.webp`), all 13 unused files under `public/jets/`, unused `public/yachts/yacht-2..4.webp`, and duplicate/unused studio files (`public/studio/g63.webp`, `s60.webp`, `jet-challenger.webp`, `jet-g550-studio.webp`). Actively referenced `/sadan/*`, `/suv/*`, `/trending/*`, active `/studio/*`, and active `/yachts/*` assets remain untouched.
- **NPM Dependency Pruning (`42` direct deps uninstalled / `111` total packages removed)**:
  - Uninstalled unused dependencies via `npm uninstall` (`@hookform/resolvers`, 26 unused `@radix-ui/react-*` packages, `autoprefixer`, `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `lenis`, `next-themes`, `react-day-picker`, `react-hook-form`, `react-resizable-panels`, `recharts`, `resend`, `sonner`, `tailwindcss-animate`, `vaul`), retaining `@radix-ui/react-slot`, `class-variance-authority`, `tw-animate-css`, `@payloadcms/email-resend`, and all runtime/CLI/tooling dependencies.
- **Lint & Script Hygiene**:
  - Removed unused imports/state across site pages, routes, `collections/Media.ts`, `components/site-footer.tsx`, `components/home/quick-book-drawer.tsx`, and `components/live-vehicle-tracker.tsx`; hoisted `ADDON_PRICES` & `BUNDLES` outside [`CarBookingWidget`](file:///e:/Github/driveit/app/(site)/cars/[slug]/booking-widget.tsx); named the export in [`eslint.config.mjs`](file:///e:/Github/driveit/eslint.config.mjs) with `caughtErrorsIgnorePattern: '^_'`; and added `.webp` MIME detection (`image/webp`) in [`scripts/upload-fleet-cloudinary.ts`](file:///e:/Github/driveit/scripts/upload-fleet-cloudinary.ts).

## 42. Descriptive Car-Named WebP Assets, Rich Alt Tags, Full CMS Editability & Auto-Updatable SEO (November 2026)
- **Vehicle-Named WebP File Migration & Legacy Compatibility (`lib/asset-paths.ts`)**:
  - Renamed all 49 vehicle, yacht, studio flagship, and aircraft image files under `public/sadan/`, `public/suv/`, `public/trending/`, `public/studio/`, and `public/yachts/` to descriptive slug-matched `.webp` filenames (e.g., `/studio/rolls-royce-phantom.webp?v=5`, `/sadan/mercedes-s-350.webp`, `/suv/toyota-fortuner.webp`, `/yachts/benetti-oasis-40m-superyacht.webp`) and replaced external `images.unsplash.com` URLs with local studio `.webp` assets.
  - Added [`LEGACY_IMAGE_PATH_MAP`](file:///e:/Github/driveit/lib/asset-paths.ts) and [`normalizeAssetPath()`](file:///e:/Github/driveit/lib/asset-paths.ts) inside [`resolveMediaUrl()`](file:///e:/Github/driveit/lib/cms.ts) and [`Cars`](file:///e:/Github/driveit/lib/cars.ts) / [`blog-seed.ts`](file:///e:/Github/driveit/lib/blog-seed.ts) so any previously seeded Postgres media paths continue resolving without 404s.
- **Accessible & Duplicate-Free Image Alt Tags**:
  - Added [`buildVehicleAlt()`](file:///e:/Github/driveit/lib/asset-paths.ts) to prevent duplicated brand prefixes (e.g., `"Rolls-Royce Rolls-Royce Phantom"` -> `"Rolls-Royce Phantom Sedan"`), replaced empty inactive hero slide `alt=""` and generic `alt="image"` / `alt={item.model}` across all homepage stages, cards, modals, checkout, blog posts, and service pages, and exposed `imageAlt` / `coverImageAlt` / `avatarAlt` / logo & banner alt fields in Payload CMS.
- **Full Payload CMS Control & SQL Migration (`migrations/20261111_120000_cms_full_editability_and_seo.ts`)**:
  - Shared defaults and typed configs live in [`lib/home-config.ts`](file:///e:/Github/driveit/lib/home-config.ts) (`heroScenes`, `pickupHubs`, `beyondPanels`, `vipCorridors`, `studioHotspots`, `sections`, showcase fallbacks).
  - Extended [`collections/Cars.ts`](file:///e:/Github/driveit/collections/Cars.ts) (`imageAlt`, gallery `alt`, `featuredInStudioStage`, `tagline`, `powerHp`, `zeroToHundred`, `topSpeed`, `acousticNote`, `engineAudioProfile`, `studioHotspots`), [`collections/Services.ts`](file:///e:/Github/driveit/collections/Services.ts) (`imageAlt`, `heroSubtitle`, `heroCtaLabel`, `seoTitle`, `seoDescription`, `seoKeywords`, `showcaseItems`), [`collections/Blogs.ts`](file:///e:/Github/driveit/collections/Blogs.ts) (`coverImageAlt`, `seoTitle`, `seoDescription`), [`collections/Testimonials.ts`](file:///e:/Github/driveit/collections/Testimonials.ts) (`avatar`, `avatarAlt`), and [`globals/SiteSettings.ts`](file:///e:/Github/driveit/globals/SiteSettings.ts) (logo/banner alts, `seoKeywords`, `googleSiteVerification`, `llmsSummaryIntro`, `allowAiCrawlers`, `extraRobotsDisallow`, `heroScenes`, `pickupHubs`, `studioStage*`, `fleetSection*`, `beyond*`, `beyondPanels`, `radar*`, `vipCorridors`, `closing*`), backed by idempotent migration `20261111_120000_cms_full_editability_and_seo.ts` registered in [`migrations/index.ts`](file:///e:/Github/driveit/migrations/index.ts).
  - Wired [`app/(site)/page.tsx`](file:///e:/Github/driveit/app/(site)/page.tsx), [`app/api/site-settings/route.ts`](file:///e:/Github/driveit/app/api/site-settings/route.ts), all homepage components, and dedicated aviation/yacht/coach pages ([`private-jet-services`](file:///e:/Github/driveit/app/(site)/services/private-jet-services/page.tsx), [`yacht-services`](file:///e:/Github/driveit/app/(site)/services/yacht-services/page.tsx), [`luxury-buses`](file:///e:/Github/driveit/app/(site)/services/luxury-buses/page.tsx)) to CMS data with Service + BreadcrumbList + Product JSON-LD and dynamic `generateMetadata()`.
- **Technical SEO & Auto-Updatable Discovery Endpoints**:
  - Added metadata & indexing controls via `layout.tsx` across `dashboard`, `checkout` (`noindex, nofollow`), `thankyou` (`noindex, nofollow`), `login` (`noindex, follow`), `contactus` (`canonical: '/contact'`, `noindex, follow`), `privacy-policy`, and `terms-conditions`; updated [`app/(site)/layout.tsx`](file:///e:/Github/driveit/app/(site)/layout.tsx) to use `/logo.png` favicon fallback, dynamic `NEXT_PUBLIC_SITE_URL`, CMS `seoKeywords` & `googleSiteVerification`, and `["LocalBusiness", "AutoRental"]` JSON-LD.
  - Upgraded [`app/robots.ts`](file:///e:/Github/driveit/app/robots.ts), [`app/sitemap.ts`](file:///e:/Github/driveit/app/sitemap.ts), [`app/llms.txt/route.ts`](file:///e:/Github/driveit/app/llms.txt/route.ts), [`app/llms-full.txt/route.ts`](file:///e:/Github/driveit/app/llms-full.txt/route.ts), [`app/feed.xml/route.ts`](file:///e:/Github/driveit/app/feed.xml/route.ts), and [`lib/revalidate.ts`](file:///e:/Github/driveit/lib/revalidate.ts) so every CMS change dynamically updates sitemap URLs/images/timestamps, robots AI crawler rules, LLMs markdown directories, and RSS feeds.

## 43. Bespoke Protocol Atelier & Verified Client Chronicles (Replacement for Synthetic Route Radar)
- **Problem Resolved**:
  - The old Section 03 (`Flight-Sync & Route Radar` / `InteractiveRouteConcierge`) relied on synthetic SVG pseudo-radar circles, sweep lines, and arbitrary coordinate curves (`x/y/ctrlX/ctrlY`) that broke visual immersion, did not match the obsidian-gold photographic standard, and felt ungrounded in real white-glove luxury service.
- **Architectural Solution & Deployment**:
  - **Component**: Created [`components/home/bespoke-protocol-atelier.tsx`](file:///e:/Github/driveit/components/home/bespoke-protocol-atelier.tsx) implementing **The Bespoke Protocol Atelier + Verified Client Chronicles**:
    1. **Interactive 4-Card Selector Column (`lg:col-span-5`)**: Protocol 01 (Airside Tarmac & Flight-Sync), Protocol 02 (Palace Wedding & Royal Gala), Protocol 03 (Boardroom Convoy & Roadshow), Protocol 04 (Grand Weekend Touring & Supercar Excursion).
    2. **Widescreen 16:9 Editorial Photographic Stage (`lg:col-span-7`)**: Motion-animated image stage (`/black-chauffeur-sedan-night-city.webp`, `/rolls-royce-wedding-ribbon.webp`, `/rolls-royce-phantom-night.webp`, `/ferrari-sf90-night-city.webp`) with frosted obsidian dossier overlay, highlights checklist, inline flight standby tag (tasteful badge, zero synthetic radar graphics), and direct `/checkout?carId=...` + WhatsApp concierge action links.
    3. **Verified Client Chronicles & Performance Benchmarks Strip**: Full-width trust strip positioned directly beneath the protocol split, rendering verified client quotes (avatar, quote, author, title) and key service metrics (Fleet Value Managed, VIP Transits Completed, Airport Standby Guarantee, Client Rating) fetched server-side from Payload CMS `Testimonials` & `Stats`.
  - **Integration**:
    - Wired `<BespokeProtocolAtelier />` into [`components/home/hype-home-client.tsx`](file:///e:/Github/driveit/components/home/hype-home-client.tsx) between `BeyondPanels` and `ClosingDrive`.
    - Wired [`app/(site)/page.tsx`](file:///e:/Github/driveit/app/(site)/page.tsx) to fetch `getTestimonials()` and `getStats()` in parallel and forward them to the client component.
    - Deleted obsolete [`components/home/interactive-route-concierge.tsx`](file:///e:/Github/driveit/components/home/interactive-route-concierge.tsx).
    - Exposed `protocolEyebrow`, `protocolTitle`, `protocolSubtitle`, and `protocols` array in [`globals/SiteSettings.ts`](file:///e:/Github/driveit/globals/SiteSettings.ts), [`lib/home-config.ts`](file:///e:/Github/driveit/lib/home-config.ts), and [`lib/cms.ts`](file:///e:/Github/driveit/lib/cms.ts) for 100% Payload CMS administrator editability.
    - Updated [`app/llms.txt/route.ts`](file:///e:/Github/driveit/app/llms.txt/route.ts) and [`app/llms-full.txt/route.ts`](file:///e:/Github/driveit/app/llms-full.txt/route.ts) to list Curated Mobility Protocols & VIP Occasions.
  - **Verification**: `npx tsc --noEmit` passed with 0 errors; `npm run lint` passed with 0 errors; `npm run build` compiled all 64 static/dynamic routes in 6.9s.

## 44. Production VPS Ops Suite (`infra/ops/`) & `makheel` Admin Access (November 2026)
- **Production Ops Scripts (`infra/ops/`)**:
  - Added [`infra/ops/lib.sh`](file:///e:/Github/driveit/infra/ops/lib.sh), [`infra/ops/healthcheck.sh`](file:///e:/Github/driveit/infra/ops/healthcheck.sh), [`infra/ops/weekly-maintenance.sh`](file:///e:/Github/driveit/infra/ops/weekly-maintenance.sh), [`infra/ops/boot-alert.sh`](file:///e:/Github/driveit/infra/ops/boot-alert.sh), [`infra/ops/security-watch.sh`](file:///e:/Github/driveit/infra/ops/security-watch.sh), [`infra/ops/install-ops.sh`](file:///e:/Github/driveit/infra/ops/install-ops.sh), and [`infra/ops/README.md`](file:///e:/Github/driveit/infra/ops/README.md).
  - Installed to `/opt/driveit-ops/` on VPS `13.140.56.180` with `/etc/cron.d/driveit-ops` (`*/5` healthcheck + security-watch, weekly Sunday 04:00 IST maintenance, `@reboot` boot-alert), `/etc/logrotate.d/driveit-ops`, and `fail2ban` SSH jail (`/etc/fail2ban/jail.d/driveit.local`).
  - Retired legacy 12h `/etc/cron.d/driveit-vps-cleaner` (which ran `drop_caches`) in favor of `weekly-maintenance.sh` (keeps newest 3 GB Docker build cache and preserves kernel page cache & Redis).
  - Telegram credentials are intentionally left unconfigured in `/etc/driveit-ops.env.example` (never copied from other projects); scripts log cleanly to `/var/log/driveit-ops/` until a dedicated DriveIt bot token + chat ID are added to `/etc/driveit-ops.env`.
- **VPS Admin Account (`makheel`)**:
  - Created user `makheel` on `13.140.56.180` in groups `sudo`, `docker`, `adm`, `systemd-journal` with passwordless sudo (`/etc/sudoers.d/makheel`) and the same SSH authorized key as `driveit`.





