import type { Metadata } from 'next'

const AREAS = [
  'Hyderabad', 'Secunderabad', 'RGIA', 'Shamshabad', 'Gachibowli', 'Madhapur', 'HITEC City', 'Banjara Hills', 'Jubilee Hills', 'Kukatpally'
]

export const metadata: Metadata = {
  title: 'Luxury Buses in Hyderabad – Premium Group Transportation | DRIVEIT',
  description:
    'Hire luxury buses and coaches in Hyderabad for corporate events, weddings, and group travel. Comfortable seating, AC, and professional drivers.',
  keywords: [
    'luxury bus Hyderabad',
    'coach rental Hyderabad',
    'group transport Hyderabad',
    'wedding buses Hyderabad',
    'corporate buses Hyderabad',
    ...AREAS,
  ],
  alternates: { canonical: '/services/luxury-buses' },
  openGraph: {
    title: 'Luxury Buses in Hyderabad – DRIVEIT',
    description:
      'Premium buses and coaches with professional drivers for events and group travel across Hyderabad.',
    url: '/services/luxury-buses',
    type: 'website',
    images: [
      { url: '/og/luxury-buses.jpg', width: 1200, height: 630, alt: 'DRIVEIT Luxury Buses Hyderabad' },
    ],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
}
