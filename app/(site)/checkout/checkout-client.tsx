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
  Smartphone,
  QrCode,
  Lock,
  MapPin,
  Clock,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Car,
  Plane,
  Sparkles,
  FileText,
  Phone,
  MessageCircle,
  Building2,
} from 'lucide-react'

import type { InitResponse, QuoteBreakdown } from '@/lib/types'
import { useCountdown, useFleet, useSavedProfile } from '@/hooks/use-fleet'
import { priceAddons } from '@/lib/pricing'
import { LuxurySelect } from '@/components/luxury-select'
import { LuxuryDatePicker } from '@/components/luxury-date-picker'

type Step = 'details' | 'payment' | 'success'
type ServiceMode = 'chauffeur' | 'selfdrive' | 'airport'
type PaymentMode = 'upi' | 'pay_at_pickup'

const today = () => new Date().toISOString().split('T')[0]

const HYDERABAD_PRESET_HUBS = [
  'RGIA Shamshabad Airport — VIP Arrival Gate',
  'Banjara Hills — Road No. 12 / Taj Krishna',
  'Jubilee Hills — Check Post / Film Nagar',
  'HITEC City — Raheja Mindspace / Cyber Towers',
  'Financial District — Gachibowli / ISB Road',
  'Taj Falaknuma Palace — Engine Bowli',
  'ITC Kohenur — Madhapur / Durgam Cheruvu',
  'Begumpet Private Aviation Terminal',
]

