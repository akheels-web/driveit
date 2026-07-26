import type { Metadata } from 'next'

const AREAS = [
  'Hyderabad', 'Secunderabad', 'RGIA', 'Shamshabad', 'Gachibowli', 'Madhapur', 'HITEC City', 'Banjara Hills', 'Jubilee Hills', 'Kukatpally'
]

export const metadata: Metadata = {
  title: 'Pickup & Dropoff Services in Hyderabad – On‑Time Chauffeur | DRIVEIT',
  description:
    'Reliable pickup and dropoff services in Hyderabad with professional chauffeurs. On‑time rides for business, events, and daily commutes.',
  keywords: [
    'pickup dropoff Hyderabad',
    'point to point cab Hyderabad',
    'chauffeur pickup Hyderabad',
    'city ride Hyderabad',
    'on time cab Hyderabad',
    ...AREAS,
  ],
  alternates: { canonical: '/services/pickup-dropoff' },
  openGraph: {
    title: 'Pickup & Dropoff Services in Hyderabad – DRIVEIT',
    description:
      'On‑time chauffeur rides for business and personal travel across Hyderabad.',
    url: '/services/pickup-dropoff',
    type: 'website',
    images: [
      { url: '/og/pickup-dropoff.jpg', width: 1200, height: 630, alt: 'DRIVEIT Pickup & Dropoff Hyderabad' },
    ],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
}
