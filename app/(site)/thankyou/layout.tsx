import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Request Confirmed | DRIVEIT Luxury',
  description: 'Your luxury car reservation or bespoke concierge inquiry has been received.',
  robots: { index: false, follow: false },
}

export default function ThankYouLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

