'use client'

import Image from "next/image"
import { useRef, useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "motion/react"

export interface HeroSlide {
  src: string
  tag: string
  model: string
}

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    src: '/rolls-royce-phantom-night.png',
    tag: 'Royal Chauffeur',
    model: 'Rolls-Royce Phantom Series II',
  },
  {
    src: '/ferrari-sf90-black-studio.png',
    tag: 'Exotic Self-Drive',
    model: 'Ferrari SF90 Stradale',
  },
  {
    src: '/maybach-s680-night.png',
    tag: 'VIP Executive Chauffeur',
    model: 'Mercedes-Maybach S680',
  },
  {
    src: '/gulfstream-g650-private-jet-on-tarmac-night.png',
    tag: 'Private Aviation Concierge',
    model: 'Gulfstream G650 Tarmac Access',
  },
  {
    src: '/rolls-royce-wedding-ribbon.png',
    tag: 'Royal Wedding Convoy',
    model: 'Flagship Bridal Motorcade',
  },
]

export default function Hero({
  videoUrl,
  heroImageSrc,
  slides: propSlides,
  subtitle = 'Premium Luxury Transportation',
  headingLine1 = 'The Art of',
  headingLine2 = 'Luxury',
}: {
  videoUrl?: string
  heroImageSrc?: string
  slides?: HeroSlide[]
  subtitle?: string
  headingLine1?: string
  headingLine2?: string
}) {
  const textRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(textRef, { once: true })

  // Build the slides deck: if custom heroImageSrc is given, place it first
  const slides: HeroSlide[] = propSlides || (
    heroImageSrc && heroImageSrc !== '/rolls-royce-phantom-night.png'
      ? [
          { src: heroImageSrc, tag: 'Signature Flagship', model: 'Exclusive Luxury Collection' },
          ...DEFAULT_HERO_SLIDES.slice(1),
        ]
      : DEFAULT_HERO_SLIDES
  )

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  // Automatic slide rotation every 5.5 seconds (when no video is active)
  useEffect(() => {
    if (videoUrl || isPaused) return
    const timer = setInterval(() => {
      nextSlide()
    }, 5500)
    return () => clearInterval(timer)
  }, [videoUrl, isPaused, nextSlide])

  const scrollToBooking = () => {
    const element = document.getElementById('book-now')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-black gpu-layer select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Media Container (Smooth Ken Burns Cross-Dissolve) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
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
          slides.map((slide, index) => {
            const isActive = index === currentSlide
            return (
              <motion.div
                key={slide.src}
                className="absolute inset-0 w-full h-full"
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1.06 : 1.0,
                }}
                transition={{
                  opacity: { duration: 1.4, ease: [0.4, 0, 0.2, 1] },
                  scale: { duration: 7, ease: "easeOut" },
                }}
                style={{
                  zIndex: isActive ? 2 : 1,
                  willChange: "opacity, transform",
                }}
              >
                <Image
                  src={slide.src}
                  alt={`${slide.model} - DRIVEIT Luxury Hyderabad`}
                  fill
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="object-cover object-center"
                  sizes="100vw"
                  unoptimized={slide.src.startsWith('http')}
                />
              </motion.div>
            )
          })
        )}
      </div>

      {/* Multi-layered cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/25 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent pointer-events-none z-10" />

      {/* Lightweight Vignette Overlay */}
      <div className="grain-overlay absolute inset-0 pointer-events-none z-10" />

      {/* Hero Content */}
      <div
        ref={textRef}
        className="relative z-20 flex h-full flex-col items-center justify-end pb-24 md:pb-32 px-4"
      >
        {/* Dynamic Model & Experience Badge */}
        {!videoUrl && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 border border-[var(--gold-400)]/30 backdrop-blur-md mb-4 text-[10px] sm:text-xs font-mono tracking-wider text-[var(--gold-300)] shadow-lg"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold-400)] inline-block animate-pulse" />
              <span className="font-semibold text-white/90">{slides[currentSlide].tag.toUpperCase()}</span>
              <span className="text-white/30">•</span>
              <span className="text-zinc-300 font-light">{slides[currentSlide].model}</span>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Gold accent line */}
        <motion.div
          className="mb-4 h-px w-16 bg-gradient-to-r from-transparent via-[var(--gold-400)] to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={isInView ? { width: 64, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
        />

        {/* Subtitle */}
        <motion.p
          className="mb-3 text-xs md:text-sm tracking-[0.3em] uppercase text-white/60 font-light"
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>

        {/* Main Heading */}
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
          className="mt-4 max-w-xl text-center text-xs sm:text-sm md:text-base text-white/75 font-light tracking-wider leading-relaxed"
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
          className="mt-6 group relative overflow-hidden inline-flex items-center gap-2.5 border border-white/25 hover:border-[var(--gold-400)]/60 bg-white/10 hover:bg-[var(--gold-400)]/15 backdrop-blur-md text-white px-8 md:px-10 py-3 rounded-full uppercase tracking-[0.22em] text-xs font-medium cursor-pointer transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
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

      {/* Slide Navigation Progress Indicators (Luxury Ken Burns Tracker) */}
      {!videoUrl && slides.length > 1 && (
        <div className="absolute bottom-8 right-6 sm:right-10 z-20 hidden sm:flex items-center gap-2">
          {slides.map((_, i) => {
            const isActive = i === currentSlide
            return (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                aria-label={`Jump to slide ${i + 1}`}
                className="group relative h-8 flex items-center justify-center p-1 cursor-pointer focus:outline-none"
              >
                <div className="w-8 sm:w-10 h-[2px] rounded-full bg-white/20 overflow-hidden group-hover:bg-white/40 transition-colors">
                  {isActive && (
                    <motion.div
                      key={`progress-${currentSlide}`}
                      className="h-full bg-[var(--gold-400)]"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5.5, ease: "linear" }}
                    />
                  )}
                </div>
              </button>
            )
          })}
          <span className="ml-2 font-mono text-[11px] text-white/50 tracking-widest select-none">
            0{currentSlide + 1} / 0{slides.length}
          </span>
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
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