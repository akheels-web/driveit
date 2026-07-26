"use client"

import React, { useRef } from 'react'
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'
import { motion, useInView } from "motion/react"

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "CEO, TechSolutions India",
    image: "/placeholder-user.jpg",
    quote: "DRIVEIT's luxury car service in Hyderabad is exceptional. Their Rolls-Royce for our corporate events always impresses our international clients. Professional chauffeurs and impeccable service.",
    rating: 5
  },
  {
    name: "Priya Sharma",
    role: "Wedding Planner, Elegant Events",
    image: "/placeholder-user.jpg",
    quote: "Used DRIVEIT for multiple luxury weddings in Hyderabad. Their wedding car collection is stunning and the service is flawless. Every bride feels like royalty on their special day.",
    rating: 5
  },
  {
    name: "Arjun Reddy",
    role: "Managing Director, RedTech Industries",
    image: "/placeholder-user.jpg",
    quote: "For our executive transportation needs in Hyderabad, DRIVEIT is our go-to choice. Their luxury fleet and professional service make every business trip memorable and comfortable.",
    rating: 5
  },
  {
    name: "Anjali Patel",
    role: "Luxury Travel Consultant",
    image: "/placeholder-user.jpg",
    quote: "DRIVEIT's private jet services from Hyderabad are world-class. They handle everything from airport transfers to international travel seamlessly. Highly recommended for luxury travel.",
    rating: 5
  },
  {
    name: "Vikram Singh",
    role: "Director, Singh Hospitality Group",
    image: "/placeholder-user.jpg",
    quote: "Outstanding luxury transportation service in Hyderabad. Their fleet of premium cars and attention to detail is unmatched. Perfect for our high-profile guests and events.",
    rating: 5
  },
  {
    name: "Meera Iyer",
    role: "Event Manager, Grand Celebrations",
    image: "/placeholder-user.jpg",
    quote: "DRIVEIT's luxury bus service for our corporate events in Hyderabad is excellent. Comfortable, punctual, and adds a touch of elegance to any group transportation need.",
    rating: 5
  }
]

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[0] }) {
  return (
    <div className="flex-shrink-0 w-[340px] md:w-[400px] p-6 rounded-2xl border-glow-gold bg-[var(--luxury-surface)] hover:bg-[var(--luxury-surface-2)] transition-all duration-500">
      {/* Quote Icon */}
      <div className="flex justify-start mb-4">
        <div className="w-10 h-10 glass-gold rounded-lg flex items-center justify-center">
          <Quote className="w-5 h-5 text-[var(--gold-400)]" />
        </div>
      </div>

      {/* Quote Text */}
      <p className="text-sm text-white/60 leading-relaxed mb-5 line-clamp-4">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, idx) => (
          <Star
            key={idx}
            className="w-3.5 h-3.5 fill-[var(--gold-400)] text-[var(--gold-400)]"
          />
        ))}
      </div>

      {/* Client Info */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--luxury-border)]">
          <Image
            src={testimonial.image}
            alt={`${testimonial.name} client testimonial Hyderabad`}
            fill
            sizes="40px"
            loading="lazy"
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">{testimonial.name}</h4>
          <p className="text-xs text-white/40">{testimonial.role}</p>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" })

  return (
    <section ref={ref} className="bg-[var(--luxury-bg)] text-white overflow-hidden py-12 md:py-20">
      {/* Header */}
      <motion.div
        className="text-center mb-10 px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <span className="text-xs tracking-[0.25em] uppercase text-white/40">Testimonials</span>
        <h3 className="mt-2 text-3xl md:text-4xl font-[family-name:var(--font-playfair)] font-semibold text-white">
          Client <span className="text-gradient-gold">Reviews</span>
        </h3>
        <p className="mt-2 text-sm text-white/50">
          What our clients in Hyderabad say about their luxury experience
        </p>
      </motion.div>

      {/* Infinite Marquee */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 md:w-32 bg-gradient-to-r from-[var(--luxury-bg)] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 md:w-32 bg-gradient-to-l from-[var(--luxury-bg)] to-transparent" />

        <div className="marquee-track" style={{ animationDuration: "50s" }}>
          <div className="marquee-content gap-6 px-3">
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={`a-${t.name}-${i}`} testimonial={t} />
            ))}
          </div>
          <div className="marquee-content gap-6 px-3" aria-hidden="true">
            {[...testimonials, ...testimonials].map((t, i) => (
              <TestimonialCard key={`b-${t.name}-${i}`} testimonial={t} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}