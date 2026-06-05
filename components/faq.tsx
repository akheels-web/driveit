'use client'

import { useRef, useState } from "react"
import { motion, AnimatePresence, useInView } from "motion/react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "Do you offer 24/7 concierge service?",
    a: "Yes, our luxury concierge team operates 24/7 to accommodate last-minute bookings, changes, and special requests. We're always available to ensure your luxury travel experience is seamless.",
  },
  {
    q: "Can I request a professional chauffeur?",
    a: "Absolutely. Professional, trained chauffeurs are available for all our luxury vehicles. They are experienced in providing discreet, high-quality service for corporate and personal travel.",
  },
  {
    q: "What documents are required for luxury car rental?",
    a: "For self-drive rentals, we require a valid driver's license, passport/ID, and a security deposit. For chauffeur services, only your booking confirmation is needed.",
  },
  {
    q: "Do you arrange intercity and international travel?",
    a: "Yes, we provide comprehensive intercity travel services and coordinate private jet charters for international routes. Our team handles all logistics and arrangements.",
  },
  {
    q: "What types of luxury vehicles do you offer?",
    a: "Our fleet includes flagship luxury cars, private jets, yachts, luxury buses, and wedding cars. We offer everything from Rolls-Royce and Bentley to private aviation and marine vessels.",
  },
  {
    q: "How far in advance should I book?",
    a: "For peak seasons and special events, we recommend booking 2-4 weeks in advance. However, we can accommodate last-minute requests subject to availability.",
  },
  {
    q: "Do you provide airport transfer services?",
    a: "Yes, we offer premium airport transportation with meet-and-greet services, flight tracking, and luggage assistance. Our drivers ensure timely arrivals and departures.",
  },
  {
    q: "How do I contact you for bookings?",
    a: "You can reach us 24/7 at +91 83413 41186, email us at info@driveitluxury.com, or use our contact form. Our team will assist you with all your luxury transportation needs.",
  },
]

function FAQItem({ faq, index, isInView }: { faq: (typeof faqs)[0]; index: number; isInView: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      className="border-glow-gold rounded-xl overflow-hidden self-start"
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-300 hover:bg-white/[0.02] cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-white pr-4">{faq.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-[var(--gold-400)]" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 border-t border-white/5">
              {/* Gold accent line */}
              <div className="w-8 h-px bg-[var(--gold-400)] mt-4 mb-3 opacity-50" />
              <p className="text-sm text-white/60 leading-relaxed">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQ() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" })

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  }

  return (
    <section ref={ref} className="bg-[var(--luxury-bg)] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs tracking-[0.25em] uppercase text-white/40">FAQ</span>
          <h3 className="mt-2 text-3xl md:text-4xl font-[family-name:var(--font-playfair)] font-semibold text-white">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h3>
          <p className="mt-2 text-sm text-white/50">
            Everything you need to know about our luxury transportation services
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-y-4">
            {faqs.filter((_, i) => i % 2 === 0).map((f, i) => (
              <FAQItem key={`left-${i}`} faq={f} index={i * 2} isInView={isInView} />
            ))}
          </div>
          <div className="flex flex-col gap-y-4">
            {faqs.filter((_, i) => i % 2 !== 0).map((f, i) => (
              <FAQItem key={`right-${i}`} faq={f} index={i * 2 + 1} isInView={isInView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}