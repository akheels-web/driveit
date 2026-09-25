'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Car, MapPin, CalendarDays, Clock, User, Phone, Mail, ArrowRight, CheckCircle, ChevronDown, CreditCard, Timer } from 'lucide-react'
import Image from 'next/image'
import { LocationSearchInput } from './location-search-input'
import { UpiPayment } from './upi-payment'
import { createBooking, updatePaymentStatus } from '@/lib/actions/bookings'
import type { BookingFormData } from '@/lib/types'
import { LuxurySelect } from '@/components/luxury-select'
import { LuxuryDatePicker } from '@/components/luxury-date-picker'

interface CarBookingModalProps {
  isOpen: boolean
  onClose: () => void
  car: {
    id?: string
    name: string
    image: string
    pricePerDay: number
    priceDisplay: string
    category?: string
  }
}

const locations = [
  "RGIA Airport (Shamshabad)",
  "Jubilee Hills",
  "Banjara Hills",
  "HITEC City",
  "Gachibowli",
  "Madhapur",
  "Kondapur",
  "Kokapet",
  "Financial District",
  "Secunderabad",
  "Begumpet",
  "Kukatpally",
]

const timeSlots = [
  "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM",
]

const serviceTypes = [
  { value: 'chauffeur', label: 'With Driver (Chauffeur)' },
  { value: 'selfdrive', label: 'Without Driver (Self Drive)' },
  { value: 'airport', label: 'Airport Transfer' },
]

