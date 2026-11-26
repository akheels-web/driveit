'use client'

import { useState, type FormEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  X,
  ArrowRight,
  CheckCircle2,
  UserCheck,
  Car,
  Plane,
  Lock,
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { formatBrandAndModel, type CarDetails } from '@/lib/cars'
import { buildVehicleAlt } from '@/lib/asset-paths'
import type { PickupHubConfig } from '@/lib/home-config'
import { LuxuryDatePicker } from '@/components/luxury-date-picker'
import { getLocalDateString } from '@/lib/utils'

export type CommissionAsset = {
  title: string
  subtitle: string
  src: string
  imageAlt?: string
  serviceName: string
}

type QuickBookDrawerProps = {
  car: CarDetails | null
  commission: CommissionAsset | null
  initialMode?: 'chauffeur' | 'selfdrive' | 'airport'
  hubs?: PickupHubConfig[]
  onClose: () => void
}

const HUBS = [
  'Banjara Hills',
  'Jubilee Hills',
  'RGIA Airport (Shamshabad)',
  'HITEC City',
  'Financial District',
  'Taj Falaknuma Palace',
]

const todayStr = () => getLocalDateString(0)
const tomorrowStr = () => getLocalDateString(1)

export function QuickBookDrawer({
  car,
  commission,
  initialMode = 'chauffeur',
  hubs,
  onClose,
}: QuickBookDrawerProps) {
  const router = useRouter()
  const hubList = hubs && hubs.length > 0 ? hubs.map((h) => h.label) : HUBS
  const [mode, setMode] = useState<'chauffeur' | 'selfdrive' | 'airport'>(initialMode)
  const [pickup, setPickup] = useState(hubList[0])
  const [pickupDate, setPickupDate] = useState(todayStr)
  const [returnDate, setReturnDate] = useState(tomorrowStr)

  // Commission form state (for Jets, Yachts, Coaches)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle')
  const [reference, setReference] = useState('')

  if (!car && !commission) return null

  // Calculate rental days & price for cars
  const days = Math.max(
    1,
    Math.ceil(
      (new Date(returnDate || todayStr()).getTime() -
        new Date(pickupDate || todayStr()).getTime()) /
        86_400_000,
    ) || 1,
  )

  const selfDriveRate = car ? (car.selfDrivePrice ?? Math.round(car.price * 0.85)) : 0
  const dailyRate = car ? (mode === 'selfdrive' ? selfDriveRate : car.price) : 0
  const totalPrice = dailyRate * days

  const handleProceedCheckout = () => {
    if (!car) return
    const params = new URLSearchParams({
      carId: car.slug,
      service: mode,
      pickup,
      pickupDate,
      returnDate: returnDate >= pickupDate ? returnDate : pickupDate,
    })
    onClose()
    router.push(`/checkout?${params.toString()}`)
  }

  const handleCommissionSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!commission) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          service: commission.serviceName,
          date: pickupDate,
          location: pickup,
          message: notes.trim() || `Private charter inquiry for ${commission.title}.`,
          company: '',
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setStatus('error')
        return
      }
      setReference(data.reference || 'PRIVE-01')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[120] flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#08080b] border-l border-white/10 h-[100dvh] overflow-y-auto flex flex-col justify-between p-5 sm:p-8 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] text-white shadow-2xl"
      >
        {/* Top Close Bar */}
        <div>
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#c9a96e]">
              {commission ? 'Privé Commission Desk' : 'Instant Reservation'}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* VehicleBooking Flow */}
          {car && (
            <div className="mt-6 space-y-6">
              {/* Visual Header */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#ebebea] border border-white/10">
                <Image
                  src={car.src}
                  alt={buildVehicleAlt({
                    imageAlt: car.imageAlt,
                    brand: car.brand,
                    name: car.name,
                    category: car.category,
                    context: 'Quick Reservation',
                  })}
                  fill
                  unoptimized
                  sizes="420px"
                  className="object-cover object-bottom"
                />
                <div className="absolute top-4 left-5 right-5 flex items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#7a6440] font-medium">
                      {formatBrandAndModel(car.brand, car.name).brandLabel}
                    </p>
                    <h3 className="text-xl font-light text-[#111111]">
                      {formatBrandAndModel(car.brand, car.name).modelLabel}
                    </h3>
                  </div>
                  <span className="text-xs font-normal text-[#f4efe6] bg-[#111111] px-3 py-1 rounded-full">
                    ₹{dailyRate.toLocaleString('en-IN')}/d
                  </span>
                </div>
              </div>

              {/* Drive Mode Switch */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/45 block mb-2">
                  Mode
                </label>
                <div className="grid grid-cols-3 gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/10">
                  {(
                    [
                      { id: 'chauffeur', label: 'Chauffeur', Icon: UserCheck },
                      { id: 'selfdrive', label: 'Self-Drive', Icon: Car },
                      { id: 'airport', label: 'Airport VIP', Icon: Plane },
                    ] as const
                  ).map((item) => {
                    const Icon = item.Icon
                    const active = mode === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMode(item.id)}
                        className={`flex items-center justify-center gap-1 sm:gap-1.5 min-h-[40px] px-1.5 sm:px-2 py-2 rounded-lg text-[10px] sm:text-[11px] font-mono uppercase tracking-wide transition cursor-pointer ${
                          active
                            ? 'bg-[#c9a96e] text-black font-bold'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Pickup Hub */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/45 block mb-2">
                  Hyderabad Handover Point
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {hubList.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setPickup(h)}
                      className={`px-3 py-1.5 rounded-lg text-xs border transition cursor-pointer ${
                        pickup === h
                          ? 'bg-[#c9a96e]/15 border-[#c9a96e] text-[#f4efe6]'
                          : 'bg-white/[0.02] border-white/10 text-white/55 hover:text-white'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 min-[390px]:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/45 block mb-1.5">
                    Pickup Date
                  </label>
                  <LuxuryDatePicker
                    size="sm"
                    min={todayStr()}
                    value={pickupDate}
                    onChange={(v) => {
                      const nextPickup = v || todayStr()
                      setPickupDate(nextPickup)
                      if (returnDate < nextPickup) setReturnDate(nextPickup)
                    }}
                    placeholder="Pickup Date"
                    ariaLabel="Pickup Date"
                    triggerClassName="bg-white/[0.03] border-white/10 hover:border-white/25 text-xs font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/45 block mb-1.5">
                    Return Date
                  </label>
                  <LuxuryDatePicker
                    size="sm"
                    min={pickupDate}
                    value={returnDate}
                    onChange={(v) => setReturnDate(v || pickupDate)}
                    placeholder="Return Date"
                    ariaLabel="Return Date"
                    triggerClassName="bg-white/[0.03] border-white/10 hover:border-white/25 text-xs font-mono text-white"
                  />
                </div>
              </div>

              {/* Clean Summary */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-white/45 block">
                    Estimated Total ({days} {days === 1 ? 'Day' : 'Days'})
                  </span>
                  <span className="text-2xl font-bold font-mono text-[#c9a96e]">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {mode === 'selfdrive' ? 'Doorstep Delivery' : '₹0 Deposit'}
                </span>
              </div>
            </div>
          )}

          {/* Private Commission Flow (Jets, Yachts, Coaches) */}
          {commission && (
            <div className="mt-6 space-y-6">
              <div className="relative h-48 rounded-2xl overflow-hidden bg-black border border-[#c9a96e]/30">
                <Image
                  src={commission.src}
                  alt={
                    commission.imageAlt ||
                    `${commission.title} — ${commission.subtitle} — DRIVEIT Concierge`
                  }
                  fill
                  sizes="420px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08080b] via-[#08080b]/30 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 border border-[#c9a96e]/40 text-[9px] font-mono uppercase tracking-[0.22em] text-[#c9a96e]">
                    <Lock className="w-2.5 h-2.5" />
                    Contact Only
                  </span>
                </div>
                <div className="absolute bottom-3.5 left-4 right-4">
                  <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c9a96e]">
                    {commission.subtitle}
                  </p>
                  <h3 className="text-xl font-semibold text-white">{commission.title}</h3>
                </div>
              </div>

              {status === 'sent' ? (
                <div className="py-8 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#c9a96e]">
                    Ref · {reference}
                  </p>
                  <h4 className="text-xl font-light">Commission Registered</h4>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Our Senior Charter Desk will call <strong className="text-white">{phone}</strong> within 15 minutes.
                  </p>
                </div>
              ) : (
                <form id="commission-drawer-form" onSubmit={handleCommissionSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/45 block mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full rounded-xl bg-white/[0.03] border border-white/12 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c9a96e]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/45 block mb-1.5">
                      Direct Mobile / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl bg-white/[0.03] border border-white/12 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#c9a96e]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/45 block mb-1.5">
                      Preferred Date
                    </label>
                    <LuxuryDatePicker
                      min={todayStr()}
                      value={pickupDate}
                      onChange={(v) => setPickupDate(v || todayStr())}
                      placeholder="Preferred Date"
                      ariaLabel="Preferred Date"
                      triggerClassName="bg-white/[0.03] border-white/12 hover:border-white/25 text-sm font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono uppercase tracking-[0.22em] text-white/45 block mb-1.5">
                      Route / Requirements (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Departure city, guest count, or special requests..."
                      className="w-full rounded-xl bg-white/[0.03] border border-white/12 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#c9a96e] resize-none"
                    />
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Sticky Bottom CTA */}
        <div className="pt-5 border-t border-white/10 space-y-2.5 mt-6">
          {car && (
            <>
              <button
                type="button"
                onClick={handleProceedCheckout}
                className="w-full py-4 rounded-xl bg-[#c9a96e] hover:bg-[#dfc288] text-black font-bold text-xs font-mono uppercase tracking-[0.22em] flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <span>Continue to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={`https://wa.me/916300041186?text=${encodeURIComponent(
                  `Hi DRIVEIT, I want to book the ${car.name} (${mode}) on ${pickupDate} at ${pickup}.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl border border-white/12 bg-white/[0.03] hover:border-[#25D366]/50 text-xs font-mono uppercase tracking-[0.18em] text-white/80 hover:text-white flex items-center justify-center gap-2 transition"
              >
                <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                <span>Instant WhatsApp Booking</span>
              </a>
            </>
          )}

          {commission && status !== 'sent' && (
            <>
              <button
                type="submit"
                form="commission-drawer-form"
                disabled={status === 'submitting'}
                className="w-full py-4 rounded-xl bg-[#c9a96e] hover:bg-[#dfc288] text-black font-bold text-xs font-mono uppercase tracking-[0.22em] flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{status === 'submitting' ? 'Sending...' : 'Request Private Charter'}</span>
              </button>
              <a
                href={`https://wa.me/916300041186?text=${encodeURIComponent(
                  `Hello DRIVEIT Privé, I would like to commission: ${commission.title}.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl border border-white/12 bg-white/[0.03] hover:border-[#25D366]/50 text-xs font-mono uppercase tracking-[0.18em] text-white/80 hover:text-white flex items-center justify-center gap-2 transition"
              >
                <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
                <span>Direct WhatsApp Desk</span>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

