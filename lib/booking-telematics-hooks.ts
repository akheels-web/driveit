import type { CollectionBeforeChangeHook } from 'payload'
import { calculateTripKilometers } from './telematics'

/**
 * Automatically snapshots vehicle odometer and reconciles extra-KM charges
 * when bookings are dispatched (confirmed) or returned (completed).
 */
export const stampBookingTelematics: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const doc = data as Record<string, any>
  const before = originalDoc as Record<string, any> | undefined

  if (!doc) return doc

  // Ensure telematics object exists
  doc.telematics = doc.telematics || {}

  // 1. Booking becomes CONFIRMED (Vehicle Dispatched / Trip Starts)
  if (
    doc.status === 'confirmed' &&
    (!before || before.status !== 'confirmed') &&
    !doc.telematics.startOdometerKm
  ) {
    try {
      // Find the car by slug to snapshot the current GPS odometer
      const carSlug = doc.carSlug || doc.carId
      if (carSlug) {
        const carRes = await req.payload.find({
          collection: 'cars',
          where: { slug: { equals: carSlug } },
          limit: 1,
          depth: 0,
        })

        const car = carRes.docs[0]
        if (car) {
          const startKm = Number(car.currentOdometerKm || 0)
          const days = Number(doc.days || 1)
          const extraRate = Number(car.extraKmRate || 75)
          const allowedKm = days * 100

          doc.telematics.startOdometerKm = startKm
          doc.telematics.allowedKm = allowedKm
          doc.telematics.extraKmRate = extraRate
        }
      }
    } catch (err) {
      console.error('[telematics] Error snapshotting start odometer:', err)
    }
  }

  // 2. Booking becomes COMPLETED (Vehicle Returned)
  if (
    doc.status === 'completed' &&
    before?.status !== 'completed' &&
    !doc.telematics.endOdometerKm
  ) {
    try {
      const carSlug = doc.carSlug || doc.carId
      if (carSlug) {
        const carRes = await req.payload.find({
          collection: 'cars',
          where: { slug: { equals: carSlug } },
          limit: 1,
          depth: 0,
        })

        const car = carRes.docs[0]
        if (car) {
          const endKm = Number(car.currentOdometerKm || doc.telematics.startOdometerKm || 0)
          const startKm = Number(doc.telematics.startOdometerKm || endKm)
          const days = Number(doc.days || 1)
          const extraRate = Number(doc.telematics.extraKmRate || car.extraKmRate || 75)

          const tripCalc = calculateTripKilometers({
            startOdometerKm: startKm,
            endOdometerKm: endKm,
            days,
            extraKmRate: extraRate,
          })

          doc.telematics.endOdometerKm = endKm
          doc.telematics.totalKmDriven = tripCalc.totalKmDriven
          doc.telematics.allowedKm = tripCalc.allowedKm
          doc.telematics.extraKmDriven = tripCalc.extraKmDriven
          doc.telematics.extraKmRate = tripCalc.extraKmRate
          doc.telematics.extraKmCharge = tripCalc.extraKmCharge

          // Reconcile with security deposit if excess distance was driven
          if (tripCalc.extraKmCharge > 0 && doc.securityDepositAmount && Number(doc.securityDepositAmount) > 0) {
            const reason = `Excess mileage: ${tripCalc.extraKmDriven} km @ ₹${tripCalc.extraKmRate}/km = ₹${tripCalc.extraKmCharge.toLocaleString('en-IN')}`
            doc.depositRefundDeductionReason = doc.depositRefundDeductionReason
              ? `${doc.depositRefundDeductionReason}; ${reason}`
              : reason
          }
        }
      }
    } catch (err) {
      console.error('[telematics] Error snapshotting return odometer:', err)
    }
  }

  return doc
}
