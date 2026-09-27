'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight } from 'lucide-react'

interface StorySlide {
  id: string
  category: string
  headline: string
  subtitle: string
  image: string
  href: string
  buttonText: string
}

const SLIDES: StorySlide[] = [
  {
    id: 'chauffeur',
    category: 'ROYAL CHAUFFEUR',
    headline: 'BEFORE A WORD IS SPOKEN, EVERYTHING IS ALREADY UNDERSTOOD.',
    subtitle: 'The World’s Most Prestigious Flagships, Commanded for You.',
    image: '/rolls-royce-phantom-night-black.png',
    href: '/services/luxury-car-rental',
    buttonText: 'EXPLORE',
  },
  {
    id: 'self-drive',
    category: 'SELF-DRIVE EXOTICS',
    headline: 'AT HIGH VELOCITY, THE ONLY LIMIT THAT EXISTS IS YOURS.',
    subtitle: 'Unrivaled Performance. Handcrafted Supercars Delivered to Your Estate.',
    image: '/ferrari-sf90-stradale-black-studio.png',
    href: '/cars?service=selfdrive',
    buttonText: 'EXPLORE',
  },
  {
    id: 'airport-vip',
    category: 'VIP AIRPORT CONCIERGE',
    headline: 'AT TOUCHDOWN, YOUR FLAGSHIP IS ALREADY WAITING ON THE TARMAC.',
    subtitle: 'Zero Waiting. 60-Minute Complimentary Touchdown Delay Guarantee.',
    image: '/gulfstream-g650-private-jet-on-tarmac-night.png',
    href: '/services/pickup-dropoff',
    buttonText: 'EXPLORE',
  },
  {
    id: 'wedding-events',
    category: 'ROYAL WEDDING CONVOYS',
    headline: 'GRAND ENTRANCES THAT BECOME TIMELESS GENERATIONAL LEGACIES.',
    subtitle: 'Coordinated Luxury Armadas & Ribboned Rolls-Royces for India’s Elite.',
    image: '/rolls-royce-wedding-ribbon.png',
    href: '/services/wedding-cars',
    buttonText: 'EXPLORE',
  },
]

function SlidePanel({
  slide,
  index,
  total,
}: {
  slide: StorySlide
  index: number
  total: number
}) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Track scroll position of this slide as the user scrolls past it to the next slide
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ['start start', 'end start'],
  })

  // The "closing of image 1 when jumping to image 2" physical transition:
  // As next slide scrolls over this one, current slide gently scales down to 0.94 and dims to 0.25 opacity
  const isLast = index === total - 1
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.94])
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.7, isLast ? 1 : 0.25])
  const blurFilter = useTransform(scrollYProgress, [0, 1], ['blur(0px)', isLast ? 'blur(0px)' : 'blur(8px)'])

  return (
    <div
      ref={panelRef}
      className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#050508]"
      style={{ zIndex: (index + 1) * 10 }}
    >
      <motion.div
        style={{
          scale,
          opacity,
          filter: blurFilter,
        }}
        className="relative w-full h-full flex items-center justify-center overflow-hidden will-change-transform"
      >
        {/* Background Image: Crisp, vibrant, unobstructed (matching Screenshot 2 & 3) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <Image
            src={slide.image}
            alt={slide.headline}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Lighter Cinematic Tint Overlay: Ensures background car/jet is 100% visible */}
        <div className="absolute inset-0 bg-black/35 z-[1] pointer-events-none" />

        {/* Subtle Diagonal Ambient Light Beam (Hype.luxury signature effect) */}
        <div
          className="absolute -top-[20%] -left-[10%] w-[35%] h-[140%] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent blur-3xl -rotate-12 z-[2] pointer-events-none"
          aria-hidden="true"
        />

        {/* Minimalist Centered Content (Lower-center position, matching Screenshot 2 & 3) */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          {/* Small Tracked Category Header */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="uppercase font-luxury tracking-[0.45em] text-white/75 text-xs sm:text-sm font-medium mb-3 sm:mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          >
            {slide.category}
          </motion.p>

          {/* Small, Refined, Ultra-Spaced Headline (Not giant, perfectly balanced) */}
          <motion.h2
            initial={{ opacity: 0, filter: 'blur(12px)', y: 25 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="uppercase font-luxury font-light tracking-[0.22em] text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white max-w-3xl mx-auto leading-relaxed md:leading-[1.4] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] text-balance"
          >
            {slide.headline}
          </motion.h2>

          {/* Thin Divider Line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 64, opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="h-[1px] bg-white/40 mx-auto my-4 sm:my-5"
          />

          {/* Refined Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/80 text-xs sm:text-sm md:text-base font-light tracking-wider max-w-xl mx-auto mb-7 sm:mb-9 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
          >
            {slide.subtitle}
          </motion.p>

          {/* Compact Frosted Glass Pill Button with Skewed Light Reflection */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Link
              href={slide.href}
              className="group relative overflow-hidden inline-flex items-center gap-2.5 border border-white/25 hover:border-white/50 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-7 sm:px-8 py-2.5 sm:py-3 rounded-full uppercase tracking-[0.22em] text-xs font-medium transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
            >
              {/* Skewed Animated Light Sweep */}
              <span
                className="absolute inset-0 w-[40%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] -translate-x-[150%] group-hover:translate-x-[350%] transition-transform duration-1000 ease-out pointer-events-none"
                aria-hidden="true"
              />
              <span className="relative z-10">{slide.buttonText}</span>
              <ArrowRight className="relative z-10 w-3.5 h-3.5 text-white/90 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export function ScrollStoryShowcase() {
  return (
    <section aria-label="DRIVEIT Luxury Experiences" className="relative w-full bg-[#050508]">
      {SLIDES.map((slide, index) => (
        <SlidePanel key={slide.id} slide={slide} index={index} total={SLIDES.length} />
      ))}
    </section>
  )
}
