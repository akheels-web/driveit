"use client"

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence, useInView } from "motion/react"
import { TestimonialView, testimonialSeed } from "@/lib/content-seed"

function TestimonialCard({ testimonial }: { testimonial: TestimonialView }) {
  return (
    <div className="h-full flex flex-col justify-between p-7 rounded-2xl bg-zinc-950/80 border border-white/[0.08] hover:border-[var(--gold-400)]/30 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 shadow-[0_12px_32px_rgba(0,0,0,0.45)] group">
      <div>
        {/* Rating and Quote Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1.5">
            {[...Array(testimonial.rating || 5)].map((_, idx) => (
              <Star
                key={idx}
                className="w-4 h-4 fill-[var(--gold-400)] text-[var(--gold-400)]"
              />
            ))}
            <span className="ml-1.5 text-xs font-semibold text-[var(--gold-400)] tracking-wide">
              5.0
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[var(--gold-400)] group-hover:bg-[var(--gold-400)]/10 transition-colors">
            <Quote className="w-4 h-4 opacity-80" />
          </div>
        </div>

        {/* Quote Body */}
        <p className="text-sm md:text-[15px] text-zinc-300 leading-relaxed font-light mb-6">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>

      {/* Client Profile */}
      <div className="flex items-center justify-between pt-5 border-t border-white/[0.06] mt-auto">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border border-white/15 bg-zinc-900 shrink-0">
            {testimonial.image && testimonial.image !== '/placeholder-user.jpg' ? (
              <Image
                src={testimonial.image}
                alt={`${testimonial.name} client testimonial`}
                fill
                sizes="44px"
                loading="lazy"
                className="object-cover"
                unoptimized={testimonial.image.startsWith('http')}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[var(--gold-400)]/20 to-zinc-900 text-[var(--gold-300)] font-bold text-sm">
                {testimonial.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium text-white tracking-wide">{testimonial.name}</h4>
            <p className="text-xs text-zinc-400 line-clamp-1">{testimonial.role}</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] text-[var(--gold-400)] font-medium shrink-0 bg-[var(--gold-400)]/10 px-2.5 py-1 rounded-full border border-[var(--gold-400)]/20">
          <CheckCircle2 className="w-3 h-3" />
          <span>Verified</span>
        </div>
      </div>
    </div>
  )
}

/** Luxury editorial client reviews showcase */
export default function Testimonials({
  testimonials = testimonialSeed,
}: {
  testimonials?: TestimonialView[]
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" })
  const [currentPage, setCurrentPage] = useState(0)

  if (!testimonials || testimonials.length === 0) return null

  // Group into pages of 3 reviews each
  const pageSize = 3
  const totalPages = Math.ceil(testimonials.length / pageSize)
  const currentReviews = testimonials.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  )

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0))
  }

  return (
    <section ref={ref} className="bg-[var(--luxury-bg)] text-white py-16 md:py-24 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Nav Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold-400)]/10 border border-[var(--gold-400)]/20 text-[var(--gold-400)] text-xs font-medium uppercase tracking-[0.2em] mb-3">
              <span>Client Reflections</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white">
              Echoes of <span className="text-gradient-gold">Excellence</span>
            </h2>
            <p className="mt-3 text-sm md:text-base text-zinc-400 max-w-xl font-light">
              Distinguished perspectives from executive leaders, private families, and celebrated wedding occasions across Hyderabad.
            </p>
          </motion.div>

          {/* Navigation & Counter (only when more than 3 reviews) */}
          {totalPages > 1 && (
            <motion.div 
              className="flex items-center gap-3 shrink-0 self-start md:self-end"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-xs tracking-wider text-zinc-400 font-mono pr-2">
                <span className="text-white font-semibold">{currentPage + 1}</span>
                <span className="mx-1 text-zinc-600">/</span>
                <span>{totalPages}</span>
              </div>
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous reviews"
                className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[var(--gold-400)]/40 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next reviews"
                className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[var(--gold-400)]/40 text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </div>

        {/* 3-Card Tranquil Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentReviews.map((testimonial, idx) => (
              <TestimonialCard key={`${testimonial.name}-${idx}`} testimonial={testimonial} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Trust Stat Bar */}
        <motion.div
          className="mt-12 pt-8 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-400 font-light"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            <span className="text-zinc-300">100% Verified Guest & Corporate Experiences</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-[var(--gold-400)] transition-colors">4.9/5 Average Rating</span>
            <span className="text-zinc-600">•</span>
            <span className="hover:text-[var(--gold-400)] transition-colors">24/7 Dedicated Concierge Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}