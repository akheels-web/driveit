import React from 'react'
import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { CarNotFound } from '@/components/car-not-found'

export const metadata: Metadata = {
  title: '404 - Off Route | DRIVEIT Luxury Fleet Hyderabad',
  description: 'The requested route or luxury vehicle dossier could not be found. Return to DRIVEIT showroom to explore our 50+ luxury cars.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between">
      <SiteHeader />
      <main className="flex-1 flex flex-col justify-center">
        <CarNotFound />
      </main>
      <SiteFooter />
    </div>
  )
}
