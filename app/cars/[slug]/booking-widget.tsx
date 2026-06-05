'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, ShieldCheck, Info, ArrowRight } from 'lucide-react'
import type { CarDetails } from '@/lib/cars'

export function CarBookingWidget({ car }: { car: CarDetails }) {
  const router = useRouter()
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [service, setService] = useState('chauffeur') // chauffeur or selfdrive

  const estimate = useMemo(() => {
    let days = 1
    if (pickupDate && returnDate) {
      const p = new Date(pickupDate)
      const r = new Date(returnDate)
      const diff = Math.ceil((r.getTime() - p.getTime()) / (1000 * 60 * 60 * 24))
      if (diff > 0) days = diff
    }
    const base = car.price * days
    // const gst = base * 0.18
    const gst = 0
    return { days, base, gst, total: base + gst }
  }, [car.price, pickupDate, returnDate])

  const handleCheckout = () => {
    if (!pickupDate) return
    const q = new URLSearchParams({
      carId: car.id,
      pickupDate,
      returnDate: returnDate || pickupDate,
      service,
      days: estimate.days.toString(),
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
               <div className="relative">
                 <input 
                   type="date" 
                   value={pickupDate}
                   onChange={(e) => setPickupDate(e.target.value)}
                   min={new Date().toISOString().split("T")[0]}
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 pl-9 text-white text-sm focus:border-[var(--gold-400)]/50 focus:outline-none transition [color-scheme:dark]" 
                 />
                 <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
               </div>
            </div>
            <div>
               <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Return</label>
               <div className="relative">
                 <input 
                   type="date" 
                   value={returnDate}
                   onChange={(e) => setReturnDate(e.target.value)}
                   min={pickupDate || new Date().toISOString().split("T")[0]}
                   className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 pl-9 text-white text-sm focus:border-[var(--gold-400)]/50 focus:outline-none transition [color-scheme:dark]" 
                 />
                 <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
               </div>
            </div>
         </div>

         <div className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-3 mt-2 text-sm">
            <div className="flex justify-between text-white/60">
               <span>₹{car.price.toLocaleString()} x {estimate.days} days</span>
               <span>₹{estimate.base.toLocaleString()}</span>
            </div>
            {/* <div className="flex justify-between text-white/60">
               <span>Taxes & GST (18%)</span>
               <span>₹{estimate.gst.toLocaleString()}</span>
            </div> */}
            <div className="pt-3 border-t border-white/10 flex justify-between font-bold text-white text-base">
               <span>Total Estimate</span>
               <span>₹{estimate.total.toLocaleString()}</span>
            </div>
         </div>

         <button 
           onClick={handleCheckout}
           disabled={!pickupDate}
           className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
           style={{
             background: pickupDate ? 'linear-gradient(135deg, var(--gold-300), var(--gold-400), var(--gold-500))' : 'rgba(255,255,255,0.05)',
             color: pickupDate ? 'black' : 'rgba(255,255,255,0.3)',
             boxShadow: pickupDate ? '0 4px 20px rgba(212,175,55,0.3)' : 'none',
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
            <Info className="w-5 h-5 text-white/40 shrink-0" />
            <div>
               <h4 className="text-xs font-semibold text-white/90">Refundable Deposit</h4>
               <p className="text-[10px] text-white/40 mt-1">{car.securityDeposit} holding deposit required at pickup.</p>
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
