"use client"

import React, { useRef } from 'react'
import { Phone, Calendar } from 'lucide-react'
import { motion, useInView } from "motion/react"

export function About() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" })

  const handleCall = () => {
    window.location.href = 'tel:+918341341186'
  }

  return (
    <section ref={ref} className="bg-[var(--luxury-bg)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">

        {/* Call to Action Banner */}
        <motion.div
          className="relative rounded-2xl overflow-hidden mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            border: '1px solid rgba(212, 175, 55, 0.3)',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(20,20,20,1) 40%, rgba(20,20,20,1) 60%, rgba(212,175,55,0.06) 100%)',
          }}
        >
          {/* Gold accent glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[var(--gold-400)] blur-[150px] opacity-[0.1]" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-[var(--gold-400)] blur-[150px] opacity-[0.07]" />

          <div className="relative p-8 md:p-14 text-center max-w-3xl mx-auto">
            <motion.h4
              className="text-2xl md:text-4xl font-[family-name:var(--font-playfair)] font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Ready to Experience <span className="text-gradient-gold">Luxury?</span>
            </motion.h4>
            <motion.p
              className="text-base md:text-lg text-white/60 mb-10 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Contact us today to book your premium transportation service. Our team is ready to make your journey exceptional.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* Primary CTA — Call Now */}
              <motion.button
                onClick={handleCall}
                className="flex items-center justify-center gap-2.5 text-black px-10 py-4 rounded-full text-base font-bold cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, var(--gold-300), var(--gold-400), var(--gold-500))',
                  boxShadow: '0 4px 25px rgba(212, 175, 55, 0.35), 0 0 0 1px rgba(212, 175, 55, 0.2)',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 6px 35px rgba(212, 175, 55, 0.5), 0 0 0 1px rgba(212, 175, 55, 0.4)',
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Phone className="w-5 h-5" />
                Call Now: +91 83413 41186
              </motion.button>

              {/* Secondary CTA — Contact Us */}
              <motion.button
                onClick={() => window.location.href = '/cars'}
                className="flex items-center justify-center gap-2.5 px-10 py-4 rounded-full text-base font-semibold cursor-pointer"
                style={{
                  color: 'var(--gold-400)',
                  border: '2px solid var(--gold-400)',
                  background: 'rgba(212, 175, 55, 0.08)',
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: 'rgba(212, 175, 55, 0.15)',
                  boxShadow: '0 0 25px rgba(212, 175, 55, 0.15)',
                }}
                whileTap={{ scale: 0.97 }}
              >
                <Calendar className="w-5 h-5" />
                Book Online
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs tracking-[0.25em] uppercase text-white/40">Find Us</span>
          <h3 className="mt-2 text-3xl md:text-4xl font-[family-name:var(--font-playfair)] font-semibold text-white">
            Visit Our <span className="text-gradient-gold">Location</span>
          </h3>
        </motion.div>

        {/* Google Maps — Visible and clear */}
        <motion.div
          className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden border-glow-gold"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.2137599390176!2d78.4565279!3d17.4015263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb97844e874967%3A0xec0fefe2fefa1e15!2sDriveit%20-%20Selfdrive%20Cars%20-%20Luxury%20Wedding%20Cars%20-%20Cabs%20for%20outstation%20-%20Luxury%20Buses!5e0!3m2!1sen!2sin!4v1756574982222!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="DRIVEIT Location - Hyderabad"
          />

          {/* Very light tint — map is clearly visible */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

          {/* Map Overlay Info */}
          <div className="absolute bottom-4 left-4 bg-black/80 border border-[var(--gold-400)]/30 backdrop-blur-md px-4 py-2.5 rounded-lg pointer-events-none">
            <p className="text-xs text-[var(--gold-400)] font-medium">
              📍 DRIVEIT — Luxury Transportation, Hyderabad
            </p>
          </div>

          {/* Fullscreen button */}
          <motion.button
            onClick={() => window.open('https://maps.app.goo.gl/z6g9rBdGoT1gzxku8', '_blank')}
            className="absolute bottom-4 right-4 glass-gold px-4 py-2.5 rounded-lg text-white text-sm flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open in Maps
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}