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

- **Google Maps Location Search & Interactive Pin Picker — Phase 2 Roadmap**:
  - **Decision**: Keep Google Places Autocomplete and Interactive Map Pin Picker in the Phase 2 roadmap to tackle after initial production launch.
  - **Planned Features**:
    1. **Google Places Autocomplete**: Real-time POI search (e.g., "Karachi Bakery Banjara Hills", "Taj Falaknuma", "Novotel HICC") using session tokens to optimize API usage.
    2. **Interactive Map Pin Picker**: Modal with obsidian-gold dark map styling (`#050505` asphalt, `#d4af37` gold pin/route markers). Users can drag a pointer on the map to pinpoint exact pickup/drop-off spots with reverse geocoding into exact street addresses.
    3. **Cost Architecture**: Uses Google Maps Platform's recurring **$200 USD (~₹16,500 INR) free monthly credit**, providing ~11,700 search sessions and ~28,500 dynamic map loads each month at zero cost ($0). A budget alert and quota limit in Google Cloud Console ensures zero unexpected charges.
    4. **Integration Targets**: Replace preset zones in [`components/booking-section.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/booking-section.tsx), [`components/car-booking-modal.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/car-booking-modal.tsx), and upgrade [`components/location-search-input.tsx`](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/location-search-input.tsx).

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



