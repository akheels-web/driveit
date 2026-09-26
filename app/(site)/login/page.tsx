'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowRight,
  ArrowLeft,
  Crown,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Info,
  Sparkles,
  PhoneCall,
  Compass,
  Star,
  FileCheck,
  Zap,
} from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const errorParam = searchParams.get('error')
  const loggedOutParam = searchParams.get('loggedOut')
  const reasonParam = searchParams.get('reason')

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  // If already authenticated and not explicitly in signed-out state, smoothly redirect to dashboard
  useEffect(() => {
    if (status === 'authenticated' && session?.user && loggedOutParam !== 'true') {
      router.replace(redirectTo)
    }
  }, [status, session, redirectTo, router, loggedOutParam])

  // Map NextAuth error codes to user-friendly luxury messaging
  const getAuthNotification = () => {
    if (loggedOutParam === 'true') {
      return {
        type: 'success',
        title: 'Signed Out Successfully',
        message: 'You have been securely signed out. Thank you for choosing DRIVEIT.',
      }
    }

    if (reasonParam === 'auth_required') {
      return {
        type: 'info',
        title: 'Authentication Required',
        message: 'Please sign in with Google to access your bookings, tax invoices, and KYC document vault.',
      }
    }

    if (reasonParam === 'session_expired') {
      return {
        type: 'info',
        title: 'Session Expired',
        message: 'Your security session has expired. Please sign in again to continue.',
      }
    }

    if (errorParam) {
      if (['OAuthSignin', 'OAuthCallback', 'OAuthCreateAccount', 'OAuthAccountNotLinked'].includes(errorParam)) {
        return {
          type: 'error',
          title: 'Google Sign-In Was Cancelled or Failed',
          message: 'We were unable to complete Google authorization. Please try again or check your account permissions.',
        }
      }
      if (errorParam === 'AccessDenied') {
        return {
          type: 'error',
          title: 'Access Denied',
          message: 'Access was denied. Please sign in with an authorized Google account.',
        }
      }
      if (errorParam === 'Configuration') {
        return {
          type: 'error',
          title: 'Sign-In Issue',
          message: 'Authentication could not be completed. Please try again or call our 24/7 concierge at +91 63000 41186.',
        }
      }
      return {
        type: 'error',
        title: 'Authentication Error',
        message: 'An unexpected issue occurred during sign in. Please try again.',
      }
    }

    return null
  }

  const notification = getAuthNotification()

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row overflow-x-hidden selection:bg-[var(--gold-400)] selection:text-black">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: THE VIP CLIENT ATELIER & PRESTIGE SHOWCASE (LEFT)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative w-full lg:w-7/12 xl:w-8/12 min-h-[460px] lg:min-h-screen overflow-hidden flex flex-col justify-between p-6 sm:p-10 lg:p-14 z-10 border-b lg:border-b-0 lg:border-r border-white/10">
        {/* Background Visual Asset */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/maybach-s680-night.png"
            alt="DRIVEIT Luxury Flagship Fleet Hyderabad"
            fill
            priority
            className="object-cover object-center scale-105"
            sizes="(max-width: 1024px) 100vw, 65vw"
          />
          {/* Multi-layered cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/90 lg:to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[var(--gold-500)]/15 via-transparent to-transparent" />
        </div>

        {/* Top Header: Brand Monogram & Live Status */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="DRIVEIT Luxury"
              width={160}
              height={48}
              className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-[var(--gold-400)]/30 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[11px] font-mono text-[var(--gold-400)] uppercase tracking-wider font-semibold">
              Concierge Active 24/7
            </span>
          </div>
        </div>

        {/* Center: Exclusive Membership Privileges Cards */}
        <div className="relative z-10 my-auto py-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--gold-400)]/10 border border-[var(--gold-400)]/30 text-[var(--gold-300)] text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              Customer Account Benefits
            </div>

            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-[family-name:var(--font-playfair)] font-bold text-white leading-tight">
              Luxury Mobility, <br />
              <span className="text-gradient-gold">Flawlessly Managed.</span>
            </h2>

            <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed">
              Sign in to manage your luxury car bookings, self-drive driving license verification, live chauffeur GPS tracking, and GST invoices.
            </p>

            {/* 3 Pillar Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md space-y-1.5 hover:border-[var(--gold-400)]/30 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-[var(--gold-400)]/10 flex items-center justify-center text-[var(--gold-400)]">
                  <Crown className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-white">Instant Booking</h4>
                <p className="text-[11px] text-white/50 leading-normal">
                  Saved customer details and 10-minute hold lock for your dates.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md space-y-1.5 hover:border-[var(--gold-400)]/30 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-400/10 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-white">Digital DL & KYC</h4>
                <p className="text-[11px] text-white/50 leading-normal">
                  Upload Driving License once for express self-drive departure.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md space-y-1.5 hover:border-[var(--gold-400)]/30 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400">
                  <Compass className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-semibold text-white">Live Radar & Invoices</h4>
                <p className="text-[11px] text-white/50 leading-normal">
                  Track chauffeur telematics radar and download GST tax invoices.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Testimonial Banner & Fleet Stat Ticker */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-[var(--gold-400)] text-[var(--gold-400)]" />
              ))}
            </div>
            <p className="text-xs text-white/70 italic">
              &ldquo;The Maybach arrival at HICC was seamless. Truly five-star chauffeur service.&rdquo;
              <span className="block text-[10px] text-white/40 not-italic mt-0.5">
                — Vikramaditya R. • Jubilee Hills, Hyderabad
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-white/50 shrink-0">
            <span>50+ Vehicles</span>
            <span>•</span>
            <span>1,200+ VIP Trips</span>
            <span>•</span>
            <span className="text-[var(--gold-400)]">4.9 ★ Rating</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: CUSTOMER ACCESS PORTAL & AUTHENTICATION (RIGHT)
          ───────────────────────────────────────────────────────────── */}
      <section className="w-full lg:w-5/12 xl:w-4/12 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-[#09090c] relative z-20">
        {/* Top Utility Nav */}
        <div className="flex items-center justify-between pb-8">
          <Link
            href="/cars"
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-[var(--gold-400)] transition group py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-[var(--gold-400)]" />
            Return to Fleet
          </Link>

          <a
            href="https://wa.me/916300041186"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            WhatsApp VIP Support
          </a>
        </div>

        {/* Center: Interactive Login Card */}
        <div className="my-auto max-w-sm w-full mx-auto space-y-6">
          {/* Authentic DRIVEIT Logo Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Link href="/" className="inline-block group">
                <Image
                  src="/logo.png"
                  alt="DRIVEIT Luxury"
                  width={180}
                  height={54}
                  className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </Link>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-[family-name:var(--font-playfair)] font-bold text-white">
                Customer Access Portal
              </h1>
              <p className="text-xs text-white/50 mt-1.5 leading-relaxed max-w-xs mx-auto">
                Sign in or create your customer account with Google in 1 click to manage reservations, track live dispatch, and book vehicles.
              </p>
            </div>
          </div>

          {/* Status & Error Notification Banner */}
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border flex items-start gap-3 text-xs ${
                notification.type === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : notification.type === 'info'
                  ? 'border-[var(--gold-400)]/30 bg-[var(--gold-400)]/10 text-[var(--gold-300)]'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
              }`}
            >
              {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
              {notification.type === 'info' && <Info className="w-4 h-4 text-[var(--gold-400)] shrink-0 mt-0.5" />}
              {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
              <div className="flex-1">
                <p className="font-semibold text-white">{notification.title}</p>
                <p className="mt-0.5 opacity-90 leading-relaxed">{notification.message}</p>
              </div>
            </motion.div>
          )}

          {/* Primary Action: Google 1-Tap Sign-In Button */}
          <div className="space-y-3">
            <button
              onClick={() => {
                setLoading(true)
                void signIn('google', { callbackUrl: redirectTo })
              }}
              disabled={loading}
              className="w-full flex items-center justify-between py-4 px-5 rounded-2xl text-sm font-bold bg-white hover:bg-zinc-100 text-black shadow-[0_4px_25px_rgba(255,255,255,0.15)] hover:shadow-[0_8px_35px_rgba(212,175,55,0.35)] transition-all duration-300 group cursor-pointer disabled:opacity-60"
            >
              <div className="flex items-center gap-3">
                <GoogleIcon />
                <span>{loading ? 'Connecting Securely…' : 'Continue with Google'}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            <p className="text-center text-[11px] text-white/40 leading-relaxed">
              Single Sign-On • Instant Account Creation • Zero Passwords
            </p>
          </div>

          {/* Customer Features Checklist */}
          <div className="pt-4 border-t border-white/10 space-y-2.5">
            <p className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">
              Customer Account Benefits:
            </p>
            <ul className="space-y-2 text-xs text-white/70">
              <li className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-400/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span>One-click vehicle reservations & 10-minute hold lock</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[var(--gold-400)]/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--gold-400)]" />
                </div>
                <span>VIP Document Vault & express KYC verification</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-emerald-400/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span>Instant GST tax invoice PDF downloads</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-4 h-4 rounded-full bg-[var(--gold-400)]/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[var(--gold-400)]" />
                </div>
                <span>10% welcome voucher on your first rental (WELCOME10)</span>
              </li>
            </ul>
          </div>

          {/* Car Owner Fleet Partner Prompt */}
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 text-center text-xs space-y-1">
            <span className="text-white/60 block">Are you a luxury car owner looking to list your vehicle?</span>
            <Link
              href="/partner/list-fleet"
              className="text-[var(--gold-400)] hover:text-[var(--gold-300)] font-semibold inline-flex items-center gap-1 hover:underline"
            >
              Apply to DRIVEIT Fleet Partner Program →
            </Link>
          </div>

          {/* Direct Concierge Phone Contact */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-white/60">
              <PhoneCall className="w-3.5 h-3.5 text-[var(--gold-400)]" />
              <span>Need booking help?</span>
            </div>
            <a
              href="tel:+916300041186"
              className="text-[var(--gold-400)] hover:underline font-semibold"
            >
              +91 63000 41186
            </a>
          </div>
        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-6 border-t border-white/10 text-center text-[10px] text-white/30 space-y-1">
          <p>
            By continuing, you agree to DRIVEIT&apos;s{' '}
            <Link href="/terms-conditions" className="text-white/50 hover:underline">
              Terms &amp; Conditions
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="text-white/50 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
          <p>© {new Date().getFullYear()} DRIVEIT Luxury Transportation • 256-Bit SSL Secured</p>
        </div>
      </section>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-[var(--gold-400)] border-t-transparent animate-spin" />
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--gold-400)]">
            Loading VIP Atelier...
          </p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
