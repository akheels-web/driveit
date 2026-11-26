import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Member Sign In | DRIVEIT Luxury',
  description: 'Sign in to your DRIVEIT Luxury account to manage reservations, chauffeur dispatches, and KYC vault.',
  alternates: { canonical: '/login' },
  robots: { index: false, follow: true },
}

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

