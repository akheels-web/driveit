import { Suspense } from 'react'
import type { Metadata } from 'next'

import { CheckoutClient } from './checkout-client'

export const metadata: Metadata = {
  title: 'Secure Checkout | DRIVEIT Luxury',
  description: 'Complete your DriveIt luxury booking securely.',
  // Never index a checkout page.
  robots: { index: false, follow: false },
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          Loading secure checkout…
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  )
}
