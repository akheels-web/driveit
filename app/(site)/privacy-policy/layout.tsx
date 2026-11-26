import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Privacy Policy | DRIVEIT Luxury Transportation Hyderabad',
  description:
    'Read the DRIVEIT Luxury privacy policy covering customer bookings, self-drive KYC vault encryption, cookies, and data protection standards.',
  alternates: { canonical: '/privacy-policy' },
  robots: { index: true, follow: true },
}

export default function PrivacyPolicyLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

