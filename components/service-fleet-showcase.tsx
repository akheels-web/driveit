'use client'

import { useState } from "react"
import { CarCard } from "@/components/car-card"
import { CarBookingModal } from "@/components/car-booking-modal"
import { carsData } from "@/lib/cars"

interface ServiceFleetShowcaseProps {
  carNames: string[]
}

export function ServiceFleetShowcase({ carNames }: ServiceFleetShowcaseProps) {
  const [selectedCar, setSelectedCar] = useState<typeof carsData[0] | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Map the requested car names to the actual car objects from centralized data
  const displayCars = carNames
    .map(name => carsData.find(c => c.name === name))
    .filter((c): c is typeof carsData[0] => c !== undefined)

  const openBooking = (car: typeof carsData[0]) => {
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
