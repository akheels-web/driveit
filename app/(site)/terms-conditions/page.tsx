"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, Car, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-[var(--luxury-bg)] text-zinc-100 pb-16">
      <div className="mx-auto max-w-4xl px-4 pt-12 pb-16">
        {/* Top Navigation */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-[var(--gold-400)] transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-[var(--gold-400)] shadow-[0_0_30px_rgba(212,175,55,0.3)]">
            <FileText className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] text-white mb-4">
            Terms & <span className="text-gradient-gold">Conditions</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto">
            Important information about using our luxury transportation services
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Car className="w-5 h-5" style={{ color: '#b48811' }} />
              Service Terms
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              By using DRIVEIT's luxury transportation services, you agree to these terms and conditions. Our services include luxury car rentals, private jet services, and yacht services, subject to availability and booking confirmation.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: '#b48811' }} />
              Booking & Cancellation
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Bookings must be confirmed at least 24 hours in advance. Cancellations made within 24 hours of the scheduled service may incur charges. Full payment is required at the time of booking confirmation.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" style={{ color: '#b48811' }} />
              User Responsibilities
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              Users are responsible for providing accurate booking information, arriving on time, and treating our vehicles and staff with respect. Any damage to vehicles will result in additional charges.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" style={{ color: '#b48811' }} />
              Service Guarantee
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              We guarantee the highest quality of service and vehicle maintenance. In case of any issues, we will provide alternative arrangements or full refunds as appropriate.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
            <h2 className="text-xl font-semibold text-white mb-4">
              Contact Information
            </h2>
            <p className="text-zinc-400 leading-relaxed">
              For questions about these terms or to make special arrangements, please contact us at +91 63000 41186 or through our contact form.
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 text-zinc-500 hover:text-[var(--gold-400)] transition-colors mx-auto text-sm py-2 px-4 rounded-lg hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}