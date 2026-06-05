'use client'

import { useRef, useState } from 'react'
import Link from "next/link"
import { ArrowRight, Car, Plane, MapPin, Bus, Heart, Building } from "lucide-react"
import { motion, useInView } from "motion/react"

const services = [
  {
    title: "LUXURY CHAUFFEUR",
    href: "/services/airport-taxi",
    img: "https://i.pinimg.com/736x/3d/2a/3a/3d2a3af540773bbad9f139450a63864c.jpg",
    desc: "Premium chauffeur service",
    icon: Car,
  },
  {
    title: "LUXURY CAR RENTAL",
    href: "/services/luxury-car-rental",
    img: "https://i.pinimg.com/736x/5a/53/96/5a539624d67f7236ac456aaeaf101517.jpg",
    desc: "Flagship cars, chauffeur or self-drive",
    icon: Car,
  },
  {
    title: "PRIVATE JET SERVICES",
    href: "/services/private-jet-services",
    img: "https://i.pinimg.com/736x/a1/13/54/a113547a7672e15380e878416e7cb1af.jpg",
    desc: "Global access to premium jets",
    icon: Plane,
  },
  {
    title: "PICKUP & DROP-OFF",
    href: "/services/pickup-dropoff",
    img: "https://i.pinimg.com/1200x/f1/84/eb/f184ebe4acf3eba81044d3c9b7ba2c12.jpg",
    desc: "On-time executive transfers",
    icon: MapPin,
  },
  {
    title: "LUXURY BUSES",
    href: "/services/luxury-buses",
    img: "https://i.pinimg.com/736x/17/f8/75/17f8753a70089849b702071dec38b9ec.jpg",
    desc: "Group travel in absolute comfort",
    icon: Bus,
  },
  {
    title: "WEDDING CARS",
    href: "/services/wedding-cars",
    img: "https://i.pinimg.com/736x/a4/f6/95/a4f6959bf69c97005baaefc48f634f1f.jpg",
    desc: "Iconic arrivals for your day",
    icon: Heart,
  },
  {
    title: "AIRPORT TAXI",
    href: "/services/airport-taxi",
    img: "https://i.pinimg.com/736x/3d/2a/3a/3d2a3af540773bbad9f139450a63864c.jpg",
    desc: "Premium airport transportation",
    icon: Car,
  },
  {
    title: "CORPORATE CAR RENTAL",
    href: "/services/corporate-car-rental",
    img: "https://i.pinimg.com/736x/d2/6b/86/d26b8690789253c15f60c954cb510e6d.jpg",
    desc: "Business travel solutions",
    icon: Building,
  },
]

function ServiceCard({
  service,
  index,
  isInView,
}: {
  service: (typeof services)[0]
  index: number
  isInView: boolean
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10
    setMousePos({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        ref={cardRef}
        href={service.href}
        className="group relative block h-80 md:h-[420px] rounded-2xl overflow-hidden border-glow-gold cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(800px) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        <img
          src={service.img}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/90" />

        {/* Icon badge */}
        <div className="absolute top-4 left-4 w-10 h-10 glass-gold rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110">
          <service.icon className="w-5 h-5 text-[var(--gold-400)]" />
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-base font-semibold text-white tracking-wide mb-1">
            {service.title}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-white/60">{service.desc}</p>
            <ArrowRight className="w-4 h-4 text-[var(--gold-400)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </div>
        </div>

        {/* Gold corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-4 right-4 w-6 h-px bg-[var(--gold-400)]" />
          <div className="absolute top-4 right-4 w-px h-6 bg-[var(--gold-400)]" />
        </div>
      </Link>
    </motion.div>
  )
}

export function TrendingGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" })

  return (
    <section className="bg-[var(--luxury-bg)] text-white">
      <div ref={ref} className="mx-auto max-w-7xl px-4 py-12 md:py-20">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-white/40">What We Offer</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-[family-name:var(--font-playfair)] font-semibold text-white">
              Our <span className="text-gradient-gold">Services</span>
            </h2>
          </div>
          <Link
            href="/services"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 glass-gold rounded-full text-sm font-medium text-white transition-all duration-300 hover:bg-[var(--gold-400)]/10 hover:scale-105 group"
          >
            Discover More
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, i) => (
            <ServiceCard
              key={service.title + i}
              service={service}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}