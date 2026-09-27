'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowRight, ShieldCheck, Sparkles, Compass, PlaneTakeoff } from 'lucide-react'

interface StorySlide {
  id: string
  badge: string
  badgeIcon: React.ElementType
  title: string
  subtitle: string
  description: string
  image: string
  href: string
  buttonText: string
  accentColor: string
}

const SLIDES: StorySlide[] = [
  {
    id: 'chauffeur',
    badge: 'ROYAL CHAUFFEUR SERVICE',
    badgeIcon: Sparkles,
    title: 'Before a word is spoken,',
    subtitle: 'every detail is already understood.',
    description:
      'Immaculate Rolls-Royce and Mercedes-Maybach flagships commanded by background-verified, uniformed concierges. Absolute discretion for dignitaries, executive summits, and grand evenings.',
    image: '/rolls-royce-phantom-night-black.png',
    href: '/services/luxury-chauffeur',
    buttonText: 'Explore Chauffeur Fleet',
    accentColor: '#d4af37',
  },
  {
    id: 'self-drive',
    badge: 'EXOTIC SELF-DRIVE FREEDOM',
    badgeIcon: Compass,
    title: 'The open road belongs',
    subtitle: 'to those who command it.',
    description:
      'Unrestricted performance. Pure automotive exhilaration delivered with zero waiting. Handcrafted supercars and high-horsepower SUVs handed over at your private estate or 5-star suite.',
    image: '/ferrari-sf90-stradale-black-studio.png',
    href: '/services/self-drive',
    buttonText: 'Command Exotics',
    accentColor: '#f59e0b',
  },
  {
    id: 'airport-vip',
    badge: 'VIP AIRPORT TARMAC CONCIERGE',
    badgeIcon: PlaneTakeoff,
    title: 'At touchdown, your flagship',
    subtitle: 'is already waiting curb-side.',
    description:
      'Live flight radar tracking with our zero-stress policy: 60 minutes of complimentary wait time from flight touchdown. White-glove luggage handling straight to your private cabin.',
    image: '/gulfstream-g650-private-jet-on-tarmac-night.png',
    href: '/services/pickup-dropoff',
    buttonText: 'Reserve Airport VIP',
    accentColor: '#38bdf8',
  },
  {
    id: 'wedding-events',
    badge: 'ROYAL WEDDING CONVOYS',
    badgeIcon: ShieldCheck,
    title: 'Grand entrances that become',
    subtitle: 'unforgettable generational legacies.',
    description:
      'Harmonized luxury armadas, ribboned Rolls-Royce Phantoms, and coordinated VIP guest logistics for India’s most prestigious weddings and milestone celebrations.',
    image: '/rolls-royce-wedding-ribbon.png',
    href: '/services/wedding-events',
    buttonText: 'Plan Wedding Convoy',
    accentColor: '#e0a96d',
  },
]

function SlidePanel({ slide, index }: { slide: StorySlide; index: number }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: panelRef,
    offset: ['start end', 'end start'],
  })

  // Subtle cinematic parallax zoom on the background image
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1, 1.08])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.4, 0.9, 0.9, 0.3])
  const contentY = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [40, 0, -30])

  const IconComponent = slide.badgeIcon

  return (
    <div
      ref={panelRef}
      className="relative min-h-[100svh] w-full overflow-hidden flex items-center justify-center border-b border-white/[0.06] bg-[#09090d]"
    >
      {/* Background Image Container with Parallax & Hardware Acceleration */}
      <motion.div
        style={{ scale: imageScale, opacity: imageOpacity }}
        className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
      >
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Multi-layered Graphite Obsidian Overlays (Avoids pure #000 for depth) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-[#09090d]/50 to-[#09090d]/80 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-[at_center_center] from-transparent via-[#09090d]/40 to-[#09090d]/90 pointer-events-none" />

      {/* Skewed Ambient Light Beam (Hype.luxury signature effect) */}
      <div
        className="absolute -top-[20%] -left-[10%] w-[45%] h-[140%] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent blur-3xl -rotate-12 pointer-events-none"
        aria-hidden="true"
      />

      {/* Editorial Content Container */}
      <motion.div
        style={{ y: contentY }}
        initial={{ opacity: 0, filter: 'blur(16px)', y: 40 }}
        whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 py-20 text-center flex flex-col items-center"
      >
        {/* Category Pill with Wide Spacing */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[var(--gold-400)]/30 bg-[var(--gold-400)]/[0.08] backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
        >
          <IconComponent className="w-3.5 h-3.5 text-[var(--gold-400)]" />
          <span className="font-luxury uppercase text-[10px] sm:text-xs tracking-[0.35em] text-[var(--gold-400)] font-medium">
            {slide.badge}
          </span>
        </motion.div>

        {/* Hero Title with Wide Luxury Typography */}
        <h2 className="font-luxury uppercase text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white font-light tracking-[0.18em] leading-[1.2] md:leading-[1.15] max-w-4xl drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
          {slide.title}
          <br className="hidden sm:inline" />
          <span className="text-white/80 font-normal"> {slide.subtitle}</span>
        </h2>

        {/* Expanding Champagne Gold Divider */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          whileInView={{ width: 80, opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="h-[1px] bg-gradient-to-r from-transparent via-[var(--gold-400)] to-transparent my-6 sm:my-8"
        />

        {/* Description Copy */}
        <p className="text-zinc-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-10 text-balance">
          {slide.description}
        </p>

        {/* Frosted Glass Pill Button with Skewed Light Sheen */}
        <Link
          href={slide.href}
          className="group relative overflow-hidden inline-flex items-center gap-3.5 border border-white/20 hover:border-[var(--gold-400)]/60 bg-white/[0.08] hover:bg-[var(--gold-400)]/[0.18] backdrop-blur-md text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full uppercase tracking-[0.25em] text-xs sm:text-sm font-medium transition-all duration-500 shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
        >
          {/* Animated Sheen Reflection Sweep */}
          <span
            className="absolute inset-0 w-[45%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] -translate-x-[160%] group-hover:translate-x-[360%] transition-transform duration-1000 ease-out pointer-events-none"
            aria-hidden="true"
          />
          <span className="relative z-10">{slide.buttonText}</span>
          <ArrowRight className="relative z-10 w-4 h-4 text-[var(--gold-400)] transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>

      {/* Slide Index Subtle Indicator */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-10 flex items-center gap-2 pointer-events-none">
        <span className="text-[10px] sm:text-xs font-luxury tracking-[0.3em] text-white/40 uppercase">
          0{index + 1} / 0{SLIDES.length}
        </span>
      </div>
    </div>
  )
}

export function ScrollStoryShowcase() {
  return (
    <section aria-label="DRIVEIT Luxury Experiences" className="relative w-full bg-[#09090d]">
      {SLIDES.map((slide, index) => (
        <SlidePanel key={slide.id} slide={slide} index={index} />
      ))}
    </section>
  )
}
