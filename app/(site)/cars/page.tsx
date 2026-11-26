'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { Search, Car, ArrowRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CarCard } from '@/components/car-card'
import { CompareModal } from '@/components/compare-modal'
import { QuickBookDrawer } from '@/components/home/quick-book-drawer'
import { useFleet } from '@/hooks/use-fleet'
import { LuxurySelect } from '@/components/luxury-select'
import type { CarDetails } from '@/lib/cars'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type Category = 'all' | 'sedan' | 'suv' | 'sports' | 'mpv' | 'bus'
type ServiceFilter = 'all' | 'chauffeur' | 'selfdrive'
type SortOption = 'featured' | 'price-high' | 'price-low' | 'name'

const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Fleet' },
  { id: 'sedan', label: 'Sedans' },
  { id: 'suv', label: 'SUVs' },
  { id: 'sports', label: 'Supercars' },
  { id: 'mpv', label: 'VIP Vans' },
  { id: 'bus', label: 'Coaches' },
]

const serviceFilters: { id: ServiceFilter; label: string }[] = [
  { id: 'all', label: 'All Modes' },
  { id: 'chauffeur', label: 'Chauffeur' },
  { id: 'selfdrive', label: 'Self-Drive' },
]

const CARS_PER_PAGE = 8

export default function CarsPage() {
  const { cars, loading } = useFleet()
  const [category, setCategory] = useState<Category>('all')
  const [service, setService] = useState<ServiceFilter>('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [currentPage, setCurrentPage] = useState(1)

  // Instant Quick-Book Drawer state
  const [quickBookCar, setQuickBookCar] = useState<CarDetails | null>(null)

  // Compare State
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [showCompareModal, setShowCompareModal] = useState(false)

  const catalogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const svc = params.get('service')
      if (svc === 'chauffeur' || svc === 'selfdrive') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setService(svc)
      }
      const cat = params.get('category')
      if (cat === 'sedan' || cat === 'suv' || cat === 'sports' || cat === 'mpv' || cat === 'bus') {
        setCategory(cat)
      } else if (cat === 'convertible') {
        setCategory('sports')
      } else if (cat === 'van') {
        setCategory('mpv')
      }
    } catch {}
  }, [])

  useEffect(() => {
    const id = setTimeout(() => setCurrentPage(1), 0)
    return () => clearTimeout(id)
  }, [category, service, search, sortBy])

  const filtered = useMemo(() => {
    const list = cars.filter((car) => {
      if (category !== 'all') {
        if (category === 'mpv' && car.category !== 'mpv' && car.category !== 'van') return false
        else if (category === 'sports' && car.category !== 'sports' && car.category !== 'convertible')
          return false
        else if (category !== 'mpv' && category !== 'sports' && car.category !== category)
          return false
      }
      if (service !== 'all' && !car.services.includes(service)) return false
      if (
        search &&
        !car.name.toLowerCase().includes(search.toLowerCase()) &&
        !car.brand.toLowerCase().includes(search.toLowerCase())
      ) {
        return false
      }
      return true
    })

    if (sortBy === 'featured') return list
    return [...list].sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      return a.name.localeCompare(b.name)
    })
  }, [cars, category, service, search, sortBy])

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARS_PER_PAGE))

  const paginatedCars = useMemo(() => {
    const start = (currentPage - 1) * CARS_PER_PAGE
    return filtered.slice(start, start + CARS_PER_PAGE)
  }, [filtered, currentPage])

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    setCurrentPage(page)
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  const compareCarsList = useMemo(
    () => cars.filter((c) => compareIds.includes(c.id)),
    [cars, compareIds],
  )

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    if (currentPage <= 3) {
      return [1, 2, 3, 'ellipsis', totalPages]
    }
    if (currentPage >= totalPages - 2) {
      return [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages]
    }
    return [1, 'ellipsis', currentPage, 'ellipsis', totalPages]
  }, [totalPages, currentPage])

  return (
    <>
      <SiteHeader />
      <section className="bg-[#040405] text-white min-h-screen pb-32">
        <div className="mx-auto max-w-7xl px-4 pt-28">
          {/* Minimalist Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#c9a96e] block mb-2">
                HYDERABAD SHOWROOM · {cars.length} VEHICLES
              </span>
              <h1 className="font-luxury text-[clamp(2.2rem,5vw,4.2rem)] font-extralight uppercase leading-none tracking-[0.02em] text-[#f4efe6]">
                The Fleet
              </h1>
            </div>

            {/* Service Mode Toggle */}
            <div className="inline-flex bg-[#0c0c10] p-1 rounded-full border border-white/12 self-start md:self-end">
              {serviceFilters.map((svc) => (
                <button
                  key={svc.id}
                  type="button"
                  onClick={() => setService(svc.id)}
                  className={`px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-[0.18em] transition cursor-pointer ${
                    service === svc.id
                      ? 'bg-[#c9a96e] text-black font-bold'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {svc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Minimal Filter & Search Bar */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/8">
              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-[0.2em] whitespace-nowrap transition cursor-pointer border ${
                      category === cat.id
                        ? 'bg-[#f4efe6] text-black border-[#f4efe6] font-bold'
                        : 'bg-transparent text-white/55 border-white/12 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Search + Sort */}
              <div className="flex flex-col sm:flex-row gap-2.5 lg:w-[420px]">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/35" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search model or brand..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white text-xs placeholder:text-white/30 focus:border-[#c9a96e] focus:outline-none"
                  />
                </div>
                <div className="w-full sm:w-48 shrink-0">
                  <LuxurySelect
                    value={sortBy}
                    onChange={(val) => setSortBy(val as SortOption)}
                    options={[
                      { value: 'featured', label: 'Flagship First' },
                      { value: 'price-high', label: 'Price: High → Low' },
                      { value: 'price-low', label: 'Price: Low → High' },
                      { value: 'name', label: 'Name: A → Z' },
                    ]}
                    triggerClassName="bg-white/[0.03] border-white/10 py-2.5 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div ref={catalogRef} className="scroll-mt-28" />

          {/* 2-Cards-Per-Row Studio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {paginatedCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                pricingMode={service === 'selfdrive' ? 'selfdrive' : 'chauffeur'}
                onBook={(selected) => setQuickBookCar(selected)}
                isCompared={compareIds.includes(car.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 pt-6 border-t border-white/8">
              <Pagination>
                <PaginationContent className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="Go to previous page"
                    />
                  </PaginationItem>

                  {visiblePages.map((page, idx) => {
                    if (page === 'ellipsis') {
                      return (
                        <PaginationItem key={`ellipsis-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }

                    const pageNum = page as number
                    const isActive = pageNum === currentPage

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={isActive}
                          onClick={() => handlePageChange(pageNum)}
                          aria-label={`Page ${pageNum}`}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="Go to next page"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <Car className="w-10 h-10 text-white/15 mx-auto mb-3" />
              <p className="text-white/40 text-xs font-mono uppercase tracking-wider">
                No vehicles match your filter
              </p>
              <button
                type="button"
                onClick={() => {
                  setCategory('all')
                  setService('all')
                  setSearch('')
                }}
                className="mt-4 text-[#c9a96e] text-xs font-mono uppercase tracking-wider hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Compare Floating Bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 right-20 sm:left-4 sm:right-4 z-40 pointer-events-none">
          <div className="mx-auto max-w-3xl bg-[#09090d]/95 backdrop-blur-md border border-[#c9a96e]/40 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 sm:gap-4 pointer-events-auto shadow-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-white pl-2">
              {compareIds.length} / 3 Selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCompareIds([])}
                className="px-3 py-2 text-xs font-mono uppercase text-white/50 hover:text-white cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setShowCompareModal(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-[#c9a96e] hover:bg-[#dfc288] text-black rounded-xl text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
              >
                <span>Compare</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <CompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        cars={compareCarsList}
        onRemove={handleToggleCompare}
      />

      <QuickBookDrawer
        car={quickBookCar}
        commission={null}
        initialMode={service === 'selfdrive' ? 'selfdrive' : 'chauffeur'}
        onClose={() => setQuickBookCar(null)}
      />

      <SiteFooter />
    </>
  )
}
