import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "Contact DRIVEIT Luxury | Book Luxury Car Hyderabad",
  description: "Contact DRIVEIT Luxury in Hyderabad. Rent premium luxury cars, book wedding transportation, airport taxi service, or corporate car hire easily.",
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
