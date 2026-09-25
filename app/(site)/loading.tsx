import React from 'react'

export default function Loading() {
  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#050505] text-white transition-opacity duration-300"
      aria-label="Loading DRIVEIT Luxury"
      role="status"
    >
      {/* Background ambient gold glow */}
      <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-[var(--gold-400)]/5 blur-[120px] pointer-events-none" />

      {/* Luxury Concentric Spinner / Radar */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer slow ring */}
        <div
          className="w-24 h-24 md:w-28 md:h-28 rounded-full border border-[var(--gold-400)]/20 animate-spin pointer-events-none"
          style={{ animationDuration: '8s' }}
        />

        {/* Middle pulsing ring */}
        <div
          className="absolute w-18 h-18 md:w-20 md:h-20 rounded-full border border-t-[var(--gold-400)] border-r-transparent border-b-[var(--gold-400)]/40 border-l-transparent animate-spin"
          style={{ animationDuration: '1.8s', animationDirection: 'reverse' }}
        />

        {/* Inner fast pulse ring */}
        <div
          className="absolute w-12 h-12 md:w-14 md:h-14 rounded-full border border-t-transparent border-r-[var(--gold-300)] border-b-transparent border-l-[var(--gold-500)] animate-spin"
          style={{ animationDuration: '1s' }}
        />

        {/* Center Golden Monogram Emblem */}
        <div className="absolute w-9 h-9 rounded-full bg-gradient-to-tr from-[var(--gold-600)] via-[var(--gold-400)] to-[var(--gold-200)] flex items-center justify-center text-black font-extrabold text-sm shadow-[0_0_20px_rgba(212,175,55,0.6)]">
          D
        </div>
      </div>

      {/* Brand title & loading text */}
      <div className="text-center space-y-2 relative z-10 px-4">
        <h2 className="text-base md:text-lg font-[family-name:var(--font-playfair)] tracking-[0.3em] uppercase text-white font-medium">
          DRIVEIT <span className="text-[var(--gold-400)]">LUXURY</span>
        </h2>
        <p className="text-[11px] md:text-xs text-white/40 tracking-[0.2em] uppercase font-light">
          Curating Excellence...
        </p>
      </div>

      {/* Bottom high-speed gold loader strip */}
      <div className="w-48 md:w-60 h-[2px] bg-white/10 rounded-full mt-6 overflow-hidden relative">
        <div className="h-full bg-gradient-to-r from-transparent via-[var(--gold-400)] to-transparent w-full animate-[shimmer_1.5s_infinite]" />
      </div>
    </div>
  )
}
