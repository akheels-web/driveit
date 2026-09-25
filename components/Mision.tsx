'use client'

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "motion/react"

export default function Mision({
  badge = 'Who We Are',
  title = 'Our Mission',
  text = 'DRIVEIT Luxury aims to be the world’s leading luxury mobility platform, offering unmatched service, exclusivity, and innovation. We redefine ultra-luxury travel with cutting-edge technology, global partnerships, and personalized experiences—setting new standards in premium lifestyle and elite mobility.',
  imageSrc = '/luxury-flagship-cars-in-black-studio.png',
}: {
  badge?: string
  title?: string
  text?: string
  imageSrc?: string
} = {}) {
  const textRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(textRef, { once: true, margin: "0px 0px -80px 0px" })

  return (
    <section className="relative bg-black text-white overflow-hidden gpu-layer">
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px] w-full">
        {/* Background Image (Hardware Accelerated, Smooth Native Scrolling) */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={imageSrc}
            alt="DRIVEIT Luxury fleet lineup Hyderabad"
            fill
            className="object-cover object-center"
            loading="lazy"
            sizes="100vw"
            unoptimized={imageSrc.startsWith('http')}
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

        {/* Mission Content at Bottom */}
        <div className="absolute inset-0 flex items-end justify-center px-4 md:px-6 pb-12 md:pb-16">
          <div ref={textRef} className="text-center w-full max-w-4xl mx-auto">
            {/* Gold divider */}
            <motion.div
              className="mx-auto mb-4 h-px bg-gradient-to-r from-transparent via-[var(--gold-400)] to-transparent"
              initial={{ width: 0, opacity: 0 }}
              animate={isInView ? { width: 80, opacity: 1 } : {}}
              transition={{ duration: 0.8 }}
            />

            <motion.span
              className="text-xs tracking-[0.25em] uppercase text-white/40"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {badge}
            </motion.span>

            <motion.h2
              className="mt-3 text-3xl md:text-4xl font-[family-name:var(--font-playfair)] font-semibold text-white"
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {title.includes('Mission') ? (
                <>
                  Our <span className="text-gradient-gold">Mission</span>
                </>
              ) : (
                <span className="text-gradient-gold">{title}</span>
              )}
            </motion.h2>

            <motion.p
              className="mt-4 text-sm md:text-base lg:text-lg leading-relaxed font-light text-white/70 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              {text}
            </motion.p>

            {/* Learn More Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-[var(--gold-400)] hover:text-[var(--gold-200)] transition-colors duration-300 group min-h-[44px]"
              >
                Learn More
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}