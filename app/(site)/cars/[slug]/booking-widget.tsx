'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ShieldCheck,
  ArrowRight,
  Crown,
  Users,
  Sparkles,
  UserCheck,
  Camera,
  Gift,
  Lock,
  ChevronDown,
  MapPin,
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import type { CarDetails } from '@/lib/cars'
import { LuxuryDatePicker } from '@/components/luxury-date-picker'
import { LuxurySelect } from '@/components/luxury-select'

const todayStr = () => new Date().toISOString().split('T')[0]

const HUBS = [
  'Banjara Hills',
  'Jubilee Hills',
  'RGIA Airport (Shamshabad)',
  'HITEC City',
  'Financial District',
  'Taj Falaknuma Palace',
]

const ADDON_PRICES = {
  child_seat: 1500,
  extra_driver: 1000,
  photographer: 5000,
  decoration: 2500,
}

const BUNDLES = [
  {
    id: 'wedding_bundle',
    label: 'Royal Bridal Package',
    price: 15000,
    Icon: Crown,
  },
  {
    id: 'family_trip',
    label: 'Family Concierge Suite',
    price: 3000,
    Icon: Users,
  },
  {
    id: 'vip_arrival',
    label: 'Tarmac VIP Protocol',
    price: 10000,
    Icon: Sparkles,
  },
]

