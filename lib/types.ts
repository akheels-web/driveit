// ═══════════════════════════════════════════════════════════════
// DRIVEIT Luxury — Database Types
// ═══════════════════════════════════════════════════════════════

export interface Car {
  id: string
  name: string
  image_url: string
  category: 'sedan' | 'suv' | 'sports' | 'mpv' | 'bus' | 'wedding' | 'convertible'
  brand: string
  price_per_day: number
  price_display: string
  is_available: boolean
  service_types: string[]
  features: string[]
  seats: number
  transmission: string
  fuel_type: string
  sort_order: number
  created_at: string
}

export interface Booking {
  id: string
  booking_ref: string
  user_id: string | null
  car_id: string | null
  car_name: string
  service_type: string
  pickup_location: string
  dropoff_location: string | null
  booking_date: string
  booking_time: string
  duration_days: number
  customer_name: string
  customer_phone: string
  customer_email: string | null
  notes: string | null
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  payment_status: 'unpaid' | 'pending' | 'paid' | 'refunded'
  payment_method: string | null
  upi_transaction_id: string | null
  total_amount: number
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  phone: string | null
  email: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Form types
export interface BookingFormData {
  carId?: string
  carName: string
  carImage?: string
  serviceType: string
  pickupLocation: string
  dropoffLocation?: string
  bookingDate: string
  bookingTime: string
  durationDays: number
  customerName: string
  customerPhone: string
  customerEmail?: string
  notes?: string
  totalAmount: number
  paymentMethod?: 'upi' | 'pay_later'
}
