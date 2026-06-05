# Implementation Plan: Phase 2 Growth Opportunities

Based on the Senior QA Reviewer's feedback, here is the architecture and approach to implementing the new retention and revenue-boosting features.

## User Review Required

> [!IMPORTANT]
> **Database Migrations:** Implementing Wishlists, Saved Addresses, and Loyalty Points requires adding tables/columns to Supabase. Do you want me to provide the raw SQL for you to run in the Supabase SQL editor, or should I mock these features using `localStorage` and `user_metadata` for now?
> 
> **Add-on Bundles:** Should we keep the a-la-carte options alongside the bundles, or exclusively offer the bundles on the detail page?

---

## Proposed Changes

### 1. "Save this car" / Wishlist
Allow logged-in users to favorite cars for later, directly impacting repeat corporate and wedding planners.

#### [NEW] Supabase Table & API `app/api/wishlist/route.ts`
- Create an API route to handle CRUD operations for a `wishlists` table (`user_id`, `car_id`).
#### [MODIFY] `app/cars/[slug]/page.tsx` & `components/car-card.tsx`
- Add a floating `Heart` icon toggle. If logged out, redirect to login.
#### [NEW] `app/dashboard/wishlist/page.tsx`
- Dedicated dashboard page rendering the user's favorited fleet.

### 2. "Booking history" & Saved Addresses
We already built the "Re-book" logic, but we need to expand user profiles to handle saved addresses.

#### [MODIFY] `app/checkout/page.tsx`
- Add a dropdown: "Use Saved Address" (Home, Office, Airport) to auto-fill pickup/dropoff fields.
#### [MODIFY] `app/dashboard/profile/page.tsx`
- Allow users to edit and save default addresses.

### 3. Personalized Social Proof ("Booked X times")
Replace generic global metrics with personalized, high-converting social proof.

#### [MODIFY] `app/cars/[slug]/page.tsx`
- Fetch the user's booking history for the current `carId`.
- **Logic:** `if (userBookings > 0) { show "You've booked this car {X} times" } else { show "Booked 246+ times globally" }`

### 4. Loyalty & Memberships
Tiered rewards to lock in high-net-worth clients.

#### [MODIFY] Supabase Profiles (or User Metadata)
- Introduce `loyalty_points` and `loyalty_tier` (Silver, Gold, Platinum, Black).
#### [MODIFY] `app/dashboard/page.tsx`
- Create a beautiful **Membership Card UI** showing current tier, point balance, and points required for the next tier.
#### [MODIFY] `lib/actions/bookings.ts`
- Update the booking action to award points post-payment (e.g., 100 points per ₹10,000 spent).

### 5. Add-on Bundles (AOV Booster)
Package existing single add-ons into high-value bundles.

#### [MODIFY] `app/cars/[slug]/booking-widget.tsx`
- Redesign the Add-ons section to feature bundles instead of individual toggles:
  - **Wedding Package:** Decoration + Photographer + 50km Extra (₹15,000)
  - **Family Trip:** 2x Child Seats + Extra Driver (₹3,000)
  - **VIP Arrival:** Premium Decoration + Champagne + Meet & Greet (₹10,000)

### 6. Quick Re-book from WhatsApp
Leverage the notification engine for direct sales.

#### [MODIFY] `lib/services/notifications.ts`
- Enhance the WhatsApp ticket payload. After a booking is completed, append a dynamic deep link that pre-fills the checkout:
  - `https://driveit.in/checkout?rebook=true&carId={car_id}&service={service_type}`
  - Example text: *"Hi [Name] — your usual [Car Name] is available. Tap here to re-book it instantly for your next trip."*

---

## Verification Plan
- **Wishlist:** Click the heart on a car, verify it persists across refreshes and appears in `/dashboard/wishlist`.
- **Social Proof:** Book a specific car twice. Navigate to that car's page and verify it says "You've booked this car 2 times".
- **Bundles:** Select a bundle in the widget, verify the total updates correctly and checkout handles the bundled payload.
- **Loyalty:** Complete a booking, check the dashboard to see the new points balance.
