'use client'

import { useState, useEffect, useMemo } from "react"
import { motion, useInView, AnimatePresence } from "motion/react"
import { useRef } from "react"
import { Search, Filter, Car, Users, ChevronDown, Check, X, ArrowRight } from "lucide-react"
import { FaCarSide, FaBus } from "react-icons/fa"
import { GiJeep } from "react-icons/gi"
import { IoMdBriefcase } from "react-icons/io"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CarCard } from "@/components/car-card"
import { CompareModal } from "@/components/compare-modal"
import { useFleet } from "@/hooks/use-fleet"

type Category = 'all' | 'sedan' | 'suv' | 'sports' | 'mpv' | 'bus'
type ServiceFilter = 'all' | 'chauffeur' | 'selfdrive'

const categories: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Cars', icon: <Car className="w-4 h-4" /> },
  { id: 'sedan', label: 'Sedans', icon: <FaCarSide className="w-4 h-4" /> },
  { id: 'suv', label: 'SUVs', icon: <GiJeep className="w-4 h-4" /> },
  { id: 'sports', label: 'Sports', icon: <IoMdBriefcase className="w-4 h-4" /> },
  { id: 'mpv', label: 'MPV / Van', icon: <Users className="w-4 h-4" /> },
  { id: 'bus', label: 'Buses', icon: <FaBus className="w-4 h-4" /> },
]

const serviceFilters: { id: ServiceFilter; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All Services', icon: <Filter className="w-4 h-4" /> },
  { id: 'chauffeur', label: 'With Chauffeur', icon: <Users className="w-4 h-4" /> },
  { id: 'selfdrive', label: 'Self Drive', icon: <Car className="w-4 h-4" /> },
]

type SortOption = 'name' | 'price-low' | 'price-high' | 'rating' | 'booked' | 'new'

