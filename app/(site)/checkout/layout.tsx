import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Private Reservation Checkout | DRIVEIT Luxury',
  description: 'Secure luxury car reservation checkout with 10-minute concurrency hold.',
  robots: { index: false, follow: false },
}

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

