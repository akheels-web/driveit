'use client'

import { motion } from 'motion/react'
import { Star } from 'lucide-react'

const publications = [
  "Forbes",
  "GQ",
  "Vogue",
  "Business Insider",
  "The New York Times"
]

export function TrustStrip() {
  return (
    <section className="bg-black border-y border-white/5 py-8 md:py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Google Reviews Badge */}
        <div className="flex flex-col items-center justify-center mb-8 md:mb-12">
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-5 h-5 text-[var(--gold-400)] fill-[var(--gold-400)]" />
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold text-white text-lg">4.9/5</span>
            <span className="text-white/50">Based on 1,200+ Google Reviews</span>
          </div>
        </div>

        {/* Featured In Logos */}
        <div className="text-center">
          <p className="text-xs text-white/30 uppercase tracking-[0.2em] mb-6">Trusted By & Featured In</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
            {publications.map((pub, index) => (
              <div 
                key={index}
                className="font-[family-name:var(--font-playfair)] text-xl md:text-3xl font-bold tracking-tight text-white/80"
              >
                {pub}
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  )
}
