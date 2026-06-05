'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, Save, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SiteHeader } from '@/components/site-header'

export default function ProfilePage() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', home_address: '', office_address: '', airport_address: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
          full_name: profile.full_name || '',
          email: profile.email || user.email || '',
          phone: profile.phone || '',
          home_address: profile.home_address || '',
          office_address: profile.office_address || '',
          airport_address: profile.airport_address || '',
        })
      }
      setLoading(false)
    }
    load()
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        phone: form.phone,
        home_address: form.home_address,
        office_address: form.office_address,
        airport_address: form.airport_address,
      })
      .eq('id', user.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <>
      <SiteHeader />
      <section className="bg-[var(--luxury-bg)] text-white min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-lg px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <Link href="/dashboard" className="text-white/30 hover:text-white/60 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-[family-name:var(--font-playfair)] font-bold">Edit Profile</h1>
                <p className="text-xs text-white/40">Update your account details</p>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-[var(--gold-400)]/30 border-t-[var(--gold-400)] rounded-full animate-spin" />
              </div>
            ) : (
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'linear-gradient(145deg, rgba(20,20,20,1), rgba(13,13,13,1))',
                  border: '1px solid rgba(212, 175, 55, 0.1)',
                }}
              >
                {/* Avatar placeholder */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-[var(--gold-400)]/10 border-2 border-[var(--gold-400)]/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-[var(--gold-400)]" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                      <input
                        type="text" value={form.full_name}
                        onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                      <input
                        type="email" value={form.email} disabled
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-white/40 text-sm cursor-not-allowed"
                      />
                    </div>
                    <p className="text-[10px] text-white/20 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                      <input
                        type="tel" value={form.phone}
                        onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <h3 className="text-sm font-semibold mb-4 text-white/80">Saved Addresses</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Home Address</label>
                        <input
                          type="text" value={form.home_address} placeholder="e.g., Flat 201, Jubilee Hills"
                          onChange={(e) => setForm((p) => ({ ...p, home_address: e.target.value }))}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Office Address</label>
                        <input
                          type="text" value={form.office_address} placeholder="e.g., Tech Park, Madhapur"
                          onChange={(e) => setForm((p) => ({ ...p, office_address: e.target.value }))}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Airport Preference</label>
                        <input
                          type="text" value={form.airport_address} placeholder="e.g., RGIA Terminal 1"
                          onChange={(e) => setForm((p) => ({ ...p, airport_address: e.target.value }))}
                          className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save button */}
                  <motion.button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold cursor-pointer disabled:opacity-50 mt-2"
                    style={{
                      background: 'linear-gradient(135deg, var(--gold-300), var(--gold-400), var(--gold-500))',
                      color: 'black',
                      boxShadow: '0 4px 20px rgba(212, 175, 55, 0.25)',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : saved ? (
                      <>✓ Saved!</>
                    ) : (
                      <><Save className="w-4 h-4" /> Save Changes</>
                    )}
                  </motion.button>
                </div>

                {/* Danger Zone */}
                <div className="mt-8 pt-6 border-t border-white/5">
                  <p className="text-[10px] text-white/20 uppercase tracking-wider mb-3">Danger Zone</p>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 text-xs text-red-400/50 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}
