'use client'

import { useState, FormEvent, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useInView } from 'motion/react'
import { MessageSquare, Phone, Mail, MapPin, Clock, Send, ExternalLink } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ContactForm } from '@/components/contact-form'

export default function ContactPage() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <>
      <SiteHeader />
      <section ref={ref} className="bg-[var(--luxury-bg)] text-white min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-4">

          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="text-xs tracking-[0.25em] uppercase text-white/40">Get In Touch</span>
            <h1 className="mt-2 text-3xl md:text-5xl font-[family-name:var(--font-playfair)] font-bold text-white">
              Contact <span className="text-gradient-gold">Us</span>
            </h1>
            <p className="mt-3 text-sm md:text-base text-white/50 max-w-xl mx-auto">
              Have questions or need a custom package? Reach out to our team — we respond within minutes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left: Contact Info */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Phone, label: 'Call Us', value: '+91 83413 41186', href: 'tel:+918341341186', sub: 'Available 24/7' },
                  { icon: Mail, label: 'Email', value: 'info@driveit.in', href: 'mailto:info@driveit.in', sub: 'Quick response' },
                  { icon: MessageSquare, label: 'WhatsApp', value: 'Chat with us', href: 'https://wa.me/918341341186', sub: 'Instant reply' },
                  { icon: Clock, label: 'Business Hours', value: '24 / 7', href: null, sub: 'Always available' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="rounded-xl p-5 transition-all duration-300 hover:border-[var(--gold-400)]/20"
                    style={{
                      background: 'rgba(22,22,22,1)',
                      border: '1px solid rgba(255,255,255,0.05)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--gold-400)]/10 flex items-center justify-center mb-3">
                      <item.icon className="w-5 h-5 text-[var(--gold-400)]" />
                    </div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined}
                        className="text-sm font-medium text-white hover:text-[var(--gold-400)] transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-white">{item.value}</p>
                    )}
                    <p className="text-[10px] text-white/30 mt-0.5">{item.sub}</p>
                  </motion.div>
                ))}
              </div>

              {/* Address */}
              <motion.div
                className="rounded-xl p-5"
                style={{ background: 'rgba(22,22,22,1)', border: '1px solid rgba(255,255,255,0.05)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--gold-400)]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[var(--gold-400)]" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Office Address</p>
                    <p className="text-sm text-white font-medium">DRIVEIT — Luxury Transportation Services</p>
                    <p className="text-xs text-white/50 mt-1 leading-relaxed">
                      Mother Mansion, 10-2-289/83, Rd Number 3,<br />
                      Shantinagar Colony, Masab Tank,<br />
                      Hyderabad, Telangana 500028
                    </p>
                    <a
                      href="https://maps.app.goo.gl/z6g9rBdGoT1gzxku8"
                      target="_blank"
                      className="inline-flex items-center gap-1.5 mt-2 text-xs text-[var(--gold-400)] hover:text-[var(--gold-200)] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> Open in Google Maps
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Map */}
              <motion.div
                className="rounded-xl overflow-hidden border-glow-gold h-[250px]"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.7 }}
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.2137599390176!2d78.4565279!3d17.4015263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb97844e874967%3A0xec0fefe2fefa1e15!2sDriveit%20-%20Selfdrive%20Cars%20-%20Luxury%20Wedding%20Cars%20-%20Cabs%20for%20outstation%20-%20Luxury%20Buses!5e0!3m2!1sen!2sin!4v1756574982222!5m2!1sen!2sin"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title="DRIVEIT Location"
                />
              </motion.div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="sticky top-28">
                <ContactForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  )
}