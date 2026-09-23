'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Chrome, Lock, X } from 'lucide-react'
import { signIn } from 'next-auth/react'

import { SiteHeader } from '@/components/site-header'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const [loading, setLoading] = useState(false)

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
            <Link
              href="/"
              className="absolute top-4 right-4 text-white/40 hover:text-[var(--gold-400)] p-1.5 rounded-full hover:bg-white/5"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </Link>

            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-[var(--gold-400)]/10 flex items-center justify-center mx-auto mb-4 border border-[var(--gold-400)]/20">
                <Lock className="w-6 h-6 text-[var(--gold-400)]" />
              </div>
              <h1 className="text-2xl font-[family-name:var(--font-playfair)] font-bold">
                Sign in to <span className="text-gradient-gold">DRIVEIT</span>
              </h1>
              <p className="text-xs text-white/40 mt-1">Manage bookings, invoices and saved cars</p>
            </div>

            {/*
              Google is the only configured provider. The previous email/password
              form called a `credentials` provider that did not exist, so it could
              never succeed — email/password can be added back once a provider
              (and password storage) exists.
            */}
            <button
              onClick={() => {
                setLoading(true)
                void signIn('google', { callbackUrl: redirectTo })
              }}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 transition disabled:opacity-60"
            >
              <Chrome className="w-4 h-4" />
              {loading ? 'Redirecting…' : 'Continue with Google'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="mt-6 text-center text-[11px] text-white/35 leading-relaxed">
              We only support Google sign-in today. The same account is used for the dashboard,
              invoices and loyalty rewards — no separate password to remember.
            </p>

            <div className="mt-6 text-center">
              <Link href="/cars" className="text-xs text-[var(--gold-400)]">
                Continue browsing the fleet →
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading…</div>}
    >
      <LoginForm />
    </Suspense>
  )
}
