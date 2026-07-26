'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { ShieldCheck, CheckCircle2, ChevronLeft, CreditCard, Smartphone, QrCode, Lock, ArrowRight, Upload, MapPin } from 'lucide-react'
import { carsData } from '@/lib/cars'
import { createClient } from '@/lib/supabase/client'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const carId = searchParams.get('carId')
  const pickupDate = searchParams.get('pickupDate') || new Date().toISOString().split('T')[0]
  const returnDate = searchParams.get('returnDate') || new Date().toISOString().split('T')[0]
  const service = searchParams.get('service') || 'wedding'
  const daysStr = searchParams.get('days')
  
  const packageType = searchParams.get('package')
  const primaryCar = searchParams.get('primaryCar')
  const packageTotalStr = searchParams.get('total')

  const isWedding = packageType === 'wedding'
  
  const weddingCar = isWedding ? {
     id: 'wedding-package',
     name: `Wedding Package (${primaryCar?.toUpperCase() || 'Custom'})`,
     brand: 'DriveIt Luxury',
     price: parseInt(packageTotalStr || '0'),
     src: 'https://i.pinimg.com/736x/a1/86/db/a186db7d8842e5c511163b21076dac56.jpg',
     securityDeposit: '₹50,000',
     cancellationPolicy: 'Non-refundable if cancelled within 7 days of event.'
  } : null;

  const car = isWedding ? weddingCar : carsData.find(c => c.id === carId)
  const days = isWedding ? 1 : parseInt(daysStr || '1')
  
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details')
  const [form, setForm] = useState({ name: '', phone: '', email: '', license: '', pickupLocation: '' })
  const [profile, setProfile] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [promoMessage, setPromoMessage] = useState('')
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState('')
  
  // If loaded directly without params, return to cars
  useEffect(() => {
     if (!isWedding && (!carId || !car)) {
        router.push('/cars')
     }
  }, [carId, car, isWedding, router])

  if (!car) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading...</div>

  const base = car.price * days
  // const gst = base * 0.18
  const gst = 0
  const total = base + gst - discount

  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'FIRST10') {
      setDiscount(base * 0.10)
      setPromoMessage('Promo FIRST10 applied: 10% off!')
    } else {
      setDiscount(0)
      setPromoMessage('Invalid promo code')
    }
  }

  const handleContinueToPayment = async () => {
     setIsProcessing(true)
     setCheckoutError('')
     try {
       const res = await fetch('/api/checkout/init', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           carSlug: car.name,
           startDate: pickupDate,
           endDate: returnDate,
           customerEmail: form.email,
           customerName: form.name,
           customerPhone: form.phone,
           pickupLocation: form.pickupLocation,
           totalPrice: total,
           serviceType: service,
         })
       })
       const data = await res.json()
       if (!res.ok) {
         setCheckoutError(data.error || 'Failed to initialize booking.')
         setIsProcessing(false)
         return
       }
       setBookingId(data.bookingId)
       setStep('payment')
     } catch (err) {
       setCheckoutError('Network error. Please try again.')
     }
     setIsProcessing(false)
  }

  const handlePay = async () => {
     if (!bookingId) return
     setIsProcessing(true)
     try {
       const res = await fetch('/api/checkout/confirm', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ bookingId })
       })
       if (res.ok) {
         setStep('success')
       } else {
         alert('Failed to confirm payment. Please contact support.')
       }
     } catch (err) {
       alert('Network error. Please try again.')
     }
     setIsProcessing(false)
  }

  if (step === 'success') {
     return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
           <motion.div 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="bg-white/[0.03] border border-green-500/30 rounded-3xl p-10 max-w-lg w-full text-center relative overflow-hidden"
           >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600" />
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                 <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-3xl font-[family-name:var(--font-playfair)] font-bold mb-2">Payment Successful!</h2>
              <p className="text-white/50 mb-8">Your booking for {car.name} is confirmed. A receipt has been sent to your email.</p>
              
              <div className="bg-black/40 rounded-xl p-5 border border-white/5 mb-8 text-left space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-white/40">Booking ID</span>
                    <span className="font-mono font-medium text-white">#DRV-{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-white/40">Amount Paid</span>
                    <span className="font-bold text-[var(--gold-400)]">₹{total.toLocaleString()}</span>
                 </div>
              </div>

              <div className="flex gap-4">
                 <Link href="/" className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition">
                    Return Home
                 </Link>
                 <a href={`https://wa.me/918341341186?text=Hi, my booking is confirmed! ID: #DRV-XXXX`} target="_blank" className="flex-1 py-3 rounded-xl bg-[#25D366] text-black font-bold hover:bg-[#20bd5a] transition">
                    WhatsApp Us
                 </a>
              </div>
           </motion.div>
        </div>
     )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="border-b border-white/10 bg-black sticky top-0 z-50">
         <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-white/50 hover:text-white transition">
               <ChevronLeft className="w-5 h-5" /> Back
            </button>
            <div className="font-bold tracking-wider text-[var(--gold-400)]">SECURE CHECKOUT</div>
            <div className="w-20" /> {/* Spacer */}
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            
            {/* Left Column: Form / Payment */}
            <div className="lg:col-span-2 space-y-8">
               
               {/* Progress Steps */}
               <div className="flex items-center gap-4 mb-8">
                  <div className={`flex items-center gap-2 ${step === 'details' ? 'text-[var(--gold-400)]' : 'text-green-400'}`}>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'details' ? 'bg-[var(--gold-400)] text-black' : 'bg-green-500/20 text-green-400'}`}>
                        {step === 'details' ? '1' : <CheckCircle2 className="w-5 h-5" />}
                     </div>
                     <span className="font-medium hidden sm:block">Guest Details</span>
                  </div>
                  <div className="h-px bg-white/20 flex-1" />
                  <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-[var(--gold-400)]' : 'text-white/40'}`}>
                     <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'payment' ? 'bg-[var(--gold-400)] text-black' : 'bg-white/10 text-white/40'}`}>
                        2
                     </div>
                     <span className="font-medium hidden sm:block">Secure Payment</span>
                  </div>
               </div>

               {step === 'details' && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8">
                     <h2 className="text-xl font-semibold mb-6">Primary Guest Details</h2>
                     <div className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                           <div>
                              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Full Name *</label>
                              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--gold-400)]/50 focus:outline-none transition" />
                           </div>
                           <div>
                              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Phone Number *</label>
                              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--gold-400)]/50 focus:outline-none transition" />
                           </div>
                        </div>
                        <div>
                           <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Email Address *</label>
                           <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--gold-400)]/50 focus:outline-none transition" />
                        </div>
                        
                        {service === 'selfdrive' && (
                           <div className="pt-4 border-t border-white/10">
                              <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Upload Driving License (Optional for now)</label>
                              <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:bg-white/[0.02] transition cursor-pointer">
                                 <Upload className="w-6 h-6 text-white/30 mx-auto mb-2" />
                                 <span className="text-sm text-white/50">Click to upload or drag and drop</span>
                              </div>
                           </div>
                        )}

                        <div className="pt-4 border-t border-white/10">
                           <div className="flex justify-between items-end mb-2">
                             <label className="block text-xs text-white/40 uppercase tracking-wider">Pickup Location *</label>
                             {profile && (profile.home_address || profile.office_address || profile.airport_address) && (
                               <select 
                                 onChange={(e) => setForm({...form, pickupLocation: e.target.value})}
                                 className="bg-black border border-white/10 text-white/70 text-xs px-2 py-1 rounded outline-none cursor-pointer"
                               >
                                 <option value="">Use Saved Address...</option>
                                 {profile.home_address && <option value={profile.home_address}>Home: {profile.home_address}</option>}
                                 {profile.office_address && <option value={profile.office_address}>Office: {profile.office_address}</option>}
                                 {profile.airport_address && <option value={profile.airport_address}>Airport: {profile.airport_address}</option>}
                               </select>
                             )}
                           </div>
                           <div className="relative">
                             <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                             <input type="text" placeholder="Enter full address or select from saved" value={form.pickupLocation} onChange={e => setForm({...form, pickupLocation: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-[var(--gold-400)]/50 focus:outline-none transition" />
                           </div>
                        </div>

                        {checkoutError && (
                           <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                             {checkoutError}
                           </div>
                        )}

                        <button 
                          onClick={handleContinueToPayment}
                          disabled={!form.name || !form.phone || !form.email || !form.pickupLocation || isProcessing}
                          className="w-full mt-6 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            background: (form.name && form.phone && form.email && form.pickupLocation) ? 'linear-gradient(135deg, var(--gold-300), var(--gold-400), var(--gold-500))' : 'rgba(255,255,255,0.05)',
                            color: (form.name && form.phone && form.email && form.pickupLocation) ? 'black' : 'rgba(255,255,255,0.3)',
                          }}
                        >
                           {isProcessing ? 'Locking Car & Proceeding...' : 'Continue to Payment'}
                        </button>
                     </div>
                  </motion.div>
               )}

               {step === 'payment' && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                     <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                           <h2 className="text-xl font-semibold">Payment Method</h2>
                           <div className="flex items-center gap-1 text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">
                              <Lock className="w-3 h-3" /> 256-bit Encrypted
                           </div>
                        </div>

                        {/* UPI Section */}
                        <div className="border border-[var(--gold-400)] bg-[var(--gold-400)]/5 rounded-xl p-5 relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-10">
                              <QrCode className="w-24 h-24" />
                           </div>
                           <div className="flex items-center gap-3 mb-6 relative z-10">
                              <Smartphone className="w-6 h-6 text-[var(--gold-400)]" />
                              <div>
                                 <h3 className="font-semibold text-white">UPI / QR Code</h3>
                                 <p className="text-xs text-white/50">Google Pay, PhonePe, Paytm, or any UPI App</p>
                              </div>
                           </div>
                           
                           {isProcessing ? (
                              <div className="py-10 flex flex-col items-center justify-center">
                                 <div className="w-12 h-12 border-4 border-white/10 border-t-[var(--gold-400)] rounded-full animate-spin mb-4" />
                                 <p className="text-white/60 text-sm animate-pulse">Waiting for payment confirmation...</p>
                              </div>
                           ) : (
                              <div className="bg-black/50 p-6 rounded-xl border border-white/10 flex flex-col md:flex-row items-center gap-8 relative z-10">
                                 <div className="w-40 h-40 bg-white p-2 rounded-xl shrink-0">
                                    <Image src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=mock@upi&pn=DRIVEIT&am=100" alt="UPI QR" width={150} height={150} className="w-full h-full" />
                                 </div>
                                 <div className="flex-1 text-center md:text-left space-y-4">
                                    <p className="text-sm text-white/70">Scan the QR code with any UPI app on your phone to complete the payment instantly.</p>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                       <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-white/60">GPay</span>
                                       <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-white/60">PhonePe</span>
                                       <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-xs text-white/60">Paytm</span>
                                    </div>
                                    <button onClick={handlePay} className="w-full py-3 bg-[var(--gold-400)] text-black font-bold rounded-lg hover:bg-[var(--gold-500)] transition shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                                       I have completed payment
                                    </button>
                                 </div>
                              </div>
                           )}
                        </div>

                        {/* Other Methods Disabled */}
                        <div className="mt-4 border border-white/5 rounded-xl p-5 flex items-center justify-between opacity-50 grayscale">
                           <div className="flex items-center gap-3">
                              <CreditCard className="w-5 h-5 text-white/50" />
                              <span className="font-medium text-white/50">Credit / Debit Card</span>
                           </div>
                           <span className="text-xs border border-white/10 px-2 py-1 rounded">Maintenance</span>
                        </div>
                     </div>
                  </motion.div>
               )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
               <div className="bg-[#111] border border-white/10 rounded-2xl p-6 sticky top-24">
                  <h3 className="text-lg font-semibold mb-6">Booking Summary</h3>
                  
                  <div className="flex gap-4 mb-6 pb-6 border-b border-white/10">
                     <div className="w-24 h-16 relative rounded-lg overflow-hidden bg-white/5 shrink-0">
                        <Image src={car.src} alt={car.name} fill className="object-cover" />
                     </div>
                     <div>
                        <h4 className="font-bold text-white">{car.name}</h4>
                        <div className="text-xs text-white/50">{car.brand} • {service === 'chauffeur' ? 'Chauffeur' : 'Self Drive'}</div>
                     </div>
                  </div>

                  <div className="space-y-4 text-sm mb-6 pb-6 border-b border-white/10">
                     <div className="flex justify-between">
                        <span className="text-white/50">Pickup</span>
                        <span className="text-white font-medium">{pickupDate}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-white/50">Return</span>
                        <span className="text-white font-medium">{returnDate}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-white/50">Duration</span>
                        <span className="text-white font-medium">{days} Day(s)</span>
                     </div>
                  </div>

                  <div className="space-y-3 text-sm">
                     <div className="flex justify-between">
                        <span className="text-white/60">Base Rate (₹{car.price.toLocaleString()} x {days})</span>
                        <span className="text-white">₹{base.toLocaleString()}</span>
                     </div>
                     {/* <div className="flex justify-between">
                        <span className="text-white/60">Taxes & GST (18%)</span>
                        <span className="text-white">₹{gst.toLocaleString()}</span>
                     </div> */}
                     {discount > 0 && (
                       <div className="flex justify-between text-green-400">
                          <span>Promo Discount</span>
                          <span>-₹{discount.toLocaleString()}</span>
                       </div>
                     )}
                     
                     <div className="flex justify-between pt-4 border-t border-white/10">
                        <span className="text-white/60">Refundable Deposit</span>
                        <span className="text-[var(--gold-400)]">{car.securityDeposit}</span>
                     </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                     <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Promo Code" 
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--gold-400)] uppercase"
                        />
                        <button 
                          onClick={applyPromo}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition font-medium"
                        >
                          Apply
                        </button>
                     </div>
                     {promoMessage && (
                        <p className={`text-xs mt-2 ${discount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                           {promoMessage}
                        </p>
                     )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/20">
                     <div className="flex items-end justify-between">
                        <span className="font-semibold text-white">Total Amount</span>
                        <div className="text-right">
                           <div className="text-2xl font-bold text-[var(--gold-400)]">₹{total.toLocaleString()}</div>
                           <div className="text-[10px] text-white/30 uppercase mt-1">Excludes Deposit</div>
                        </div>
                     </div>
                  </div>

                  <div className="mt-6 flex items-start gap-2 bg-white/5 p-3 rounded-lg border border-white/10">
                     <ShieldCheck className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                     <p className="text-[10px] text-white/50 leading-relaxed">
                        By proceeding, you agree to our Terms of Service and Cancellation Policy. {car.cancellationPolicy}
                     </p>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Secure Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}
