import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services – Luxury Transport, Private Jets, Yachts & More in Hyderabad | DRIVEIT',
  description:
    'Explore all DRIVEIT services in Hyderabad: luxury car rentals, private jet charters, yacht experiences, corporate transportation, airport transfers, and more.',
  alternates: { canonical: '/services' },
  openGraph: {
    title: 'DRIVEIT Services – Hyderabad',
    description:
      'One destination for luxury mobility in Hyderabad: cars, jets, yachts, buses, and more with concierge-level service.',
    url: '/services',
    type: 'website',
    images: [
      { url: '/og/services.jpg', width: 1200, height: 630, alt: 'DRIVEIT Services Hyderabad' },
    ],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
}
