import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "Our Luxury Fleet | Rolls Royce, Mercedes, BMW Rental Hyderabad",
  description: "Explore our premium luxury car fleet in Hyderabad. Rent Rolls Royce, Mercedes, BMW, SUVs, and exotic cars with professional chauffeurs for any occasion.",
}

export default function CarsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