export function CheckoutClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const profile = useSavedProfile()
  const { cars, loading: fleetLoading } = useFleet()

  // `primaryCar` is how the wedding configurator hands over the chosen vehicle.
  const carIdentifier = searchParams.get('carId') || searchParams.get('primaryCar') || ''
  const packageType = searchParams.get('package')
  const initialPickupDate = searchParams.get('pickupDate') || today()
  const initialReturnDate = searchParams.get('returnDate') || initialPickupDate
  const initialServiceRaw = searchParams.get('service') || 'chauffeur'
  const initialService: ServiceMode =
    initialServiceRaw === 'selfdrive' || initialServiceRaw === 'self-drive'
      ? 'selfdrive'
      : initialServiceRaw === 'airport' || initialServiceRaw === 'airport-transfer'
        ? 'airport'
        : 'chauffeur'

  const [selectedService, setSelectedService] = useState<ServiceMode>(initialService)
  const [pickupDate, setPickupDate] = useState<string>(initialPickupDate)
  const [returnDate, setReturnDate] = useState<string>(
    initialReturnDate >= initialPickupDate ? initialReturnDate : initialPickupDate,
  )

  const addons = useMemo(() => {
    const ids = (searchParams.get('addons') || '')
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean)
    if (packageType === 'wedding' && !ids.includes('wedding_bundle')) ids.push('wedding_bundle')
    return ids
  }, [searchParams, packageType])

  const car = useMemo(
    () => cars.find((candidate) => candidate.slug === carIdentifier || candidate.id === carIdentifier),
    [cars, carIdentifier],
  )

  const [step, setStep] = useState<Step>('details')
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('upi')
  const [form, setForm] = useState({
    name: searchParams.get('name') || '',
    phone: searchParams.get('phone') || '',
    email: searchParams.get('email') || '',
    pickupLocation: searchParams.get('pickup') || 'Banjara Hills, Hyderabad',
    dropoffLocation: searchParams.get('dropoff') || '',
    flightNumber: searchParams.get('flightNumber') || '',
    drivingLicenseNumber: '',
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

  // Prefill traveller details once the saved profile arrives.
  const [profileApplied, setProfileApplied] = useState(false)
  if (!profileApplied && profile && car) {
    setProfileApplied(true)
    setForm((previous) => ({
      name: previous.name || profile.name || '',
      phone: previous.phone || profile.phone || '',
      email: previous.email || profile.email || '',
      pickupLocation: previous.pickupLocation || profile.homeAddress || '',
      dropoffLocation: previous.dropoffLocation,
      flightNumber: previous.flightNumber,
      drivingLicenseNumber:
        previous.drivingLicenseNumber || (profile as any).drivingLicenseNumber || '',
      companyName: previous.companyName || (profile as any).companyName || '',
      gstin: previous.gstin || (profile as any).gstin || '',
    }))
  }

  // Keep returnDate >= pickupDate when pickupDate changes
  const handlePickupDateChange = (nextPickup: string) => {
    const resolved = nextPickup || today()
    setPickupDate(resolved)
    if (!returnDate || returnDate < resolved) {
      setReturnDate(resolved)
    }
  }

  const handleReturnDateChange = (nextReturn: string) => {
    const resolved = nextReturn && nextReturn >= pickupDate ? nextReturn : pickupDate
    setReturnDate(resolved)
  }

  // Display-only estimate; the server recomputes every number it charges.
  const isSelfDrive = selectedService === 'selfdrive'
  const chauffeurRate = car?.price ?? 0
  const selfDriveRate = car?.selfDrivePrice ?? Math.round(chauffeurRate * 0.85)
  const effectiveDailyRate = isSelfDrive ? selfDriveRate : chauffeurRate

  const estimate = useMemo<QuoteBreakdown>(() => {
    const days = Math.max(
      1,
      Math.ceil(
        (new Date(returnDate).getTime() - new Date(pickupDate).getTime()) / (1000 * 60 * 60 * 24),
      ) || 1,
    )
    const base = effectiveDailyRate * days
    const { lines: addonLines, total: addonsTotal } = priceAddons(addons)
    const subtotal = base + addonsTotal
    const discount = Math.min(subtotal, Math.max(0, Math.round(estimatedDiscount)))
    return {
      days,
      basePrice: base,
      addonsTotal,
      addonLines,
      discount,
      totalPrice: Math.max(0, subtotal - discount),
    }
  }, [effectiveDailyRate, pickupDate, returnDate, addons, estimatedDiscount])

  const quote: QuoteBreakdown = step === 'details' ? estimate : (hold ?? estimate)

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
          subtotal: estimate.basePrice + estimate.addonsTotal,
        }),
      })
      const data = await response.json()
      setPromoMessage(data.message || (data.valid ? 'Privilege code applied.' : 'That code is not valid.'))
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
          customerName: form.name.trim(),
          customerEmail: form.email.trim(),
          customerPhone: form.phone.trim(),
          pickupLocation: form.pickupLocation.trim(),
          dropoffLocation: form.dropoffLocation.trim() || null,
          serviceType: selectedService,
          addons: addons.join(','),
          couponCode: appliedCoupon || undefined,
          flightNumber: form.flightNumber.trim() || undefined,
          drivingLicenseNumber: form.drivingLicenseNumber.trim() || undefined,
          companyName: form.companyName.trim() || undefined,
          gstin: form.gstin.trim() || undefined,
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

  async function confirmPayment(methodOverride?: PaymentMode) {
    if (!hold) return
    const activeMethod = methodOverride || paymentMode
    setBusy(true)
    setError('')

    try {
      const response = await fetch('/api/checkout/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: hold.bookingId,
          holdToken: hold.holdToken,
          paymentMethod: activeMethod,
          upiTransactionId:
            activeMethod === 'pay_at_pickup' ? 'pay_at_pickup' : upiReference.trim() || undefined,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Reservation confirmation failed. Please contact our concierge.')
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
      <div className="min-h-screen bg-[#070709] flex items-center justify-center text-white/60 font-mono text-xs uppercase tracking-[0.25em]">
        Preparing Private Reservation Desk…
      </div>
    )
  }

  // Contact-only guard for Luxury Coaches / Buses
  if (car.category === 'bus') {
    const whatsappMsg = encodeURIComponent(
      `Hello DRIVEIT Charter Desk, I would like to commission the ${car.name} for a private charter on ${pickupDate}.`,
    )
    return (
      <div className="min-h-screen bg-[#070709] text-white flex items-center justify-center p-4">
        <div className="max-w-xl w-full rounded-3xl border border-[var(--gold-400)]/30 bg-[#0d0d12] p-8 md:p-10 space-y-6 shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-400)]/10 border border-[var(--gold-400)]/30 text-[10px] font-mono uppercase tracking-[0.22em] text-[var(--gold-400)]">
            Private Commission Only
          </div>
          <h1 className="text-2xl md:text-3xl font-light tracking-tight">
            {car.name} — Bespoke Charter Desk
          </h1>
          <p className="text-sm text-white/65 leading-relaxed">
            Luxury coaches, multi-vehicle wedding convoys, and delegation transport are tailored to your route, guest manifest, and security protocol. Connect directly with our Charter Desk for an instant custom quotation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href={`/contact?service=${encodeURIComponent(`Luxury Coach Charter: ${car.name}`)}`}
              className="py-3.5 px-5 rounded-xl bg-[var(--gold-400)] text-black font-semibold text-xs uppercase tracking-[0.18em] text-center hover:bg-[var(--gold-300)] transition"
            >
              Request Charter Quote
            </Link>
            <a
              href={`https://wa.me/916300041186?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-5 rounded-xl border border-white/15 bg-white/[0.03] text-white font-semibold text-xs uppercase tracking-[0.18em] text-center hover:border-[var(--gold-400)]/50 transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[var(--gold-400)]" />
              WhatsApp Concierge
            </a>
          </div>
          <div className="pt-2 text-center">
            <Link href="/cars" className="text-xs text-white/45 hover:text-white underline">
              ← Return to Luxury Fleet
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    const reference = hold?.bookingId ? `DRV-${String(hold.bookingId).padStart(5, '0')}` : '—'
    const isPayAtPickup = paymentMode === 'pay_at_pickup'
    return (
      <div className="min-h-screen bg-[#070709] text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#0e0e13] border border-[var(--gold-400)]/35 rounded-3xl p-8 md:p-10 max-w-lg w-full text-center shadow-[0_30px_100px_rgba(0,0,0,0.9)]"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-[var(--gold-400)] mb-2">
            Guaranteed Plate Allocation
          </div>
          <h2 className="text-3xl font-light tracking-tight mb-3">Reservation Confirmed</h2>
          <p className="text-sm text-white/60 mb-6 leading-relaxed">
            Your <strong className="text-white">{car.name}</strong> is locked in for{' '}
            <strong className="text-white">{pickupDate}</strong>. Your official tax dossier and itinerary have been dispatched to{' '}
            <span className="text-white/90">{form.email}</span>.
          </p>

          {isPayAtPickup ? (
            <div className="text-left text-xs text-[var(--gold-300)] bg-[var(--gold-400)]/10 border border-[var(--gold-400)]/25 rounded-xl px-4 py-3.5 mb-6 leading-relaxed">
              <strong className="block text-[var(--gold-400)] mb-0.5">
                Concierge Handover Settlement Selected
              </strong>
              Our dispatch manager will call you on <span className="text-white">{form.phone}</span> to reconfirm your exact delivery coordinates and preferred handover settlement.
            </div>
          ) : hold?.paymentStatus === 'awaiting_verification' ? (
            <div className="text-left text-xs text-[var(--gold-300)] bg-[var(--gold-400)]/10 border border-[var(--gold-400)]/25 rounded-xl px-4 py-3.5 mb-6 leading-relaxed">
              <strong className="block text-[var(--gold-400)] mb-0.5">
                UTR Verification in Progress
              </strong>
              Our accounts desk is matching your UPI reference against our bank ledger. Your vehicle is strictly reserved for you meanwhile.
            </div>
          ) : null}

          <div className="bg-black/50 rounded-2xl p-5 border border-white/10 mb-8 text-left space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-white/45 uppercase tracking-wider font-mono">Booking Ref</span>
              <span className="font-mono font-semibold text-white">{reference}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/45 uppercase tracking-wider font-mono">Experience</span>
              <span className="text-white/90">
                {selectedService === 'selfdrive'
                  ? 'Self-Drive Exotic'
                  : selectedService === 'airport'
                    ? 'VIP Airport Transfer'
                    : 'Chauffeur Driven'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/45 uppercase tracking-wider font-mono">Pickup Hub</span>
              <span className="text-white/90 truncate max-w-[220px]">{form.pickupLocation}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-white/10">
              <span className="text-white/50">Total Tariff</span>
              <span className="font-bold text-[var(--gold-400)]">
                ₹{Number(quote.totalPrice).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 py-3.5 rounded-xl border border-white/15 text-xs uppercase tracking-[0.18em] text-white/75 hover:text-white hover:border-white/30 transition"
            >
              Return to Showroom
            </Link>
            <Link
              href="/dashboard/bookings"
              className="flex-1 py-3.5 rounded-xl bg-[var(--gold-400)] hover:bg-[var(--gold-300)] text-black text-xs uppercase tracking-[0.18em] font-bold transition"
            >
              Manage Booking
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  const canContinue = Boolean(
    form.name.trim().length >= 2 &&
      form.phone.trim().length >= 6 &&
      form.email.trim().includes('@') &&
      form.pickupLocation.trim().length >= 2,
  )

  const savedAddresses = profile
    ? [
        ['homeAddress', 'Home'] as const,
        ['officeAddress', 'Office'] as const,
        ['airportAddress', 'Airport'] as const,
      ].filter(([key]) => Boolean(profile[key]))
    : []

  const presetHubOptions = [
    ...savedAddresses.map(([key, label]) => ({
      value: profile?.[key] ?? '',
      label: `Saved ${label}: ${profile?.[key]}`,
    })),
    ...HYDERABAD_PRESET_HUBS.map((hub) => ({
      value: hub,
      label: hub,
    })),
  ]

  return (
    <div className="min-h-screen bg-[#070709] text-white">
      {/* Top Bar */}
      <div className="border-b border-white/10 bg-[#070709]/95 backdrop-blur-xl sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => (step === 'payment' ? setStep('details') : router.back())}
            className="flex items-center gap-1.5 min-h-[40px] px-1.5 text-xs font-mono uppercase tracking-[0.14em] sm:tracking-[0.18em] text-white/60 hover:text-white cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[var(--gold-400)] shrink-0" />
            <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.26em] text-[var(--gold-400)] truncate">
              Private Fleet Checkout
            </span>
          </div>
          {countdown ? (
            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-[var(--gold-400)] bg-[var(--gold-400)]/10 border border-[var(--gold-400)]/25 px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap shrink-0">
              <Clock className="w-3.5 h-3.5 shrink-0" /> Hold {countdown.label}
            </div>
          ) : (
            <a
              href="tel:+916300041186"
              className="hidden sm:flex items-center gap-1.5 text-xs text-white/55 hover:text-[var(--gold-400)] transition"
            >
              <Phone className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              <span>+91 63000 41186</span>
            </a>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {countdown?.expired && step === 'payment' && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between gap-3">
              <span>Your 10-minute vehicle hold expired. Please re-lock your dates to continue.</span>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-bold text-xs cursor-pointer shrink-0"
              >
                Re-lock Vehicle
              </button>
            </div>
          )}

          {step === 'details' ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Section 1: Experience Mode & Dates */}
              <div className="bg-[#0e0e13] border border-white/10 rounded-2xl p-6 md:p-7 space-y-6">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--gold-400)] block">
                      Step 01 · Configuration
                    </span>
                    <h2 className="text-lg md:text-xl font-medium mt-0.5">
                      Select Drive Mode & Schedule
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-white/45">
                    {quote.days} {quote.days === 1 ? 'Day' : 'Days'}
                  </span>
                </div>

                {/* 3-Card Service Mode Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedService('chauffeur')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedService === 'chauffeur'
                        ? 'bg-[var(--gold-400)]/12 border-[var(--gold-400)] shadow-[0_0_25px_rgba(201,169,110,0.15)]'
                        : 'bg-black/40 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <UserCheck
                        className={`w-4 h-4 ${
                          selectedService === 'chauffeur' ? 'text-[var(--gold-400)]' : 'text-white/45'
                        }`}
                      />
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                        ₹0 Deposit
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">With Chauffeur</div>
                    <div className="text-xs text-[var(--gold-400)] font-mono mt-1">
                      ₹{chauffeurRate.toLocaleString('en-IN')}/day
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedService('selfdrive')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedService === 'selfdrive'
                        ? 'bg-[var(--gold-400)]/12 border-[var(--gold-400)] shadow-[0_0_25px_rgba(201,169,110,0.15)]'
                        : 'bg-black/40 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Car
                        className={`w-4 h-4 ${
                          selectedService === 'selfdrive' ? 'text-[var(--gold-400)]' : 'text-white/45'
                        }`}
                      />
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--gold-400)]/15 text-[var(--gold-300)] border border-[var(--gold-400)]/25">
                        Self-Drive
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">Self-Drive Exotic</div>
                    <div className="text-xs text-[var(--gold-400)] font-mono mt-1">
                      ₹{selfDriveRate.toLocaleString('en-IN')}/day
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService('airport')
                      if (!form.pickupLocation) {
                        setForm((prev) => ({
                          ...prev,
                          pickupLocation: 'RGIA Shamshabad Airport — VIP Arrival Gate',
                        }))
                      }
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedService === 'airport'
                        ? 'bg-[var(--gold-400)]/12 border-[var(--gold-400)] shadow-[0_0_25px_rgba(201,169,110,0.15)]'
                        : 'bg-black/40 border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Plane
                        className={`w-4 h-4 ${
                          selectedService === 'airport' ? 'text-[var(--gold-400)]' : 'text-white/45'
                        }`}
                      />
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/25">
                        60m Wait
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">Airport VIP</div>
                    <div className="text-xs text-[var(--gold-400)] font-mono mt-1">
                      ₹{chauffeurRate.toLocaleString('en-IN')}/day
                    </div>
                  </button>
                </div>

                {/* Pickup & Return Date Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono uppercase tracking-[0.18em] text-white/55">
                      Pickup Date
                    </label>
                    <LuxuryDatePicker
                      value={pickupDate}
                      min={today()}
                      onChange={handlePickupDateChange}
                      placeholder="Select pickup date"
                      triggerClassName="bg-black border-white/12"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono uppercase tracking-[0.18em] text-white/55">
                      Return Date
                    </label>
                    <LuxuryDatePicker
                      value={returnDate}
                      min={pickupDate || today()}
                      onChange={handleReturnDateChange}
                      placeholder="Select return date"
                      triggerClassName="bg-black border-white/12"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Guest & Handover Details */}
              <div className="bg-[#0e0e13] border border-white/10 rounded-2xl p-6 md:p-7 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--gold-400)] block">
                      Step 02 · Primary Guest & Dispatch
                    </span>
                    <h2 className="text-lg md:text-xl font-medium mt-0.5">
                      Guest & Handover Coordinates
                    </h2>
                  </div>

                  {profile ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full bg-emerald-500/12 text-emerald-300 border border-emerald-500/25">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      VIP Profile Synced
                    </span>
                  ) : (
                    <Link
                      href={`/login?redirect=${encodeURIComponent(
                        typeof window !== 'undefined'
                          ? window.location.pathname + window.location.search
                          : '/checkout',
                      )}`}
                      className="text-xs text-[var(--gold-400)] hover:underline flex items-center gap-1"
                    >
                      <span>Have an account? Sign in</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono uppercase tracking-[0.16em] text-white/55">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Vikramaditya Reddy"
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      className="w-full bg-black border border-white/12 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--gold-400)]/60 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono uppercase tracking-[0.16em] text-white/55">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98490 00000"
                      value={form.phone}
                      onChange={(event) => setForm({ ...form, phone: event.target.value })}
                      className="w-full bg-black border border-white/12 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--gold-400)]/60 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-[0.16em] text-white/55">
                    Email Address (For Official Invoice & Chauffeur Dossier) *
                  </label>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className="w-full bg-black border border-white/12 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--gold-400)]/60 focus:outline-none"
                  />
                </div>

                {/* Quick Hub Selector + Custom Pickup Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-mono uppercase tracking-[0.16em] text-white/55">
                      Pickup / Delivery Location *
                    </label>
                    <span className="text-[11px] text-white/40">Doorstep or Hub Delivery</span>
                  </div>

                  <LuxurySelect
                    value=""
                    onChange={(val) => {
                      if (val) setForm((prev) => ({ ...prev, pickupLocation: val }))
                    }}
                    placeholder="Quick-select a Hyderabad landmark or saved hub…"
                    size="sm"
                    options={presetHubOptions}
                    triggerClassName="bg-black border-white/12"
                  />

                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gold-400)]/70" />
                    <input
                      type="text"
                      placeholder="Enter exact hotel, residence, or terminal address *"
                      value={form.pickupLocation}
                      onChange={(event) => setForm({ ...form, pickupLocation: event.target.value })}
                      className="w-full bg-black border border-white/12 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-[var(--gold-400)]/60 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-[0.16em] text-white/55">
                    Drop-off Destination (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Destination or return pickup point"
                    value={form.dropoffLocation}
                    onChange={(event) => setForm({ ...form, dropoffLocation: event.target.value })}
                    className="w-full bg-black border border-white/12 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--gold-400)]/60 focus:outline-none"
                  />
                </div>

                {/* Airport flight number */}
                {selectedService === 'airport' && (
                  <div className="p-4 rounded-xl bg-[var(--gold-400)]/8 border border-[var(--gold-400)]/25 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[var(--gold-400)] flex items-center gap-1.5">
                        <Plane className="w-3.5 h-3.5" />
                        Live Flight Telemetry & Placard Meet-and-Greet
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">
                        60-Min Delay Guarantee
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Flight Number (e.g. 6E 521 / AI 840 / EK 526)"
                      value={form.flightNumber}
                      onChange={(e) =>
                        setForm({ ...form, flightNumber: e.target.value.toUpperCase() })
                      }
                      className="w-full bg-black border border-white/12 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase focus:border-[var(--gold-400)]/60 focus:outline-none"
                    />
                  </div>
                )}

                {/* Self-Drive License & Deposit Notice */}
                {selectedService === 'selfdrive' && (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/12 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white/90 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[var(--gold-400)]" />
                        Self-Drive Verification & Security Deposit
                      </span>
                      <span className="text-[10px] text-[var(--gold-400)] font-mono uppercase">
                        Full-to-Full Fuel · FASTag
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Driving License Number (Optional now — required prior to key handover)"
                      value={form.drivingLicenseNumber}
                      onChange={(e) =>
                        setForm({ ...form, drivingLicenseNumber: e.target.value.toUpperCase() })
                      }
                      className="w-full bg-black border border-white/12 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase focus:border-[var(--gold-400)]/60 focus:outline-none"
                    />
                    <p className="text-[11px] text-white/55 leading-relaxed">
                      Refundable security deposit of{' '}
                      <strong className="text-white">
                        ₹{Number(car.securityDepositAmount ?? 25000).toLocaleString('en-IN')}
                      </strong>{' '}
                      is collected at handover and refunded within 24–48 hours with verified bank UTR.
                    </p>
                  </div>
                )}

                {/* Corporate GSTIN billing */}
                <div className="pt-2 border-t border-white/8">
                  <details className="text-xs group">
                    <summary className="text-white/60 hover:text-white cursor-pointer font-medium select-none flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-[var(--gold-400)]" />
                      <span>+ Add Corporate GSTIN (Tax Invoice for Input Credit)</span>
                    </summary>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-2">
                      <input
                        type="text"
                        placeholder="Registered Company Name"
                        value={form.companyName}
                        onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                        className="w-full bg-black border border-white/12 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[var(--gold-400)]/60 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="GSTIN (e.g. 36AABCU9603R1ZM)"
                        value={form.gstin}
                        onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                        className="w-full bg-black border border-white/12 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase focus:border-[var(--gold-400)]/60 focus:outline-none"
                      />
                    </div>
                  </details>
                </div>

                {/* Error Banner */}
                {error && (
                  <div
                    className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-200 text-xs flex items-start gap-3"
                    role="alert"
                  >
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-semibold text-rose-300">Reservation Notice</p>
                      <p className="leading-relaxed">{error}</p>
                    </div>
                  </div>
                )}

                {!canContinue && (
                  <div className="text-[11px] text-white/55 bg-white/[0.02] border border-white/8 rounded-xl p-3 flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[var(--gold-400)] shrink-0" />
                    <span>
                      Complete{' '}
                      <strong className="text-white/85">
                        {[
                          form.name.trim().length < 2 && 'Full Name',
                          form.phone.trim().length < 6 && 'Mobile Number',
                          !form.email.trim().includes('@') && 'Email Address',
                          form.pickupLocation.trim().length < 2 && 'Pickup Location',
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </strong>{' '}
                      to lock this vehicle for 10 minutes.
                    </span>
                  </div>
                )}

                <button
                  onClick={startHold}
                  disabled={!canContinue || busy}
                  className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] bg-[var(--gold-400)] hover:bg-[var(--gold-300)] text-black disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition shadow-[0_12px_35px_rgba(201,169,110,0.25)] flex items-center justify-center gap-2"
                >
                  <span>
                    {busy ? 'Locking Vehicle Availability…' : 'Lock Vehicle & Proceed to Settlement'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-white/45 flex items-center justify-center gap-2 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    Exclusively holds this exact plate for 10 minutes while you complete settlement.
                  </span>
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0e0e13] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--gold-400)] block">
                    Step 03 · Final Settlement
                  </span>
                  <h2 className="text-xl font-medium mt-0.5">Choose Settlement Method</h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
                  <Lock className="w-3 h-3" /> Vehicle Held
                </div>
              </div>

              {/* Settlement Method Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMode('upi')}
                  className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                    paymentMode === 'upi'
                      ? 'bg-[var(--gold-400)]/12 border-[var(--gold-400)]'
                      : 'bg-black/40 border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[var(--gold-400)]" />
                      Instant UPI / QR
                    </span>
                    <span className="text-[10px] font-mono uppercase text-[var(--gold-400)]">
                      Fastest
                    </span>
                  </div>
                  <p className="text-xs text-white/55">
                    Scan with Google Pay, PhonePe, Paytm, or CRED UPI
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMode('pay_at_pickup')}
                  className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                    paymentMode === 'pay_at_pickup'
                      ? 'bg-[var(--gold-400)]/12 border-[var(--gold-400)]'
                      : 'bg-black/40 border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Concierge Settlement at Handover
                    </span>
                  </div>
                  <p className="text-xs text-white/55">
                    Confirm reservation now; settle via Card, RTGS, or UPI upon dispatch
                  </p>
                </button>
              </div>

              {paymentMode === 'upi' ? (
                <div className="border border-[var(--gold-400)]/35 bg-[var(--gold-400)]/5 rounded-2xl p-5 md:p-6">
                  <div className="bg-black/60 p-6 rounded-xl border border-white/10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-44 h-44 bg-white p-2.5 rounded-xl shrink-0 flex items-center justify-center">
                      {qrDataUrl ? (
                        <Image
                          src={qrDataUrl}
                          alt="DRIVEIT Luxury instant reservation UPI payment QR code"
                          width={176}
                          height={176}
                          unoptimized
                          className="w-full h-full"
                        />
                      ) : (
                        <QrCode className="w-10 h-10 text-gray-400 animate-pulse" />
                      )}
                    </div>

                    <div className="flex-1 space-y-4 text-center md:text-left w-full">
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider text-[var(--gold-400)]">
                          Amount Payable
                        </div>
                        <div className="text-2xl font-bold text-white mt-0.5">
                          ₹{Number(quote.totalPrice).toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] text-white/55 uppercase tracking-wider font-mono">
                          UPI Transaction / 12-Digit UTR Reference (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 425618992144"
                          value={upiReference}
                          onChange={(event) => setUpiReference(event.target.value)}
                          className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[var(--gold-400)]/60 focus:outline-none"
                        />
                        <p className="text-[11px] text-white/45">
                          Providing your UTR accelerates priority verification under 15 minutes.
                        </p>
                      </div>

                      <button
                        onClick={() => confirmPayment('upi')}
                        disabled={busy || countdown?.expired}
                        className="w-full py-4 bg-[var(--gold-400)] hover:bg-[var(--gold-300)] text-black font-bold text-xs uppercase tracking-[0.2em] rounded-xl disabled:opacity-40 cursor-pointer transition"
                      >
                        {busy ? 'Confirming Reservation…' : 'Complete UPI Reservation'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-white/12 bg-black/50 rounded-2xl p-6 space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-white">
                      Direct Concierge Dispatch & Handover Settlement
                    </h3>
                    <p className="text-xs text-white/65 leading-relaxed">
                      Your <strong className="text-white">{car.name}</strong> will be immediately marked as confirmed. Our Hyderabad dispatch manager will call you on{' '}
                      <strong className="text-white">{form.phone}</strong> within 15 minutes to coordinate vehicle handover and preferred payment (POS Card Terminal, Corporate NEFT/RTGS, or UPI).
                    </p>
                  </div>
                  <button
                    onClick={() => confirmPayment('pay_at_pickup')}
                    disabled={busy || countdown?.expired}
                    className="w-full py-4 bg-[var(--gold-400)] hover:bg-[var(--gold-300)] text-black font-bold text-xs uppercase tracking-[0.2em] rounded-xl disabled:opacity-40 cursor-pointer transition"
                  >
                    {busy ? 'Confirming Reservation…' : 'Confirm Reservation (Settle at Handover)'}
                  </button>
                </div>
              )}

              {error && (
                <div
                  className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-200 text-xs flex items-start gap-2.5"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-rose-300">Confirmation Notice</p>
                    <p className="leading-relaxed">{error}</p>
                    <p className="text-[11px] text-white/60 pt-1">
                      Need immediate help? Call our 24/7 desk at{' '}
                      <a href="tel:+916300041186" className="text-[var(--gold-400)] underline">
                        +91 63000 41186
                      </a>
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Sticky Summary Sidebar */}
        <aside className="lg:col-span-5 xl:col-span-4">
          <div className="bg-[#0e0e13] border border-white/10 rounded-2xl p-6 sticky top-24 space-y-6 shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-mono uppercase tracking-[0.22em] text-white/75">
                Reservation Dossier
              </h3>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--gold-400)]/15 text-[var(--gold-300)] border border-[var(--gold-400)]/30">
                Exact Plate Guaranteed
              </span>
            </div>

            <div className="space-y-3 pb-5 border-b border-white/10">
              <div className="w-full aspect-[16/10] relative rounded-2xl overflow-hidden bg-[#ebebea]">
                <Image
                  src={car.src}
                  alt={`${car.name} selected for instant luxury charter booking in Hyderabad`}
                  fill
                  unoptimized
                  sizes="400px"
                  className="object-cover object-bottom"
                />
                <div className="absolute top-3.5 left-4 right-4 flex items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.26em] text-[#7a6440] font-medium">
                      {car.brand}
                    </p>
                    <h4 className="text-lg font-light text-[#111111] leading-tight">{car.name}</h4>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-white/60 px-1">
                <span>
                  {selectedService === 'selfdrive'
                    ? 'Self-Drive Exotic'
                    : selectedService === 'airport'
                      ? 'VIP Airport Transfer'
                      : 'Chauffeur Driven'}
                </span>
                <span className="font-mono text-[#c9a96e]">
                  ₹{effectiveDailyRate.toLocaleString('en-IN')}/day
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-white/50">Pickup Date</span>
                <span className="font-mono text-white">{pickupDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Return Date</span>
                <span className="font-mono text-white">{returnDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Duration</span>
                <span className="font-mono text-white">
                  {quote.days} {quote.days === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/8">
                <span className="text-white/50">
                  Base Tariff (₹{effectiveDailyRate.toLocaleString('en-IN')} × {quote.days})
                </span>
                <span className="font-mono text-white">
                  ₹{quote.basePrice.toLocaleString('en-IN')}
                </span>
              </div>

              {quote.addonLines && quote.addonLines.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {quote.addonLines.map((addon) => (
                    <div key={addon.id} className="flex justify-between text-white/70">
                      <span>+ {addon.label}</span>
                      <span className="font-mono">₹{addon.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              )}

              {quote.discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Privilege Discount</span>
                  <span className="font-mono">-₹{quote.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-xs pt-2 border-t border-white/8">
                <span className="text-white/50">Security Deposit</span>
                {selectedService === 'selfdrive' ? (
                  <span className="font-mono text-[var(--gold-300)]">
                    ₹{Number(car.securityDepositAmount ?? 25000).toLocaleString('en-IN')} (Refundable)
                  </span>
                ) : (
                  <span className="font-mono text-emerald-400">₹0 (Chauffeur Included)</span>
                )}
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-white/10">
                <span className="text-sm font-semibold text-white">Total Tariff</span>
                <span className="text-[var(--gold-400)] text-2xl font-bold font-mono">
                  ₹{Number(quote.totalPrice).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {step === 'details' && (
              <div className="pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Privilege / Promo Code"
                    value={promoCode}
                    onChange={(event) => setPromoCode(event.target.value.toUpperCase())}
                    className="flex-1 bg-black border border-white/12 rounded-xl px-3.5 py-2.5 text-xs uppercase font-mono focus:border-[var(--gold-400)]/60 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-xs font-semibold cursor-pointer transition"
                  >
                    Apply
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-xs mt-2 flex items-center gap-1.5 ${
                      estimatedDiscount > 0 ? 'text-emerald-400 font-medium' : 'text-rose-400'
                    }`}
                  >
                    {estimatedDiscount > 0 ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5" />
                    )}
                    {promoMessage}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-start gap-2.5 bg-white/[0.03] p-3.5 rounded-xl border border-white/8">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-white/55 leading-relaxed">
                {car.cancellationPolicy ||
                  'Complimentary rescheduling & cancellation up to 48 hours prior to dispatch. Uniformed chauffeur & sanitized cabin guaranteed.'}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
