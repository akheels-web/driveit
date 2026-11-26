'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  MapPin,
  ArrowRight,
  Lock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { CommissionAsset } from './quick-book-drawer'
import { LuxurySelect } from '@/components/luxury-select'
import { LuxuryDatePicker } from '@/components/luxury-date-picker'
import { getLocalDateString } from '@/lib/utils'

const SLIDE_MS = 6500

type HeroScene = {
  id: string
  tabLabel: string
  categoryTag: string
  brand: string
  title: string
  subtitle: string
  src: string
  focus: string
  kind: 'car' | 'commission'
  carSlug?: string
  dailyRate?: number
  selfDriveRate?: number
  serviceDefault?: 'chauffeur' | 'selfdrive'
  telemetry: { label: string; value: string }[]
  commissionAsset?: CommissionAsset
  exploreHref: string
}

const SCENES: HeroScene[] = [
  {
    id: 'phantom',
    tabLabel: '01 / Phantom VIII',
    categoryTag: 'CHAUFFEUR & SELF-DRIVE · HYDERABAD',
    brand: 'ROLLS-ROYCE',
    title: 'PHANTOM VIII',
    subtitle: '₹1,85,000 / Day · Uniformed Protocol',
    src: '/rolls-royce-phantom-night.webp',
    focus: '50% 62%',
    kind: 'car',
    carSlug: 'rolls-royce-phantom',
    dailyRate: 185000,
    selfDriveRate: 160000,
    serviceDefault: 'chauffeur',
    telemetry: [
      { label: 'ENGINE', value: '6.75L V12' },
      { label: 'OUTPUT', value: '563 BHP' },
      { label: 'CABIN', value: '58 dB Whisper' },
    ],
    exploreHref: '/cars/rolls-royce-phantom',
  },
  {
    id: 'db12',
    tabLabel: '02 / Aston DB12',
    categoryTag: 'SUPER TOURER · SELF-DRIVE & CHAUFFEUR',
    brand: 'ASTON MARTIN',
    title: 'ASTON MARTIN DB12',
    subtitle: '₹1,45,000 / Day · 671 BHP Twin-Turbo V8',
    src: '/aston-martin-db12-night.webp',
    focus: '50% 62%',
    kind: 'car',
    carSlug: 'aston-martin-db12',
    dailyRate: 145000,
    selfDriveRate: 125000,
    serviceDefault: 'selfdrive',
    telemetry: [
      { label: '0–100 KM/H', value: '3.5 Sec' },
      { label: 'OUTPUT', value: '671 BHP' },
      { label: 'VMAX', value: '325 km/h' },
    ],
    exploreHref: '/cars/aston-martin-db12',
  },
  {
    id: 'supercar',
    tabLabel: '03 / Ferrari SF90',
    categoryTag: 'SELF-DRIVE EXOTIC · DOORSTEP FLATBED',
    brand: 'FERRARI',
    title: 'SF90 STRADALE',
    subtitle: '₹1,65,000 / Day · 986 CV V8 Hybrid',
    src: '/ferrari-sf90-stradale-black-studio.webp',
    focus: '50% 60%',
    kind: 'car',
    carSlug: 'ferrari-sf90-stradale',
    dailyRate: 165000,
    selfDriveRate: 145000,
    serviceDefault: 'selfdrive',
    telemetry: [
      { label: '0–100 KM/H', value: '2.5 Sec' },
      { label: 'HYBRID V8', value: '986 CV' },
      { label: 'VMAX', value: '340 km/h' },
    ],
    exploreHref: '/cars/ferrari-sf90-stradale',
  },
  {
    id: 'aviation',
    tabLabel: '04 / Private Jets',
    categoryTag: 'PRIVATE COMMISSION · CONTACT ONLY',
    brand: 'GULFSTREAM AEROSPACE',
    title: 'GULFSTREAM G650ER',
    subtitle: 'Begumpet & RGIA VVIP Tarmac Transfers',
    src: '/gulfstream-g650-private-jet-on-tarmac-night.webp',
    focus: '50% 58%',
    kind: 'commission',
    telemetry: [
      { label: 'RANGE', value: '7,500 NM' },
      { label: 'CRUISE', value: 'Mach 0.925' },
      { label: 'CABIN', value: '19 Passengers' },
    ],
    commissionAsset: {
      title: 'Private Jet Charter',
      subtitle: 'Gulfstream · Global 7500 · Helicopters',
      src: '/gulfstream-g650-private-jet-on-tarmac-night.webp',
      serviceName: 'Private Jet / Helicopter Charter',
    },
    exploreHref: '/services/private-jet-services',
  },
  {
    id: 'yachts',
    tabLabel: '05 / Superyachts',
    categoryTag: 'PRIVATE COMMISSION · CONTACT ONLY',
    brand: 'PRIVÉ MARINE',
    title: 'SUPERYACHT CHARTER',
    subtitle: 'Sunset Deck Soirées & Coastal Voyages',
    src: '/yachts/benetti-oasis-40m-superyacht.webp',
    focus: '50% 55%',
    kind: 'commission',
    telemetry: [
      { label: 'DECK', value: '120 FT Tri-Deck' },
      { label: 'GUESTS', value: 'Up to 24 VIPs' },
      { label: 'CREW', value: 'Full Butler & Chef' },
    ],
    commissionAsset: {
      title: 'Superyacht Charter',
      subtitle: 'Private Deck Soirées & Crew',
      src: '/yachts/benetti-oasis-40m-superyacht.webp',
      serviceName: 'Superyacht & Marine Charter',
    },
    exploreHref: '/services/yacht-services',
  },
]

