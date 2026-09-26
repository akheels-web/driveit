// ═══════════════════════════════════════════════════════════════
// DRIVEIT — shared application types (Payload-aligned)
//
// These were previously Supabase row types (booking_ref, total_amount,
// booking_date, user_id …) which no longer matched what Payload returns, so the
// dashboard and invoice pages rendered empty rows. Keep them in sync with the
// Bookings / Customers collections.
// ═══════════════════════════════════════════════════════════════

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type SecurityDepositStatus = 'na' | 'held' | 'inspection_passed' | 'refunded' | 'deducted'

export interface Booking {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  carName: string
  carSlug?: string | null
  pickupLocation?: string | null
  dropoffLocation?: string | null
  serviceType?: 'chauffeur' | 'selfdrive' | 'airport' | null
  status: BookingStatus
  startDate?: string | null
  endDate?: string | null
  days?: number | null
  totalPrice: number
  discountApplied?: number | null
  couponCode?: string | null
  securityDepositAmount?: number | null
  securityDepositStatus?: SecurityDepositStatus | null
  depositRefundUtr?: string | null
  flightNumber?: string | null
  airportTerminal?: string | null
  gstin?: string | null
  companyName?: string | null
  chauffeurDetails?: {
    name?: string
    phone?: string
    photoUrl?: string
    vehicleNumber?: string
    carColor?: string
  } | null
  createdAt: string
}

export interface CustomerProfile {
  name: string | null
  phone: string | null
  homeAddress: string | null
  officeAddress: string | null
  airportAddress: string | null
  gstin?: string | null
  companyName?: string | null
  kycStatus?: 'unverified' | 'pending' | 'verified' | 'rejected'
  drivingLicenseNumber?: string | null
  aadhaarLast4?: string | null
  loyaltyPoints: number
  loyaltyTier: 'silver' | 'gold' | 'platinum'
  completedBookings: number
}

export interface BookingFormData {
  carId?: string
  carSlug?: string
  carName: string
  serviceType: string
  pickupLocation: string
  dropoffLocation?: string
  bookingDate: string
  bookingTime?: string
  durationDays: number
  customerName: string
  customerPhone: string
  customerEmail?: string
  notes?: string
  /** Display-only. The server always recomputes the authoritative amount. */
  totalAmount?: number
  paymentMethod?: 'upi' | 'pay_later'
}

/** Minimal car shape shipped to the browser by /api/cars. */
export interface FleetCar {
  id: string
  slug: string
  name: string
  src: string
  brand: string
  price: number
  priceDisplay: string
  seats: number
  services: string[]
  category?: string
  transmission?: string
  fuel?: string
  rating?: number
  reviewsCount?: number
  bookingsCount?: number
  cancellationPolicy?: string
  securityDeposit?: string
  securityDepositAmount?: number
  fuelPolicy?: string
  fastTagEquipped?: boolean
}

export interface SavedProfile {
  email?: string | null
  name: string | null
  phone: string | null
  homeAddress: string | null
  officeAddress: string | null
  airportAddress: string | null
  gstin?: string | null
  companyName?: string | null
  kycStatus?: 'unverified' | 'pending' | 'verified' | 'rejected'
  drivingLicenseNumber?: string | null
  aadhaarLast4?: string | null
  loyaltyPoints?: number
  loyaltyTier?: 'silver' | 'gold' | 'platinum'
  completedBookings?: number
}

export interface QuoteBreakdown {
  days: number
  basePrice: number
  addonsTotal: number
  addonLines: { id: string; label: string; price: number }[]
  discount: number
  totalPrice: number
}

export type InitResponse = QuoteBreakdown & {
  success: true
  bookingId: string | number
  holdToken: string
  holdExpiresAt: string
  couponCode: string | null
  car: { id: string; slug: string; name: string; image: string; pricePerDay: number }
  /** Set once the booking is confirmed; 'awaiting_verification' until staff check the UPI reference. */
  paymentStatus?: 'awaiting_verification' | 'verified' | 'rejected'
  reference?: string
  status?: BookingStatus
}
