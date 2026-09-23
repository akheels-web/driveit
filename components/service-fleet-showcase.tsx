'use client'

import { useState } from "react"
import { CarCard } from "@/components/car-card"
import { CarBookingModal } from "@/components/car-booking-modal"
import type { CarDetails } from "@/lib/cars"
import { useFleet } from "@/hooks/use-fleet"

interface ServiceFleetShowcaseProps {
  carNames: string[]
}

export function ServiceFleetShowcase({ carNames }: ServiceFleetShowcaseProps) {
  const { cars } = useFleet()
  const [selectedCar, setSelectedCar] = useState<CarDetails | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Map the requested car names to live CMS records
  const displayCars = carNames
    .map(name => cars.find(c => c.name === name))
    .filter((c): c is CarDetails => c !== undefined)

  const openBooking = (car: CarDetails) => {
    setSelectedCar(car)
    setModalOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayCars.map(car => (
          <CarCard key={car.id} car={car} onBook={openBooking} />
        ))}
      </div>

      <CarBookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        car={selectedCar ? {
          id: selectedCar.id,
          name: selectedCar.name,
          image: selectedCar.src,
          pricePerDay: selectedCar.price,
          priceDisplay: selectedCar.priceDisplay,
          category: selectedCar.category
        } : { name: '', image: '', pricePerDay: 0, priceDisplay: '' }}
      />
    </>
  )
}
