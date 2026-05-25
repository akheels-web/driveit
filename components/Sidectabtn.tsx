'use client'

import React, { useState, useEffect } from 'react'
import { Phone, MessageCircle, Mail } from 'lucide-react'

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

  const handleContactUs = () => {
    window.location.href = '/contact'
  }

  if (!isVisible) return null

  return (
    <div className="fixed right-4 bottom-20 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsApp}
        className="group relative bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
        <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          WhatsApp
        </div>
      </button>

      {/* Call Button */}
      <button
        onClick={handleCall}
        className="group relative text-white p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
        style={{ backgroundColor: '#b48811' }}
        aria-label="Call for appointment"
      >
        <Phone className="w-4 h-4" />
        <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Call Now
        </div>
      </button>

    </div>
  )
}

export default Sidectabtn
