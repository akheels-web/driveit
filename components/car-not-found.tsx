'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import {
  Home,
  Car,
  Search,
  PhoneCall,
  Crown,
  Plane,
  HeartHandshake,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react'

export function CarNotFound() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/cars?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/cars')
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white flex flex-col justify-start items-center px-4 sm:px-6 pt-36 sm:pt-44 pb-16 sm:pb-24 overflow-hidden selection:bg-[var(--gold-400)] selection:text-black">
      {/* ─────────────────────────────────────────────────────────────
          1. BACKGROUND ATMOSPHERE: RADIAL GOLD GLOWS & MESH
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft ambient gold glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.06)_0%,transparent_70%)]" />

        {/* Perspective Highway Grid Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-64 opacity-20 [mask-image:linear-gradient(to_bottom,transparent,black)]">
          <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [transform:perspective(500px)_rotateX(60deg)] origin-bottom" />
        </div>

        {/* Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px]" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CONTENT STACK (PERFECTLY ALIGNED)
          ───────────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-3xl w-full mx-auto flex flex-col items-center text-center space-y-6 sm:space-y-8">
        
        {/* 1. Status Indicator Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/80 border border-[var(--gold-400)]/35 shadow-[0_0_20px_rgba(212,175,55,0.12)] backdrop-blur-xl"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] sm:text-xs font-mono text-[var(--gold-300)] uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[var(--gold-400)]" />
            Route Unmapped • 404 Engine Idle
          </span>
        </motion.div>

        {/* 2. Cockpit Speedometer 404 Display */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center justify-center space-y-1"
        >
          {/* Digital 404 Gauge */}
          <div className="flex items-center justify-center gap-3">
            <div className="px-2.5 py-1 rounded bg-black/80 border border-white/10 text-[10px] font-mono tracking-widest text-[var(--gold-400)] font-bold">
              GEAR P
            </div>
            <span className="text-6xl sm:text-8xl font-[family-name:var(--font-playfair)] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-[var(--gold-400)] tracking-tight drop-shadow-[0_8px_25px_rgba(0,0,0,0.9)]">
              404
            </span>
            <div className="px-2.5 py-1 rounded bg-black/80 border border-white/10 text-[10px] font-mono tracking-widest text-zinc-400">
              0 KM/H
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-[family-name:var(--font-playfair)] font-bold text-white tracking-tight">
            You&apos;ve Drifted Off <span className="text-gradient-gold">The Luxury Circuit.</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-xl mx-auto leading-relaxed pt-1">
            The page or vehicle dossier you requested does not exist or has been relocated to our private hangar. Let&apos;s get you back on course.
          </p>
        </motion.div>

        {/* 3. Cinematic 16:9 Luxury Fleet Showcase (Feathered Edges) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-xl"
        >
          <div
            className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.1)] group"
            style={{ position: 'relative' }}
          >
            <Image
              src="/luxury-404-cars.jpg"
              alt="DRIVEIT Flagship Luxury Fleet Bugatti and Rolls-Royce"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              priority
              sizes="(max-width: 768px) 100vw, 600px"
            />
            {/* Multi-layered soft vignette so image seamlessly fades into black */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(5,5,5,0.6)_100%)] pointer-events-none" />
            
            {/* Subtle Car Badge Tag */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white/70 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10">
              <span>DRIVEIT PRIVATE FLEET</span>
              <span className="text-[var(--gold-400)] font-semibold">HYDERABAD VIP</span>
            </div>
          </div>
        </motion.div>

        {/* 4. Live Garage Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-lg"
        >
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search garage (Rolls-Royce, Maybach, Defender)..."
              className="w-full h-12 sm:h-13 pl-11 pr-24 rounded-xl bg-zinc-900/90 border border-zinc-700/80 text-white placeholder-zinc-400 text-xs sm:text-sm focus:outline-none focus:border-[var(--gold-400)] focus:ring-2 focus:ring-[var(--gold-400)]/20 shadow-lg transition-all"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-4 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg text-xs font-bold bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-400)] text-black hover:brightness-110 transition-all cursor-pointer flex items-center justify-center"
            >
              Search
            </button>
          </form>
        </motion.div>

        {/* 5. Aligned Action Buttons (Exact Same Height & Baseline) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md"
        >
          <Link
            href="/"
            className="w-full sm:w-1/2 h-12 inline-flex items-center justify-center gap-2 px-5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[var(--gold-500)] via-[var(--gold-400)] to-[var(--gold-300)] text-black shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_6px_30px_rgba(212,175,55,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 whitespace-nowrap group"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Return to Home</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/cars"
            className="w-full sm:w-1/2 h-12 inline-flex items-center justify-center gap-2 px-5 rounded-xl font-bold text-xs sm:text-sm bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700/80 hover:border-[var(--gold-400)]/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 whitespace-nowrap shadow-md"
          >
            <Car className="w-4 h-4 text-[var(--gold-400)] shrink-0" />
            <span>Showroom Fleet (50+)</span>
          </Link>
        </motion.div>

        {/* 6. Popular Pitstop Destinations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="pt-4 border-t border-zinc-800/80 w-full max-w-2xl space-y-2.5"
        >
          <p className="text-[11px] uppercase tracking-widest text-zinc-400 font-semibold">
            Or Navigate to a Destination:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/services/airport-taxi"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/70 border border-zinc-800 hover:border-[var(--gold-400)]/40 hover:bg-zinc-800/90 text-xs text-zinc-300 hover:text-white transition"
            >
              <Crown className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              VIP Chauffeur
            </Link>

            <Link
              href="/services/wedding-cars"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/70 border border-zinc-800 hover:border-[var(--gold-400)]/40 hover:bg-zinc-800/90 text-xs text-zinc-300 hover:text-white transition"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              Wedding Convoys
            </Link>

            <Link
              href="/services/private-jet-services"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/70 border border-zinc-800 hover:border-[var(--gold-400)]/40 hover:bg-zinc-800/90 text-xs text-zinc-300 hover:text-white transition"
            >
              <Plane className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              Private Jets
            </Link>

            <a
              href="https://wa.me/916300041186"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs text-emerald-400 transition"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              WhatsApp Concierge
            </a>

            <a
              href="tel:+916300041186"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/70 border border-zinc-800 hover:border-[var(--gold-400)]/40 hover:bg-zinc-800/90 text-xs text-zinc-300 hover:text-[var(--gold-400)] transition"
            >
              <PhoneCall className="w-3 h-3 text-[var(--gold-400)]" />
              +91 63000 41186
            </a>
          </div>
        </motion.div>

        {/* 7. Footer Status */}
        <div className="pt-2 flex items-center justify-center gap-3 text-[10px] font-mono text-zinc-400">
          <span>HYDERABAD HQ</span>
          <span>•</span>
          <span>RADAR: 24/7 STANDBY</span>
          <span>•</span>
          <span className="text-[var(--gold-400)]">DRIVEIT LUXURY</span>
        </div>

      </div>
    </div>
  )
}
