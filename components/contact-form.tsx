'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'motion/react'
import { Send } from 'lucide-react'

/**
 * Contact form.
 *
 * The Telegram bot token used to live here as a NEXT_PUBLIC_ fallback, which
 * shipped a live credential to every visitor. The request now goes to
 * /api/contact, which validates it, rate limits it and calls Telegram server-side.
 */
export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

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
          service: formData.get('service'),
          message: formData.get('message'),
          company: formData.get('company'),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSent(true)
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
            className="w-14 h-14 rounded-full bg-[var(--gold-400)] flex items-center justify-center mx-auto mb-5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <Send className="w-6 h-6 text-black" />
          </motion.div>
          <h3 className="text-lg font-semibold mb-2">Message sent</h3>
          <p className="text-sm text-white/50">Our concierge team will get back to you shortly.</p>
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
          <select
            name="service"
            defaultValue=""
            className="w-full bg-[#121214] border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 focus:border-[var(--gold-400)]/40 focus:outline-none [color-scheme:dark]"
          >
            <option value="" className="bg-[#121214] text-zinc-300">Service of interest</option>
            <option value="Luxury car rental" className="bg-[#121214] text-white">Luxury car rental</option>
            <option value="Airport transfer" className="bg-[#121214] text-white">Airport transfer</option>
            <option value="Wedding cars" className="bg-[#121214] text-white">Wedding cars</option>
            <option value="Corporate travel" className="bg-[#121214] text-white">Corporate travel</option>
            <option value="Private jet / yacht" className="bg-[#121214] text-white">Private jet / yacht</option>
          </select>
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
            <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
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
