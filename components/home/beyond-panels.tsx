'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plane, Anchor, Crown, Users, Lock, ArrowUpRight } from 'lucide-react'
import type { CommissionAsset } from './quick-book-drawer'
import type { BeyondPanelConfig } from '@/lib/home-config'

const PANELS = [
  {
    id: 'aviation',
    title: 'Private Jets',
    subtitle: 'Gulfstream · Global 7500 · Helicopters',
    src: '/gulfstream-g650-private-jet-on-tarmac-night.webp',
    href: '/services/private-jet-services',
    serviceName: 'Private Jet / Helicopter Charter',
    Icon: Plane,
    metrics: [
      { label: 'RANGE', value: '7,500 NM' },
      { label: 'TERMINAL', value: 'Begumpet & RGIA VVIP' },
      { label: 'CABIN', value: '12–19 VVIP Seats' },
    ],
  },
  {
    id: 'yacht',
    title: 'Superyachts',
    subtitle: 'Private Deck Soirées & Voyages',
    src: '/yachts/benetti-oasis-40m-superyacht.webp',
    href: '/services/yacht-services',
    serviceName: 'Superyacht & Marine Charter',
    Icon: Anchor,
    metrics: [
      { label: 'VESSEL', value: '85–140 FT Tri-Deck' },
      { label: 'CAPACITY', value: 'Up to 24 Guests' },
      { label: 'HOSPITALITY', value: 'Private Chef & Crew' },
    ],
  },
  {
    id: 'coaches',
    title: 'Luxury Coaches',
    subtitle: '14–45 Seater Reclining Lounges',
    src: '/luxury-coach-interior-black-gold.webp',
    href: '/services/luxury-buses',
    serviceName: 'Luxury Coach & Convoy Charter',
    Icon: Users,
    metrics: [
      { label: 'SEATING', value: '14–45 Captain Recliners' },
      { label: 'ONBOARD', value: 'Starlight Lounge & Wi-Fi' },
      { label: 'PROTOCOL', value: 'Corporate & Delegation' },
    ],
  },
  {
    id: 'bridal',
    title: 'Royal Bridal',
    subtitle: 'Palace Convoys · Rolls-Royce & Maybach',
    src: '/rolls-royce-wedding-ribbon.webp',
    href: '/services/wedding-cars',
    serviceName: 'Royal Wedding Motorcade Commission',
    Icon: Crown,
    metrics: [
      { label: 'FLAGSHIPS', value: 'Phantom · Maybach · G63' },
      { label: 'VENUES', value: 'Falaknuma & Palace Estates' },
      { label: 'PROTOCOL', value: 'Uniformed Ceremonial Escort' },
    ],
  },
] as const

