'use client'

import { useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Check, ArrowRight, Lock } from 'lucide-react'
import { formatBrandAndModel, type CarDetails } from '@/lib/cars'
import { buildVehicleAlt } from '@/lib/asset-paths'

interface CarCardProps {
  car: CarDetails
  pricingMode?: 'chauffeur' | 'selfdrive'
  onBook?: (car: CarDetails) => void
  isCompared?: boolean
  onToggleCompare?: (carId: string) => void
}

export function CarCard({
  car,
  pricingMode = 'chauffeur',
  onBook,
  isCompared,
  onToggleCompare,
}: CarCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isCharterOnly = car.category === 'bus'
  const selfDriveRate = car.selfDrivePrice ?? Math.round(car.price * 0.85)
  const activeRate = pricingMode === 'selfdrive' ? selfDriveRate : car.price
  const { brandLabel, modelLabel } = formatBrandAndModel(car.brand, car.name)

  // Zero-render GPU 3D micro-tilt on desktop mouse move only
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(1000px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg) translateY(-3px)`
  }, [])

  const handlePointerLeave = useCallback(() => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)'
  }, [])

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
      className={`group relative rounded-[24px] overflow-hidden bg-[#ebebea] will-change-transform ${
        isCompared ? 'ring-2 ring-[#c9a96e]' : ''
      }`}
    >
      {/* Seamless Studio Stage with Generous Top Headroom (Zero Text Overlap) */}
      <Link
        href={`/cars/${car.slug}`}
        className="block relative w-full aspect-[16/10] bg-[#ebebea] overflow-hidden"
      >
        <Image
          src={car.src}
          alt={buildVehicleAlt({
            imageAlt: car.imageAlt,
            brand: car.brand,
            name: car.name,
            category: car.category,
            context: 'DRIVEIT Luxury Hyderabad',
          })}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-bottom group-hover:scale-[1.025] transition-transform duration-500 ease-out"
        />

        {/* Top-Left Brand + Model & Optional Top-Right Compare Pill */}
        <div className="absolute top-3.5 left-4 right-4 sm:top-7 sm:left-8 sm:right-8 z-10 flex items-start justify-between gap-2 sm:gap-3 pointer-events-none">
          <div className="min-w-0">
            <p className="font-luxury text-[10px] sm:text-xs uppercase tracking-[0.24em] sm:tracking-[0.28em] text-[#7a6440] font-medium truncate">
              {brandLabel}
            </p>
            <h3 className="font-luxury mt-0.5 text-xl sm:text-[32px] font-light tracking-[-0.01em] text-[#111111] leading-tight truncate">
              {modelLabel}
            </h3>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0 pt-0.5 pointer-events-auto">
            {isCharterOnly && (
              <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-[#66635d] font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8c734b]" />
                <span>PRIVÉ CHARTER</span>
              </div>
            )}

            {onToggleCompare && !isCharterOnly && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onToggleCompare(car.id)
                }}
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-luxury uppercase tracking-[0.18em] transition cursor-pointer ${
                  isCompared
                    ? 'bg-[#111111] text-[#ebebea]'
                    : 'bg-black/8 text-[#44423e] hover:bg-black/15'
                }`}
              >
                {isCompared ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                <span>{isCompared ? 'Saved' : 'Compare'}</span>
              </button>
            )}
          </div>
        </div>
      </Link>

      {/* Ultra-Clean Bottom Action Strip — Unified Luxury Geometric Sans */}
      <div className="px-4 py-3.5 sm:px-8 sm:py-4 flex flex-wrap items-center justify-between gap-2.5 bg-[#111114] text-white border-t border-white/8">
        {isCharterOnly ? (
          <>
            <span className="font-luxury text-[11px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.2em] text-white/60">
              {car.seats} Seats · Contact Only
            </span>
            <Link
              href={`/contact?service=${encodeURIComponent(`Luxury Coach Charter: ${car.name}`)}`}
              className="min-h-[38px] px-4 sm:px-5 py-2 rounded-full bg-[#c9a96e] hover:bg-[#dfc288] text-black font-luxury font-medium text-[11px] uppercase tracking-[0.2em] flex items-center gap-1.5 transition shrink-0"
            >
              <Lock className="w-3 h-3" />
              <span>Inquire</span>
            </Link>
          </>
        ) : (
          <>
            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="font-luxury text-base sm:text-xl font-normal tracking-[0.02em] text-[#f4efe6] tabular-nums">
                ₹{activeRate.toLocaleString('en-IN')}
              </span>
              <span className="font-luxury text-[11px] sm:text-xs font-light tracking-[0.06em] sm:tracking-[0.08em] text-white/50 whitespace-nowrap">
                / day · {car.seats} Seats
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-auto">
              <Link
                href={`/cars/${car.slug}`}
                className="min-h-[38px] inline-flex items-center px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/15 font-luxury text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-white/75 hover:text-white hover:border-white/35 transition"
              >
                Specs
              </Link>

              {onBook ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    onBook(car)
                  }}
                  className="min-h-[38px] px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#c9a96e] hover:bg-[#dfc288] text-black font-luxury font-medium text-[10px] sm:text-[11px] uppercase tracking-[0.18em] sm:tracking-[0.2em] flex items-center gap-1.5 transition cursor-pointer"
                >
                  <span>Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link
                  href={`/checkout?carId=${car.slug}&service=${pricingMode}`}
                  className="px-5 py-2 rounded-full bg-[#c9a96e] hover:bg-[#dfc288] text-black font-luxury font-medium text-[11px] uppercase tracking-[0.2em] flex items-center gap-1.5 transition"
                >
                  <span>Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
