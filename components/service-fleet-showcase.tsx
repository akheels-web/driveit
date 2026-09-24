'use client'

import { useRouter } from 'next/navigation'
import { CarCard } from '@/components/car-card'
import type { CarDetails } from '@/lib/cars'
import { useFleet } from '@/hooks/use-fleet'

interface ServiceFleetShowcaseProps {
  carNames: string[]
}

export function ServiceFleetShowcase({ carNames }: ServiceFleetShowcaseProps) {
  const router = useRouter()
  const { cars } = useFleet()

  // Map the requested car names to live CMS records
  const displayCars = carNames
    .map((name) => cars.find((c) => c.name === name))
    .filter((c): c is CarDetails => c !== undefined)

  const openBooking = (car: CarDetails) => {
    router.push(`/checkout?carId=${encodeURIComponent(car.slug || car.id)}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayCars.map((car) => (
        <CarCard key={car.id} car={car} onBook={openBooking} />
      ))}
    </div>
  )
}
