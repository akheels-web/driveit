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

        {/* Main Heading - Clean word-level entrance for light DOM footprint */}
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-playfair)] font-bold leading-[1.1]">
            <motion.span
              className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-1"
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {headingLine1}
            </motion.span>

            <motion.span
              className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-shimmer-gold"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {headingLine2}
            </motion.span>
          </h1>
        </div>

        {/* Description */}
        <motion.p
          className="mt-6 max-w-md text-center text-sm md:text-base text-white/70 font-light leading-relaxed"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Experience elegance and innovation with Hyderabad&apos;s finest fleet.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={scrollToBooking}
          className="mt-8 group relative overflow-hidden rounded-full px-8 md:px-10 py-3.5 md:py-4 text-sm md:text-base font-semibold text-black bg-[var(--gold-400)] cursor-pointer"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.75, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative z-10">Book Your Ride</span>
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