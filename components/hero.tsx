'use client'

import Image from "next/image"
import { useRef } from "react"
import { motion, useInView } from "motion/react"

export default function Hero({
  videoUrl,
  heroImageSrc = '/rolls-royce-phantom-night.png',
  subtitle = 'Premium Luxury Transportation',
  headingLine1 = 'The Art of',
  headingLine2 = 'Luxury',
}: {
  videoUrl?: string
  heroImageSrc?: string
  subtitle?: string
  headingLine1?: string
  headingLine2?: string
}) {
  const textRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(textRef, { once: true })

  const scrollToBooking = () => {
    const element = document.getElementById('book-now')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-black gpu-layer">
      {/* Background Media Container (Hardware accelerated, Zero scroll-thread blocking) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            src={videoUrl}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <Image
            src={heroImageSrc}
            alt="Luxury Fleet - DRIVEIT premium fleet Hyderabad"
            fill
            priority
            fetchPriority="high"
            className="object-cover object-center"
            sizes="100vw"
            unoptimized={heroImageSrc.startsWith('http')}
          />
        )}
      </div>

      {/* Multi-layered cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/25 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent pointer-events-none" />

      {/* Lightweight Vignette Overlay */}
      <div className="grain-overlay absolute inset-0 pointer-events-none" />

      {/* Hero Content */}
      <div
        ref={textRef}
        className="relative z-10 flex h-full flex-col items-center justify-end pb-24 md:pb-32 px-4"
      >
        {/* Gold accent line */}
        <motion.div
          className="mb-6 h-px w-16 bg-gradient-to-r from-transparent via-[var(--gold-400)] to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={isInView ? { width: 64, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        />

        {/* Subtitle */}
        <motion.p
          className="mb-4 text-xs md:text-sm tracking-[0.3em] uppercase text-white/60 font-light"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>

        {/* Main Heading - Refined, elegant, unobstructed (Matching Screenshot 1) */}
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="font-luxury uppercase tracking-[0.2em] font-light leading-[1.25]">
            <motion.span
              className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-2"
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {headingLine1}
            </motion.span>

            <motion.span
              className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gradient-gold font-normal tracking-[0.25em]"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {headingLine2}
            </motion.span>
          </h1>
        </div>

        {/* Description */}
        <motion.p
          className="mt-5 max-w-xl text-center text-xs sm:text-sm md:text-base text-white/75 font-light tracking-wider leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Royal Chauffeur · Exotic Self-Drive · VIP Airport Concierge
          <br className="hidden sm:inline" />
          <span className="text-white/60"> One elite world. Entirely yours.</span>
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={scrollToBooking}
          className="mt-7 group relative overflow-hidden inline-flex items-center gap-2.5 border border-white/25 hover:border-[var(--gold-400)]/60 bg-white/10 hover:bg-[var(--gold-400)]/15 backdrop-blur-md text-white px-8 md:px-10 py-3 rounded-full uppercase tracking-[0.22em] text-xs font-medium cursor-pointer transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.75 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="absolute inset-0 w-[40%] bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-25deg] -translate-x-[150%] group-hover:translate-x-[350%] transition-transform duration-1000 ease-out pointer-events-none" />
          <span className="relative z-10">Reserve Your Flagship</span>
        </motion.button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/40">Scroll</span>
        <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 rounded-full bg-[var(--gold-400)]"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </section>
  )
}