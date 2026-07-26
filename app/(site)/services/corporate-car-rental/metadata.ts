import type { Metadata } from 'next'

const AREAS = [
  'Hyderabad',
  'Begumpet',
  'RGIA',
  'Shamshabad',
  'Secunderabad',
  'Gachibowli',
  'Madhapur',
  'HITEC City',
  'Jubilee Hills',
  'Banjara Hills',
  'Kondapur',
  'Kokapet',
  'Financial District',
  'Nanakramguda',
  'Somajiguda',
  'Kukatpally',
  'Manikonda',
  'LB Nagar',
  'Uppal',
  'Miyapur',
  'Kompally',
  'Dilsukhnagar',
]

export const metadata: Metadata = {
  title: 'Corporate Car Rental in Hyderabad – Executive Chauffeur Services | DRIVEIT',
  description:
    'Premium corporate car rental in Hyderabad with executive sedans and SUVs, professional chauffeurs, airport transfers, and event logistics across major business districts.',
  keywords: [
    'corporate car rental Hyderabad',
    'executive chauffeur Hyderabad',
    'business travel Hyderabad',
    'corporate airport transfer Hyderabad',
    'conference transportation Hyderabad',
    ...AREAS,
  ],
  alternates: { canonical: '/services/corporate-car-rental' },
  openGraph: {
    title: 'Corporate Car Rental in Hyderabad – DRIVEIT',
    description:
      'Executive chauffeur-driven cars for corporates, events, and airport transfers across Hyderabad’s business hubs.',
    url: '/services/corporate-car-rental',
    type: 'website',
    images: [
      { url: '/og/corporate-car-rental.jpg', width: 1200, height: 630, alt: 'DRIVEIT Corporate Car Rental Hyderabad' },
    ],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
}
