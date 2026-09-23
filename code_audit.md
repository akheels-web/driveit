# 🔍 DriveIt — Code Audit Report
> Reviewed: All API routes, collections, lib/, auth, Dockerfile, docker-compose

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical (security / data loss) | 4 |
| 🟠 High (logic bugs) | 4 |
| 🟡 Medium (architecture / maintainability) | 4 |
| 🔵 Low (minor improvements) | 3 |

---

## 🔴 Critical Issues

---

### 1. All Collections are Wide Open — No Access Control

**Files:** [`Cars.ts`](file:///c:/Github/code/driveit/collections/Cars.ts), [`Bookings.ts`](file:///c:/Github/code/driveit/collections/Bookings.ts), [`Wishlists.ts`](file:///c:/Github/code/driveit/collections/Wishlists.ts), [`Coupons.ts`](file:///c:/Github/code/driveit/collections/Coupons.ts)

Every collection uses `() => true` for **create, update, and delete**. This means:
- Anyone on the internet can **POST /api/cars** and add fake cars
- Anyone can **DELETE /api/bookings/[id]** and wipe bookings
- Anyone can **create unlimited coupons** with any discount they want
- Anyone can mark their own booking as `completed` to farm loyalty coupons

```ts
// ❌ CURRENT — completely public
access: {
  read: () => true,
  create: () => true,
  update: () => true,
  delete: () => true,
}

// ✅ FIX — protect write operations
import { isAdminOrSelf } from '@/lib/access'

access: {
  read: () => true,
  create: ({ req }) => !!req.user,        // must be logged in
  update: ({ req }) => req.user?.role === 'admin',
  delete: ({ req }) => req.user?.role === 'admin',
}
```

> Add a `role` field to `Users.ts` with values `admin | user`, then implement an `isAdmin` helper.

---

### 2. Hardcoded `localhost` URLs in Production Code

**File:** [`lib/services/notifications.ts`](file:///c:/Github/code/driveit/lib/services/notifications.ts) — Lines 47, 74

```ts
// ❌ CRITICAL — this will break in production
const rebookUrl = `http://localhost:3000/checkout?...`
const ticket_url = `http://localhost:3000/dashboard/invoices/${bookingRef}`
```

These URLs are sent to customers via WhatsApp. In production, customers will receive dead `localhost` links.

```ts
// ✅ FIX
const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const rebookUrl = `${BASE_URL}/checkout?rebook=true&carId=${data.carId}&service=${data.serviceType}`
const ticket_url = `${BASE_URL}/dashboard/invoices/${bookingRef}`
```

---

### 3. Hardcoded Payload Secret Fallback

**File:** [`payload.config.ts`](file:///c:/Github/code/driveit/payload.config.ts) — Line 54

```ts
// ❌ If PAYLOAD_SECRET is missing in prod, it silently uses a public string
secret: process.env.PAYLOAD_SECRET || 'DRIVEIT_PAYLOAD_SECRET_LOCAL_HOST_12345',
```

If someone accidentally deploys without setting `PAYLOAD_SECRET`, the app runs with a **known, public secret** that compromises all JWT tokens and admin sessions.

```ts
// ✅ FIX — crash loudly instead of silently failing
if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is not set!')
}
secret: process.env.PAYLOAD_SECRET,
```

Same fix applies to `AUTH_SECRET` in [`auth.ts`](file:///c:/Github/code/driveit/auth.ts) line 22.

---

### 4. Coupon Validation Has No Server-Side Enforcement

**File:** [`collections/Coupons.ts`](file:///c:/Github/code/driveit/collections/Coupons.ts)

The `validUntil` date and `usageCount >= usageLimit` check are **stored in the DB** but there's no hook or API route that enforces them before applying a discount. A user who already used their coupon can keep submitting it. The `usageCount` field is `readOnly` in admin but nothing **increments it** after use.

**Fix needed:**
1. Create a `/api/coupons/validate` route that checks `isActive`, `validUntil`, `usageCount < usageLimit`, and optionally `customerEmail`
2. Add an `afterChange` hook on Bookings that increments `usageCount` when a coupon is applied

---

## 🟠 High Issues

---

### 5. Double-Booking Race Condition (Check-then-Write Gap)

**File:** [`app/api/checkout/init/route.ts`](file:///c:/Github/code/driveit/app/api/checkout/init/route.ts)

The availability check and booking creation are two **separate operations** with no transaction or lock between them. Two users booking the same car simultaneously can both pass the check before either creates a record.

```
User A: check() → no conflict ✅
User B: check() → no conflict ✅  ← both pass at the same time
User A: create() → pending booking
User B: create() → pending booking ← DOUBLE BOOKED 💥
```

**Fix:** SQLite supports `BEGIN EXCLUSIVE TRANSACTION`. Use Drizzle's transaction API or add a unique constraint on `(carSlug, startDate, endDate, status IN ('pending','confirmed'))` at the DB level so the second insert fails and can be caught gracefully.

---

### 6. Loyalty Coupon Count is Off-by-One

**File:** [`collections/Bookings.ts`](file:///c:/Github/code/driveit/collections/Bookings.ts) — Line 33

```ts
// The query is run AFTER the current booking is already saved as 'completed'
// So totalDocs already includes THIS booking
const { totalDocs } = await req.payload.find({ ... status: 'completed' })

if (totalDocs > 0 && totalDocs % 5 === 0) { ... }
```

This is actually correct in intent but the email says _"your Nth booking"_ using `totalDocs` which **includes the current one**. However, on the 5th booking the count returns 5, the email says "5th booking" — that part is fine.

The real bug: **if the hook runs twice** (e.g. network retry, Payload internal retry), it will generate **two coupons** for the same booking. There's no idempotency check.

```ts
// ✅ FIX — check if coupon already exists for this booking
const existingCoupon = await req.payload.find({
  collection: 'coupons',
  where: { customerEmail: { equals: doc.customerEmail }, code: { contains: 'VIP-' } }
})
// Only create if the count is right AND no recent coupon was issued
```

---

### 7. `createBooking` Bypasses the Checkout Hold Lock

**File:** [`lib/actions/bookings.ts`](file:///c:/Github/code/driveit/lib/actions/bookings.ts) — Line 36

```ts
// ❌ This directly creates a 'confirmed' booking WITHOUT going through
// the /api/checkout/init hold check
status: 'confirmed',
```

The old server action `createBooking` creates a booking as `confirmed` immediately, **skipping the 10-minute hold/availability check** entirely from `/api/checkout/init`. This means users who call the server action path can double-book cars.

**Fix:** Either deprecate `createBooking` in favour of the API routes, or add the same availability check inside it.

---

### 8. `/api/bookings/count` Ignores the `carId` Parameter

**File:** [`app/api/bookings/count/route.ts`](file:///c:/Github/code/driveit/app/api/bookings/count/route.ts) — Lines 12, 16-23

```ts
const carId = searchParams.get('carId')
if (!carId) return NextResponse.json({ count: 0 })

// ❌ carId is extracted but never used in the query!
const { totalDocs } = await payload.find({
  collection: 'bookings',
  where: {
    customerEmail: { equals: session.user.email }, // counts ALL bookings, not by carId
  },
})
```

The route accepts `carId` but returns total bookings for the user across **all cars**, not for the specific car. This produces incorrect counts in the UI.

```ts
// ✅ FIX
where: {
  and: [
    { customerEmail: { equals: session.user.email } },
    { carSlug: { equals: carId } },
  ]
}
```

---

## 🟡 Medium Issues

---

### 9. Fleet Data is Hardcoded — CMS Cars Are Never Used for New Installs

**File:** [`lib/cms.ts`](file:///c:/Github/code/driveit/lib/cms.ts) — Line 14 & 47

```ts
// If CMS has NO cars (fresh install), falls back to hardcoded static data
if (docs && docs.length > 0) { ... }
// ↓ fallback
return carsData  // 28 hardcoded cars in lib/cars.ts
```

On a fresh deployment with zero CMS cars, the site shows **hardcoded static data with fake ratings (4.9), fake reviews (32), and fake booking counts (120)**. Customers see "120 bookings" for a car that was just added.

More critically, `lib/cars.ts` has **hardcoded image paths** (`/sadan/1.jpg`, `/suv/1.jpg`) that won't exist in production unless those files are in `public/`.

**Fix:** Show an empty state / placeholder when CMS has no cars, or seed the DB with real data on first run.

---

### 10. `NotificationService.sendBookingConfirmation` is Fire-and-Forget (Missing `await`)

**File:** [`lib/actions/bookings.ts`](file:///c:/Github/code/driveit/lib/actions/bookings.ts) — Line 80

```ts
// ❌ No await — this Promise is completely untracked
NotificationService.sendBookingConfirmation(bookingRef, data)
```

The notification call is not awaited, so:
1. Errors inside it are **silently swallowed** in production
2. The server action returns `success: true` even if notifications fail
3. In a serverless/edge environment, the function may terminate before the notification fires

```ts
// ✅ FIX — fire-and-forget is acceptable but should at least log
void NotificationService.sendBookingConfirmation(bookingRef, data).catch(e =>
  console.error('Notification failed silently:', e)
)
```

---

### 11. `NotificationService` Email/SMS Methods are Stubs — Never Send Real Notifications

**File:** [`lib/services/notifications.ts`](file:///c:/Github/code/driveit/lib/services/notifications.ts) — Lines 24-40

```ts
// These only console.log — no real email or SMS is sent via this path
private static async sendEmail(...) {
  console.log(`[Email Stub] ...`)
}
private static async sendSMS(...) {
  console.log(`[SMS Stub] ...`)
}
```

Meanwhile, the **real** email is sent via Payload's `sendEmail()` in [`confirm/route.ts`](file:///c:/Github/code/driveit/app/api/checkout/confirm/route.ts). There are now **two parallel notification systems**:
- `NotificationService` (stubs, used by server action)  
- Direct `payload.sendEmail()` (real, used by API route)

This will cause **duplicate emails** if both paths are triggered, and confused debugging. Consolidate into one system.

---

### 12. WhatsApp API Version is Outdated

**File:** [`lib/whatsapp.ts`](file:///c:/Github/code/driveit/lib/whatsapp.ts) — Line 41

```ts
// ❌ v17.0 is from 2023 — Meta's current stable is v22.0 (Sep 2026)
fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, ...)
```

Meta deprecates old Graph API versions after ~2 years. v17.0 will be sunset. Update to `v22.0`.

```ts
// ✅ FIX
fetch(`https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_ID}/messages`, ...)
```

---

## 🔵 Low / Minor Issues

---

### 13. `Wishlists` Collection Missing `carName` Field in Schema

**File:** [`collections/Wishlists.ts`](file:///c:/Github/code/driveit/collections/Wishlists.ts)

The collection schema only has `userEmail` and `carSlug`, but [`app/api/wishlist/route.ts`](file:///c:/Github/code/driveit/app/api/wishlist/route.ts) line 37 tries to save `carName`:

```ts
data: {
  userEmail: session.user.email,
  carSlug: carId,
  carName: carId,  // ← field doesn't exist in schema, will be silently dropped
}
```

Add `carName` to the Wishlists collection, or remove it from the create call.

---

### 14. `package.json` Has an Incorrect Next.js Version

**File:** [`package.json`](file:///c:/Github/code/driveit/package.json) — Line 57

```json
"next": "^16.2.6"
```

Next.js 16 **does not exist**. The latest stable is **Next.js 15.x**. This is likely a typo. npm will resolve `^16.x.x` and may fail with a "version not found" error during `npm install` or pick up an unexpected pre-release.

```json
// ✅ FIX
"next": "^15.3.0"
```

---

### 15. `updatePaymentStatus` Doesn't Actually Save the Transaction ID

**File:** [`lib/actions/bookings.ts`](file:///c:/Github/code/driveit/lib/actions/bookings.ts) — Lines 108-121

```ts
export async function updatePaymentStatus(bookingId: string, upiTransactionId: string) {
  await payload.update({
    collection: 'bookings',
    id: bookingId,
    data: {
      status: 'confirmed',
      // ❌ upiTransactionId is accepted as parameter but never saved!
    },
  })
}
```

The UPI transaction ID is silently discarded. Add a `upiTransactionId` field to the Bookings collection and save it.

---

## ✅ Quick Wins — Recommended Fix Order

| Priority | Issue | Effort |
|----------|-------|--------|
| 1 | Fix hardcoded `localhost` in notifications | 2 min |
| 2 | Fix `next` version in package.json (`^16` → `^15`) | 1 min |
| 3 | Update WhatsApp API from `v17.0` → `v22.0` | 1 min |
| 4 | Fix `/api/bookings/count` to actually filter by `carId` | 5 min |
| 5 | Add guard for missing `PAYLOAD_SECRET` / `AUTH_SECRET` | 5 min |
| 6 | Add `carName` field to Wishlists schema | 5 min |
| 7 | Add `await` / `.catch()` to `NotificationService` call | 2 min |
| 8 | Add role-based access control to collections | 30 min |
| 9 | Add coupon validation API route | 1 hour |
| 10 | Fix double-booking race condition | 2 hours |
