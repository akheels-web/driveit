'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import QRCode from 'qrcode'
import { motion } from 'motion/react'
import {
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  CreditCard,
  Smartphone,
  QrCode,
  Lock,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react'

import type { InitResponse, QuoteBreakdown } from '@/lib/types'
import { useCountdown, useFleet, useSavedProfile } from '@/hooks/use-fleet'
import { LuxurySelect } from '@/components/luxury-select'

type Step = 'details' | 'payment' | 'success'

const today = () => new Date().toISOString().split('T')[0]

export function CheckoutClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const profile = useSavedProfile()
  const { cars, loading: fleetLoading } = useFleet()

  // `primaryCar` is how the wedding configurator hands over the chosen vehicle.
  const carIdentifier = searchParams.get('carId') || searchParams.get('primaryCar') || ''
  const packageType = searchParams.get('package')
  const pickupDate = searchParams.get('pickupDate') || today()
  const returnDate = searchParams.get('returnDate') || pickupDate
  const service = (searchParams.get('service') as 'chauffeur' | 'selfdrive' | 'airport') || 'chauffeur'
  const addons = useMemo(() => {
    const ids = (searchParams.get('addons') || '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
    // The wedding package always includes its server-priced bundle.
    if (packageType === 'wedding' && !ids.includes('wedding_bundle')) ids.push('wedding_bundle')
    return ids
  }, [searchParams, packageType])

  const car = useMemo(
    () => cars.find((candidate) => candidate.slug === carIdentifier || candidate.id === carIdentifier),
    [cars, carIdentifier],
  )

  const [step, setStep] = useState<Step>('details')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    pickupLocation: '',
    dropoffLocation: '',
    flightNumber: '',
    companyName: '',
    gstin: '',
  })
  const [promoCode, setPromoCode] = useState('')
  const [promoMessage, setPromoMessage] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [estimatedDiscount, setEstimatedDiscount] = useState(0)
  const [hold, setHold] = useState<InitResponse | null>(null)
  const [upiReference, setUpiReference] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [qrDataUrl, setQrDataUrl] = useState('')

  const countdown = useCountdown(hold?.holdExpiresAt)

  useEffect(() => {
    if (!fleetLoading && !car) router.replace('/cars')
  }, [car, fleetLoading, router])

  // Prefill the traveller details once the saved profile arrives. Adjusting
  // state during render (React's documented pattern for prop-derived state)
  // avoids the extra effect + render pass, and never overwrites what the user
  // has already typed.
  const [profileApplied, setProfileApplied] = useState(false)
  if (!profileApplied && profile && car) {
    setProfileApplied(true)
    setForm((previous) => ({
      name: previous.name || profile.name || '',
      phone: previous.phone || profile.phone || '',
      email: previous.email,
      pickupLocation: previous.pickupLocation,
      dropoffLocation: previous.dropoffLocation,
      flightNumber: previous.flightNumber,
      companyName: previous.companyName || (profile as any).companyName || '',
      gstin: previous.gstin || (profile as any).gstin || '',
    }))
  }

  // Display-only estimate; the server recomputes every number it charges.
  const isSelfDrive = service === 'selfdrive'
  const effectiveDailyRate = isSelfDrive
    ? (car?.selfDrivePrice ?? Math.round((car?.price ?? 0) * 0.85))
    : (car?.price ?? 0)

  const estimate = useMemo<QuoteBreakdown>(() => {
    const days = Math.max(
      1,
      Math.ceil(
        (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24),
      ) || 1,
    )
    const base = effectiveDailyRate * days
    return {
      days,
      basePrice: base,
      addonsTotal: 0,
      addonLines: [],
      discount: estimatedDiscount,
      totalPrice: Math.max(0, base - estimatedDiscount),
    }
  }, [effectiveDailyRate, pickupDate, returnDate, estimatedDiscount])

  const quote: QuoteBreakdown = hold ?? estimate

  const upiLink = useMemo(() => {
    const upiId = process.env.NEXT_PUBLIC_UPI_ID || ''
    const upiName = process.env.NEXT_PUBLIC_UPI_NAME || 'DRIVEIT Luxury'
    const reference = hold ? `DRV${hold.bookingId}` : 'DRIVEIT'
    const params = new URLSearchParams({
      pa: upiId,
      pn: upiName,
      am: String(quote.totalPrice),
      cu: 'INR',
      tn: `DRIVEIT Booking ${reference}`,
      tr: reference,
    })
    return `upi://pay?${params.toString()}`
  }, [hold, quote.totalPrice])

  useEffect(() => {
    if (step !== 'payment' || !upiLink) return
    QRCode.toDataURL(upiLink, { width: 240, margin: 2 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''))
  }, [step, upiLink])

  async function applyPromo() {
    if (!promoCode.trim()) return
    setPromoMessage('Checking…')
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: promoCode,
          email: form.email || undefined,
          subtotal: estimate.basePrice,
        }),
      })
      const data = await response.json()
      setPromoMessage(data.message || (data.valid ? 'Promo applied.' : 'That promo code is not valid.'))
      setEstimatedDiscount(data.valid ? data.discount : 0)
      setAppliedCoupon(data.valid ? data.code : null)
    } catch {
      setPromoMessage('Could not check that code. Try again.')
      setEstimatedDiscount(0)
      setAppliedCoupon(null)
    }
  }

  async function startHold() {
    if (!car) return
    setBusy(true)
    setError('')

    try {
      const response = await fetch('/api/checkout/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carSlug: car.slug,
          startDate: pickupDate,
          endDate: returnDate,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          pickupLocation: form.pickupLocation,
          dropoffLocation: form.dropoffLocation || null,
          serviceType: service,
          addons: addons.join(','),
          couponCode: appliedCoupon || undefined,
          flightNumber: form.flightNumber || undefined,
          companyName: form.companyName || undefined,
          gstin: form.gstin || undefined,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Could not reserve this vehicle.')
        return
      }

      setHold(data as InitResponse)
      setStep('payment')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function confirmPayment() {
    if (!hold) return
    setBusy(true)
    setError('')

    try {
      const response = await fetch('/api/checkout/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: hold.bookingId,
          holdToken: hold.holdToken,
          upiTransactionId: upiReference || undefined,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Payment confirmation failed. Please contact the concierge.')
        return
      }

      setHold({ ...hold, ...data })
      setStep('success')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (fleetLoading || !car) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white/60">
        Loading secure checkout…
      </div>
    )
  }

  if (step === 'success') {
    const reference = hold?.bookingId ? `DRV-${String(hold.bookingId).padStart(5, '0')}` : '—'
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/[0.03] border border-green-500/30 rounded-3xl p-10 max-w-lg w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Booking Confirmed</h2>
          <p className="text-white/50 mb-6">
            Your {car.name} reservation is confirmed. A receipt with your invoice is on its way to{' '}
            {form.email}.
          </p>
          {/* We do not claim the money arrived: the UPI reference is typed by the
              customer and a human checks it against our account. */}
          {hold?.paymentStatus === 'awaiting_verification' ? (
            <p className="text-left text-xs text-[var(--gold-400)] bg-[var(--gold-400)]/10 border border-[var(--gold-400)]/20 rounded-xl px-4 py-3 mb-6">
              Payment under review — we will match your UPI reference against our account within one
              business day. Your car is held for you meanwhile.
            </p>
          ) : null}
          <div className="bg-black/40 rounded-xl p-5 border border-white/5 mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Reference</span>
              <span className="font-mono font-medium">{reference}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">Amount</span>
              <span className="font-bold text-[var(--gold-400)]">
                ₹{Number(quote.totalPrice).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white">
              Return Home
            </Link>
            <Link
              href="/dashboard/bookings"
              className="flex-1 py-3 rounded-xl bg-[var(--gold-400)] text-black font-bold"
            >
              My Bookings
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  const canContinue = Boolean(form.name && form.phone && form.email && form.pickupLocation)
  const savedAddresses = profile
    ? [
        ['homeAddress', 'Home'] as const,
        ['officeAddress', 'Office'] as const,
        ['airportAddress', 'Airport'] as const,
      ].filter(([key]) => Boolean(profile[key]))
    : []

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b border-white/10 bg-black sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => (step === 'payment' ? setStep('details') : router.back())}
            className="flex items-center gap-2 text-white/50 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          <div className="font-bold tracking-wider text-[var(--gold-400)]">SECURE CHECKOUT</div>
          {countdown ? (
            <div className="flex items-center gap-1.5 text-xs text-white/60">
              <Clock className="w-3.5 h-3.5" /> Hold {countdown.label}
            </div>
          ) : (
            <div className="w-20" />
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {countdown?.expired && step === 'payment' && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
              Your 10 minute hold expired. Please go back and start again.
            </div>
          )}

          {step === 'details' ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 space-y-5"
            >
              <h2 className="text-xl font-semibold">Guest Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Full name *"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--gold-400)]/50 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone number *"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--gold-400)]/50 focus:outline-none"
                />
              </div>

              <input
                type="email"
                placeholder="Email address *"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--gold-400)]/50 focus:outline-none"
              />

              {savedAddresses.length > 0 && (
                <LuxurySelect
                  value=""
                  onChange={(val) => {
                    if (val) setForm((prev) => ({ ...prev, pickupLocation: val }))
                  }}
                  placeholder="Use a saved address…"
                  size="sm"
                  options={savedAddresses.map(([key, label]) => ({
                    value: profile?.[key] ?? '',
                    label: `${label}: ${profile?.[key]}`,
                  }))}
                  triggerClassName="bg-black border-white/10"
                />
              )}

              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="text"
                  placeholder="Pickup location *"
                  value={form.pickupLocation}
                  onChange={(event) => setForm({ ...form, pickupLocation: event.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-[var(--gold-400)]/50 focus:outline-none"
                />
              </div>

              <input
                type="text"
                placeholder="Drop-off location (optional)"
                value={form.dropoffLocation}
                onChange={(event) => setForm({ ...form, dropoffLocation: event.target.value })}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--gold-400)]/50 focus:outline-none"
              />

              {/* Airport flight number */}
              {service === 'airport' && (
                <div className="p-3.5 rounded-xl bg-[var(--gold-400)]/5 border border-[var(--gold-400)]/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[var(--gold-400)]">✈️ Airport Flight Monitoring</span>
                    <span className="text-[10px] text-emerald-400 font-medium">✓ 60-min wait included</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Flight number (e.g. 6E 521 / AI 840 / EK 526)"
                    value={form.flightNumber}
                    onChange={(e) => setForm({ ...form, flightNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase focus:border-[var(--gold-400)]/50 focus:outline-none"
                  />
                </div>
              )}

              {/* Self-Drive notice */}
              {service === 'selfdrive' && (
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white/90">🛡️ Self-Drive Express Handover</span>
                    <span className="text-[10px] text-[var(--gold-400)] font-medium">Full-to-Full Fuel & FASTag</span>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    A refundable security deposit of ₹{Number(car.securityDepositAmount ?? 25000).toLocaleString('en-IN')} is held and returned via UPI within 24–48 hours after vehicle inspection.
                  </p>
                </div>
              )}

              {/* Corporate GSTIN billing */}
              <div className="pt-2 border-t border-white/5 space-y-3">
                <details className="text-xs group">
                  <summary className="text-white/60 hover:text-white cursor-pointer font-medium select-none">
                    + Add Corporate GSTIN (Tax Invoice for Business Claim)
                  </summary>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-2">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[var(--gold-400)]/50 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="GSTIN (e.g. 36AABCU9603R1ZM)"
                      value={form.gstin}
                      onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                      className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase focus:border-[var(--gold-400)]/50 focus:outline-none"
                    />
                  </div>
                </details>
              </div>

              {/* Error Banner */}
              {error && (
                <div
                  className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-200 text-xs flex items-start gap-3 shadow-[0_0_20px_rgba(244,63,94,0.1)] animate-in fade-in"
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-rose-300">Reservation Notice</p>
                    <p className="leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              {/* Incomplete Fields Guidance */}
              {!canContinue && (
                <div className="text-[11px] text-amber-400/90 bg-amber-400/5 border border-amber-400/20 rounded-xl p-3 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-amber-300">Required to proceed: </span>
                    <span className="text-white/70">
                      {[
                        form.name.trim().length < 2 && 'Full Name',
                        !form.email.includes('@') && 'Valid Email',
                        form.phone.trim().length < 6 && 'Phone Number',
                        form.pickupLocation.trim().length < 2 && 'Pickup Location',
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={startHold}
                disabled={!canContinue || busy}
                className="w-full py-4 rounded-xl font-bold bg-[var(--gold-400)] text-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition hover:scale-[1.01]"
              >
                {busy ? 'Reserving vehicle…' : 'Continue to Payment'}
              </button>
              <p className="text-[11px] text-white/40 flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                Continuing reserves this car for 10 minutes with guaranteed availability.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Payment</h2>
                <div className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                  <Lock className="w-3 h-3" /> Encrypted
                </div>
              </div>

              <div className="border border-[var(--gold-400)]/40 bg-[var(--gold-400)]/5 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-5">
                  <Smartphone className="w-6 h-6 text-[var(--gold-400)]" />
                  <div>
                    <h3 className="font-semibold">UPI / QR Code</h3>
                    <p className="text-xs text-white/50">Google Pay, PhonePe, Paytm or any UPI app</p>
                  </div>
                </div>

                <div className="bg-black/50 p-6 rounded-xl border border-white/10 flex flex-col md:flex-row items-center gap-6">
                  <div className="w-44 h-44 bg-white p-2 rounded-xl shrink-0 flex items-center justify-center">
                    {qrDataUrl ? (
                      <Image
                        src={qrDataUrl}
                        alt="UPI QR code"
                        width={176}
                        height={176}
                        unoptimized
                        className="w-full h-full"
                      />
                    ) : (
                      <QrCode className="w-10 h-10 text-gray-300 animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <p className="text-sm text-white/70">
                      Pay ₹{Number(quote.totalPrice).toLocaleString('en-IN')} by scanning the code, then confirm
                      below.
                    </p>
                    <div className="space-y-1.5">
                      <label className="block text-[11px] text-white/50 uppercase tracking-wider">
                        UPI Transaction / UTR Reference
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 425618992144 (12-digit UPI Ref)"
                        value={upiReference}
                        onChange={(event) => setUpiReference(event.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[var(--gold-400)]/60 focus:outline-none"
                      />
                      <p className="text-[10px] text-white/40">
                        Entering your UTR speeds up automatic payment verification under 15 minutes.
                      </p>
                    </div>

                    {/* Step 2 Error Banner */}
                    {error && (
                      <div
                        className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-200 text-xs flex items-start gap-2.5 shadow-[0_0_20px_rgba(244,63,94,0.1)] animate-in fade-in"
                        role="alert"
                      >
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="font-semibold text-rose-300">Payment Issue</p>
                          <p className="leading-relaxed">{error}</p>
                          <p className="text-[11px] text-white/60 pt-1">
                            Contact concierge 24/7 at <a href="tel:+916300041186" className="text-[var(--gold-400)] underline font-medium">+91 63000 41186</a>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Hold Expired Alert */}
                    {countdown?.expired && (
                      <div
                        className="p-3.5 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in"
                        role="alert"
                      >
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div className="space-y-0.5">
                          <p className="font-semibold text-amber-300">Vehicle Hold Expired</p>
                          <p className="leading-relaxed">
                            Your 10-minute hold window expired. Please re-initiate booking to secure this car.
                          </p>
                          <button
                            type="button"
                            onClick={() => setStep('details')}
                            className="text-[11px] text-[var(--gold-400)] font-semibold underline pt-1"
                          >
                            Return to Step 1 & Refresh
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={confirmPayment}
                      disabled={busy || countdown?.expired}
                      className="w-full py-3.5 bg-[var(--gold-400)] text-black font-bold rounded-xl disabled:opacity-40 cursor-pointer transition hover:scale-[1.01]"
                    >
                      {busy ? 'Confirming with accounting…' : 'I have completed the payment'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 border border-white/5 rounded-xl p-5 flex items-center justify-between opacity-50">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-white/50" />
                  <span className="text-white/50">Card payments</span>
                </div>
                <span className="text-xs border border-white/10 px-2 py-1 rounded">Coming soon</span>
              </div>
            </motion.div>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sticky top-24 space-y-6">
            <h3 className="text-lg font-semibold">Booking Summary</h3>

            <div className="flex gap-4 pb-6 border-b border-white/10">
              <div className="w-24 h-16 relative rounded-lg overflow-hidden bg-white/5 shrink-0">
                <Image src={car.src} alt={car.name} fill sizes="96px" className="object-cover" />
              </div>
              <div>
                <h4 className="font-bold">{car.name}</h4>
                <div className="text-xs text-white/50">
                  {car.brand} • {service === 'selfdrive' ? 'Self Drive' : 'Chauffeur'}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Pickup</span>
                <span>{pickupDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Return</span>
                <span>{returnDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Duration</span>
                <span>{quote.days} day(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">
                  Base (₹{effectiveDailyRate.toLocaleString('en-IN')} × {quote.days})
                </span>
                <span>₹{quote.basePrice.toLocaleString('en-IN')}</span>
              </div>
              {quote.addonsTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/50">Add-ons</span>
                  <span>₹{quote.addonsTotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              {quote.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span>-₹{quote.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              {service === 'selfdrive' && (
                <div className="flex justify-between text-xs pt-2 text-[var(--gold-400)]/80">
                  <span>Refundable Deposit (100% back)</span>
                  <span>₹{Number(car.securityDepositAmount ?? 25000).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-white/10 font-semibold">
                <span>Total</span>
                <span className="text-[var(--gold-400)] text-xl">
                  ₹{Number(quote.totalPrice).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {step === 'details' && (
              <div className="pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(event) => setPromoCode(event.target.value.toUpperCase())}
                    className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm uppercase"
                  />
                  <button onClick={applyPromo} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p className={`text-xs mt-2 flex items-center gap-1.5 ${estimatedDiscount > 0 ? 'text-emerald-400 font-medium' : 'text-rose-400'}`}>
                    {estimatedDiscount > 0 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    {promoMessage}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-start gap-2 bg-white/5 p-3 rounded-lg border border-white/10">
              <ShieldCheck className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-white/50 leading-relaxed">
                {car.cancellationPolicy ||
                  'Free cancellation up to 48 hours before pickup. All rates and discounts are guaranteed before payment.'}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
