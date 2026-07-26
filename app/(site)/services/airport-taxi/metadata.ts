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
  title: 'Airport Taxi & VIP Transfers in Hyderabad | DRIVEIT',
  description:
    'Premium airport taxi and VIP transfers in Hyderabad, serving RGIA and Begumpet. Chauffeur-driven pickups, luxury sedans & SUVs, 24/7 concierge, and on-time arrivals to all major areas.',
  keywords: [
    'Hyderabad airport taxi',
    'RGIA airport transfer',
    'Begumpet airport taxi',
    'VIP airport pickup Hyderabad',
    'chauffeur airport transfer Hyderabad',
    'luxury airport cab Hyderabad',
    ...AREAS,
  ],
  alternates: { canonical: '/services/airport-taxi' },
  openGraph: {
    title: 'Airport Taxi & VIP Transfers in Hyderabad',
    description:
      'Luxury chauffeur airport transfers to and from RGIA & Begumpet. Executive sedans and SUVs with professional drivers across Hyderabad.',
    url: '/services/airport-taxi',
    type: 'website',
    images: [
      {
        url: '/og/airport-taxi.jpg',
        width: 1200,
        height: 630,
        alt: 'DRIVEIT Airport Taxi Hyderabad',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}
