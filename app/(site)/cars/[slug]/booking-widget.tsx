'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, ShieldCheck, Info, ArrowRight } from 'lucide-react'
import type { CarDetails } from '@/lib/cars'
import { LuxuryDatePicker } from '@/components/luxury-date-picker'

export function CarBookingWidget({ car }: { car: CarDetails }) {
  const router = useRouter()
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [service, setService] = useState('chauffeur') // chauffeur or selfdrive
  const [addons, setAddons] = useState<string[]>([])
  const [activeBundle, setActiveBundle] = useState<string | null>(null)

  const ADDON_PRICES = {
    child_seat: 1500,
    extra_driver: 1000,
    photographer: 5000,
    decoration: 2500,
  }

  const BUNDLES = [
    { id: 'wedding_bundle', label: 'Wedding Package', price: 15000, desc: 'Decoration + Photographer + 50km Extra', icon: '💍' },
    { id: 'family_trip', label: 'Family Trip', price: 3000, desc: 'Child Seat + Extra Driver', icon: '👨‍👩‍👧‍👦' },
    { id: 'vip_arrival', label: 'VIP Arrival', price: 10000, desc: 'Premium Decor + Champagne + Meet & Greet', icon: '🍾' },
  ]

  const estimate = useMemo(() => {
    let days = 1
    if (pickupDate && returnDate) {
      const p = new Date(pickupDate)
      const r = new Date(returnDate)
      const diff = Math.ceil((r.getTime() - p.getTime()) / (1000 * 60 * 60 * 24))
      if (diff > 0) days = diff
    }
    const base = car.price * days
    
    // Addons calculation
    const addonsTotal = addons.reduce((sum, addonId) => {
      return sum + (ADDON_PRICES[addonId as keyof typeof ADDON_PRICES] || 0)
    }, 0)

    const bundleTotal = activeBundle ? (BUNDLES.find(b => b.id === activeBundle)?.price || 0) : 0
    const totalAddonsAndBundles = addonsTotal + bundleTotal

    const gst = 0
    return { days, base, addonsTotal: totalAddonsAndBundles, gst, total: base + totalAddonsAndBundles + gst }
  }, [car.price, pickupDate, returnDate, addons, activeBundle])

  const handleCheckout = () => {
    if (!pickupDate) return
    const q = new URLSearchParams({
      carId: car.id,
      pickupDate,
      returnDate: returnDate || pickupDate,
      service,
      days: estimate.days.toString(),
      addons: [...addons, activeBundle].filter(Boolean).join(','),
      total: estimate.total.toString()
    })
    router.push(`/checkout?${q.toString()}`)
  }

  return (
    <div className="bg-[#111] rounded-2xl border border-[var(--gold-400)]/30 p-6 shadow-[0_0_40px_rgba(212,175,55,0.1)]">
      <div className="flex items-end gap-2 mb-6 border-b border-white/10 pb-4">
         <span className="text-3xl font-bold text-[var(--gold-400)]">₹{car.price.toLocaleString()}</span>
         <span className="text-sm text-white/40 mb-1">/ day</span>
      </div>

      <div className="space-y-5">
         <div>
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Service Type</label>
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/5">
               <button 
                 onClick={() => setService('chauffeur')}
                 disabled={!car.services.includes('chauffeur')}
                 className={`flex-1 py-2 text-sm rounded-lg transition-all ${service === 'chauffeur' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'} disabled:opacity-20`}
               >
                  Chauffeur
               </button>
               <button 
                 onClick={() => setService('selfdrive')}
                 disabled={!car.services.includes('selfdrive')}
                 className={`flex-1 py-2 text-sm rounded-lg transition-all ${service === 'selfdrive' ? 'bg-white/10 text-white shadow-sm' : 'text-white/40 hover:text-white/70'} disabled:opacity-20`}
               >
                  Self Drive
               </button>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-3">
            <div>
               <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Pickup</label>
               <LuxuryDatePicker
                 value={pickupDate}
                 onChange={setPickupDate}
                 min={new Date().toISOString().split("T")[0]}
                 placeholder="Pickup date"
                 triggerClassName="bg-white/5 border-white/10"
               />
            </div>
            <div>
               <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Return</label>
               <LuxuryDatePicker
                 value={returnDate}
                 onChange={setReturnDate}
                 min={pickupDate || new Date().toISOString().split("T")[0]}
                 placeholder="Return date"
                 triggerClassName="bg-white/5 border-white/10"
               />
            </div>
         </div>

         {/* Curated Bundles */}
         <div className="pt-2">
            <label className="block text-xs text-white/40 uppercase tracking-wider mb-3">Curated Packages</label>
            <div className="space-y-2 mb-4">
              {BUNDLES.map((bundle) => (
                <label 
                  key={bundle.id} 
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    activeBundle === bundle.id ? 'bg-[var(--gold-400)]/10 border-[var(--gold-400)]' : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex gap-3 items-center">
                    <span className="text-2xl">{bundle.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white/90">{bundle.label}</p>
                      <p className="text-[10px] text-white/50">{bundle.desc}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                     <p className="text-xs text-[var(--gold-400)] font-medium mb-1">+₹{bundle.price.toLocaleString()}</p>
                     <input 
                        type="radio" 
                        name="bundle"
                        className="accent-[var(--gold-400)] w-4 h-4 cursor-pointer"
                        checked={activeBundle === bundle.id}
                        onChange={(e) => setActiveBundle(e.target.checked ? bundle.id : null)}
                        onClick={(e) => {
                           // Allow unchecking a radio button
                           if (activeBundle === bundle.id) {
                              e.preventDefault()
                              setActiveBundle(null)
                           }
                        }}
                     />
                  </div>
                </label>
              ))}
            </div>

            <label className="block text-xs text-white/40 uppercase tracking-wider mb-3">A-la-carte Add-ons</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'child_seat', label: 'Child Seat', price: ADDON_PRICES.child_seat, icon: '🍼' },
                { id: 'extra_driver', label: 'Extra Driver', price: ADDON_PRICES.extra_driver, icon: '👔' },
                { id: 'photographer', label: 'Photographer', price: ADDON_PRICES.photographer, icon: '📸' },
                { id: 'decoration', label: 'Decoration', price: ADDON_PRICES.decoration, icon: '🎀' },
              ].map((addon) => (
                <label 
                  key={addon.id} 
                  className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                    addons.includes(addon.id) ? 'bg-[var(--gold-400)]/10 border-[var(--gold-400)]' : 'bg-white/5 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-lg">{addon.icon}</span>
                    <input 
                      type="checkbox" 
                      className="accent-[var(--gold-400)] w-4 h-4"
                      checked={addons.includes(addon.id)}
                      onChange={(e) => {
                        if (e.target.checked) setAddons(prev => [...prev, addon.id])
                        else setAddons(prev => prev.filter(id => id !== addon.id))
                      }}
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-white/90">{addon.label}</p>
                    <p className="text-[10px] text-[var(--gold-400)] mt-0.5">+₹{addon.price.toLocaleString()}</p>
                  </div>
                </label>
              ))}
            </div>
         </div>

         {(!pickupDate || !returnDate) ? (
            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500/80 p-3 rounded-xl text-xs mt-2 flex gap-2">
               <Info className="w-4 h-4 shrink-0 mt-0.5" />
               <p>Please select your <strong>Pickup</strong> and <strong>Return</strong> dates to view accurate pricing and proceed to checkout.</p>
            </div>
         ) : (
            <div className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-3 mt-2 text-sm">
               <div className="flex justify-between text-white/60">
                  <span>₹{car.price.toLocaleString()} x {estimate.days} days</span>
                  <span>₹{estimate.base.toLocaleString()}</span>
               </div>
               {estimate.addonsTotal > 0 && (
                 <div className="flex justify-between text-white/60">
                    <span>Premium Add-ons</span>
                    <span>+₹{estimate.addonsTotal.toLocaleString()}</span>
                 </div>
               )}
               <div className="pt-3 border-t border-white/10 flex justify-between font-bold text-white text-base">
                  <span>Total Estimate</span>
                  <span>₹{estimate.total.toLocaleString()}</span>
               </div>
            </div>
         )}

         <button 
           onClick={handleCheckout}
           disabled={!pickupDate || !returnDate}
           className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
           style={{
             background: (pickupDate && returnDate) ? 'linear-gradient(135deg, var(--gold-300), var(--gold-400), var(--gold-500))' : 'rgba(255,255,255,0.05)',
             color: (pickupDate && returnDate) ? 'black' : 'rgba(255,255,255,0.3)',
             boxShadow: (pickupDate && returnDate) ? '0 4px 20px rgba(212,175,55,0.3)' : 'none',
           }}
         >
            Proceed to Checkout <ArrowRight className="w-5 h-5" />
         </button>
      </div>

      <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
         <div className="flex gap-3">
            <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
            <div>
               <h4 className="text-xs font-semibold text-white/90">Free Cancellation</h4>
               <p className="text-[10px] text-white/40 mt-1">{car.cancellationPolicy}</p>
            </div>
         </div>
         <div className="flex gap-3">
            <ShieldCheck className="w-5 h-5 text-[var(--gold-400)] shrink-0" />
            <div>
               <h4 className="text-xs font-semibold text-white/90">
                 {service === 'selfdrive' ? 'Refundable Security Deposit' : 'Zero Deposit Chauffeur'}
               </h4>
               <p className="text-[10px] text-white/40 mt-1">
                 {service === 'selfdrive'
                   ? `${car.securityDeposit || '₹25,000'} refundable deposit released within 24–48h via UPI post inspection.`
                   : 'Zero security deposit required for our chauffeur-driven luxury trips.'}
               </p>
            </div>
         </div>
         <div className="flex gap-3">
            <Info className="w-5 h-5 text-white/40 shrink-0" />
            <div>
               <h4 className="text-xs font-semibold text-white/90">Fuel & Electronic Tolls</h4>
               <p className="text-[10px] text-white/40 mt-1">
                 {service === 'selfdrive'
                   ? 'Full-to-Full fuel policy. Equipped with electronic FASTag for automatic highway & airport toll lanes.'
                   : 'Chauffeur trips include fuel and chauffeur allowances; tolls & parking billed at actuals.'}
               </p>
            </div>
         </div>
         <div className="flex gap-3">
            <Info className="w-5 h-5 text-white/40 shrink-0" />
            <div>
               <h4 className="text-xs font-semibold text-white/90">Kilometer Allowance</h4>
               <p className="text-[10px] text-white/40 mt-1">{car.kmAllowance}</p>
            </div>
         </div>
      </div>
    </div>
  )
}
