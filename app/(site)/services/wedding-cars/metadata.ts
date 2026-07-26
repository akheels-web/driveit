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
  title: 'Wedding Car Rental Hyderabad | Rolls Royce, BMW | DRIVEIT Luxury',
  description:
    'Rent premium luxury wedding cars in Hyderabad. Hire chauffeur-driven Rolls Royce, BMW, Mercedes and vintage cars for an elegant bridal and groom entry.',
  keywords: [
    'wedding cars Hyderabad',
    'bridal car Hyderabad',
    'groom car Hyderabad',
    'wedding car rental Hyderabad',
    'vintage wedding car Hyderabad',
    ...AREAS,
  ],
  alternates: { canonical: '/services/wedding-cars' },
  openGraph: {
    title: 'Wedding Cars in Hyderabad – DRIVEIT',
    description:
      'Luxury wedding car rentals with professional chauffeurs. Bridal and groom cars, guest logistics, and event transfers across Hyderabad.',
    url: '/services/wedding-cars',
    type: 'website',
    images: [
      { url: '/og/wedding-cars.jpg', width: 1200, height: 630, alt: 'DRIVEIT Wedding Cars Hyderabad' },
    ],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
}
