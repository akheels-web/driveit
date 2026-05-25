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
  title: 'Luxury Car Rental in Hyderabad – Chauffeur & Self‑Drive | DRIVEIT',
  description:
    'Hire luxury cars in Hyderabad with professional chauffeurs or self‑drive. Premium sedans & SUVs, VIP experience, airport transfers, and citywide coverage across top Hyderabad areas.',
  keywords: [
    'luxury car rental Hyderabad',
    'chauffeur car Hyderabad',
    'self drive luxury car Hyderabad',
    'VIP car hire Hyderabad',
    'airport transfer luxury car Hyderabad',
    ...AREAS,
  ],
  alternates: { canonical: '/services/luxury-car-rental' },
  openGraph: {
    title: 'Luxury Car Rental in Hyderabad – DRIVEIT',
    description:
      'Premium chauffeur and self‑drive luxury cars. Book executive sedans and SUVs with citywide service across Hyderabad.',
    url: '/services/luxury-car-rental',
    type: 'website',
    images: [
      {
        url: '/og/luxury-car-rental.jpg',
        width: 1200,
        height: 630,
        alt: 'DRIVEIT Luxury Car Rental Hyderabad',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}
