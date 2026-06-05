'use client'

import React, { useState, useEffect } from 'react'
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa'

function Sidectabtn() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past hero section (approximately 92vh)
      const heroHeight = window.innerHeight * 0.92
      setIsVisible(window.scrollY > heroHeight)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleWhatsApp = () => {
    const phoneNumber = '918341341186'
    const message = 'Hi! I would like to book an appointment for your luxury services.'
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleCall = () => {
    window.location.href = 'tel:+918341341186'
  }

  if (!isVisible) return null

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
      {/* Call Button */}
      <button
        onClick={handleCall}
        className="group relative text-black p-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, var(--gold-300), var(--gold-400), var(--gold-500))' }}
        aria-label="Call for appointment"
      >
        <FaPhoneAlt className="w-5 h-5" />
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Call Now
        </div>
      </button>

      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="group relative bg-[#25D366] hover:bg-[#128C7E] text-white p-3.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="Contact via WhatsApp"
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-30" />
        <FaWhatsapp className="w-6 h-6 relative z-10" />
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-1.5 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          WhatsApp
        </div>
      </button>
    </div>
  )
}

export default Sidectabtn
