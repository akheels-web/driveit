'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

const brands = [
  "Rolls-Royce",
  "Mercedes-Benz",
  "BMW",
  "Bentley",
  "Ferrari",
  "Lamborghini",
  "Audi",
  "Lexus",
  "Volvo",
  "Range Rover",
  "Mini Cooper",
  "Toyota Vellfire",
]

function BrandItem({ brand }: { brand: string }) {
  return (
    <span className="inline-flex items-center whitespace-nowrap text-sm md:text-base tracking-[0.15em] uppercase font-light text-white/20 select-none">
      {brand}
      <span className="mx-8 md:mx-12 text-[var(--gold-400)] opacity-40">✦</span>
    </span>
  )
}

export function MarqueeStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  // We render the list 4 times to ensure seamless looping
  const brandList = [...brands, ...brands, ...brands, ...brands]

  return (
    <motion.section
      ref={ref}
      className="relative overflow-hidden bg-[var(--luxury-bg)] py-6 md:py-8"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
    >
      {/* Top gold divider */}
      <div className="divider-gold mb-6" />

      {/* Marquee container */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[var(--luxury-bg)] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[var(--luxury-bg)] to-transparent" />

        {/* The actual scrolling wrapper — one continuous strip */}
        <div className="marquee-track">
          <div className="marquee-content">
            {brandList.map((brand, i) => (
              <BrandItem key={`a-${i}`} brand={brand} />
            ))}
          </div>
          <div className="marquee-content" aria-hidden="true">
            {brandList.map((brand, i) => (
              <BrandItem key={`b-${i}`} brand={brand} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gold divider */}
      <div className="divider-gold mt-6" />
    </motion.section>
  )
}
