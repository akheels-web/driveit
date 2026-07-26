import type { Metadata } from 'next'

const AREAS = [
  'Hyderabad',
  'Hussain Sagar',
  'Necklace Road',
  'Tank Bund',
  'Gachibowli',
  'Madhapur',
  'HITEC City',
  'Jubilee Hills',
  'Banjara Hills',
]

export const metadata: Metadata = {
  title: 'Yacht Services in Hyderabad – Private Yacht & Luxury Boat Rentals | DRIVEIT',
  description:
    'Private yacht and luxury boat experiences in Hyderabad for celebrations, corporate events, and romantic getaways. Curated hospitality and VIP arrangements.',
  keywords: [
    'yacht services Hyderabad',
    'luxury boat Hyderabad',
    'private yacht Hyderabad',
    'yacht party Hyderabad',
    'corporate yacht event Hyderabad',
    ...AREAS,
  ],
  alternates: { canonical: '/services/yacht-services' },
  openGraph: {
    title: 'Yacht Services in Hyderabad – DRIVEIT',
    description:
      'Luxury yacht and boat rentals in Hyderabad with concierge service for events and private occasions.',
    url: '/services/yacht-services',
    type: 'website',
    images: [
      { url: '/og/yacht-services.jpg', width: 1200, height: 630, alt: 'DRIVEIT Yacht Services Hyderabad' },
    ],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
}