export function CarBookingModal({ isOpen, onClose, car }: CarBookingModalProps) {
  const [step, setStep] = useState(1) // 1: details, 2: payment, 3: success
  const [loading, setLoading] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [bookingId, setBookingId] = useState('')
  // Proof that this browser created the hold — required to confirm the payment.
  const [holdToken, setHoldToken] = useState('')

  const [form, setForm] = useState({
    serviceType: 'chauffeur',
    pickup: '',
    dropoff: '',
    date: '',
    time: '',
    days: 1,
    name: '',
    phone: '',
    email: '',
    notes: '',
  })

  const totalAmount = car.pricePerDay * form.days

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSubmit = form.pickup && form.date && form.time && form.name && form.phone

  // Reset when the modal opens. Adjusting state during render is React's
  // documented pattern for "state that depends on a prop change" — it avoids the
  // extra render pass (and the stale flash) an effect would cause.
  const [wasOpen, setWasOpen] = useState(isOpen)
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen)
    if (isOpen) {
      setStep(1)
      setForm({ serviceType: 'chauffeur', pickup: '', dropoff: '', date: '', time: '', days: 1, name: '', phone: '', email: '', notes: '' })
      setBookingRef('')
      setBookingId('')
      setHoldToken('')
    }
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleSubmitBooking = async (paymentMethod: 'upi' | 'pay_later') => {
    if (!canSubmit) return
    setLoading(true)

    const data: BookingFormData = {
      carId: car.id,
      carSlug: car.id,
      carName: car.name,
      serviceType: form.serviceType,
      pickupLocation: form.pickup,
      dropoffLocation: form.dropoff || undefined,
      bookingDate: form.date,
      bookingTime: form.time,
      durationDays: form.days,
      customerName: form.name,
      customerPhone: form.phone,
      customerEmail: form.email || undefined,
      notes: form.notes || undefined,
      totalAmount,
      paymentMethod,
    }

    const result = await createBooking(data)

    if (result.success) {
      setBookingRef(result.reference)
      setBookingId(result.bookingId)
      setHoldToken(result.holdToken)
      if (paymentMethod === 'upi') {
        setStep(2)
      } else {
        const confirmed = await updatePaymentStatus(result.bookingId, 'pay_at_pickup', result.holdToken)
        if (!confirmed.success) {
          alert(confirmed.error || 'Could not confirm booking. Please try again.')
          setLoading(false)
          return
        }
        setStep(3)
      }
    } else {
      alert(result.error || 'Error creating booking. Please try again or call +91 63000 41186')
    }

    setLoading(false)
  }

  const handlePaymentConfirmed = async (txnId: string) => {
    const result = await updatePaymentStatus(bookingId, txnId, holdToken)
    if (!result.success) {
      alert(result.error || 'Could not confirm the payment. Please contact support.')
      return
    }
    setStep(3)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{
              background: 'linear-gradient(145deg, rgba(20,20,20,1), rgba(10,10,10,1))',
              border: '1px solid rgba(212, 175, 55, 0.15)',
              boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 40px rgba(212,175,55,0.05)',
            }}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Car Header */}
            <div className="flex items-center gap-4 p-6 pb-4 border-b border-white/5">
              <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                <Image src={car.image} alt={car.name} fill className="object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate">{car.name}</h3>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-sm text-[var(--gold-400)] font-medium">{car.priceDisplay}</span>
                  {form.days > 1 && (
                    <span className="text-xs text-white/30">× {form.days} days = ₹{totalAmount.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* STEP 1: Booking Details */}
                {step === 1 && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="space-y-4">
                      {/* Service Type + Duration */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Service Type</label>
                          <LuxurySelect
                            value={form.serviceType}
                            onChange={(val) => updateField('serviceType', val)}
                            options={serviceTypes.map((s) => ({ value: s.value, label: s.label }))}
                            triggerClassName="bg-white/[0.03] border-white/10"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Duration (days)</label>
                          <LuxurySelect
                            value={String(form.days)}
                            onChange={(val) => updateField('days', parseInt(val) || 1)}
                            options={[1, 2, 3, 4, 5, 6, 7, 10, 14, 30].map((d) => ({
                              value: String(d),
                              label: `${d} ${d === 1 ? 'day' : 'days'}`,
                            }))}
                            triggerClassName="bg-white/[0.03] border-white/10"
                          />
                        </div>
                      </div>

                      {/* Pickup & Dropoff */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Pickup Location *</label>
                          <LocationSearchInput 
                            value={form.pickup} 
                            onChange={(val) => updateField('pickup', val)} 
                            placeholder="Enter pickup address" 
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-3 pl-9 text-white text-sm placeholder:text-white/20 hover:border-[var(--gold-400)]/30 focus:border-[var(--gold-400)]/50 focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Drop-off</label>
                          <LocationSearchInput 
                            value={form.dropoff} 
                            onChange={(val) => updateField('dropoff', val)} 
                            placeholder="Same as pickup or enter address" 
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-3 pl-9 text-white text-sm placeholder:text-white/20 hover:border-[var(--gold-400)]/30 focus:border-[var(--gold-400)]/50 focus:outline-none transition-colors"
                            iconClassName="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20"
                          />
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Date *</label>
                          <LuxuryDatePicker
                            value={form.date}
                            onChange={(val) => updateField('date', val)}
                            min={new Date().toISOString().split('T')[0]}
                            placeholder="Select date"
                            triggerClassName="bg-white/[0.03] border-white/10"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Time *</label>
                          <LuxurySelect
                            value={form.time}
                            onChange={(val) => updateField('time', val)}
                            placeholder="Time..."
                            icon={<Clock className="w-3.5 h-3.5 text-[var(--gold-400)]/70" />}
                            options={timeSlots.map((t) => ({ value: t, label: t }))}
                            triggerClassName="bg-white/[0.03] border-white/10"
                          />
                        </div>
                      </div>

                      {/* Customer details */}
                      <div className="border-t border-white/5 pt-4 mt-4">
                        <p className="text-xs text-white/40 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5" /> Your Details
                        </p>
                        <div className="space-y-3">
                          <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)}
                            placeholder="Full Name *"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 hover:border-[var(--gold-400)]/30 focus:border-[var(--gold-400)]/50 focus:outline-none transition-colors"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)}
                              placeholder="Phone *"
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 hover:border-[var(--gold-400)]/30 focus:border-[var(--gold-400)]/50 focus:outline-none transition-colors"
                            />
                            <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)}
                              placeholder="Email (optional)"
                              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 hover:border-[var(--gold-400)]/30 focus:border-[var(--gold-400)]/50 focus:outline-none transition-colors"
                            />
                          </div>
                          <textarea value={form.notes} onChange={(e) => updateField('notes', e.target.value)}
                            placeholder="Special requests (optional)"
                            rows={2}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 hover:border-[var(--gold-400)]/30 focus:border-[var(--gold-400)]/50 focus:outline-none transition-colors resize-none"
                          />
                        </div>
                      </div>

                      {/* Total & Actions */}
                      <div className="border-t border-white/5 pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-white/50">Total ({form.days} {form.days === 1 ? 'day' : 'days'})</span>
                          <span className="text-xl font-bold text-gradient-gold">₹{totalAmount.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <motion.button
                            onClick={() => handleSubmitBooking('upi')}
                            disabled={!canSubmit || loading}
                            className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{
                              background: canSubmit ? 'linear-gradient(135deg, var(--gold-300), var(--gold-400), var(--gold-500))' : 'rgba(255,255,255,0.05)',
                              color: canSubmit ? 'black' : 'rgba(255,255,255,0.3)',
                              boxShadow: canSubmit ? '0 4px 20px rgba(212, 175, 55, 0.3)' : 'none',
                            }}
                            whileHover={canSubmit ? { scale: 1.02 } : {}}
                            whileTap={canSubmit ? { scale: 0.98 } : {}}
                          >
                            <CreditCard className="w-4 h-4" />
                            {loading ? 'Booking...' : 'Pay & Book'}
                          </motion.button>

                          <motion.button
                            onClick={() => handleSubmitBooking('pay_later')}
                            disabled={!canSubmit || loading}
                            className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed border border-[var(--gold-400)]/30 text-[var(--gold-400)] bg-[var(--gold-400)]/5 hover:bg-[var(--gold-400)]/10 transition-colors"
                            whileHover={canSubmit ? { scale: 1.02 } : {}}
                            whileTap={canSubmit ? { scale: 0.98 } : {}}
                          >
                            <Timer className="w-4 h-4" />
                            Pay at Pickup
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: UPI Payment */}
                {step === 2 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <UpiPayment
                      amount={totalAmount}
                      bookingRef={bookingRef}
                      onPaymentConfirmed={handlePaymentConfirmed}
                      onPayLater={async () => {
                        setLoading(true)
                        const confirmed = await updatePaymentStatus(bookingId, 'pay_at_pickup', holdToken)
                        setLoading(false)
                        if (confirmed.success) {
                          setStep(3)
                        } else {
                          alert(confirmed.error || 'Could not confirm booking. Please contact support.')
                        }
                      }}
                    />
                  </motion.div>
                )}

                {/* STEP 3: Success */}
                {step === 3 && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-8 text-center"
                  >
                    <motion.div
                      className="w-16 h-16 rounded-full bg-[var(--gold-400)] flex items-center justify-center mx-auto mb-5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    >
                      <CheckCircle className="w-8 h-8 text-black" />
                    </motion.div>
                    <h3 className="text-xl font-[family-name:var(--font-playfair)] font-bold text-white mb-2">
                      Booking Confirmed!
                    </h3>
                    <p className="text-sm text-white/40 mb-1">Booking Reference</p>
                    <p className="text-lg font-mono font-bold text-[var(--gold-400)] mb-4">{bookingRef}</p>
                    <p className="text-sm text-white/50 max-w-sm mx-auto mb-6">
                      We'll confirm your booking within 15 minutes. You'll receive a WhatsApp message shortly.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-sm font-medium text-black cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, var(--gold-300), var(--gold-400))' }}
                      >
                        Done
                      </button>
                      <a
                        href={`https://wa.me/916300041186?text=${encodeURIComponent(`Hi, my booking ref is ${bookingRef}. Please confirm.`)}`}
                        target="_blank"
                        className="px-6 py-2.5 rounded-xl text-sm font-medium text-[var(--gold-400)] border border-[var(--gold-400)]/30 hover:bg-[var(--gold-400)]/5 transition-colors"
                      >
                        WhatsApp Us
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
