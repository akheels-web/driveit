"use client"

import React from 'react'
import { Phone, Calendar } from 'lucide-react'

export function About() {
  const handleCall = () => {
    window.location.href = 'tel:+918341341186'
  }

  return (
    <section className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Visit Our Location
          </h3>
          <p className="text-sm text-white/80">
            Experience luxury at our premium facility in Hyderabad
          </p>
        </div>
        
        {/* Call to Action Banner */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Experience Luxury?
            </h4>
            <p className="text-lg text-white/80 mb-8">
              Contact us today to book your premium transportation service. Our team is ready to make your journey exceptional.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleCall}
                className="flex items-center justify-center gap-2 text-black px-8 py-4 rounded-full text-lg font-medium hover:scale-105 transition-all duration-300 shadow-lg"
                style={{ backgroundColor: '#b48811' }}
              >
                <Phone className="w-5 h-5" />
                Call Now: +91 83413 41186
              </button>
              
              <button
                onClick={() => window.location.href = '/contactus'}
                className="flex items-center justify-center gap-2 text-white px-8 py-4 rounded-full text-lg font-medium hover:scale-105 transition-all duration-300 border border-gold hover:bg-gold hover:text-black shadow-lg"
              >
                <Calendar className="w-5 h-5" />
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/20 shadow-2xl">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.2137599390176!2d78.4565279!3d17.4015263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb97844e874967%3A0xec0fefe2fefa1e15!2sDriveit%20-%20Selfdrive%20Cars%20-%20Luxury%20Wedding%20Cars%20-%20Cabs%20for%20outstation%20-%20Luxury%20Buses!5e0!3m2!1sen!2sin!4v1756574982222!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'grayscale(1) brightness(0.55) contrast(1.25)' }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="DRIVEIT Location"
          />
          {/* Darkening overlay on map */}
          <div className="pointer-events-none absolute inset-0 bg-black/70" aria-hidden="true" />
          
          {/* Map Overlay Info */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
            <p className="text-xs text-white/80">
              📍 DRIVEIT - Luxury Transportation Services
            </p>
          </div>
          
          {/* Fullscreen button */}
          <button 
            onClick={() => window.open('https://maps.app.goo.gl/z6g9rBdGoT1gzxku8', '_blank')}
            className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30 text-white text-sm hover:bg-white/30 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open in Maps
          </button>
        </div>
     
      </div>
    </section>
  )
}