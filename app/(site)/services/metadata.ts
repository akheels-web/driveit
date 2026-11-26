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
      { url: '/luxury-flagship-cars-in-black-studio.webp', width: 1920, height: 1072, alt: 'DRIVEIT Services Hyderabad' },
    ],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
}
