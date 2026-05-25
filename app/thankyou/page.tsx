"use client"

import React from 'react'
import { CheckCircle, Phone, MessageSquare, ArrowLeft } from 'lucide-react'
import Image from 'next/image'

export default function ThankYouPage() {
  const handleCall = () => {
    window.location.href = 'tel:+918341341186'
  }

  const handleGoBack = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#b48811' }}>
            <CheckCircle className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Thank You!
          </h1>
          <p className="text-lg text-zinc-400 max-w-md mx-auto">
            Your luxury transportation request has been received successfully. Our team will contact you shortly.
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-zinc-900 rounded-2xl p-6 md:p-8 border border-zinc-800 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            What happens next?
          </h2>
          <div className="space-y-4 text-left max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#b48811' }}>
                1
              </div>
              <p className="text-zinc-400 text-sm">
                Our luxury concierge team will review your request within 30 minutes
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#b48811' }}>
                2
              </div>
              <p className="text-zinc-400 text-sm">
                We'll call you to discuss details and confirm your booking
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#b48811' }}>
                3
              </div>
              <p className="text-zinc-400 text-sm">
                Your luxury vehicle will be prepared and delivered as scheduled
              </p>
            </div>
          </div>
        </div>

        {/* Contact Options */}
        <div className="space-y-4 mb-8">
          <button
            onClick={handleCall}
            className="w-full flex items-center justify-center gap-3 text-black px-6 py-4 rounded-lg font-semibold hover:scale-105 transition-all duration-300"
            style={{ backgroundColor: '#b48811' }}
          >
            <Phone className="w-5 h-5" />
            Call Now: +91 83413 41186
          </button>
          
          <button
            onClick={() => window.location.href = '/contactus'}
            className="w-full flex items-center justify-center gap-3 text-white px-6 py-4 rounded-lg font-semibold border border-zinc-700 hover:border-gold hover:bg-zinc-800 transition-all duration-300"
          >
            <MessageSquare className="w-5 h-5" />
            Send Another Message
          </button>
        </div>

        {/* Back to Home */}
        <button
          onClick={handleGoBack}
          className="flex items-center justify-center gap-2 text-zinc-500 hover:text-white transition-colors mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Luxury Image */}
        <div className="mt-12 relative">
          <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-zinc-800">
            <Image
              src="/luxury-flagship-cars-in-black-studio.png"
              alt="DRIVEIT Luxury"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="mt-4">
            <p className="text-sm text-zinc-500">
              Experience luxury with <span style={{ color: '#b48811' }}>DRIVEIT</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}