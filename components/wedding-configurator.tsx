'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, ArrowLeft, Check, Car, Palette, Map, Shirt, Star } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const steps = [
  { id: 'primary_car', label: 'Primary Car', icon: Car },
  { id: 'escort_cars', label: 'Escort Cars', icon: Star },
  { id: 'decoration', label: 'Decoration', icon: Palette },
  { id: 'route', label: 'Route & Wait Time', icon: Map },
  { id: 'chauffeur', label: 'Chauffeur Attire', icon: Shirt },
]

const primaryCars = [
  { id: 's-class', name: 'Mercedes S-Class', price: 45000, img: '/sadan/4.jpg' },
  { id: 'maybach', name: 'Mercedes Maybach', price: 85000, img: '/sadan/3.jpg' },
  { id: 'rolls', name: 'Rolls Royce Ghost', price: 150000, img: '/sadan/6.jpg' },
]

const escortCars = [
  { id: 'none', name: 'None', price: 0 },
  { id: 'crysta_1', name: '1x Innova Crysta', price: 8000 },
  { id: 'crysta_3', name: '3x Innova Crysta Fleet', price: 22000 },
  { id: 'g_wagon', name: '1x G-Wagon (VIP Escort)', price: 45000 },
]

const decorations = [
  { id: 'none', name: 'No Decoration', price: 0, desc: 'Vehicle arrives pristine and clean' },
  { id: 'minimalist', name: 'Minimalist Ribbon', price: 5000, desc: 'Elegant satin ribbons and door bows' },
  { id: 'floral_premium', name: 'Premium Floral', price: 15000, desc: 'Fresh exotic flowers across bonnet and trunk' },
  { id: 'royal_theme', name: 'Royal Theme', price: 25000, desc: 'Custom floral arrangements, ribbons, and interior styling' },
]

const routes = [
  { id: 'standard', name: 'Standard Wedding Transfer', price: 0, desc: 'Home → Venue (up to 4 hours, 40km)' },
  { id: 'baraat', name: 'Baraat Procession', price: 10000, desc: 'Slow-moving route with up to 8 hours and 80km' },
  { id: 'full_day', name: 'Full Day Premium', price: 20000, desc: 'Home → Venue → Photoshoot → Hotel (12 hours, 120km)' },
]

const attires = [
  { id: 'standard', name: 'Standard Suit', price: 0 },
  { id: 'tuxedo', name: 'Premium Tuxedo', price: 2000 },
  { id: 'safari', name: 'Traditional Safari Suit', price: 1500 },
]

