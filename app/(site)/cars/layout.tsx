import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "Our Luxury Fleet | Rolls Royce, Mercedes, BMW Rental Hyderabad - DRIVEIT",
  description: "Explore our premium luxury car fleet in Hyderabad. Rent Rolls Royce, Mercedes, BMW, SUVs, and exotic cars with professional chauffeurs for any occasion.",
  alternates: {
    canonical: "/cars",
  },
  openGraph: {
    title: "Our Luxury Fleet | DRIVEIT Luxury Hyderabad",
    description: "Explore our premium luxury car fleet in Hyderabad. Rent Rolls Royce, Mercedes, BMW, and exotic cars.",
    url: "/cars",
    type: "website",
  },
}

export default function CarsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
