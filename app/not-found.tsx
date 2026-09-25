import React from 'react'
import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CarNotFound } from '@/components/car-not-found'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: '404 - Off Route | DRIVEIT Luxury Fleet Hyderabad',
  description: 'The requested route could not be found. Return to DRIVEIT showroom.',
}

export default function GlobalNotFound() {
  return (
    <div className={`dark min-h-screen bg-[#050505] text-white flex flex-col justify-between antialiased font-sans ${playfair.variable} selection:bg-[var(--gold-400)] selection:text-black`}>
      <SiteHeader />
      <main className="flex-1 flex flex-col justify-center">
        <CarNotFound />
      </main>
      <SiteFooter />
    </div>
  )
}
