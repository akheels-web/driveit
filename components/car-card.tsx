'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { Users, Settings2, Fuel, Plus, Check } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { BrandIcon } from '@/components/brand-icon'
import type { CarDetails } from '@/lib/cars'

interface CarCardProps {
  car: CarDetails
  onBook?: (car: CarDetails) => void
  isCompared?: boolean
  onToggleCompare?: (carId: string) => void
}

export function CarCard({ car, onBook, isCompared, onToggleCompare }: CarCardProps) {
  return (
    <div
      className={`group relative rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-[var(--gold-400)]/10 ${isCompared ? 'border border-[var(--gold-400)] shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'border border-white/5 hover:border-white/10'}`}
      style={{
        background: 'linear-gradient(145deg, rgba(22,22,22,1), rgba(14,14,14,1))',
      }}
    >
      {/* Category badge */}
      <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-wider text-white/60">
        {car.category}
      </div>

      {/* Compare button */}
      {onToggleCompare && (
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleCompare(car.id); }}
          className={`absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md border text-xs font-semibold transition-colors duration-300 ${isCompared ? 'bg-[var(--gold-400)] text-black border-[var(--gold-400)]' : 'bg-black/60 border-white/20 text-white hover:border-[var(--gold-400)] hover:text-[var(--gold-400)]'}`}
        >
          {isCompared ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          {isCompared ? 'Added' : 'Compare'}
        </button>
      )}

      {/* Car Image */}
      <Link href={`/cars/${car.slug}`} className="block relative w-full h-48 md:h-56 bg-gradient-to-b from-white/[0.02] to-transparent cursor-pointer overflow-hidden">
        <Image
          src={car.src}
          alt={`${car.name} luxury car rental Hyderabad`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Rating overlay */}
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white flex items-center gap-1 border border-white/10">
           <span className="text-[var(--gold-400)]">★</span> {car.rating} ({car.reviewsCount})
        </div>
      </Link>

      {/* Car Info */}
      <div className="p-4 pt-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
            <BrandIcon brand={car.brand} className="w-4 h-4" />
          </div>
          <Link href={`/cars/${car.slug}`} className="hover:text-[var(--gold-400)] transition-colors">
            <h3 className="text-sm font-semibold leading-tight">{car.name}</h3>
            <p className="text-[10px] text-white/40">{car.brand}</p>
          </Link>
        </div>

        {/* Specs */}
        <div className="flex justify-center items-center gap-6 text-[11px] text-white/40 mb-4 mt-3 bg-white/[0.02] py-2.5 rounded-xl border border-white/5">
          <span className="flex flex-col items-center gap-1"><Users className="w-4 h-4 text-white/60" /> {car.seats}</span>
          <span className="flex flex-col items-center gap-1"><Settings2 className="w-4 h-4 text-white/60" /> {car.transmission}</span>
          <span className="flex flex-col items-center gap-1"><Fuel className="w-4 h-4 text-white/60" /> {car.fuel}</span>
        </div>
        
        {/* Price & Actions */}
        <div className="space-y-3">
          <div className="flex justify-between items-end border-b border-white/5 pb-3">
             <div className="text-[10px] text-white/40">Starting at</div>
             <div className="text-sm font-bold text-[var(--gold-400)]">{car.priceDisplay}</div>
          </div>
          <div className="flex gap-2 pt-1">
            {onBook ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  onBook(car)
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all bg-[var(--gold-400)] hover:bg-[var(--gold-300)] text-black cursor-pointer shadow-[0_2px_10px_rgba(212,175,55,0.2)]"
              >
                Book Now
              </button>
            ) : (
              <Link
                href={`/cars/${car.slug}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10"
              >
                View Details
              </Link>
            )}
            <a
              href={`https://wa.me/916300041186?text=${encodeURIComponent(`Hi, I'm interested in the ${car.name} (${car.priceDisplay}). Can you check availability?`)}`}
              target="_blank"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-[#25D366] transition-all text-sm"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
