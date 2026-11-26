'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Gauge,
  ShieldCheck,
  Volume2,
  VolumeX,
  Plus,
  Check,
  SlidersHorizontal,
} from 'lucide-react'
import type { CarDetails } from '@/lib/cars'
import { buildVehicleAlt } from '@/lib/asset-paths'
import { playEngineAcoustic, type EngineType } from '@/lib/engine-audio'

interface Hotspot {
  id: string
  x: number // percentage from left
  y: number // percentage from top
  label: string
  spec: string
  detail: string
}

interface StudioMachine {
  slug: string
  brand: string
  model: string
  tagline: string
  src: string
  imageAlt?: string
  category: string
  chauffeurRate: number
  selfDriveRate: number
  powerHp: number
  maxHpScale: number
  zeroToHundred: string
  topSpeed: string
  acousticNote: string
  engineType: EngineType
  transmission: string
  seats: number
  hotspots: Hotspot[]
}

const STUDIO_MACHINES: StudioMachine[] = [
  {
    slug: 'rolls-royce-phantom',
    brand: 'ROLLS-ROYCE',
    model: 'Phantom',
    tagline: 'Architecture of Luxury · Starlight Headliner',
    src: '/studio/rolls-royce-phantom.webp?v=5',
    category: 'FLAGSHIP SALOON',
    chauffeurRate: 185000,
    selfDriveRate: 160000,
    powerHp: 563,
    maxHpScale: 1000,
    zeroToHundred: '5.3s',
    topSpeed: '250 km/h',
    acousticNote: '58 dB Whisper Cabin · 130 kg Sound Insulation',
    engineType: 'v12-whisper',
    transmission: '8-Speed Satellite-Aided',
    seats: 4,
    hotspots: [
      {
        id: 'grille',
        x: 21,
        y: 64,
        label: 'Pantheon Grille & Spirit of Ecstasy',
        spec: '6.75L Twin-Turbo V12',
        detail: '900 Nm torque delivered from 1,700 rpm for silent, effortless surge.',
      },
      {
        id: 'cabin',
        x: 55,
        y: 46,
        label: 'Starlight Suite & Coach Doors',
        spec: '1,344 Fibre-Optic Stars',
        detail: 'Rear Sanctuary seats with champagne chiller & power-closing coach doors.',
      },
      {
        id: 'chassis',
        x: 42,
        y: 74,
        label: 'Magic Carpet Ride Suspension',
        spec: 'Stereo Camera Road Scan',
        detail: 'Reads road surfaces at 100 km/h and pre-adjusts air struts in milliseconds.',
      },
    ],
  },
  {
    slug: 'aston-martin-db12',
    brand: 'ASTON MARTIN',
    model: 'DB12',
    tagline: 'The World’s First Super Tourer',
    src: '/studio/aston-martin-db12.webp?v=5',
    category: 'SUPER TOURER',
    chauffeurRate: 145000,
    selfDriveRate: 125000,
    powerHp: 671,
    maxHpScale: 1000,
    zeroToHundred: '3.5s',
    topSpeed: '325 km/h',
    acousticNote: 'Hand-Built 4.0L Twin-Turbo V8 Roar',
    engineType: 'v8-twinturbo',
    transmission: '8-Speed Electronic Rear Diff',
    seats: 2,
    hotspots: [
      {
        id: 'aero',
        x: 24,
        y: 65,
        label: 'Vane Grille & Front Splitter',
        spec: '671 BHP · 800 Nm',
        detail: 'Enlarged Aston Martin signature aperture feeding dual twin-scroll turbos.',
      },
      {
        id: 'cockpit',
        x: 54,
        y: 48,
        label: 'Bridge of Weir Leather Cockpit',
        spec: 'Bowers & Wilkins 1,170W',
        detail: 'Driver-centric carbon & hand-stitched Scottish leather cabin.',
      },
      {
        id: 'wheels',
        x: 47,
        y: 72,
        label: '21" Forged Alloy & Carbon Ceramic',
        spec: ' Michelin Pilot Sport 5 S',
        detail: 'Bespoke AML-coded tires with Bilstein DTX adaptive dampers.',
      },
    ],
  },
  {
    slug: 'ferrari-sf90-stradale',
    brand: 'FERRARI',
    model: 'SF90 Stradale',
    tagline: '986 CV Plug-In Hybrid V8 Berlinetta',
    src: '/studio/ferrari-sf90-stradale.webp?v=5',
    category: 'HYPER BERLINETTA',
    chauffeurRate: 165000,
    selfDriveRate: 145000,
    powerHp: 986,
    maxHpScale: 1000,
    zeroToHundred: '2.5s',
    topSpeed: '340 km/h',
    acousticNote: '8,000 RPM Flat-Plane V8 + Triple e-Motor',
    engineType: 'v8-hybrid',
    transmission: '8-Speed F1 Dual-Clutch',
    seats: 2,
    hotspots: [
      {
        id: 'front-motors',
        x: 24,
        y: 66,
        label: 'RAC-e Torque Vectoring Front Axle',
        spec: 'Dual Front Electric Motors',
        detail: 'Independent electric torque distribution across front wheels for razor cornering.',
      },
      {
        id: 'e-manettino',
        x: 51,
        y: 50,
        label: 'eManettino Digital Cockpit',
        spec: 'eDrive · Hybrid · Performance · Qualify',
        detail: '16-inch curved HD instrument cluster with F1 steering wheel controls.',
      },
      {
        id: 'v8-bay',
        x: 74,
        y: 56,
        label: 'F154 CD Twin-Turbo V8',
        spec: '780 CV Internal Combustion + 220 CV Electric',
        detail: 'Inconel exhaust manifold & shut-off Gurney active rear downforce.',
      },
    ],
  },
  {
    slug: 'mercedes-amg-g-63',
    brand: 'MERCEDES-BENZ',
    model: 'AMG G 63',
    tagline: 'Handcrafted AMG 4.0L V8 Biturbo Icon',
    src: '/studio/mercedes-amg-g63.webp?v=5',
    category: 'COMMAND SUV',
    chauffeurRate: 65000,
    selfDriveRate: 55000,
    powerHp: 577,
    maxHpScale: 1000,
    zeroToHundred: '4.5s',
    topSpeed: '240 km/h',
    acousticNote: 'Side-Exit AMG Performance Twin Exhaust',
    engineType: 'v8-amg',
    transmission: 'AMG SPEEDSHIFT TCT 9G',
    seats: 5,
    hotspots: [
      {
        id: 'panamericana',
        x: 22,
        y: 60,
        label: 'AMG Panamericana Crest',
        spec: '850 Nm Peak Torque',
        detail: 'One Man, One Engine — Affalterbach plaque with 3 locking differentials.',
      },
      {
        id: 'manufaktur',
        x: 52,
        y: 44,
        label: 'G Manufaktur Nappa Interior',
        spec: 'Burmester 3D Surround',
        detail: 'Active Multicontour diamond-quilted seats with dual 12.3" widescreen cockpit.',
      },
      {
        id: 'exhaust',
        x: 68,
        y: 74,
        label: 'Side-Exit Quad Exhaust Pipes',
        spec: 'Adjustable Acoustic Flaps',
        detail: 'Signature G-Wagon V8 thunder beneath the rear running boards.',
      },
    ],
  },
  {
    slug: 'lamborghini-hurac-n-evo',
    brand: 'LAMBORGHINI',
    model: 'Huracán Evo',
    tagline: 'Naturally Aspirated 5.2L V10 Symphony',
    src: '/studio/lamborghini-huracan-evo.webp?v=5',
    category: 'V10 SUPERCAR',
    chauffeurRate: 125000,
    selfDriveRate: 105000,
    powerHp: 631,
    maxHpScale: 1000,
    zeroToHundred: '2.9s',
    topSpeed: '325 km/h',
    acousticNote: '8,500 RPM Naturally Aspirated V10 Scream',
    engineType: 'v10-screamer',
    transmission: '7-Speed LDF Dual-Clutch',
    seats: 2,
    hotspots: [
      {
        id: 'y-aero',
        x: 23,
        y: 68,
        label: 'Ypsilon Front Aero Splitter',
        spec: '5x Aero Efficiency vs Gen-1',
        detail: 'Integrated air curtain channels airflow cleanly under the flat carbon floor.',
      },
      {
        id: 'ldvi',
        x: 50,
        y: 52,
        label: 'LDVI Predictive Brain',
        spec: 'Strada · Sport · Corsa',
        detail: 'Lamborghini Dinamica Veicolo Integrata anticipates driver input in real time.',
      },
      {
        id: 'v10',
        x: 75,
        y: 56,
        label: '5.2L Naturally Aspirated V10',
        spec: '640 CV @ 8,000 RPM',
        detail: 'Titanium intake valves and high-mounted twin exhaust outlets.',
      },
    ],
  },
]

