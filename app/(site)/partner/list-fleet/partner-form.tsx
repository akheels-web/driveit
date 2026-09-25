'use client'

import { useState } from 'react'
import {
  Car,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Send,
  Building,
  Calendar,
  Gauge,
  Phone,
  Mail,
  User,
  MapPin,
} from 'lucide-react'

export function PartnerConsignmentForm() {
  const [form, setForm] = useState({
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    city: 'Hyderabad',
    vehicleName: '',
    manufacturingYear: '2023',
    registrationNumber: '',
    odometerKm: '',
    expectedMonthlyRevenue: '₹2,00,000 / month (or 70/30 share)',
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (field: keyof typeof form, val: string) =>
    setForm((prev) => ({ ...prev, [field]: val }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/partners/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (res.ok) {
        setSubmitted(true)
      } else {
        setError(data.error || 'Submission failed. Please check your inputs.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl p-8 md:p-12 text-center bg-white/[0.02] border border-emerald-500/30 max-w-xl mx-auto animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Application Received</h2>
        <p className="text-sm text-white/60 mb-6 leading-relaxed">
          Thank you for applying to the DRIVEIT Fleet Consignment Program with your{' '}
          <strong className="text-white">{form.vehicleName}</strong>. Our fleet management team will review your registration details and contact you at{' '}
          <span className="text-[var(--gold-400)]">{form.ownerPhone}</span> within 24 hours to schedule a 30-point physical inspection.
        </p>
        <button
          onClick={() => {
            setSubmitted(false)
            setForm({
              ownerName: '',
              ownerEmail: '',
              ownerPhone: '',
              city: 'Hyderabad',
              vehicleName: '',
              manufacturingYear: '2023',
              registrationNumber: '',
              odometerKm: '',
              expectedMonthlyRevenue: '₹2,00,000 / month (or 70/30 share)',
            })
          }}
          className="px-6 py-2.5 rounded-xl border border-white/20 text-xs font-semibold hover:border-[var(--gold-400)] text-white transition"
        >
          Submit Another Vehicle
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Vehicle Info */}
      <div className="rounded-2xl p-6 md:p-8 bg-white/[0.02] border border-white/10 space-y-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Car className="w-5 h-5 text-[var(--gold-400)]" /> Vehicle Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
              Make & Model *
            </label>
            <input
              required
              value={form.vehicleName}
              onChange={(e) => update('vehicleName', e.target.value)}
              placeholder="e.g. Porsche 911 Carrera / Mercedes S-Class 450"
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--gold-400)]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
              Manufacturing Year *
            </label>
            <input
              required
              type="number"
              min="2012"
              max="2027"
              value={form.manufacturingYear}
              onChange={(e) => update('manufacturingYear', e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--gold-400)]/50 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
              Registration Plate *
            </label>
            <input
              required
              value={form.registrationNumber}
              onChange={(e) => update('registrationNumber', e.target.value.toUpperCase())}
              placeholder="e.g. TS09-EX-0001"
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white uppercase focus:border-[var(--gold-400)]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
              Current Odometer (km)
            </label>
            <input
              type="number"
              value={form.odometerKm}
              onChange={(e) => update('odometerKm', e.target.value)}
              placeholder="e.g. 18500"
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--gold-400)]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
              Vehicle Location / City
            </label>
            <input
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              placeholder="Hyderabad / Bangalore"
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--gold-400)]/50 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
            Expected Monthly Return / Revenue Model
          </label>
          <input
            value={form.expectedMonthlyRevenue}
            onChange={(e) => update('expectedMonthlyRevenue', e.target.value)}
            placeholder="e.g. ₹2,00,000 fixed / month or 70% share per booking"
            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--gold-400)]/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Owner Contact */}
      <div className="rounded-2xl p-6 md:p-8 bg-white/[0.02] border border-white/10 space-y-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <User className="w-5 h-5 text-[var(--gold-400)]" /> Owner / Fleet Partner Contact
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
              Full Name / Company *
            </label>
            <input
              required
              value={form.ownerName}
              onChange={(e) => update('ownerName', e.target.value)}
              placeholder="Enter your name or entity"
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--gold-400)]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <input
              required
              type="email"
              value={form.ownerEmail}
              onChange={(e) => update('ownerEmail', e.target.value)}
              placeholder="contact@example.com"
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--gold-400)]/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
              Phone Number *
            </label>
            <input
              required
              type="tel"
              value={form.ownerPhone}
              onChange={(e) => update('ownerPhone', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--gold-400)]/50 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-black disabled:opacity-50 cursor-pointer transition-all duration-300 hover:scale-[1.01]"
        style={{
          background: 'linear-gradient(135deg, var(--gold-300), var(--gold-400), var(--gold-500))',
          boxShadow: '0 4px 20px rgba(212, 175, 55, 0.25)',
        }}
      >
        {loading ? (
          'Submitting Application…'
        ) : (
          <>
            <Send className="w-4 h-4" /> Submit Vehicle for Consignment
          </>
        )}
      </button>
    </form>
  )
}