export function WeddingConfigurator() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selections, setSelections] = useState({
    primaryCar: '',
    escortCar: 'none',
    decoration: 'none',
    route: 'standard',
    attire: 'standard'
  })

  const updateSelection = (key: string, value: string) => {
    setSelections(prev => ({ ...prev, [key]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(c => c + 1)
  }

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(c => c - 1)
  }

  const calculateTotal = () => {
    const pc = primaryCars.find(c => c.id === selections.primaryCar)?.price || 0
    const ec = escortCars.find(c => c.id === selections.escortCar)?.price || 0
    const dec = decorations.find(c => c.id === selections.decoration)?.price || 0
    const rtc = routes.find(c => c.id === selections.route)?.price || 0
    const att = attires.find(c => c.id === selections.attire)?.price || 0
    return pc + ec + dec + rtc + att
  }

  const handleCheckout = () => {
    const q = new URLSearchParams({
      package: 'wedding',
      primaryCar: selections.primaryCar,
      total: calculateTotal().toString()
    })
    router.push(`/checkout?${q.toString()}`)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {primaryCars.map(car => (
              <div 
                key={car.id} 
                onClick={() => updateSelection('primaryCar', car.id)}
                className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${selections.primaryCar === car.id ? 'border-[var(--gold-400)] shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'border-white/10 hover:border-white/30'}`}
              >
                <div className="relative h-40 w-full bg-neutral-900">
                  <Image src={car.img} alt={car.name} fill className="object-cover" />
                </div>
                <div className="p-4 bg-black/50">
                  <h3 className="font-semibold text-white">{car.name}</h3>
                  <p className="text-[var(--gold-400)] text-sm">From ₹{car.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )
      case 1:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {escortCars.map(item => (
              <div 
                key={item.id} 
                onClick={() => updateSelection('escortCar', item.id)}
                className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${selections.escortCar === item.id ? 'border-[var(--gold-400)] bg-[var(--gold-400)]/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  {item.price > 0 && <span className="text-[var(--gold-400)]">+₹{item.price.toLocaleString()}</span>}
                </div>
              </div>
            ))}
          </div>
        )
      case 2:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {decorations.map(item => (
              <div 
                key={item.id} 
                onClick={() => updateSelection('decoration', item.id)}
                className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${selections.decoration === item.id ? 'border-[var(--gold-400)] bg-[var(--gold-400)]/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  {item.price > 0 && <span className="text-[var(--gold-400)]">+₹{item.price.toLocaleString()}</span>}
                </div>
                <p className="text-xs text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        )
      case 3:
        return (
          <div className="grid grid-cols-1 gap-4">
            {routes.map(item => (
              <div 
                key={item.id} 
                onClick={() => updateSelection('route', item.id)}
                className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${selections.route === item.id ? 'border-[var(--gold-400)] bg-[var(--gold-400)]/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  {item.price > 0 && <span className="text-[var(--gold-400)]">+₹{item.price.toLocaleString()}</span>}
                </div>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        )
      case 4:
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {attires.map(item => (
              <div 
                key={item.id} 
                onClick={() => updateSelection('attire', item.id)}
                className={`cursor-pointer p-5 text-center rounded-xl border-2 transition-all ${selections.attire === item.id ? 'border-[var(--gold-400)] bg-[var(--gold-400)]/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
              >
                <h3 className="font-semibold text-white mb-2">{item.name}</h3>
                {item.price > 0 && <span className="text-[var(--gold-400)] text-sm">+₹{item.price.toLocaleString()}</span>}
              </div>
            ))}
          </div>
        )
    }
  }

  const isCurrentStepValid = () => {
    if (currentStep === 0 && !selections.primaryCar) return false
    return true
  }

  return (
    <div className="bg-[#0f0f0f] border border-[var(--gold-400)]/20 rounded-3xl p-6 md:p-10 max-w-5xl mx-auto shadow-2xl">
      {/* Progress Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        {steps.map((s, i) => (
          <div key={s.id} className={`flex items-center gap-2 ${i <= currentStep ? 'text-[var(--gold-400)]' : 'text-zinc-600'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${i < currentStep ? 'bg-[var(--gold-400)] border-[var(--gold-400)] text-black' : i === currentStep ? 'border-[var(--gold-400)]' : 'border-zinc-700'}`}>
              {i < currentStep ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider hidden md:block">{s.label}</span>
            {i < steps.length - 1 && <div className={`w-8 h-px hidden md:block ${i < currentStep ? 'bg-[var(--gold-400)]' : 'bg-zinc-800'}`} />}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-playfair)]">
              {steps[currentStep].label}
            </h2>
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Controls & Live Price */}
      <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack} 
            disabled={currentStep === 0}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Estimated Total</p>
            <p className="text-2xl font-bold text-[var(--gold-400)]">₹{calculateTotal().toLocaleString()}</p>
          </div>
          
          {currentStep < steps.length - 1 ? (
            <button 
              onClick={handleNext}
              disabled={!isCurrentStepValid()}
              className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-[var(--gold-400)] transition disabled:opacity-50"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleCheckout}
              className="flex items-center gap-2 bg-gradient-to-r from-[var(--gold-300)] to-[var(--gold-500)] text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              Complete Package <Check className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
