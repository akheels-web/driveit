'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Chrome, Crown, X, AlertCircle } from 'lucide-react'
import { signIn } from 'next-auth/react'

import { SiteHeader } from '@/components/site-header'

function SignupForm() {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const [loading, setLoading] = useState(false)

  return (
    <>
      <SiteHeader />
      <section className="bg-[var(--luxury-bg)] text-white min-h-screen flex items-center justify-center px-4 pt-20">
        <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div
            className="rounded-2xl p-8 relative"
            style={{
              background: 'linear-gradient(145deg, rgba(20,20,20,1), rgba(12,12,12,1))',
              border: '1px solid rgba(212, 175, 55, 0.12)',
            }}
          >
            <Link
              href="/"
              className="absolute top-4 right-4 text-white/40 hover:text-[var(--gold-400)] p-1.5 rounded-full hover:bg-white/5"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </Link>

            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-[var(--gold-400)]/10 flex items-center justify-center mx-auto mb-4 border border-[var(--gold-400)]/20">
                <Crown className="w-6 h-6 text-[var(--gold-400)]" />
              </div>
              <h1 className="text-2xl font-[family-name:var(--font-playfair)] font-bold">
                Join <span className="text-gradient-gold">DRIVEIT</span>
              </h1>
              <p className="text-xs text-white/40 mt-1">
                Create your account in one tap with Google — no password required.
              </p>
            </div>

            {errorParam && (
              <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs flex items-start gap-2.5 mb-6 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-rose-200">Sign Up Could Not Complete</p>
                  <p className="mt-0.5 text-rose-300/80 leading-relaxed">
                    Google authorization was interrupted or cancelled. Please try again.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setLoading(true)
                void signIn('google', { callbackUrl: '/dashboard' })
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 transition disabled:opacity-60 cursor-pointer"
            >
              <Chrome className="w-4 h-4" />
              {loading ? 'Redirecting…' : 'Sign up with Google'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <ul className="mt-6 space-y-2 text-[11px] text-white/40">
              <li>• Saved addresses auto-fill at checkout</li>
              <li>• Loyalty points on every completed booking</li>
              <li>• Invoices and booking history in your dashboard</li>
            </ul>

            <p className="mt-6 text-center text-xs text-white/40">
              Already booked with us?{' '}
              <Link href="/login" className="text-[var(--gold-400)]">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </section>
    </>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading…</div>}>
      <SignupForm />
    </Suspense>
  )
}