export function BeyondPanels({
  panels: cmsPanels,
  eyebrow = '02 / PRIVÉ COMMISSIONS · CONTACT ONLY',
  title = 'Air, Sea & Convoys',
  subtitle = 'By Private Consultation Only',
  onRequestCommission,
}: {
  panels?: BeyondPanelConfig[]
  eyebrow?: string
  title?: string
  subtitle?: string
  onRequestCommission: (asset: CommissionAsset) => void
}) {
  const iconForKey = (key: string) => {
    const k = key.toLowerCase()
    if (k.includes('jet') || k.includes('aviation')) return Plane
    if (k.includes('yacht') || k.includes('marine')) return Anchor
    if (k.includes('coach') || k.includes('bus')) return Users
    return Crown
  }

  const resolvedPanels =
    cmsPanels && cmsPanels.length > 0
      ? cmsPanels.map((p, idx) => {
          const preset =
            PANELS.find(
              (base) =>
                base.id === p.key ||
                base.href === p.href ||
                base.title.toLowerCase() === p.title.toLowerCase(),
            ) || PANELS[idx % PANELS.length]
          return {
            id: p.key || preset.id,
            title: p.title || preset.title,
            subtitle: p.subtitle || preset.subtitle,
            src: p.src || preset.src,
            imageAlt: p.imageAlt || `${p.title} — ${p.subtitle} — DRIVEIT Privé Hyderabad`,
            href: p.href || preset.href,
            serviceName: p.serviceName || preset.serviceName,
            Icon: iconForKey(p.key || preset.id),
            metrics:
              p.highlights && p.highlights.length > 0
                ? [
                    { label: 'CAPACITY', value: p.capacity || preset.metrics[0]?.value || 'VIP' },
                    ...p.highlights.slice(0, 2).map((h, i) => ({
                      label: `PROTOCOL 0${i + 1}`,
                      value: h,
                    })),
                  ]
                : preset.metrics,
          }
        })
      : PANELS.map((p) => ({
          ...p,
          imageAlt: `${p.title} — ${p.subtitle} — DRIVEIT Privé Hyderabad`,
        }))

  const [open, setOpen] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setOpen((prev) => (prev + 1) % resolvedPanels.length)
    }, 5500)
    return () => clearInterval(timer)
  }, [paused, resolvedPanels.length])

  return (
    <section
      id="driveit-prive"
      className="bg-[#040405] px-4 py-20 md:px-[4vw] md:py-28 border-t border-white/8"
      aria-label="DriveIt Privé — Jets, Yachts & Bespoke Commissions"
    >
      <div className="max-w-7xl mx-auto">
        {/* Minimalist Section Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.35em] text-[#c9a96e] block mb-2">
              {eyebrow}
            </span>
            <h2 className="font-luxury text-[clamp(2rem,4.2vw,3.6rem)] font-extralight uppercase leading-none tracking-[0.02em] text-[#f4efe6]">
              {title}
            </h2>
          </div>

          {/* Interactive Quick Switcher Dots */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/45">
              {subtitle}
            </span>
            <div className="flex items-center gap-1.5">
              {resolvedPanels.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setOpen(idx)}
                  aria-label={`Select ${p.title}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    open === idx ? 'w-7 bg-[#c9a96e]' : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 4 Expanding Visual Panels */}
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="flex flex-col gap-3 lg:h-[68svh] lg:min-h-[540px] lg:flex-row"
        >
          {resolvedPanels.map((panel, i) => {
            const active = open === i
            const Icon = panel.Icon
            return (
              <div
                key={panel.id}
                onMouseEnter={() => setOpen(i)}
                onClick={() => setOpen(i)}
                className={`group relative overflow-hidden rounded-[24px] border transition-[flex-grow,min-height,border-color] duration-500 ease-out cursor-pointer flex flex-col justify-between p-5 md:p-7 gap-6 ${
                  active
                    ? 'min-h-[340px] sm:min-h-[370px] lg:min-h-0 lg:flex-[3] border-[#c9a96e]/55 shadow-[0_0_40px_rgba(201,169,110,0.12)]'
                    : 'min-h-[124px] sm:min-h-[136px] lg:min-h-0 lg:flex-[1] border-white/10 hover:border-white/25'
                }`}
              >
                <Image
                  src={panel.src}
                  alt={(panel as { imageAlt?: string }).imageAlt || `${panel.title} — ${panel.subtitle} — DRIVEIT Privé Hyderabad`}
                  fill
                  quality={90}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={`object-cover transition-transform duration-700 ease-out ${
                    active ? 'scale-100' : 'scale-105'
                  }`}
                />
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    active
                      ? 'bg-gradient-to-t from-[#040405] via-[#040405]/45 to-black/20'
                      : 'bg-black/70'
                  }`}
                />

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 border border-[#c9a96e]/35 text-[9px] font-mono uppercase tracking-[0.22em] text-[#c9a96e]">
                    <Icon className="w-3 h-3" />
                    Contact Only
                  </span>
                  <span className="text-[10px] font-mono tracking-[0.28em] text-white/50">
                    0{i + 1}
                  </span>
                </div>

                {/* Bottom Visual Caption, Telemetry & Direct Action */}
                <div className="relative z-10 mt-auto">
                  <p className="text-[10px] font-mono uppercase tracking-[0.26em] text-[#c9a96e]">
                    {panel.subtitle}
                  </p>
                  <h3 className="mt-1 font-luxury text-xl sm:text-2xl md:text-4xl font-light uppercase tracking-[0.04em] text-[#f4efe6]">
                    {panel.title}
                  </h3>

                  <AnimatePresence>
                    {active && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="mt-4 space-y-4"
                      >
                        {/* Telemetry Row */}
                        <div className="grid grid-cols-1 min-[360px]:grid-cols-3 gap-2 max-w-lg">
                          {panel.metrics.map((m) => (
                            <div
                              key={m.label}
                              className="rounded-xl bg-black/65 border border-white/12 px-3 py-2 backdrop-blur-md"
                            >
                              <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/45 block">
                                {m.label}
                              </span>
                              <span className="text-[11px] font-mono font-semibold text-[#f4efe6] truncate block mt-0.5">
                                {m.value}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              onRequestCommission({
                                title: panel.title,
                                subtitle: panel.subtitle,
                                src: panel.src,
                                serviceName: panel.serviceName,
                              })
                            }}
                            className="inline-flex items-center justify-center min-h-[40px] gap-2 px-5 py-2.5 rounded-xl bg-[#c9a96e] hover:bg-[#dfc288] text-black font-bold text-[10px] font-mono uppercase tracking-[0.22em] transition cursor-pointer"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Inquire Privately</span>
                          </button>

                          <Link
                            href={panel.href}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center justify-center min-h-[40px] gap-1.5 px-4 py-2.5 rounded-xl border border-white/20 bg-black/65 hover:border-[#c9a96e] text-[10px] font-mono uppercase tracking-[0.2em] text-[#f4efe6] transition"
                          >
                            <span>Explore Dossier</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[#c9a96e]" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
