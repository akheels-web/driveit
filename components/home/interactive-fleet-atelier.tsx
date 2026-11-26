'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, ArrowUpRight, Layers, X } from 'lucide-react'
import { CarCard } from '@/components/car-card'
import { CompareModal } from '@/components/compare-modal'
import type { CarDetails } from '@/lib/cars'
import type { CommissionAsset } from './quick-book-drawer'

type CategoryTab = 'flagship' | 'sedan' | 'suv' | 'sports' | 'mpv' | 'bus'
type PricingMode = 'chauffeur' | 'selfdrive'

const CATEGORY_TABS: { id: CategoryTab; label: string }[] = [
  { id: 'flagship', label: 'Flagship' },
  { id: 'sedan', label: 'Sedans' },
  { id: 'suv', label: 'SUVs' },
  { id: 'sports', label: 'Supercars' },
  { id: 'mpv', label: 'VIP Vans' },
  { id: 'bus', label: 'Coaches' },
]

export function InteractiveFleetAtelier({
  cars,
  eyebrow = '02 / CURATED HYDERABAD FLEET',
  title = 'The Collection',
  subtitle,
  onQuickBookCar,
  onRequestCommission,
}: {
  cars: CarDetails[]
  eyebrow?: string
  title?: string
  subtitle?: string
  onQuickBookCar: (car: CarDetails, mode: PricingMode) => void
  onRequestCommission: (asset: CommissionAsset) => void
}) {
  const [activeTab, setActiveTab] = useState<CategoryTab>('flagship')
  const [pricingMode, setPricingMode] = useState<PricingMode>('chauffeur')
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [isCompareOpen, setIsCompareOpen] = useState(false)

  const toggleCompare = (carId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(carId)) return prev.filter((id) => id !== carId)
      if (prev.length >= 3) return prev
      return [...prev, carId]
    })
  }

  const comparedCars = useMemo(
    () => cars.filter((c) => compareIds.includes(c.id)),
    [cars, compareIds],
  )

  const displayedCars = useMemo(() => {
    if (activeTab === 'flagship') {
      return [...cars]
        .filter((c) => c.category !== 'bus')
        .sort((a, b) => b.price - a.price)
        .slice(0, 6)
    }
    if (activeTab === 'mpv') {
      return cars.filter((c) => c.category === 'mpv' || c.category === 'van').slice(0, 6)
    }
    if (activeTab === 'sports') {
      return cars
        .filter((c) => c.category === 'sports' || c.category === 'convertible' || c.price >= 35000)
        .slice(0, 6)
    }
    return cars.filter((c) => c.category === activeTab).slice(0, 6)
  }, [cars, activeTab])

  return (
    <section
      id="fleet-atelier"
      className="bg-[#040405] py-20 md:py-28 px-4 md:px-[4vw] border-t border-white/8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Minimalist Hype-Style Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#c9a96e] block mb-2">
              {eyebrow}
            </span>
            <h2 className="font-luxury text-[clamp(2rem,4.2vw,3.6rem)] font-extralight uppercase leading-none tracking-[0.02em] text-[#f4efe6]">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-xs text-white/55 font-light max-w-xl">{subtitle}</p>
            )}
          </div>

          {/* Minimalist Chauffeur vs Self-Drive Switch */}
          <div className="inline-flex bg-[#0c0c10] p-1 rounded-full border border-white/12 self-start md:self-end">
            <button
              type="button"
              onClick={() => setPricingMode('chauffeur')}
              className={`px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-[0.18em] transition cursor-pointer ${
                pricingMode === 'chauffeur'
                  ? 'bg-[#c9a96e] text-black font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Chauffeur
            </button>
            <button
              type="button"
              onClick={() => setPricingMode('selfdrive')}
              className={`px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-[0.18em] transition cursor-pointer ${
                pricingMode === 'selfdrive'
                  ? 'bg-[#c9a96e] text-black font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Self-Drive
            </button>
          </div>
        </div>

        {/* Minimal Category Filter Bar */}
        <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-white/8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-[0.2em] whitespace-nowrap transition cursor-pointer border ${
                    isActive
                      ? 'bg-[#ebebea] text-[#111111] border-[#ebebea] font-bold'
                      : 'bg-transparent border-white/12 text-white/55 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          <Link
            href="/cars"
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.22em] text-[#c9a96e] hover:text-white transition shrink-0"
          >
            <span>All {cars.length} Vehicles</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Animated Hype.luxury #ebebea Light-Grey Studio Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${pricingMode}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-7"
          >
            {displayedCars.map((car, idx) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.04, ease: 'easeOut' }}
              >
                <CarCard
                  car={car}
                  pricingMode={pricingMode}
                  isCompared={compareIds.includes(car.id)}
                  onToggleCompare={toggleCompare}
                  onBook={(selected) => {
                    if (selected.category === 'bus') {
                      onRequestCommission({
                        title: selected.name,
                        subtitle: `${selected.seats}-Seater Luxury Coach`,
                        src: selected.src,
                        serviceName: `Luxury Coach Charter: ${selected.name}`,
                      })
                    } else {
                      onQuickBookCar(selected, pricingMode)
                    }
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/15 text-xs font-mono uppercase tracking-[0.22em] text-[#f4efe6]"
          >
            <span>Explore All {cars.length} Vehicles</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#c9a96e]" />
          </Link>
        </div>
      </div>

      {/* Floating Compare Dock when 1–3 Cars Selected */}
      <AnimatePresence>
        {comparedCars.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-20 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:bottom-6 z-40 flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#111116]/95 border border-[#c9a96e]/50 backdrop-blur-md shadow-2xl"
          >
            <Layers className="w-4 h-4 text-[#c9a96e]" />
            <span className="text-xs font-mono uppercase tracking-[0.18em] text-[#f4efe6]">
              {comparedCars.length} / 3 Selected
            </span>
            <button
              type="button"
              onClick={() => setIsCompareOpen(true)}
              className="px-4 py-1.5 rounded-full bg-[#c9a96e] hover:bg-[#dfc288] text-black font-bold text-[10px] font-mono uppercase tracking-[0.2em] transition cursor-pointer"
            >
              Compare Side-by-Side
            </button>
            <button
              type="button"
              onClick={() => setCompareIds([])}
              aria-label="Clear comparison"
              className="p-1 text-white/50 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        cars={comparedCars}
        onRemove={toggleCompare}
      />
    </section>
  )
}
