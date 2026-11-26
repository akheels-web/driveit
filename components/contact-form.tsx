'use client'

import { useState, useEffect, FormEvent } from 'react'
import { motion } from 'motion/react'
import { Send, AlertCircle, Lock, MessageCircle, CheckCircle2 } from 'lucide-react'
import { LuxurySelect } from '@/components/luxury-select'
import { LuxuryDatePicker } from '@/components/luxury-date-picker'
import { getLocalDateString } from '@/lib/utils'

export function ContactForm({ defaultService = '' }: { defaultService?: string }) {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [reference, setReference] = useState('')
  const [error, setError] = useState('')
  const [service, setService] = useState(defaultService)
  const [preferredDate, setPreferredDate] = useState('')

  useEffect(() => {
    if (defaultService) {
      queueMicrotask(() => setService(defaultService))
      return
    }
    if (typeof window !== 'undefined') {
      const qs = new URLSearchParams(window.location.search)
      const fromUrl = qs.get('service')
      if (fromUrl) {
        queueMicrotask(() => setService(fromUrl))
      }
    }
  }, [defaultService])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          phone: formData.get('phone'),
          email: formData.get('email') || undefined,
          service: formData.get('service') || service || 'General Concierge Inquiry',
          date: formData.get('date') || undefined,
          guests: formData.get('guests') || undefined,
          message: formData.get('message'),
          company: formData.get('company'),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setReference(data.reference || 'COM-PRIVE')
        setSent(true)
        setPreferredDate('')
        event.currentTarget.reset()
      } else {
        setError(data.error || 'We could not send your message. Please call us instead.')
      }
    } catch {
      setError('Network error. Please try again or call us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="rounded-3xl p-6 md:p-9"
      style={{
        background: 'linear-gradient(155deg, rgba(16,16,22,0.98), rgba(9,9,13,0.98))',
        border: '1px solid rgba(201, 169, 110, 0.25)',
        boxShadow: '0 24px_80px rgba(0,0,0,0.75)',
      }}
    >
      {sent ? (
        <div className="py-10 text-center space-y-5">
          <motion.div
            className="w-16 h-16 rounded-full bg-emerald-500/12 border border-emerald-500/30 flex items-center justify-center mx-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </motion.div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-[#c9a96e]">
              Commission Logged · Ref {reference}
            </span>
            <h3 className="text-2xl font-light text-white">Concierge Brief Dispatched</h3>
            <p className="text-xs text-white/60 max-w-md mx-auto leading-relaxed">
              Our Senior Concierge & Charter Specialist has received your brief and will connect with you via phone or WhatsApp within 15 minutes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/916300041186?text=${encodeURIComponent(
                `Hello DRIVEIT Concierge, my inquiry reference is ${reference}.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-[#c9a96e] text-black font-bold text-xs font-mono uppercase tracking-[0.18em] flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Priority WhatsApp Desk</span>
            </a>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-[0.18em] text-white/75 border border-white/15 hover:text-white transition cursor-pointer"
            >
              Submit Another Brief
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/8 pb-3 mb-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.24em] text-[#c9a96e]">
              <Lock className="w-3 h-3" /> Private Commission & Concierge Desk
            </span>
            <span className="text-[10px] font-mono text-white/40">15-Min Response SLA</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              required
              minLength={2}
              placeholder="Principal / Guest Full Name *"
              className="w-full bg-black border border-white/12 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#c9a96e]/60 focus:outline-none"
            />
            <input
              name="phone"
              required
              minLength={6}
              placeholder="Direct Mobile / WhatsApp Number *"
              className="w-full bg-black border border-white/12 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#c9a96e]/60 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              name="email"
              type="email"
              placeholder="Email Address (Optional)"
              className="w-full bg-black border border-white/12 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#c9a96e]/60 focus:outline-none"
            />
            <LuxuryDatePicker
              name="date"
              value={preferredDate}
              onChange={setPreferredDate}
              min={getLocalDateString()}
              placeholder="Preferred Date"
              ariaLabel="Preferred Date"
              triggerClassName="bg-black border-white/12 hover:border-white/25 focus:border-[#c9a96e]/60 rounded-xl text-sm text-white font-mono"
            />
            <input
              name="guests"
              type="text"
              placeholder="Party Size (e.g. 12 Pax)"
              className="w-full bg-black border border-white/12 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#c9a96e]/60 focus:outline-none"
            />
          </div>

          <LuxurySelect
            name="service"
            value={service}
            onChange={setService}
            placeholder="Select Commission or Service Division"
            options={[
              { value: 'Private Jet / Helicopter Charter', label: 'Private Jet / Helicopter Charter (Contact Only)' },
              { value: 'Superyacht & Marine Charter', label: 'Superyacht & Marine Charter (Contact Only)' },
              { value: 'Luxury Coach & Convoy Charter', label: 'Luxury Coach & Convoy Charter (Contact Only)' },
              { value: 'Royal Wedding Motorcade', label: 'Royal Wedding Motorcade & Bridal Cars' },
              { value: 'Corporate & Diplomatic Fleet', label: 'Corporate & Diplomatic Retainer' },
              { value: 'Luxury Car Rental', label: 'Chauffeur / Exotic Self-Drive Car' },
              { value: 'Airport VIP Tarmac Transfer', label: 'Airport VIP Tarmac Transfer' },
            ]}
          />

          <textarea
            name="message"
            required
            minLength={5}
            rows={4}
            placeholder="Share your itinerary, departure hub/airport, vessel or aircraft preference, or special hospitality requirements *"
            className="w-full bg-black border border-white/12 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#c9a96e]/60 focus:outline-none resize-none"
          />

          {/* Honeypot — bots fill this in, humans never see it. */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          {error && (
            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-rose-200">Unable to Dispatch Brief</p>
                <p className="text-rose-300/80 leading-relaxed">{error}</p>
                <p className="text-white/40 text-[11px]">
                  Call our 24/7 Privé desk directly at{' '}
                  <a href="tel:+916300041186" className="text-[#c9a96e] underline">
                    +91 63000 41186
                  </a>
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-xs font-mono uppercase tracking-[0.22em] font-bold text-black bg-[#c9a96e] hover:bg-[#dfc288] transition cursor-pointer disabled:opacity-50 shadow-[0_10px_30px_rgba(201,169,110,0.28)]"
          >
            {loading ? (
              'Dispatching Commission Brief…'
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Private Commission Request
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
