'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'motion/react'
import { Send, AlertCircle } from 'lucide-react'

/**
 * Contact form.
 *
 * The Telegram bot token used to live here as a NEXT_PUBLIC_ fallback, which
 * shipped a live credential to every visitor. The request now goes to
 * /api/contact, which validates it, rate limits it and calls Telegram server-side.
 */
import { LuxurySelect } from '@/components/luxury-select'

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [service, setService] = useState('')

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
          service: formData.get('service') || service,
          message: formData.get('message'),
          company: formData.get('company'),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSent(true)
        setService('')
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
      className="rounded-2xl p-6 md:p-8"
      style={{
        background: 'linear-gradient(145deg, rgba(20,20,20,1), rgba(13,13,13,1))',
        border: '1px solid rgba(212, 175, 55, 0.12)',
        boxShadow: '0 0 60px rgba(0,0,0,0.5)',
      }}
    >
      {sent ? (
        <div className="py-12 text-center">
          <motion.div
            className="w-14 h-14 rounded-full bg-[var(--gold-400)] flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(212,175,55,0.3)]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <Send className="w-6 h-6 text-black" />
          </motion.div>
          <h3 className="text-xl font-bold text-white mb-2">Inquiry Dispatched Successfully</h3>
          <p className="text-sm text-white/60 max-w-sm mx-auto mb-6 leading-relaxed">
            Our luxury fleet concierge has received your request and will connect with you via phone or WhatsApp within 15 minutes.
          </p>
          <button
            onClick={() => setSent(false)}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold text-[var(--gold-400)] border border-[var(--gold-400)]/30 hover:bg-[var(--gold-400)]/10 transition cursor-pointer"
          >
            Send Another Inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            required
            minLength={2}
            placeholder="Full name *"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/25 focus:border-[var(--gold-400)]/40 focus:outline-none"
          />
          <input
            name="phone"
            required
            minLength={6}
            placeholder="Phone number *"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/25 focus:border-[var(--gold-400)]/40 focus:outline-none"
          />
          <LuxurySelect
            name="service"
            value={service}
            onChange={setService}
            placeholder="Service of interest"
            options={[
              { value: 'Luxury car rental', label: 'Luxury car rental' },
              { value: 'Airport transfer', label: 'Airport transfer' },
              { value: 'Wedding cars', label: 'Wedding cars' },
              { value: 'Corporate travel', label: 'Corporate travel' },
              { value: 'Private jet / yacht', label: 'Private jet / yacht' },
            ]}
          />
          <textarea
            name="message"
            required
            minLength={5}
            rows={4}
            placeholder="How can we help? *"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/25 focus:border-[var(--gold-400)]/40 focus:outline-none"
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
                <p className="font-semibold text-rose-200">Unable to Send Message</p>
                <p className="text-rose-300/80 leading-relaxed">{error}</p>
                <p className="text-white/40 text-[11px]">
                  You can also call our 24/7 concierge directly at{' '}
                  <a href="tel:+916300041186" className="text-[var(--gold-400)] underline">
                    +91 63000 41186
                  </a>
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-black disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, var(--gold-300), var(--gold-400), var(--gold-500))' }}
          >
            {loading ? 'Sending…' : (
              <>
                <Send className="w-4 h-4" /> Send message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
