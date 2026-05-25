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
  title: 'Private Jet Services in Hyderabad – Charters from Begumpet & RGIA | DRIVEIT',
  description:
    'Luxury private jet charters in Hyderabad covering Begumpet and RGIA. On‑demand VIP flights, concierge service, gourmet dining, pet‑friendly travel, and chauffeur transfers across Hyderabad’s prime areas.',
  keywords: [
    'private jet Hyderabad',
    'Hyderabad jet charter',
    'private jet Begumpet',
    'private jet RGIA',
    'VIP charter Hyderabad',
    'luxury aviation Hyderabad',
    'jet rentals Hyderabad',
    ...AREAS,
  ],
  alternates: { canonical: '/services/private-jet-services' },
  openGraph: {
    title: 'Private Jet Services in Hyderabad – DRIVEIT',
    description:
      'Private jet charters from Begumpet & RGIA with premium concierge, gourmet dining, pet-friendly cabins, and VIP ground transfers across Hyderabad.',
    url: '/services/private-jet-services',
    type: 'website',
    images: [
      {
        url: '/og/private-jet-services.jpg',
        width: 1200,
        height: 630,
        alt: 'DRIVEIT Private Jet Services Hyderabad',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}