export default function CarsPage() {
  const { cars, loading } = useFleet()
  const [category, setCategory] = useState<Category>('all')
  const [service, setService] = useState<ServiceFilter>('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  
  // Compare State
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const svc = params.get('service')
      if (svc === 'chauffeur' || svc === 'selfdrive') {
        // One-shot read of an external store (the URL) after mount. This page is
        // statically rendered, so the value must not be read during render —
        // that would hydrate differently from the prerendered HTML.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setService(svc as ServiceFilter)
      }
    } catch {}
  }, [])

  const filtered = useMemo(() => cars
    .filter((car) => {
      if (category !== 'all' && car.category !== category) return false
      if (service !== 'all' && !car.services.includes(service)) return false
      if (search && !car.name.toLowerCase().includes(search.toLowerCase()) && !car.brand.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'booked') return b.bookingsCount - a.bookingsCount
      if (sortBy === 'new') return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
      return a.name.localeCompare(b.name)
    }), [cars, category, service, search, sortBy])

  const handleToggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id)
      if (prev.length >= 3) return prev // Max 3
      return [...prev, id]
    })
  }

  const compareCarsList = useMemo(() => cars.filter(c => compareIds.includes(c.id)), [cars, compareIds])

  return (
    <>
      <SiteHeader />
      <section ref={ref} className="bg-[var(--luxury-bg)] text-white min-h-screen pb-32">
        <div className="mx-auto max-w-7xl px-4 pt-28">

          {/* Page Header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs tracking-[0.25em] uppercase text-[var(--gold-400)] font-semibold">Premium Collection</span>
            <h1 className="mt-2 text-3xl md:text-5xl font-[family-name:var(--font-playfair)] font-bold text-white">
              Luxury <span className="text-gradient-gold">Fleet</span>
            </h1>
            <p className="mt-3 text-sm md:text-base text-white/50 max-w-xl mx-auto">
              Explore {cars.length} meticulously maintained vehicles. View detailed specs, transparent pricing, and book instantly.
            </p>
          </motion.div>

          {/* Filters Bar */}
          <motion.div
            className="mb-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Search + Sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by car name or brand..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/20 hover:border-[var(--gold-400)]/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
                />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 pr-9 text-white text-sm appearance-none cursor-pointer hover:border-[var(--gold-400)]/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
                >
                  <option value="name" className="bg-[#111]">Sort: Name A-Z</option>
                  <option value="booked" className="bg-[#111]">Most Booked</option>
                  <option value="rating" className="bg-[#111]">Best Rated</option>
                  <option value="new" className="bg-[#111]">Newly Added</option>
                  <option value="price-low" className="bg-[#111]">Price: Low → High</option>
                  <option value="price-high" className="bg-[#111]">Price: High → Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                    category === cat.id
                      ? 'bg-[var(--gold-400)] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                      : 'bg-white/[0.03] text-white/50 border border-white/5 hover:border-[var(--gold-400)]/20 hover:text-white/70'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Service Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {serviceFilters.map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => setService(svc.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                    service === svc.id
                      ? 'bg-white/10 text-[var(--gold-400)] border border-[var(--gold-400)]/30'
                      : 'bg-white/[0.02] text-white/40 border border-white/5 hover:border-white/10 hover:text-white/60'
                  }`}
                >
                  {svc.icon}
                  {svc.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results count */}
          <div className="flex justify-between items-end mb-6">
             <p className="text-xs text-white/30">{filtered.length} vehicles found</p>
             {compareIds.length > 0 && (
                <p className="text-xs text-[var(--gold-400)] font-medium bg-[var(--gold-400)]/10 px-3 py-1 rounded-full border border-[var(--gold-400)]/20">
                   {compareIds.length}/3 selected for comparison
                </p>
             )}
          </div>

          {/* Car Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((car, i) => (
                <motion.div
                  key={car.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                >
                  <CarCard 
                    car={car} 
                    isCompared={compareIds.includes(car.id)}
                    onToggleCompare={handleToggleCompare}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <Car className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/30 text-sm">No cars match your filters. Try adjusting your search.</p>
              <button 
                onClick={() => {setCategory('all'); setService('all'); setSearch('')}}
                className="mt-4 text-[var(--gold-400)] text-sm hover:underline"
              >
                 Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Compare Floating Bar */}
      <AnimatePresence>
         {compareIds.length > 0 && (
            <motion.div
               initial={{ y: 100, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 100, opacity: 0 }}
               className="fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none"
            >
               <div className="mx-auto max-w-4xl bg-black/80 backdrop-blur-xl border border-[var(--gold-400)]/30 shadow-[0_0_40px_rgba(212,175,55,0.15)] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 pointer-events-auto">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                     <div className="flex -space-x-4">
                        {compareCarsList.map((car) => (
                           <div key={car.id} className="relative w-12 h-12 rounded-full border-2 border-black overflow-hidden bg-white/5">
                              <img src={car.src} alt={car.name} className="w-full h-full object-cover" />
                           </div>
                        ))}
                        {Array.from({ length: Math.max(0, 3 - compareIds.length) }).map((_, i) => (
                           <div key={`empty-${i}`} className="w-12 h-12 rounded-full border-2 border-black border-dashed bg-white/5 flex items-center justify-center text-white/20">
                              <Car className="w-4 h-4" />
                           </div>
                        ))}
                     </div>
                     <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">{compareIds.length} of 3</span>
                        <span className="text-xs text-white/40">Vehicles selected</span>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto">
                     <button
                        onClick={() => setCompareIds([])}
                        className="px-4 py-2 text-sm text-white/50 hover:text-white transition"
                     >
                        Clear
                     </button>
                     <button
                        onClick={() => setShowCompareModal(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[var(--gold-400)] hover:bg-[var(--gold-500)] text-black rounded-xl font-semibold transition shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                     >
                        Compare Now <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>

      <CompareModal 
         isOpen={showCompareModal} 
         onClose={() => setShowCompareModal(false)} 
         cars={compareCarsList}
         onRemove={handleToggleCompare}
      />
      <SiteFooter />
    </>
  )
}