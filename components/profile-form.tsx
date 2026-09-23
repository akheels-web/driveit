'use client'

import { useState } from 'react'
import { Mail, Phone, Save, User } from 'lucide-react'

import type { CustomerProfile } from '@/lib/types'

export function ProfileForm({ email, initial }: { email: string; initial: CustomerProfile | null }) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    phone: initial?.phone ?? '',
    homeAddress: initial?.homeAddress ?? '',
    officeAddress: initial?.officeAddress ?? '',
    airportAddress: initial?.airportAddress ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const update = (field: keyof typeof form, value: string) =>
    setForm((previous) => ({ ...previous, [field]: value }))

  async function save() {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()

      // The profile used to be saved to nowhere; now failures are visible.
      setMessage(response.ok ? 'Saved!' : data.error || 'Could not save your details.')
    } catch {
      setMessage('Network error — please try again.')
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 4000)
    }
  }

  const fields: { key: keyof typeof form; label: string; placeholder: string }[] = [
    { key: 'homeAddress', label: 'Home address', placeholder: 'e.g. Flat 201, Jubilee Hills' },
    { key: 'officeAddress', label: 'Office address', placeholder: 'e.g. Tech Park, Madhapur' },
    { key: 'airportAddress', label: 'Airport preference', placeholder: 'e.g. RGIA Terminal 1' },
  ]

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: 'linear-gradient(145deg, rgba(20,20,20,1), rgba(13,13,13,1))',
        border: '1px solid rgba(212, 175, 55, 0.1)',
      }}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Full name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-[var(--gold-400)]/40 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              value={email}
              disabled
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white/40 cursor-not-allowed"
            />
          </div>
          <p className="text-[10px] text-white/20 mt-1">Email is managed by your Google sign-in.</p>
        </div>

        <div>
          <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              value={form.phone}
              onChange={(event) => update('phone', event.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-[var(--gold-400)]/40 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-4">
          <h3 className="text-sm font-semibold text-white/80">Saved addresses</h3>
          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">
                {field.label}
              </label>
              <input
                value={form[field.key]}
                placeholder={field.placeholder}
                onChange={(event) => update(field.key, event.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[var(--gold-400)]/40 focus:outline-none"
              />
            </div>
          ))}
        </div>

        {message && (
          <p className={`text-xs ${message === 'Saved!' ? 'text-green-400' : 'text-amber-300'}`}>{message}</p>
        )}

        <button
          onClick={save}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-black disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, var(--gold-300), var(--gold-400), var(--gold-500))' }}
        >
          {saving ? 'Saving…' : (
            <>
              <Save className="w-4 h-4" /> Save changes
            </>
          )}
        </button>
      </div>
    </div>
  )
}
