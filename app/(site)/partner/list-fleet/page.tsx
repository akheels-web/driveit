import { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { PartnerConsignmentForm } from './partner-form'
import { ShieldCheck, DollarSign, Users, Award, Lock, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Consign Your Luxury Fleet | DRIVEIT Partner Program',
  description:
    'Monetize your idle supercar or luxury car with DRIVEIT. 100% insured, real-time GPS tracking, and vetted VIP clientele with high-yield monthly returns.',
  alternates: {
    canonical: '/partner/list-fleet',
  },
}

export default function ListFleetPartnerPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[var(--luxury-bg)] text-white min-h-screen pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[var(--gold-400)]/10 text-[var(--gold-400)] border border-[var(--gold-400)]/20 mb-4 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" /> Fleet Consignment & Partner Program
            </span>
            <h1 className="text-3xl md:text-5xl font-[family-name:var(--font-playfair)] font-bold mb-4">
              Monetize Your <span className="text-gradient-gold">Luxury Fleet</span>
            </h1>
            <p className="text-white/60 text-sm md:text-base leading-relaxed">
              Partner with Hyderabad's premier luxury mobility platform. Transform your idle Porsche, Rolls-Royce, Mercedes, or exotic SUV into high-yield passive revenue under commercial insurance protection.
            </p>
          </div>

          {/* 3 Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--gold-400)]/10 flex items-center justify-center text-[var(--gold-400)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Full Commercial Insurance</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Comprehensive 100% coverage, 24/7 telematics GPS tracking, geofencing speed monitors, and zero liability on your personal policy.
              </p>
            </div>

            <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--gold-400)]/10 flex items-center justify-center text-[var(--gold-400)]">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Vetted VIP Clientele Only</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                No open marketplace risks. Every driver undergoes mandatory KYC Aadhaar & Driving License verification, and security deposits up to ₹50,000.
              </p>
            </div>

            <div className="rounded-2xl p-6 bg-white/[0.02] border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--gold-400)]/10 flex items-center justify-center text-[var(--gold-400)]">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">High-Yield Monthly Returns</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Earn ₹1,50,000 to ₹4,00,000+ monthly with guaranteed bi-weekly payouts and transparent transaction logs in your partner dashboard.
              </p>
            </div>
          </div>

          {/* Consignment Application Form */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-[family-name:var(--font-playfair)] font-bold text-white">
                Submit Your Vehicle for Review
              </h2>
              <p className="text-xs text-white/40 mt-1">
                Zero listing fees. We inspect and onboard your vehicle within 48 hours.
              </p>
            </div>

            <PartnerConsignmentForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
