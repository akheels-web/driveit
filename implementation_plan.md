# Premium Features Implementation Plan

This implementation plan addresses the four major features requested by the Senior Quality Reviewer to elevate the DRIVEIT luxury experience.

## User Review Required

> [!IMPORTANT]
> Please review the proposed architecture and UI changes below. Specifically, the SMS and Email providers will need actual API keys (e.g., Twilio/Resend) for production, but we can implement the service stubs now. Do you have preferred providers for SMS/Email, or should we use standard mock/stubs for now?

## Open Questions

1. **Invoices**: For the PDF invoices, should we generate them on the client-side (e.g., using `jspdf`) or server-side via an API endpoint?
2. **Add-on Pricing**: What are the standard prices for add-ons (e.g., Child Seat, Extra Driver, Photographer)? I will use placeholder luxury prices (e.g., ₹2000 for child seat) for now.

---

## Proposed Changes

### 1. Wedding Package Configurator
The Wedding Cars page currently has a basic layout. We will build a high-AOV (Average Order Value) multi-step configurator modal or dedicated booking section.

#### [MODIFY] [app/services/wedding-cars/page.tsx](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/services/wedding-cars/page.tsx)
- Add a new "Configure Wedding Package" button replacing standard "Book Online" CTAs.
- Embed the `<WeddingConfigurator />` component.

#### [NEW] [components/wedding-configurator.tsx](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/components/wedding-configurator.tsx)
- **Step 1:** Select Primary Car (Groom/Bride)
- **Step 2:** Add Escort Cars (Multi-car selection for family)
- **Step 3:** Decoration Theme (Floral, Ribbon, Minimalist)
- **Step 4:** Baraat Route & Wait times
- **Step 5:** Chauffeur Dress Code (Tuxedo, Traditional Safari)
- Dynamic pricing calculation based on the premium selections.

---

### 2. Customer Dashboard ("My Bookings") Upgrades
We will enhance the existing customer portal to provide a premium post-booking experience.

#### [MODIFY] [app/dashboard/bookings/page.tsx](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/dashboard/bookings/page.tsx)
- Implement a real-time **Status Timeline** (Pending → Confirmed → Chauffeur Assigned → Completed).
- Add a **"Download Invoice"** button for confirmed/completed bookings.
- Add a **"Re-book"** button that redirects to checkout pre-filled with the same car details.

#### [NEW] [app/api/invoices/[id]/route.ts](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/api/invoices/%5Bid%5D/route.ts)
- Generate PDF/HTML invoices on the fly for customer bookings.

---

### 3. Unified Notification Engine (Email, SMS, WA)
Currently, notifications might just be basic WaCRM pings. We need a robust multi-channel ticket system.

#### [NEW] [lib/services/notifications.ts](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/lib/services/notifications.ts)
- Abstracted service to dispatch:
  - **Email:** Beautiful HTML booking confirmation (using Resend or NodeMailer).
  - **SMS:** Immediate text confirmation.
  - **WhatsApp:** Integration with WaCRM to send a branded digital ticket (QR Code + itinerary).

#### [MODIFY] [lib/actions/bookings.ts](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/lib/actions/bookings.ts)
- Update the checkout/booking action to asynchronously trigger `NotificationService.sendBookingConfirmation(bookingId)`.

---

### 4. Detail Page Add-ons Configurator
The existing booking widget is functional but lacks upsell opportunities.

#### [MODIFY] [app/cars/[slug]/booking-widget.tsx](file:///c:/Users/Akheel/Downloads/driveitfinals-main%202/driveitfinals-main/app/cars/%5Bslug%5D/booking-widget.tsx)
- Integrate an **"Add-ons"** expandable section before checkout.
- Options:
  - 🍼 Premium Child Seat (+₹2,500)
  - 👔 Extra Driver (+₹1,500/day)
  - 📸 Professional Photographer (+₹10,000)
  - 🎀 Basic Vehicle Decoration (+₹5,000)
- Dynamically update the `estimate.total` and pass these add-ons to the `/checkout` route via URL params or state.

---

## Verification Plan

### Automated/Manual Verification
- **Wedding Configurator:** Verify that selecting multiple cars correctly aggregates the total price and stores the configuration in local state or redirects correctly to checkout.
- **Dashboard:** Log in as a user, verify the timeline renders correctly for different booking statuses, and test the invoice download.
- **Add-ons:** Check that toggling an add-on recalculates the daily/total price correctly in real-time on the car detail page.
