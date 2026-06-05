'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Chrome, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SiteHeader } from '@/components/site-header'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      router.push(redirectTo)
      router.refresh()
    }
  }

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
      },
    })
  }

  return (
    <>
      <SiteHeader />
      <section className="bg-[var(--luxury-bg)] text-white min-h-screen flex items-center justify-center px-4 pt-20">
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
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-[var(--gold-400)]/10 flex items-center justify-center mx-auto mb-4 border border-[var(--gold-400)]/20">
                <Lock className="w-6 h-6 text-[var(--gold-400)]" />
              </div>
              <h1 className="text-2xl font-[family-name:var(--font-playfair)] font-bold">
                Sign In to <span className="text-gradient-gold">DRIVEIT</span>
              </h1>
              <p className="text-xs text-white/40 mt-1">Access your account to manage bookings</p>
            </div>

            {/* Google Login */}
            <motion.button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-sm font-medium cursor-pointer bg-white/[0.04] border border-white/10 text-white/80 hover:bg-white/[0.07] hover:border-white/15 transition-all"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Chrome className="w-4 h-4" />
              Continue with Google
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] text-white/30 uppercase tracking-wider">or email</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address" required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-white/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white text-sm placeholder:text-white/20 focus:border-[var(--gold-400)]/40 focus:outline-none transition-colors"
                />
                <button
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
                  <>Sign In <ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </form>

            {/* Footer links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-xs text-white/30">
                Don't have an account?{' '}
                <Link href="/signup" className="text-[var(--gold-400)] hover:text-[var(--gold-200)] transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
