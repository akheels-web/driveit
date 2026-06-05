'use client'

import { useState } from "react"
import { CarCard } from "@/components/car-card"
import { carsData } from "@/lib/cars"
import { motion, AnimatePresence } from "motion/react"
import { Crown, Star, Car, Settings2 } from "lucide-react"

const tabs = [
  { id: 'trending', label: 'Trending', icon: <Star className="w-4 h-4" /> },
  { id: 'sedans', label: 'Luxury Sedans', icon: <Car className="w-4 h-4" /> },
  { id: 'suvs', label: 'Premium SUVs', icon: <Crown className="w-4 h-4" /> },
  { id: 'selfdrive', label: 'Self Drive', icon: <Settings2 className="w-4 h-4" /> }
]

export function LuxuryCarClient() {
  const [activeTab, setActiveTab] = useState('trending')

  // Derive cars based on active tab
  const displayCars = carsData.filter(c => {
    if (activeTab === 'trending') return c.rating >= 4.8
    if (activeTab === 'sedans') return c.category === 'sedan'
    if (activeTab === 'suvs') return c.category === 'suv' || c.category === 'mpv'
    if (activeTab === 'selfdrive') return c.services.includes('selfdrive')
    return false
  }).slice(0, 6) // limit to 6 for the showcase

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl md:text-4xl font-[family-name:var(--font-playfair)] font-bold text-white mb-4">Our Elite Collection</h2>
        <p className="text-white/50 text-sm md:text-base">Explore our curated selection of premium vehicles designed for your ultimate comfort.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-[var(--gold-400)] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                : 'bg-white/[0.03] text-white/50 border border-white/5 hover:border-[var(--gold-400)]/30 hover:text-white/80'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {displayCars.map((car, i) => (
            <motion.div
              key={car.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="text-center mt-10">
         <a href="/cars" className="inline-block px-8 py-3 rounded-full border border-[var(--gold-400)] text-[var(--gold-400)] hover:bg-[var(--gold-400)] hover:text-black transition-colors duration-300 font-medium">
            View Full Fleet
         </a>
      </div>
    </section>
  )
}
