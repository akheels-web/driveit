'use client'

import { motion, AnimatePresence } from 'motion/react'
import { X, CheckCircle2, Users, Fuel, Settings2, ShieldCheck, Snowflake, Briefcase, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { CarDetails } from '@/lib/cars'

interface CompareModalProps {
  isOpen: boolean
  onClose: () => void
  cars: CarDetails[]
  onRemove: (id: string) => void
}

export function CompareModal({ isOpen, onClose, cars, onRemove }: CompareModalProps) {
  if (cars.length === 0) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed inset-3 md:inset-10 z-[100] flex flex-col bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
              <h2 className="text-xl font-semibold text-white">Compare Vehicles</h2>
              <button
                onClick={onClose}
                className="p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
              <div className="flex gap-6 min-w-max pb-4">
                {cars.map((car) => (
                  <div key={car.id} className="w-[280px] md:w-[320px] flex flex-col border border-white/10 rounded-xl overflow-hidden bg-white/[0.02] relative">
                    <button 
                      onClick={() => onRemove(car.id)}
                      className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white/60 hover:text-red-400 hover:border-red-400/50 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    {/* Image */}
                    <div className="relative h-48 bg-white/5">
                      <Image
                        src={car.src}
                        alt={car.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-1">{car.name}</h3>
                      <p className="text-xs text-white/40 mb-4">{car.brand} • {car.category}</p>

                      {/* Specs List */}
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/50 flex items-center gap-2"><Users className="w-4 h-4" /> Seats</span>
                          <span className="text-white font-medium">{car.seats}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/50 flex items-center gap-2"><Settings2 className="w-4 h-4" /> Transmission</span>
                          <span className="text-white font-medium">{car.transmission}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/50 flex items-center gap-2"><Fuel className="w-4 h-4" /> Fuel</span>
                          <span className="text-white font-medium">{car.fuel}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm border-t border-white/10 pt-4">
                          <span className="text-white/50 flex items-center gap-2"><Briefcase className="w-4 h-4" /> Boot Space</span>
                          <span className="text-white font-medium">{car.specs.bootSpace}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/50 flex items-center gap-2"><Snowflake className="w-4 h-4" /> AC Zones</span>
                          <span className="text-white font-medium text-right max-w-[120px]">{car.specs.acZones}</span>
                        </div>
                        
                        <div className="border-t border-white/10 pt-4 space-y-2">
                           <div className="flex gap-2 items-start text-xs text-white/60">
                              <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                              <span>{car.kmAllowance}</span>
                           </div>
                           <div className="flex gap-2 items-start text-xs text-white/60">
                              <ShieldCheck className="w-4 h-4 text-[var(--gold-400)] shrink-0" />
                              <span>Refundable Deposit: {car.securityDeposit}</span>
                           </div>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="mt-6 pt-4 border-t border-[var(--gold-400)]/30">
                        <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Base Price</div>
                        <div className="text-xl font-bold text-[var(--gold-400)] mb-4">{car.priceDisplay}</div>
                        <Link 
                          href={`/cars/${car.slug}`}
                          className="block w-full py-3 rounded-xl text-center text-sm font-bold bg-white text-black hover:bg-gray-200 transition"
                        >
                          View Details & Book
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Empty Slot Placeholder */}
                {cars.length < 3 && (
                  <div className="w-[280px] md:w-[320px] flex flex-col items-center justify-center border border-dashed border-white/20 rounded-xl bg-white/[0.01] p-6 text-center">
                     <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/20">
                        <Plus className="w-8 h-8" />
                     </div>
                     <h3 className="text-white/40 font-medium">Add another vehicle</h3>
                     <p className="text-xs text-white/20 mt-2">You can compare up to 3 vehicles side-by-side.</p>
                     <button onClick={onClose} className="mt-6 px-6 py-2 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/30 transition">
                        Browse Fleet
                     </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