export function CarBookingWidget({ car }: { car: CarDetails }) {
  const router = useRouter()
  const [pickupDate, setPickupDate] = useState(todayStr)
  const [returnDate, setReturnDate] = useState(todayStr)
  const [pickupHub, setPickupHub] = useState(HUBS[0])
  const [service, setService] = useState<'chauffeur' | 'selfdrive'>('chauffeur')
  const [addons, setAddons] = useState<string[]>([])
  const [activeBundle, setActiveBundle] = useState<string | null>(null)
  const [showAddons, setShowAddons] = useState(false)

  const isSelfDrive = service === 'selfdrive'
  const selfDriveRate = car.selfDrivePrice ?? Math.round(car.price * 0.85)
  const effectiveDailyRate = isSelfDrive ? selfDriveRate : car.price

  const estimate = useMemo(() => {
    let days = 1
    if (pickupDate && returnDate) {
      const p = new Date(pickupDate)
      const r = new Date(returnDate)
      const diff = Math.ceil((r.getTime() - p.getTime()) / (1000 * 60 * 60 * 24))
      if (diff > 0) days = diff
    }
    const base = effectiveDailyRate * days

    const addonsTotal = addons.reduce((sum, addonId) => {
      return sum + (ADDON_PRICES[addonId as keyof typeof ADDON_PRICES] || 0)
    }, 0)

    const bundleTotal = activeBundle ? BUNDLES.find((b) => b.id === activeBundle)?.price || 0 : 0
    const totalAddonsAndBundles = addonsTotal + bundleTotal

    return {
      days,
      base,
      addonsTotal: totalAddonsAndBundles,
      total: base + totalAddonsAndBundles,
    }
  }, [effectiveDailyRate, pickupDate, returnDate, addons, activeBundle])

  const handlePickupChange = (val: string) => {
    const nextPickup = val || todayStr()
    setPickupDate(nextPickup)
    if (!returnDate || returnDate < nextPickup) {
      setReturnDate(nextPickup)
    }
  }

  const handleReturnChange = (val: string) => {
    const nextReturn = val && val >= pickupDate ? val : pickupDate
    setReturnDate(nextReturn)
  }

  const handleCheckout = () => {
    const resolvedPickup = pickupDate || todayStr()
    const resolvedReturn = returnDate && returnDate >= resolvedPickup ? returnDate : resolvedPickup
    const q = new URLSearchParams({
      carId: car.slug || car.id,
      pickup: pickupHub,
      pickupDate: resolvedPickup,
      returnDate: resolvedReturn,
      service,
      days: estimate.days.toString(),
      addons: [...addons, activeBundle].filter(Boolean).join(','),
      total: estimate.total.toString(),
    })
    router.push(`/checkout?${q.toString()}`)
  }

  // Contact-Only Charter Desk for Luxury Coaches / Buses
  if (car.category === 'bus') {
    const waText = encodeURIComponent(
      `Hello DRIVEIT Charter Desk, I would like a private charter quote for the ${car.name}.`,
    )
    return (
      <div className="bg-[#09090d] rounded-2xl border border-[#c9a96e]/35 p-6 space-y-5">
        <div className="border-b border-white/10 pb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#c9a96e]/12 border border-[#c9a96e]/30 text-[10px] font-mono uppercase tracking-[0.22em] text-[#c9a96e] mb-2">
            <Lock className="w-3 h-3" />
            Contact Only
          </span>
          <h3 className="text-xl font-medium text-white">Private Charter Desk</h3>
        </div>

        <div className="space-y-2.5">
          <Link
            href={`/contact?service=${encodeURIComponent(`Luxury Coach Charter: ${car.name}`)}`}
            className="w-full py-4 rounded-xl bg-[#c9a96e] hover:bg-[#dfc288] text-black font-bold text-xs font-mono uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition"
          >
            <span>Inquire Privately</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href={`https://wa.me/916300041186?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-xl border border-white/15 bg-white/[0.03] hover:border-[#25D366]/50 text-white text-xs font-mono uppercase tracking-[0.18em] flex items-center justify-center gap-2 transition"
          >
            <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
            <span>WhatsApp Desk</span>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#09090d] rounded-2xl border border-white/12 p-6 space-y-5">
      {/* Top Rate Display */}
      <div className="flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#c9a96e] block mb-1">
            {isSelfDrive ? 'Self-Drive Rate' : 'Chauffeur Rate'}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-white font-mono">
              ₹{effectiveDailyRate.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-mono text-white/45">/ day</span>
          </div>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/12 text-emerald-300 border border-emerald-500/25">
          {isSelfDrive ? 'Doorstep Delivery' : '₹0 Deposit'}
        </span>
      </div>

      {/* Mode Switch */}
      <div className="grid grid-cols-2 gap-1.5 bg-black p-1 rounded-xl border border-white/10">
        <button
          type="button"
          onClick={() => setService('chauffeur')}
          className={`py-2.5 px-3 text-xs font-mono uppercase tracking-wider rounded-lg transition cursor-pointer ${
            service === 'chauffeur'
              ? 'bg-[#c9a96e] text-black font-bold'
              : 'text-white/55 hover:text-white'
          }`}
        >
          Chauffeur
        </button>
        <button
          type="button"
          onClick={() => setService('selfdrive')}
          className={`py-2.5 px-3 text-xs font-mono uppercase tracking-wider rounded-lg transition cursor-pointer ${
            service === 'selfdrive'
              ? 'bg-[#c9a96e] text-black font-bold'
              : 'text-white/55 hover:text-white'
          }`}
        >
          Self-Drive
        </button>
      </div>

      {/* Pickup Location */}
      <div>
        <label className="block text-[10px] font-mono text-white/45 uppercase tracking-[0.2em] mb-1.5">
          Handover Hub
        </label>
        <LuxurySelect
          value={pickupHub}
          onChange={setPickupHub}
          options={HUBS}
          size="sm"
          icon={<MapPin className="w-3.5 h-3.5 text-[#c9a96e]" />}
          triggerClassName="bg-black border-white/12 text-xs py-2.5 min-h-[42px]"
          ariaLabel="Select handover location"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-mono text-white/45 uppercase tracking-[0.2em] mb-1.5">
            Pickup
          </label>
          <LuxuryDatePicker
            value={pickupDate}
            onChange={handlePickupChange}
            min={todayStr()}
            placeholder="Pickup"
            triggerClassName="bg-black border-white/12"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-white/45 uppercase tracking-[0.2em] mb-1.5">
            Return
          </label>
          <LuxuryDatePicker
            value={returnDate}
            onChange={handleReturnChange}
            min={pickupDate || todayStr()}
            placeholder="Return"
            triggerClassName="bg-black border-white/12"
          />
        </div>
      </div>

      {/* Collapsible Concierge Add-ons */}
      <div className="border-t border-white/8 pt-3">
        <button
          type="button"
          onClick={() => setShowAddons(!showAddons)}
          className="w-full flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.18em] text-white/60 hover:text-white cursor-pointer py-1"
        >
          <span>+ Concierge Packages & Add-ons</span>
          <ChevronDown
            className={`w-4 h-4 text-[#c9a96e] transition-transform ${showAddons ? 'rotate-180' : ''}`}
          />
        </button>

        {showAddons && (
          <div className="mt-3 space-y-2">
            {BUNDLES.map((bundle) => {
              const Icon = bundle.Icon
              const isSelected = activeBundle === bundle.id
              return (
                <button
                  type="button"
                  key={bundle.id}
                  onClick={() => setActiveBundle(isSelected ? null : bundle.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#c9a96e]/15 border-[#c9a96e]'
                      : 'bg-black/40 border-white/8 hover:border-white/20'
                  }`}
                >
                  <span className="flex items-center gap-2 text-xs text-white">
                    <Icon className="w-3.5 h-3.5 text-[#c9a96e]" />
                    {bundle.label}
                  </span>
                  <span className="text-[11px] font-mono text-[#c9a96e]">
                    +₹{bundle.price.toLocaleString('en-IN')}
                  </span>
                </button>
              )
            })}

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {[
                { id: 'child_seat', label: 'Child Seat', price: ADDON_PRICES.child_seat, Icon: ShieldCheck },
                { id: 'extra_driver', label: 'Relief Driver', price: ADDON_PRICES.extra_driver, Icon: UserCheck },
                { id: 'photographer', label: 'Photographer', price: ADDON_PRICES.photographer, Icon: Camera },
                { id: 'decoration', label: 'Floral Trim', price: ADDON_PRICES.decoration, Icon: Gift },
              ].map((addon) => {
                const checked = addons.includes(addon.id)
                return (
                  <button
                    type="button"
                    key={addon.id}
                    onClick={() =>
                      setAddons((prev) =>
                        checked ? prev.filter((id) => id !== addon.id) : [...prev, addon.id],
                      )
                    }
                    className={`p-2 rounded-lg border text-left cursor-pointer text-[11px] flex items-center justify-between transition ${
                      checked
                        ? 'bg-[#c9a96e]/15 border-[#c9a96e] text-white'
                        : 'bg-black/40 border-white/8 text-white/65'
                    }`}
                  >
                    <span className="truncate">{addon.label}</span>
                    <span className="font-mono text-[#c9a96e] ml-1">
                      +₹{(addon.price / 1000).toFixed(1)}k
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Total Bar */}
      <div className="bg-black rounded-xl p-4 border border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-white/45 block">
            Total ({estimate.days} {estimate.days === 1 ? 'Day' : 'Days'})
          </span>
          <span className="text-2xl font-bold font-mono text-[#c9a96e]">
            ₹{estimate.total.toLocaleString('en-IN')}
          </span>
        </div>
        <span className="text-[10px] font-mono text-white/45">Excl. GST</span>
      </div>

      {/* Primary Book CTA + WhatsApp */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={handleCheckout}
          className="w-full py-4 rounded-xl bg-[#c9a96e] hover:bg-[#dfc288] text-black font-bold text-xs font-mono uppercase tracking-[0.22em] transition cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Book Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <a
          href={`https://wa.me/916300041186?text=${encodeURIComponent(
            `Hi DRIVEIT, I want to reserve the ${car.name} (${service}) on ${pickupDate} at ${pickupHub}.`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-xl border border-white/12 bg-white/[0.02] hover:border-[#25D366]/50 text-xs font-mono uppercase tracking-[0.18em] text-white/80 hover:text-white flex items-center justify-center gap-2 transition"
        >
          <FaWhatsapp className="w-4 h-4 text-[#25D366]" />
          <span>Book via WhatsApp</span>
        </a>
      </div>
    </div>
  )
}