export function InteractiveStudioStage({
  cars,
  eyebrow = 'INTERACTIVE ATELIER · TAP HOTSPOTS TO INSPECT',
  title = 'Bespoke Studio Stage',
  onQuickBookCar,
}: {
  cars: CarDetails[]
  eyebrow?: string
  title?: string
  onQuickBookCar: (car: CarDetails, mode: 'chauffeur' | 'selfdrive') => void
}) {
  const cmsFeatured = cars.filter((c) => c.featuredInStudioStage)

  const mergeCarIntoMachine = (base: StudioMachine | undefined, car: CarDetails): StudioMachine => {
    const customHotspots: Hotspot[] | undefined = car.studioHotspots?.map((h, i) => ({
      id: h.id || `spot-${i + 1}`,
      x: h.x,
      y: h.y,
      label: h.label,
      spec: h.specBadge,
      detail: h.detail,
    }))
    return {
      slug: car.slug,
      brand: car.brand.toUpperCase(),
      model: base?.model || car.name,
      tagline: car.tagline || base?.tagline || `${car.specs.year} Concierge Flagship`,
      src: car.src || base?.src || '/studio/rolls-royce-phantom.webp?v=5',
      imageAlt: car.imageAlt,
      category: base?.category || car.category.toUpperCase(),
      chauffeurRate: car.price || base?.chauffeurRate || 185000,
      selfDriveRate: car.selfDrivePrice || base?.selfDriveRate || Math.round((car.price || 185000) * 0.85),
      powerHp: car.powerHp || base?.powerHp || 563,
      maxHpScale: base?.maxHpScale || 1000,
      zeroToHundred: car.zeroToHundred || base?.zeroToHundred || '4.2s',
      topSpeed: car.topSpeed || base?.topSpeed || '250 km/h',
      acousticNote: car.acousticNote || base?.acousticNote || `${car.fuel} · ${car.transmission}`,
      engineType: car.engineAudioProfile || base?.engineType || 'v12-whisper',
      transmission: car.transmission || base?.transmission || 'Automatic',
      seats: car.seats || base?.seats || 4,
      hotspots: customHotspots && customHotspots.length > 0 ? customHotspots : base?.hotspots || [],
    }
  }

  const resolvedMachines: StudioMachine[] =
    cmsFeatured.length > 0
      ? cmsFeatured.map((car) => {
          const preset = STUDIO_MACHINES.find((m) => m.slug === car.slug)
          return mergeCarIntoMachine(preset, car)
        })
      : STUDIO_MACHINES.map((preset) => {
          const match = cars.find((c) => c.slug === preset.slug)
          return match ? mergeCarIntoMachine(preset, match) : preset
        })

  const [activeIndex, setActiveIndex] = useState(0)
  const [activeHotspot, setActiveHotspot] = useState<string | null>('grille')
  const [showHotspots, setShowHotspots] = useState(true)
  const [soundActive, setSoundActive] = useState(false)
  const [driveMode, setDriveMode] = useState<'chauffeur' | 'selfdrive'>('chauffeur')
  const [days, setDays] = useState(2)

  const soundRef = useRef<{ stop: () => void; rev: () => void } | null>(null)

  const machine = resolvedMachines[activeIndex] || resolvedMachines[0]
  const activeRate = driveMode === 'selfdrive' ? machine.selfDriveRate : machine.chauffeurRate
  const multiDayDiscount = days >= 7 ? 0.9 : days >= 3 ? 0.95 : 1
  const estimatedTotal = Math.round(activeRate * days * multiDayDiscount)

  const selectedHotspotObj =
    machine.hotspots.find((h) => h.id === activeHotspot) || machine.hotspots[0]

  useEffect(() => {
    if (!soundActive) {
      if (soundRef.current) {
        soundRef.current.stop()
        soundRef.current = null
      }
      return
    }

    if (soundRef.current) {
      soundRef.current.stop()
    }
    soundRef.current = playEngineAcoustic(machine.engineType)

    return () => {
      if (soundRef.current) {
        soundRef.current.stop()
        soundRef.current = null
      }
    }
  }, [soundActive, activeIndex, machine.engineType])

  const handleSelectMachine = (idx: number) => {
    setActiveIndex(idx)
    setActiveHotspot(resolvedMachines[idx]?.hotspots[0]?.id || null)
    if (soundActive && soundRef.current) {
      soundRef.current.rev()
    }
  }

  const handleReserve = () => {
    const matchedCar =
      cars.find((c) => c.slug === machine.slug) ||
      cars.find((c) => c.name.toLowerCase().includes(machine.model.toLowerCase())) ||
      cars[0]
    if (matchedCar) {
      onQuickBookCar(matchedCar, driveMode)
    }
  }

  return (
    <section
      id="interactive-studio"
      className="relative bg-[#040405] py-20 md:py-28 px-4 md:px-[4vw] border-t border-white/8 overflow-hidden"
      aria-label="Interactive Flagship Studio Configurator"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Header & Interactive Mode Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a96e]/10 border border-[#c9a96e]/30 mb-3">
              <Sparkles className="w-3 h-3 text-[#c9a96e]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#c9a96e]">
                {eyebrow}
              </span>
            </div>
            <h2 className="font-luxury text-[clamp(2rem,4.4vw,3.8rem)] font-extralight uppercase leading-none tracking-[0.02em] text-[#f4efe6]">
              {title}
            </h2>
          </div>

          {/* Machine Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {resolvedMachines.map((item, idx) => {
              const isSelected = idx === activeIndex
              return (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => handleSelectMachine(idx)}
                  className={`px-4 py-2.5 rounded-full text-[11px] font-mono uppercase tracking-[0.18em] whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#ebebea] text-[#111111] border-[#ebebea] font-bold shadow-[0_0_25px_rgba(235,235,234,0.2)]'
                      : 'bg-[#0c0c10] text-white/60 border-white/12 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {item.model}
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Split Interactive Stage: Left Cyclorama Canvas (7 cols) + Right Telemetry & Configurator (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT: Seamless #ebebea Light-Grey Cyclorama Studio Card with Overlaid Header & Interactive Hotspots */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-[26px] bg-[#ebebea] overflow-hidden relative shadow-2xl">
            {/* Vehicle Stage with Overlaid Top Header (Matches CarCard: Zero Horizontal Seam) */}
            <div className="relative w-full aspect-[16/10] bg-[#ebebea] flex-1 min-h-[240px] sm:min-h-[290px]">
              {/* Top Bar Overlaid Inside Light-Grey Studio Stage */}
              <div className="absolute top-4 left-4 right-4 sm:top-7 sm:left-9 sm:right-9 z-20 flex items-start justify-between gap-3 sm:gap-4 pointer-events-none">
                <div className="min-w-0">
                  <motion.p
                    key={`brand-${machine.slug}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-luxury text-[10px] sm:text-xs uppercase tracking-[0.26em] sm:tracking-[0.3em] text-[#7a6440] font-medium truncate"
                  >
                    {machine.brand}
                  </motion.p>
                  <motion.h3
                    key={`model-${machine.slug}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="font-luxury mt-0.5 text-2xl sm:text-5xl font-light tracking-[-0.02em] text-[#111111] truncate"
                  >
                    {machine.model}
                  </motion.h3>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto pt-0.5 shrink-0">
                  {/* Toggle Hotspot Pins Button */}
                  <button
                    type="button"
                    onClick={() => setShowHotspots((v) => !v)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/8 hover:bg-black/15 text-[10px] font-mono uppercase tracking-[0.18em] text-[#222] transition cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>{showHotspots ? 'Hide Pins' : 'Show Pins'}</span>
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={machine.slug}
                  initial={{ opacity: 0, scale: 0.96, x: 24 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.97, x: -24 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={machine.src}
                    alt={buildVehicleAlt({
                      imageAlt: machine.imageAlt,
                      brand: machine.brand,
                      name: machine.model,
                      category: machine.category,
                      context: 'Interactive Studio Stage',
                    })}
                    fill
                    unoptimized
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover object-bottom select-none"
                  />

                  {/* Interactive Hotspot Pins on the Car */}
                  {showHotspots &&
                    machine.hotspots.map((spot, idx) => {
                      const isActive = selectedHotspotObj?.id === spot.id
                      return (
                        <button
                          key={spot.id}
                          type="button"
                          onClick={() => {
                            setActiveHotspot(spot.id)
                            if (soundActive && soundRef.current) {
                              soundRef.current.rev()
                            }
                          }}
                          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                          aria-label={`Inspect ${spot.label}`}
                          className="group/pin absolute -translate-x-1/2 -translate-y-1/2 z-30 p-1.5 cursor-pointer focus:outline-none"
                        >
                          <span
                            className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-300 ${
                              isActive
                                ? 'bg-[#111111] text-[#ebebea] scale-115 shadow-[0_0_0_6px_rgba(17,17,17,0.2)]'
                                : 'bg-[#111111]/80 text-white hover:scale-110'
                            }`}
                          >
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8c734b] opacity-40" />
                            {isActive ? (
                              <Check className="w-3.5 h-3.5 text-[#c9a96e]" />
                            ) : (
                              <Plus className="w-3.5 h-3.5" />
                            )}
                          </span>
                          <span className="hidden sm:inline-block ml-2 px-2.5 py-0.5 rounded-full bg-[#111111]/90 text-[#f4efe6] text-[9px] font-mono uppercase tracking-[0.18em] whitespace-nowrap shadow-md">
                            0{idx + 1} · {spot.label.split(' ')[0]}
                          </span>
                        </button>
                      )
                    })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Hotspot Inspector Drawer Inside the Studio Stage */}
            <div className="relative z-20 mx-3 mb-3 sm:mx-5 sm:mb-5 p-4 sm:p-5 rounded-2xl bg-[#111114]/95 backdrop-blur-md text-white border border-white/10 flex flex-col gap-3">
              {/* Top Mini Switcher + Acoustic Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {machine.hotspots.map((spot, idx) => {
                    const isSelectedSpot = selectedHotspotObj.id === spot.id
                    return (
                      <button
                        key={spot.id}
                        type="button"
                        onClick={() => {
                          setActiveHotspot(spot.id)
                          if (soundActive && soundRef.current) {
                            soundRef.current.rev()
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase tracking-[0.18em] transition cursor-pointer border ${
                          isSelectedSpot
                            ? 'bg-[#c9a96e] text-black border-[#c9a96e] font-bold'
                            : 'bg-white/[0.04] text-white/60 border-white/10 hover:text-white'
                        }`}
                      >
                        0{idx + 1} · {spot.label.split(' ')[0]}
                      </button>
                    )
                  })}
                </div>

                {/* Acoustic Toggle + Rev Burst Trigger */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSoundActive((s) => !s)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[10px] font-mono uppercase tracking-[0.18em] transition cursor-pointer ${
                      soundActive
                        ? 'bg-[#c9a96e]/15 border-[#c9a96e] text-[#c9a96e]'
                        : 'bg-white/[0.04] border-white/12 text-white/70 hover:text-white'
                    }`}
                  >
                    {soundActive ? (
                      <Volume2 className="w-3.5 h-3.5 text-[#c9a96e]" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5" />
                    )}
                    <span>{soundActive ? 'Acoustic Active' : 'Acoustic Profile'}</span>
                    <span className="flex items-end gap-0.5 h-3">
                      {[0.4, 0.9, 0.6, 1, 0.5].map((h, i) => (
                        <motion.span
                          key={i}
                          animate={
                            soundActive
                              ? {
                                  height: ['25%', `${h * 100}%`, '35%', `${h * 90}%`],
                                }
                              : { height: '25%' }
                          }
                          transition={
                            soundActive
                              ? { duration: 0.6 + i * 0.1, repeat: Infinity, ease: 'easeInOut' }
                              : { duration: 0.2 }
                          }
                          className="w-0.5 bg-[#c9a96e] rounded-full"
                        />
                      ))}
                    </span>
                  </button>

                  {soundActive && (
                    <button
                      type="button"
                      onClick={() => soundRef.current?.rev()}
                      className="px-3 py-2 rounded-xl bg-[#c9a96e] hover:bg-[#dfc288] text-black font-bold text-[10px] font-mono uppercase tracking-[0.18em] transition cursor-pointer shadow-[0_0_15px_rgba(201,169,110,0.28)]"
                    >
                      Rev
                    </button>
                  )}
                </div>
              </div>

              {/* Unclipped Full Hotspot Engineering Detail */}
              <div className="min-w-0 pt-1 border-t border-white/8">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#c9a96e]/20 text-[#c9a96e] text-[9px] font-mono uppercase tracking-[0.2em]">
                    {selectedHotspotObj.spec}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-[0.14em] text-white/95">
                    {selectedHotspotObj.label}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-white/65 leading-relaxed">
                  {selectedHotspotObj.detail}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Live Telemetry & Interactive Instant Lease Calculator (5 cols) */}
          <div className="lg:col-span-5 rounded-[26px] bg-[#0b0b0f] border border-white/10 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Machine Tag & Acoustic Note */}
              <div className="flex items-center justify-between gap-2 pb-5 border-b border-white/8">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#c9a96e]">
                    {machine.category}
                  </span>
                  <h4 className="mt-1 text-lg font-light text-[#f4efe6]">{machine.tagline}</h4>
                </div>
                <Gauge className="w-5 h-5 text-[#c9a96e] shrink-0" />
              </div>

              {/* Animated Telemetry Progress Bars */}
              <div className="py-5 space-y-4 border-b border-white/8">
                <div>
                  <div className="flex justify-between text-[11px] font-mono uppercase tracking-[0.18em] mb-1.5">
                    <span className="text-white/50">Power Output</span>
                    <span className="text-[#f4efe6] font-semibold">{machine.powerHp} BHP</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
                    <motion.div
                      key={`hp-${machine.slug}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (machine.powerHp / machine.maxHpScale) * 100)}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-[#8c734b] to-[#dfC288]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-1">
                  <div className="rounded-xl bg-white/[0.03] border border-white/8 p-3">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 block">
                      0–100 km/h
                    </span>
                    <span className="mt-1 text-base font-mono font-semibold text-[#f4efe6] block">
                      {machine.zeroToHundred}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/8 p-3">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 block">
                      Top Speed
                    </span>
                    <span className="mt-1 text-base font-mono font-semibold text-[#f4efe6] block">
                      {machine.topSpeed}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/8 p-3 col-span-2 sm:col-span-1">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 block">
                      Seating
                    </span>
                    <span className="mt-1 text-base font-mono font-semibold text-[#f4efe6] block">
                      {machine.seats} Guests
                    </span>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/8 p-3 col-span-2">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 block">
                      Transmission
                    </span>
                    <span className="mt-1 text-xs font-mono font-medium text-[#f4efe6] block truncate">
                      {machine.transmission}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/8 p-3 col-span-2 sm:col-span-1">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40 block">
                      FASTag &amp; KYC
                    </span>
                    <span className="mt-1 text-xs font-mono font-medium text-[#c9a96e] block">
                      Active
                    </span>
                  </div>
                </div>

                {soundActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="rounded-xl bg-[#c9a96e]/10 border border-[#c9a96e]/30 px-3.5 py-2.5 text-[11px] font-mono text-[#c9a96e]"
                  >
                    {machine.acousticNote}
                  </motion.div>
                )}
              </div>

              {/* Interactive Configuration: Chauffeur vs Self-Drive + Duration Slider */}
              <div className="py-5 space-y-5">
                {/* Mode Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-white/45">
                      1. Select Protocol
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#c9a96e]">
                      {driveMode === 'selfdrive' ? 'Save ~15% Self-Drive' : 'Uniformed Chauffeur'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 bg-black p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setDriveMode('chauffeur')}
                      className={`py-2.5 rounded-lg text-[11px] font-mono uppercase tracking-[0.18em] transition cursor-pointer ${
                        driveMode === 'chauffeur'
                          ? 'bg-[#c9a96e] text-black font-bold'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Chauffeur Driven
                    </button>
                    <button
                      type="button"
                      onClick={() => setDriveMode('selfdrive')}
                      className={`py-2.5 rounded-lg text-[11px] font-mono uppercase tracking-[0.18em] transition cursor-pointer ${
                        driveMode === 'selfdrive'
                          ? 'bg-[#c9a96e] text-black font-bold'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Self-Drive
                    </button>
                  </div>
                </div>

                {/* Interactive Duration Slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-white/45">
                      2. Charter Duration
                    </span>
                    <span className="text-xs font-mono font-bold text-[#f4efe6]">
                      {days} {days === 1 ? 'Day' : 'Days'}
                      {days >= 7 ? ' (10% Privé Privilege)' : days >= 3 ? ' (5% Privilege)' : ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={14}
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    aria-label="Charter duration in days"
                    className="w-full accent-[#c9a96e] cursor-pointer h-1.5 bg-white/15 rounded-lg"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-white/35 mt-1">
                    <span>1 Day</span>
                    <span>3 Days (-5%)</span>
                    <span>7 Days (-10%)</span>
                    <span>14 Days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Live Quote & 1-Click Reserve Button */}
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-white/45 block">
                    Estimated Privilege Tariff
                  </span>
                  <span className="text-[11px] text-white/40 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#c9a96e]" />
                    100 km/day · Doorstep Flatbed / Chauffeur
                  </span>
                </div>
                <div className="text-right">
                  <motion.span
                    key={`${machine.slug}-${driveMode}-${days}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-3xl font-mono font-bold text-[#f4efe6] block"
                  >
                    ₹{estimatedTotal.toLocaleString('en-IN')}
                  </motion.span>
                  <span className="text-[10px] font-mono text-[#c9a96e]">
                    ₹{activeRate.toLocaleString('en-IN')} / day base
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReserve}
                className="w-full min-h-[50px] rounded-xl bg-[#c9a96e] hover:bg-[#dfc288] text-black font-bold text-xs font-mono uppercase tracking-[0.22em] flex items-center justify-center gap-2 transition cursor-pointer shadow-[0_10px_30px_rgba(201,169,110,0.25)]"
              >
                <span>Lock {machine.model} Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <Link
                href={`/cars/${machine.slug}`}
                className="mt-2.5 w-full py-2.5 rounded-xl border border-white/10 hover:border-[#c9a96e]/40 text-[10px] font-mono uppercase tracking-[0.22em] text-white/65 hover:text-[#c9a96e] flex items-center justify-center gap-1.5 transition"
              >
                <span>View Full Vehicle Dossier</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