const HYDERABAD_HUBS = [
  'Banjara Hills',
  'Jubilee Hills',
  'RGIA Airport (Shamshabad)',
  'HITEC City',
  'Financial District',
  'Taj Falaknuma Palace',
]

const todayIso = () => getLocalDateString()

import {
  DEFAULT_HERO_SCENES,
  type HeroSceneConfig,
  type PickupHubConfig,
} from '@/lib/home-config'

export function ShowroomHero({
  onRequestCommission,
  scenes: cmsScenes,
  hubs: cmsHubs,
}: {
  eyebrow?: string
  scenes?: HeroSceneConfig[]
  hubs?: PickupHubConfig[]
  onRequestCommission?: (asset: CommissionAsset) => void
}) {
  const router = useRouter()
  const stageRef = useRef<HTMLDivElement>(null)
  const resolvedScenes = (cmsScenes && cmsScenes.length > 0 ? cmsScenes : DEFAULT_HERO_SCENES).map(
    (s, idx) => {
      const preset =
        SCENES.find((p) => p.id === s.id || p.title.toLowerCase() === s.title.toLowerCase()) ||
        SCENES[idx % SCENES.length]
      return {
        ...preset,
        id: s.id || preset.id,
        tabLabel: s.tabLabel || preset.tabLabel,
        categoryTag: s.kicker || preset.categoryTag,
        title: s.title || preset.title,
        subtitle: s.subtitle || preset.subtitle,
        src: s.src || preset.src,
        imageAlt: s.imageAlt || `${s.title} — ${s.subtitle} — DRIVEIT Luxury Hyderabad`,
        exploreHref: s.ctaHref || preset.exploreHref,
        kind: s.ctaHref?.startsWith('/services/') ? ('commission' as const) : preset.kind,
      }
    },
  )
  const resolvedHubs =
    cmsHubs && cmsHubs.length > 0 ? cmsHubs.map((h) => h.label) : HYDERABAD_HUBS
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const scene = resolvedScenes[index] || resolvedScenes[0]

  const [driveMode, setDriveMode] = useState<'chauffeur' | 'selfdrive'>('chauffeur')
  const [pickupHub, setPickupHub] = useState(resolvedHubs[0])
  const [pickupDate, setPickupDate] = useState(todayIso)

  const sceneCount = resolvedScenes.length
  const nextIndex = (index + 1) % sceneCount

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + sceneCount) % sceneCount),
    [sceneCount],
  )

  useEffect(() => {
    if (paused) return
    const id = setTimeout(() => go(1), SLIDE_MS)
    return () => clearTimeout(id)
  }, [index, paused, go])

  // Keyboard arrow navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  // Zero-render GPU pointer parallax on background stage (mouse pointers only)
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = stageRef.current
    if (!el) return
    const rect = e.currentTarget.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `translate3d(${nx * -14}px, ${ny * -10}px, 0) scale(1.03)`
  }, [])

  const handlePointerLeave = useCallback(() => {
    const el = stageRef.current
    if (!el) return
    el.style.transform = 'translate3d(0px, 0px, 0) scale(1.01)'
  }, [])

  const handleBookCar = () => {
    const params = new URLSearchParams({
      carId: scene.carSlug || 'rolls-royce-phantom',
      service: driveMode,
      pickup: pickupHub,
      pickupDate: pickupDate || todayIso(),
      returnDate: pickupDate || todayIso(),
    })
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <section
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative min-h-[100svh] w-full select-none overflow-hidden bg-[#040405] flex flex-col justify-between pt-[94px] sm:pt-[108px] pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-10 px-4 md:px-[4vw] gap-6"
      aria-label="DRIVEIT Luxury Mobility Showcase"
    >
      {/* Hardware-Accelerated Image Stage with Smooth Pointer Parallax */}
      <div
        ref={stageRef}
        className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform"
        style={{ transform: 'translate3d(0px, 0px, 0) scale(1.01)' }}
      >
        {resolvedScenes.map((s, i) => {
          const isCurrent = i === index
          const isNext = i === nextIndex
          if (!isCurrent && !isNext) return null

          return (
            <div
              key={s.id}
              aria-hidden={!isCurrent}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={s.src}
                alt={s.imageAlt}
                fill
                priority={i === 0}
                quality={90}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: s.focus }}
              />
            </div>
          )
        })}
      </div>

      {/* Atmospheric Vignettes */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-52 bg-gradient-to-b from-[#040405]/95 via-[#040405]/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[62%] bg-gradient-to-t from-[#040405] via-[#040405]/75 to-transparent" />

      {/* Top Multi-Vertical Scene Switcher Dock */}
      <div
        className="relative z-30 flex items-center justify-between gap-2 sm:gap-4"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="inline-flex items-center gap-1 overflow-x-auto no-scrollbar max-w-full rounded-full bg-black/65 backdrop-blur-xl border border-white/10 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
          {resolvedScenes.map((s, i) => {
            const active = i === index
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`relative px-3.5 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 ${
                  active
                    ? 'bg-[#c9a96e] text-black font-bold shadow-[0_0_20px_rgba(201,169,110,0.35)]'
                    : 'text-white/75 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {s.tabLabel}
              </button>
            )
          })}
        </div>

        {/* Right Controls: Prev/Next Arrows */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="w-9 h-9 rounded-full bg-black/65 backdrop-blur-xl border border-white/12 hover:border-[#c9a96e] text-white flex items-center justify-center transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="w-9 h-9 rounded-full bg-black/65 backdrop-blur-xl border border-white/12 hover:border-[#c9a96e] text-white flex items-center justify-center transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bottom Visual Headline, Animated Telemetry Pills & Sleek 1-Line Booking Bar */}
      <div
        className="relative z-30 mt-auto flex flex-col gap-4 sm:gap-5"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Minimalist Title + Live Telemetry HUD */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c9a96e]" />
                  <p className="text-[10px] font-mono uppercase tracking-[0.32em] text-[#c9a96e]">
                    {scene.categoryTag}
                  </p>
                </div>
                <h1 className="font-luxury text-[clamp(2.4rem,6.5vw,5.8rem)] font-extralight uppercase leading-[0.92] tracking-[0.01em] text-[#f4efe6]">
                  {scene.title}
                </h1>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Live Animated Telemetry Cards + Explore Pill */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
            {scene.telemetry.map((metric) => (
              <div
                key={metric.label}
                className="px-3 sm:px-3.5 py-2 rounded-xl bg-black/65 border border-white/12 backdrop-blur-md"
              >
                <span className="text-[8px] font-mono uppercase tracking-[0.24em] text-white/45 block">
                  {metric.label}
                </span>
                <span className="text-xs font-mono font-bold text-[#f4efe6]">
                  {metric.value}
                </span>
              </div>
            ))}

            <Link
              href={scene.exploreHref}
              className="px-4 py-3 rounded-xl border border-[#c9a96e]/40 bg-black/65 hover:bg-[#c9a96e] hover:text-black text-[10px] font-mono uppercase tracking-[0.22em] text-[#f4efe6] transition flex items-center gap-1.5"
            >
              <span>Inspect</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Sleek Floating Command Bar */}
        <div className="rounded-2xl border border-white/15 bg-[#09090d]/90 backdrop-blur-md p-2.5 md:p-3 shadow-2xl">
          {scene.kind === 'car' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
              {/* Mode Switch */}
              <div className="md:col-span-3 flex bg-black/60 p-1 rounded-xl border border-white/10">
                {(
                  [
                    { id: 'chauffeur', label: 'Chauffeur' },
                    { id: 'selfdrive', label: 'Self-Drive' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDriveMode(tab.id)}
                    className={`flex-1 py-2 rounded-lg text-[11px] font-mono uppercase tracking-wider transition cursor-pointer ${
                      driveMode === tab.id
                        ? 'bg-[#c9a96e] text-black font-bold'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Location */}
              <div className="md:col-span-4">
                <LuxurySelect
                  value={pickupHub}
                  onChange={setPickupHub}
                  options={resolvedHubs}
                  size="sm"
                  icon={<MapPin className="w-3.5 h-3.5 text-[#c9a96e]" />}
                  triggerClassName="bg-black/60 border-white/10 min-h-[42px] text-xs py-2"
                  ariaLabel="Select Pickup Location"
                />
              </div>

              {/* Date */}
              <div className="hidden lg:block md:col-span-2">
                <LuxuryDatePicker
                  value={pickupDate}
                  onChange={(d) => setPickupDate(d || todayIso())}
                  min={todayIso()}
                  placeholder="Date"
                  size="sm"
                  triggerClassName="bg-black/60 border-white/10 min-h-[42px] text-xs"
                  ariaLabel="Select Pickup Date"
                />
              </div>

              {/* Book CTA */}
              <div className="md:col-span-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBookCar}
                  className="flex-1 min-h-[42px] rounded-xl bg-[#c9a96e] hover:bg-[#dfc288] text-black font-bold text-[11px] font-mono uppercase tracking-[0.2em] px-4 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Reserve {scene.brand.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-1">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c9a96e]/15 border border-[#c9a96e]/35 text-[10px] font-mono uppercase tracking-[0.22em] text-[#c9a96e]">
                  <Lock className="w-3 h-3" />
                  By Private Commission Only
                </span>
                <span className="hidden md:inline-block text-xs text-white/65 font-light">
                  Direct charter desk for {scene.title} — tailored routing & crew.
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (scene.commissionAsset && onRequestCommission) {
                      onRequestCommission(scene.commissionAsset)
                    } else {
                      router.push(scene.exploreHref)
                    }
                  }}
                  className="flex-1 sm:flex-initial min-h-[42px] px-6 rounded-xl bg-[#c9a96e] hover:bg-[#dfc288] text-black font-bold text-[11px] font-mono uppercase tracking-[0.22em] flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Inquire Privately</span>
                </button>
                <Link
                  href={scene.exploreHref}
                  className="min-h-[42px] px-4 rounded-xl border border-white/15 bg-white/[0.04] hover:border-[#c9a96e] text-[10px] font-mono uppercase tracking-[0.2em] text-white flex items-center justify-center transition"
                >
                  Specs
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
