'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { BrandIcon } from '@/components/brand-icon'

const fleet = [
  { src: "/sadan/5.jpg", name: "Mercedes S 450", category: "Sedan" },
  { src: "/trending/4.jpg", name: "Range Rover Vogue", category: "SUV" },
  { src: "/sadan/2.jpg", name: "Lamborghini Gallardo", category: "Sports" },
  { src: "/trending/1.jpg", name: "Mercedes G 350 Wagon", category: "SUV" },
  { src: "/sadan/8.jpg", name: "Audi A6", category: "Sedan" },
  { src: "/suv/7.jpg", name: "Toyota Vellfire", category: "MPV" },
  { src: "/trending/7.jpg", name: "BMW 730 LD", category: "Sedan" },
  { src: "/suv/8.jpg", name: "Volvo XC60", category: "SUV" },
  { src: "/trending/9.jpg", name: "Mercedes C300 Convertible", category: "Sports" },
  { src: "/sadan/9.jpg", name: "Audi RS5 QUATRO", category: "Sports" },
  { src: "/trending/5.jpg", name: "Volvo S90", category: "Sedan" },
  { src: "/suv/2.jpg", name: "Mercedes GLS 350D", category: "SUV" },
]

export function FleetCarousel() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" })
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollByAmount = (dir: number) => {
    const el = scrollRef.current
    if (!el) return
    const amt = Math.max(el.clientWidth * 0.6, 300)
    el.scrollBy({ left: dir * amt, behavior: "smooth" })
  }

  return (
    <section ref={ref} className="bg-[var(--luxury-bg)] text-white py-12 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-white/40">Our Fleet</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-[family-name:var(--font-playfair)] font-semibold text-white">
              Premium <span className="text-gradient-gold">Collection</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            {/* Navigation arrows */}
            <button
              onClick={() => scrollByAmount(-1)}
              className="w-10 h-10 rounded-full glass-gold flex items-center justify-center text-[var(--gold-400)] hover:bg-[var(--gold-400)]/10 transition-all duration-300 cursor-pointer"
              aria-label="Scroll left"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollByAmount(1)}
              className="w-10 h-10 rounded-full glass-gold flex items-center justify-center text-[var(--gold-400)] hover:bg-[var(--gold-400)]/10 transition-all duration-300 cursor-pointer"
              aria-label="Scroll right"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <Link
              href="/cars"
              className="ml-2 inline-flex items-center gap-2 px-5 py-2.5 glass-gold rounded-full text-sm font-medium text-white transition-all duration-300 hover:bg-[var(--gold-400)]/10 group"
            >
              View All
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Horizontal Scroll Carousel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div
          ref={scrollRef}
          className="overflow-x-auto snap-x snap-mandatory pl-4 md:pl-[calc((100vw-80rem)/2+1rem)] pr-4 pb-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="flex gap-5 w-max">
            {fleet.map((car, i) => (
              <motion.div
                key={car.name}
                className="group flex-shrink-0 w-[280px] md:w-[320px] snap-start"
                initial={{ opacity: 0, x: 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.06 }}
              >
                <div className="relative h-[200px] md:h-[240px] rounded-2xl overflow-hidden border-glow-gold mb-3">
                  <Image
                    src={car.src}
                    alt={`${car.name} for rent in Hyderabad`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    sizes="320px"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Category badge */}
                  <div className="absolute top-3 left-3 glass-gold px-3 py-1 rounded-full">
                    <span className="text-[10px] tracking-wider uppercase text-[var(--gold-400)] font-medium">
                      {car.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <BrandIcon brand={car.name.split(' ')[0]} className="w-5 h-5 text-white/60" />
                  <h4 className="text-sm font-medium text-white/80 group-hover:text-white transition-colors duration-300">
                    {car.name}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
