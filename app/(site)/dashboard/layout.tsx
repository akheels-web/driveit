import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Member Dashboard | DRIVEIT Luxury',
  description: 'Manage your luxury vehicle bookings, KYC verification vault, wishlist, and deposit status.',
  robots: { index: false, follow: false },
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

