'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, Crown, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SiteHeader } from '@/components/site-header'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const updateField = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }))

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          phone: form.phone,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <SiteHeader />
        <section className="bg-[var(--luxury-bg)] text-white min-h-screen flex items-center justify-center px-4 pt-20">
          <motion.div
            className="w-full max-w-md text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div
              className="rounded-2xl p-8"
              style={{
                background: 'linear-gradient(145deg, rgba(20,20,20,1), rgba(12,12,12,1))',
                border: '1px solid rgba(212, 175, 55, 0.12)',
              }}
            >
              <motion.div
                className="w-16 h-16 rounded-full bg-[var(--gold-400)] flex items-center justify-center mx-auto mb-5"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                <Crown className="w-8 h-8 text-black" />
              </motion.div>
              <h2 className="text-xl font-[family-name:var(--font-playfair)] font-bold mb-2">Account Created!</h2>
              <p className="text-sm text-white/50 mb-5">Check your email to verify your account, then sign in.</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-black"
                style={{ background: 'linear-gradient(135deg, var(--gold-300), var(--gold-400))' }}
              >
                Go to Login <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </section>
      </>
    )
  }

  return (
    <>
      <SiteHeader />
      <section className="bg-[var(--luxury-bg)] text-white min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="rounded-2xl p-8 relative"
            style={{
              background: 'linear-gradient(145deg, rgba(20,20,20,1), rgba(12,12,12,1))',
              border: '1px solid rgba(212, 175, 55, 0.12)',
              boxShadow: '0 0 80px rgba(0,0,0,0.6), 0 0 30px rgba(212,175,55,0.03)',
            }}
          >
            {/* Close Button */}
            <Link
              href="/"
              className="absolute top-4 right-4 text-white/40 hover:text-[var(--gold-400)] transition-colors p-1.5 rounded-full hover:bg-white/5"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </Link>
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-[var(--gold-400)]/10 flex items-center justify-center mx-auto mb-4 border border-[var(--gold-400)]/20">
                <Crown className="w-6 h-6 text-[var(--gold-400)]" />
              </div>
              <h1 className="text-2xl font-[family-name:var(--font-playfair)] font-bold">
                Create <span className="text-gradient-gold">Account</span>
              </h1>
              <p className="text-xs text-white/40 mt-1">Join DRIVEIT for a premium booking experience</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Full Name *" required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <input
                    type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)}
                    placeholder="Email *" required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <input
                    type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="Phone *" required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Password (min 6 chars) *" required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white text-sm placeholder:text-white/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="password" value={form.confirm} onChange={(e) => updateField('confirm', e.target.value)}
                  placeholder="Confirm Password *" required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-400/5 border border-red-400/10 rounded-lg px-3 py-2">{error}</p>
              )}

              <motion.button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold cursor-pointer disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, var(--gold-300), var(--gold-400), var(--gold-500))',
                  color: 'black',
                  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.25)',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>Create Account <ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-white/30">
                Already have an account?{' '}
                <Link href="/login" className="text-[var(--gold-400)] hover:text-[var(--gold-200)] transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
