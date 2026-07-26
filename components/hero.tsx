'use client'

import Image from "next/image"
import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "motion/react"

export default function Hero({ videoUrl }: { videoUrl?: string }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(textRef, { once: true })

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  // Parallax zoom: image scales from 1.0 to 1.2 as user scrolls
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
  // Overlay fades darker as user scrolls
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 0.8])
  // Text moves up as user scrolls for parallax depth
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100])

  const scrollToBooking = () => {
    const element = document.getElementById('book-now')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Letter-by-letter animation for the heading
  const headingLine1 = "The Art of"
  const headingLine2 = "Luxury"

  return (
    <section
      ref={heroRef}
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-black"
    >
      {/* Parallax Background Image */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ scale: imageScale }}
      >
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            src={videoUrl}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <Image
            src="/rolls-royce-phantom-night.png"
            alt="Luxury Rolls Royce Phantom at night - DRIVEIT premium fleet"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        )}
      </motion.div>

      {/* Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20"
        style={{ opacity: overlayOpacity }}
      />

      {/* Additional bottom gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

      {/* Film Grain Overlay */}
      <div className="grain-overlay absolute inset-0 pointer-events-none" />

      {/* Hero Content */}
      <motion.div
        ref={textRef}
        className="relative z-10 flex h-full flex-col items-center justify-end pb-24 md:pb-32 px-4"
        style={{ y: textY }}
      >
        {/* Gold accent line */}
        <motion.div
          className="mb-6 h-px w-16 bg-gradient-to-r from-transparent via-[var(--gold-400)] to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={isInView ? { width: 64, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Subtitle */}
        <motion.p
          className="mb-4 text-xs md:text-sm tracking-[0.3em] uppercase text-white/60 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Premium Luxury Transportation
        </motion.p>

        {/* Main Heading - Staggered letter animation */}
        <div className="text-center">
          <h1 className="font-[family-name:var(--font-playfair)] font-bold leading-[1.1]">
            {/* Line 1 */}
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-1">
              {headingLine1.split("").map((char, i) => (
                <motion.span
                  key={`l1-${i}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + i * 0.03,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </span>

            {/* Line 2 - Gold gradient */}
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-shimmer-gold">
              {headingLine2.split("").map((char, i) => (
                <motion.span
                  key={`l2-${i}`}
                  className="inline-block"
                  initial={{ opacity: 0, y: 40, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.7 + i * 0.05,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h1>
        </div>

        {/* Description */}
        <motion.p
          className="mt-6 max-w-md text-center text-sm md:text-base text-white/70 font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          Experience elegance and innovation with Hyderabad&apos;s finest fleet.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          onClick={scrollToBooking}
          className="mt-8 group relative overflow-hidden rounded-full px-8 md:px-10 py-3.5 md:py-4 text-sm md:text-base font-semibold text-black bg-[var(--gold-400)] cursor-pointer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 1.4, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Shimmer overlay on hover */}
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative z-10">Book Your Ride</span>

        </motion.button>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/40">Scroll</span>
        <motion.div
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-[var(--gold-400)]"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}