"use client"

import React from 'react'
import { ArrowLeft, FileText, Car, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TermsConditionsPage() {
  const handleGoBack = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#b48811' }}>
            <FileText className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Terms & <span style={{ color: '#b48811' }}>Conditions</span>
          </h1>
          <p className="text-zinc-400">
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
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}