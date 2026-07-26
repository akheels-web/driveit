import type { Metadata } from 'next'

const AREAS = [
  'Hyderabad', 'Secunderabad', 'RGIA', 'Shamshabad', 'Gachibowli', 'Madhapur', 'HITEC City', 'Banjara Hills', 'Jubilee Hills', 'Kukatpally'
]

export const metadata: Metadata = {
  title: 'Intercity Cabs from Hyderabad – Outstation Taxi & Chauffeur | DRIVEIT',
  description:
    'Book intercity cabs from Hyderabad to all major destinations. Premium sedans & SUVs with professional chauffeurs and 24/7 support.',
  keywords: [
    'intercity cabs Hyderabad',
    'outstation taxi Hyderabad',
    'Hyderabad to Bangalore cab',
    'Hyderabad to Vijayawada cab',
    'Hyderabad to Warangal cab',
    ...AREAS,
  ],
  alternates: { canonical: '/services/intercity-cabs' },
  openGraph: {
    title: 'Intercity Cabs from Hyderabad – DRIVEIT',
    description:
      'Outstation taxi services with executive sedans and SUVs. Safe and reliable chauffeurs for long-distance trips from Hyderabad.',
    url: '/services/intercity-cabs',
    type: 'website',
    images: [
      { url: '/og/intercity-cabs.jpg', width: 1200, height: 630, alt: 'DRIVEIT Intercity Cabs Hyderabad' },
    ],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
}
