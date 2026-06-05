'use client'

import { useState, FormEvent } from 'react'
import { motion } from 'motion/react'
import { Send } from 'lucide-react'

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || '8068562276:AAFP_ToBxZXbbVmK1gvnnMZYeURT9nTPm6c'
  const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || '6163736948'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const service = formData.get('service') as string
    const message = formData.get('message') as string

    const telegramMessage = `📩 DRIVEIT Contact Form\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`

    try {
      const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: telegramMessage }),
      })
      const data = await res.json()
      if (data.ok) {
        setSent(true)
        e.currentTarget.reset()
      } else {
        alert('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error(error)
      alert('Error sending message. Please try again.')
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
        boxShadow: '0 0 60px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.03)',
      }}
    >
      {sent ? (
        <div className="py-12 text-center">
          <motion.div
            className="w-14 h-14 rounded-full bg-[var(--gold-400)] flex items-center justify-center mx-auto mb-5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Send className="w-7 h-7 text-black" />
          </motion.div>
          <h3 className="text-xl font-[family-name:var(--font-playfair)] font-bold text-white mb-2">Message Sent!</h3>
          <p className="text-sm text-white/50 mb-5">We'll get back to you within 15 minutes.</p>
          <button
            onClick={() => setSent(false)}
            className="text-sm text-[var(--gold-400)] hover:text-[var(--gold-200)] transition-colors cursor-pointer"
          >
            Send Another Message →
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold text-white mb-1">Send us a Message</h2>
          <p className="text-xs text-white/40 mb-6">Fill in the form and we'll respond promptly.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text" name="name" placeholder="Full Name *" required
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 hover:border-[var(--gold-400)]/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
              />
              <input
                type="tel" name="phone" placeholder="Phone Number *" required
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 hover:border-[var(--gold-400)]/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
              />
            </div>

            <select
              name="service" required
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm appearance-none cursor-pointer hover:border-[var(--gold-400)]/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
            >
              <option value="" className="bg-[#111]">Select Service</option>
              <option value="Luxury Car Rental" className="bg-[#111]">Luxury Car Rental</option>
              <option value="Airport Transfer" className="bg-[#111]">Airport Transfer</option>
              <option value="Wedding Cars" className="bg-[#111]">Wedding Cars</option>
              <option value="Corporate Events" className="bg-[#111]">Corporate Events</option>
              <option value="Chauffeur Service" className="bg-[#111]">Chauffeur Service</option>
              <option value="Private Jet" className="bg-[#111]">Private Jet</option>
              <option value="Yacht Services" className="bg-[#111]">Yacht Services</option>
              <option value="Other" className="bg-[#111]">Other</option>
            </select>

            <textarea
              name="message" placeholder="Tell us about your requirements *" required rows={4}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 hover:border-[var(--gold-400)]/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors resize-none"
            />

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-bold cursor-pointer disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, var(--gold-300), var(--gold-400), var(--gold-500))',
                color: 'black',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </motion.button>
          </form>
        </>
      )}
    </div>
  )
}
