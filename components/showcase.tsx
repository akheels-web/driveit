'use client'

import { useRef } from 'react'
import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "motion/react"

import type { ServiceView } from '@/lib/content-seed'

const defaultSections = [
  {
    title: "Chauffeur Luxury Service",
    desc: "Executive rides with professional chauffeurs, on time and in style.",
    href: "/services/airport-taxi",
    img: "https://i.pinimg.com/736x/68/b9/c2/68b9c2fe5a114be8de36d53873d39041.jpg",
    alt: "Chauffeur luxury car service Hyderabad",
  },
  {
    title: "Luxury Cars",
    desc: "Explore our premium fleet of luxury vehicles.",
    href: "/services/luxury-car-rental",
    img: "https://i.pinimg.com/736x/b7/0a/ea/b70aea52ac1e2b17283c01327323309b.jpg",
    alt: "Premium luxury car rental Hyderabad",
  },
]

export function Showcase({ services }: { services?: ServiceView[] } = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" })

  const chauffeurService = services?.find(
    (s) => s.slug === 'airport-taxi' || s.slug.includes('chauffeur')
  )
  const luxuryCarService = services?.find(
    (s) => s.slug === 'luxury-car-rental'
  )
  const weddingCarService = services?.find(
    (s) => s.slug === 'wedding-cars'
  )

  const cardSections = [
    {
      title: chauffeurService?.title || defaultSections[0].title,
      desc: chauffeurService?.summary || defaultSections[0].desc,
      href: chauffeurService?.href || defaultSections[0].href,
      img: chauffeurService?.image || defaultSections[0].img,
      alt: `${chauffeurService?.title || defaultSections[0].title} Hyderabad`,
    },
    {
      title: luxuryCarService?.title || defaultSections[1].title,
      desc: luxuryCarService?.summary || defaultSections[1].desc,
      href: luxuryCarService?.href || defaultSections[1].href,
      img: luxuryCarService?.image || defaultSections[1].img,
      alt: `${luxuryCarService?.title || defaultSections[1].title} Hyderabad`,
    },
  ]

  const weddingTitle = weddingCarService?.title || "Wedding Cars"
  const weddingDesc = weddingCarService?.summary || "Make your big day unforgettable with our elegant wedding fleet."
  const weddingImg = weddingCarService?.image || "https://i.pinimg.com/736x/09/f9/44/09f944012c94c6a5b75bffa4e11333c5.jpg"
  const weddingHref = weddingCarService?.href || "/services/wedding-cars"

  return (
    <section className="bg-[var(--luxury-bg)] text-white">
      <div ref={ref} className="mx-auto max-w-7xl px-4 py-12 md:py-20">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs tracking-[0.25em] uppercase text-white/40">Explore</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-[family-name:var(--font-playfair)] font-semibold text-white">
            Our <span className="text-gradient-gold">Services</span>
          </h2>
        </motion.div>

        {/* Two-card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {cardSections.map((item, i) => (
            <motion.div
              key={item.href}
              className="group relative h-80 md:h-[480px] rounded-2xl overflow-hidden border-glow-gold"
              initial={{ opacity: 0, x: i === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
            >
              <Image
                src={item.img}
                alt={item.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 gpu-layer"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={item.img.startsWith('http')}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/90" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-[family-name:var(--font-playfair)] font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-white/70 mb-4">{item.desc}</p>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--gold-400)] group-hover:text-[var(--gold-200)] transition-colors duration-300"
                >
                  Discover More
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Gold corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-4 right-4 w-8 h-px bg-[var(--gold-400)]" />
                <div className="absolute top-4 right-4 w-px h-8 bg-[var(--gold-400)]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Full-width wedding card */}
        <motion.div
          className="group relative h-72 sm:h-96 md:h-[500px] rounded-2xl overflow-hidden border-glow-gold"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link href={weddingHref} className="absolute inset-0 z-10" aria-label={weddingTitle} />
          <Image
            src={weddingImg}
            alt={`${weddingTitle} in Hyderabad`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 gpu-layer"
            loading="lazy"
            sizes="100vw"
            unoptimized={weddingImg.startsWith('http')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8 z-20">
            <h3 className="text-2xl md:text-3xl font-[family-name:var(--font-playfair)] font-semibold text-white mb-2">
              {weddingTitle}
            </h3>
            <p className="text-sm md:text-base text-white/70">
              {weddingDesc}
            </p>
          </div>
          {/* Gold corner accent */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
            <div className="absolute top-4 right-4 w-8 h-px bg-[var(--gold-400)]" />
            <div className="absolute top-4 right-4 w-px h-8 bg-[var(--gold-400)]" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
