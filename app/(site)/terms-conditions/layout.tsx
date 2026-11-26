import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Terms & Conditions | DRIVEIT Luxury Car Rental Hyderabad',
  description:
    'Official rental terms, security deposit refund policy, fuel Full-to-Full standards, FASTag usage, and cancellation guarantees at DRIVEIT Luxury.',
  alternates: { canonical: '/terms-conditions' },
  robots: { index: true, follow: true },
}

export default function TermsConditionsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

