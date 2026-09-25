'use client'

import { useRef, useState, useMemo } from 'react'
import { motion, useInView } from 'motion/react'
import { Car, MapPin, CalendarDays, Clock, User, Phone, Mail, ArrowRight, CheckCircle, ChevronDown, Info, ShieldCheck, Users, PartyPopper, Plane, Fuel } from 'lucide-react'
import { useFleet } from '@/hooks/use-fleet'
import { LuxurySelect } from '@/components/luxury-select'
import { LuxuryDatePicker } from '@/components/luxury-date-picker'

const popularLocations = [
  "RGIA Airport (Shamshabad)",
  "Jubilee Hills",
  "Banjara Hills",
  "HITEC City",
  "Gachibowli",
  "Madhapur",
  "Kondapur",
  "Kokapet",
  "Financial District",
  "Secunderabad",
  "Begumpet",
  "Kukatpally",
]

const timeSlots = [
  "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM",
]

const occasions = [
  "Airport Transfer",
  "Wedding / Pre-Wedding",
  "Corporate Meeting",
  "Outstation Trip",
  "City Tour / Leisure",
  "Other"
]

export function BookingSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" })
  // Fleet comes from the CMS instead of the bundled static catalogue.
  const { cars: carsData } = useFleet()

  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    tripType: "One-Way", // One-Way, Round-Trip
    carId: "",
    driverOption: "Chauffeur Driven",
    pickup: "",
    dropoff: "",
    pickupDate: "",
    pickupTime: "",
    returnDate: "",
    returnTime: "",
    passengers: "4",
    occasion: "",
    flightNumber: "",
    airportTerminal: "RGIA Shamshabad — Domestic Arrival",
    name: "",
    phone: "",
    email: "",
    notes: "",
  })

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // Filter vehicles according to passenger capacity
  const filteredCars = useMemo(() => {
    if (!form.passengers) return carsData
    const count = parseInt(form.passengers, 10)
    if (isNaN(count)) return carsData

    if (count <= 2) {
      // 1-2 passengers: sports cars (2-seater) and 4/5 seater sedans/SUVs (excludes 7-seaters)
      return carsData.filter((car) => car.seats <= 5)
    }

    if (count === 3 || count === 4) {
      // Exactly 3-4 passengers: strictly 4 or 5 seaters, NOT 7 seaters
      return carsData.filter((car) => car.seats === 4 || car.seats === 5)
    }

    if (count === 5) {
      // 5 passengers: strictly 5 seaters
      return carsData.filter((car) => car.seats === 5)
    }

    if (count === 6 || count === 7) {
      // 6-7 passengers: 7 or 8 seaters (Fortuner, Crysta, Vellfire, GLS, Q7)
      return carsData.filter((car) => car.seats === 7 || car.seats === 8)
    }

    if (count >= 8) {
      // 8+ passengers: high-capacity vans & commuter buses
      return carsData.filter((car) => car.seats >= 8)
    }

    return carsData
  }, [carsData, form.passengers])

  const handleCarSelect = (selectedCarId: string) => {
    const car = carsData.find((c) => c.id === selectedCarId)
    if (!car) {
      updateField("carId", selectedCarId)
      return
    }

    setForm((prev) => {
      let nextPassengers = prev.passengers
      const currentCount = parseInt(prev.passengers || "0", 10)

      // When vehicle = Fortuner (or any 7-seater), passengers is automatically set to 7.
      // If car is a 2-seater sports car, auto-set to 2.
      // If car is a 14-seater bus, auto-set to 14.
      if (!currentCount || car.seats === 7 || (currentCount <= 4 && car.seats >= 7) || currentCount > car.seats) {
        nextPassengers = String(car.seats)
      } else if (car.seats === 2 && currentCount > 2) {
        nextPassengers = "2"
      }

      return {
        ...prev,
        carId: selectedCarId,
        passengers: nextPassengers,
      }
    })
  }

  const handlePassengersChange = (newPassengers: string) => {
    setForm((prev) => {
      const count = parseInt(newPassengers, 10)
      const selectedCarData = carsData.find((c) => c.id === prev.carId)
      let newCarId = prev.carId

      if (selectedCarData) {
        let isStillValid = false
        if (count <= 2) {
          isStillValid = selectedCarData.seats <= 5
        } else if (count === 3 || count === 4) {
          isStillValid = selectedCarData.seats === 4 || selectedCarData.seats === 5
        } else if (count === 5) {
          isStillValid = selectedCarData.seats === 5
        } else if (count === 6 || count === 7) {
          isStillValid = selectedCarData.seats === 7 || selectedCarData.seats === 8
        } else if (count >= 8) {
          isStillValid = selectedCarData.seats >= 8
        }

        if (!isStillValid) {
          newCarId = ""
        }
      }

      return {
        ...prev,
        passengers: newPassengers,
        carId: newCarId,
      }
    })
  }

  // Real-time Pricing Logic
  const selectedCar = useMemo(() => carsData.find(c => c.id === form.carId), [form.carId])
  
  const priceEstimate = useMemo(() => {
    if (!selectedCar) return null
    let days = 1
    if (form.tripType === "Round-Trip" && form.pickupDate && form.returnDate) {
      const pDate = new Date(form.pickupDate)
      const rDate = new Date(form.returnDate)
      const diffTime = Math.abs(rDate.getTime() - pDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      if (diffDays > 0) days = diffDays
    }
    const basePrice = selectedCar.price * days
    // const gst = basePrice * 0.18 // 18% GST typical for car rental in India
    const gst = 0
    return {
      base: basePrice,
      gst: gst,
      total: basePrice + gst,
      days
    }
  }, [selectedCar, form.tripType, form.pickupDate, form.returnDate])

  const canSubmit = form.carId && form.pickup && form.pickupDate && form.pickupTime && form.name && form.phone && (form.tripType === "One-Way" || (form.returnDate && form.returnTime))

  const handleSubmit = () => {
    const message = `🚗 *New DRIVEIT Premium Booking*

📋 *Trip Details (${form.tripType}):*
• Vehicle: ${selectedCar?.name || form.carId}
• Service: ${form.driverOption}
• Pickup: ${form.pickup}
• Drop-off: ${form.dropoff || "Not specified"}
• Pickup Date/Time: ${form.pickupDate} at ${form.pickupTime}
${form.tripType === "Round-Trip" ? `• Return Date/Time: ${form.returnDate} at ${form.returnTime}\n` : ""}
• Passengers: ${form.passengers}
• Occasion: ${form.occasion || "Not specified"}
${form.flightNumber ? `• Flight No: ${form.flightNumber} (${form.airportTerminal})\n` : ""}${form.driverOption === "Without Driver (Self Drive)" ? `• Self-Drive: Yes (Full-to-Full Fuel & FASTag equipped)\n` : ""}
👤 *Customer Details:*
• Name: ${form.name}
• Phone: ${form.phone}
${form.email ? `• Email: ${form.email}` : ""}
${form.notes ? `• Special Requests: ${form.notes}` : ""}

💰 *Estimate Summary:*
${priceEstimate ? `• Estimated Base: ₹${priceEstimate.base.toLocaleString()}
• *Total Est.*: ₹${priceEstimate.total.toLocaleString()} for ${priceEstimate.days} day(s)` : "Pending Quote"}`

    const whatsappUrl = `https://wa.me/916300041186?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section ref={ref} className="relative bg-[var(--luxury-bg)] text-white py-16 md:py-24 overflow-hidden" id="book-now">
         <div className="mx-auto max-w-3xl px-4 text-center">
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--gold-400)] to-[var(--gold-600)] flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-10 h-10 text-black" />
            </motion.div>
            <h3 className="text-3xl font-[family-name:var(--font-playfair)] font-bold text-white mb-4">
              Booking Request Received!
            </h3>
            <p className="text-white/60 mb-8 max-w-lg mx-auto text-lg">
              Your comprehensive booking request has been sent via WhatsApp. A concierge will review your details and confirm your reservation within 15 minutes.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-8 py-3 rounded-full border border-[var(--gold-400)] text-[var(--gold-400)] hover:bg-[var(--gold-400)] hover:text-black transition-colors duration-300 font-medium"
            >
              Make Another Booking
            </button>
         </div>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative bg-[var(--luxury-bg)] text-white py-16 md:py-24 overflow-hidden" id="book-now">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--gold-400)] blur-[200px] opacity-[0.04] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="text-xs tracking-[0.25em] uppercase text-white/40">Comprehensive Reservation</span>
          <h2 className="mt-2 text-3xl md:text-5xl font-[family-name:var(--font-playfair)] font-bold text-white">
            Book Your <span className="text-gradient-gold">Experience</span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-white/50 max-w-2xl mx-auto">
            Get an instant estimate and reserve your premium vehicle. Fill out your details below to begin your luxury journey.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Main Form Area */}
          <div className="space-y-8">
            
            {/* 1. Trip Details */}
            <div className="rounded-2xl p-6 md:p-8 border border-white/10 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--gold-400)]/50" />
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[var(--gold-400)]" /> 
                Trip Details
              </h3>
              
              <div className="space-y-6">
                {/* Trip Type Toggle */}
                <div className="flex p-1 bg-black/50 rounded-xl w-full sm:w-max border border-white/10">
                  <button
                    onClick={() => updateField("tripType", "One-Way")}
                    className={`flex-1 sm:px-8 py-2.5 rounded-lg text-sm font-medium transition-all ${form.tripType === "One-Way" ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/70"}`}
                  >
                    One-Way / Local
                  </button>
                  <button
                    onClick={() => updateField("tripType", "Round-Trip")}
                    className={`flex-1 sm:px-8 py-2.5 rounded-lg text-sm font-medium transition-all ${form.tripType === "Round-Trip" ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/70"}`}
                  >
                    Round-Trip / Outstation
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Pickup Location *</label>
                    <LuxurySelect
                      value={form.pickup}
                      onChange={(val) => updateField("pickup", val)}
                      placeholder="Select pickup area..."
                      options={popularLocations.map((loc) => ({ value: loc, label: loc }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Drop-off Location {form.tripType === "Round-Trip" ? "" : "*"}</label>
                    <LuxurySelect
                      value={form.dropoff}
                      onChange={(val) => updateField("dropoff", val)}
                      placeholder={form.tripType === "Round-Trip" ? "Same as pickup" : "Select drop-off area..."}
                      options={popularLocations.map((loc) => ({ value: loc, label: loc }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-4">
                    <label className="block text-xs text-white/40 uppercase tracking-wider">Pickup Date & Time *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <LuxuryDatePicker
                        value={form.pickupDate}
                        onChange={(val) => updateField("pickupDate", val)}
                        min={new Date().toISOString().split("T")[0]}
                        placeholder="Pickup date..."
                      />
                      <LuxurySelect
                        value={form.pickupTime}
                        onChange={(val) => updateField("pickupTime", val)}
                        placeholder="Time..."
                        icon={<Clock className="w-4 h-4 text-[var(--gold-400)]/50" />}
                        options={timeSlots.map((t) => ({ value: t, label: t }))}
                      />
                    </div>
                  </div>

                  {form.tripType === "Round-Trip" && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
                      <label className="block text-xs text-white/40 uppercase tracking-wider">Return Date & Time *</label>
                      <div className="grid grid-cols-2 gap-2">
                        <LuxuryDatePicker
                          value={form.returnDate}
                          onChange={(val) => updateField("returnDate", val)}
                          min={form.pickupDate || new Date().toISOString().split("T")[0]}
                          placeholder="Return date..."
                        />
                        <LuxurySelect
                          value={form.returnTime}
                          onChange={(val) => updateField("returnTime", val)}
                          placeholder="Time..."
                          icon={<Clock className="w-4 h-4 text-[var(--gold-400)]/50" />}
                          options={timeSlots.map((t) => ({ value: t, label: t }))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Vehicle & Service Options */}
            <div className="rounded-2xl p-6 md:p-8 border border-white/10 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--gold-400)]/50" />
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <Car className="w-5 h-5 text-[var(--gold-400)]" /> 
                Vehicle & Preferences
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 1. PASSENGERS (FIRST) */}
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">
                    1. Number of Passengers *
                  </label>
                  <LuxurySelect
                    value={form.passengers}
                    onChange={handlePassengersChange}
                    icon={<Users className="w-4 h-4 text-[var(--gold-400)]/70" />}
                    options={[
                      { value: "1", label: "1 Passenger", sub: "Executive Sedans & 5-Seater SUVs" },
                      { value: "2", label: "2 Passengers", sub: "Coupes, Sedans & 5-Seater SUVs" },
                      { value: "3", label: "3 Passengers", sub: "Executive Sedans & 5-Seater SUVs" },
                      { value: "4", label: "4 Passengers", sub: "4–5 Seater Sedans & SUVs (excludes 7-seaters)" },
                      { value: "5", label: "5 Passengers", sub: "Spacious 5-Seater Sedans & SUVs" },
                      { value: "6", label: "6 Passengers", sub: "7-Seater Luxury SUVs & MPVs" },
                      { value: "7", label: "7 Passengers", sub: "7-Seater Fortuner, Crysta, Vellfire, GLS" },
                      { value: "8", label: "8 Passengers", sub: "8+ Seater Executive Vans" },
                      { value: "10", label: "10 Passengers", sub: "Luxury Mini Coach" },
                      { value: "14", label: "14+ Passengers", sub: "High-Capacity Commuter & Luxury Bus" },
                    ]}
                  />
                  <p className="text-[11px] mt-1.5 flex items-center gap-1">
                    {form.passengers === "4" && (
                      <span className="text-[var(--gold-300)] font-medium">✓ Filtered to 4/5-seater sedans & SUVs (7-seaters hidden)</span>
                    )}
                    {form.passengers === "7" && (
                      <span className="text-[var(--gold-300)] font-medium">✓ Filtered to 7-seater luxury SUVs & MPVs (Fortuner, Vellfire, etc.)</span>
                    )}
                    {(form.passengers === "1" || form.passengers === "2" || form.passengers === "3") && (
                      <span className="text-white/40">Showing executive 4/5-seater fleet</span>
                    )}
                    {parseInt(form.passengers, 10) >= 8 && (
                      <span className="text-[var(--gold-300)] font-medium">Showing high-capacity luxury buses & commuter vans</span>
                    )}
                  </p>
                </div>

                {/* 2. SELECT VEHICLE (SECOND) */}
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">
                    2. Select Vehicle *
                  </label>
                  <LuxurySelect
                    value={form.carId}
                    onChange={handleCarSelect}
                    placeholder={
                      form.passengers === "4"
                        ? "Choose a 4–5 seater vehicle..."
                        : form.passengers === "7"
                        ? "Choose a 7-seater SUV / MPV..."
                        : "Choose a vehicle..."
                    }
                    icon={<Car className="w-4 h-4 text-[var(--gold-400)]/70" />}
                    options={filteredCars.map((car) => ({
                      value: car.id,
                      label: `${car.name} (${car.seats} Seats) - ${car.priceDisplay}`,
                      sub: `${car.category.toUpperCase()} • ${car.transmission} • ${car.seats} Seats`,
                    }))}
                  />
                  {selectedCar && (
                    <p className="text-[11px] text-[var(--gold-400)] mt-1.5 flex items-center gap-1.5 font-medium">
                      <span>✓ {selectedCar.name} ({selectedCar.seats} seats)</span>
                      {selectedCar.seats === 7 && (
                        <span className="text-white/70 bg-[var(--gold-400)]/15 px-2 py-0.5 rounded-full text-[10px] border border-[var(--gold-400)]/30">
                          Auto-configured for 7 passengers
                        </span>
                      )}
                    </p>
                  )}
                  {filteredCars.length === 0 && (
                    <p className="text-xs text-red-400 mt-1.5">No vehicles found matching {form.passengers} passengers.</p>
                  )}
                </div>

                {/* 3. SERVICE TYPE (THIRD) */}
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">
                    3. Service Type *
                  </label>
                  <LuxurySelect
                    value={form.driverOption}
                    onChange={(val) => updateField("driverOption", val)}
                    options={[
                      { value: "Chauffeur Driven", label: "With Driver (Chauffeur Driven)", sub: "Uniformed VIP driver, zero deposit liability" },
                      { value: "Self Drive", label: "Without Driver (Self Drive)", sub: "Drive yourself with FASTag & full fuel" },
                    ]}
                  />
                </div>

                {/* 4. OCCASION (FOURTH) */}
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">
                    4. Occasion (Optional)
                  </label>
                  <LuxurySelect
                    value={form.occasion}
                    onChange={(val) => updateField("occasion", val)}
                    placeholder="Select occasion..."
                    icon={<PartyPopper className="w-4 h-4 text-white/40" />}
                    options={[
                      { value: "", label: "Select occasion..." },
                      ...occasions.map((occ) => ({ value: occ, label: occ })),
                    ]}
                  />
                </div>
              </div>

              {/* VIP Airport Transfer Details (Conditional) */}
              {(form.occasion === "Airport Transfer" || form.pickup.includes("Airport") || form.dropoff.includes("Airport")) && (
                <div className="mt-5 p-4 rounded-xl border border-[var(--gold-400)]/20 bg-[var(--gold-400)]/5 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--gold-400)]">
                    <Plane className="w-4 h-4" /> VIP Airport Flight Monitoring
                  </div>
                  <p className="text-[11px] text-white/60">
                    Complimentary <strong>60-minute wait guarantee</strong> from flight touchdown. Our chauffeur tracks your flight automatically.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Flight Number (Optional)</label>
                      <input
                        type="text"
                        value={form.flightNumber}
                        onChange={(e) => updateField("flightNumber", e.target.value.toUpperCase())}
                        placeholder="e.g. 6E 521 / AI 840 / EK 526"
                        className="w-full bg-[#111] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-[var(--gold-400)]/50 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/40 uppercase tracking-wider mb-1.5">Terminal Selection</label>
                      <LuxurySelect
                        value={form.airportTerminal}
                        onChange={(val) => updateField("airportTerminal", val)}
                        options={[
                          { value: "RGIA Shamshabad — Domestic Arrival", label: "Domestic Arrival (RGIA)" },
                          { value: "RGIA Shamshabad — International Arrival", label: "International Arrival (RGIA)" },
                          { value: "Begumpet Airport (Private Charter)", label: "Begumpet (Private Charter)" },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Self-Drive Transparent Policies */}
              {form.driverOption === "Without Driver (Self Drive)" && (
                <div className="mt-5 p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-start gap-3">
                  <Fuel className="w-5 h-5 text-[var(--gold-400)] shrink-0 mt-0.5" />
                  <div className="text-xs text-white/70 space-y-1">
                    <p className="font-semibold text-white">Full-to-Full Fuel & Electronic FASTag</p>
                    <p className="text-[11px] text-white/50">
                      Vehicle delivered with full tank — return with same level for zero fuel surcharge. Highway tolls auto-reconciled via electronic windshield FASTag.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Your Details */}
            <div className="rounded-2xl p-6 md:p-8 border border-white/10 bg-white/[0.02] backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--gold-400)]/50" />
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <User className="w-5 h-5 text-[var(--gold-400)]" /> 
                Your Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Full Name *</label>
                  <div className="relative">
                    <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Enter your full name" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[var(--gold-400)]/50 transition" />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gold-400)]/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Phone Number *</label>
                  <div className="relative">
                    <input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+91 XXXXX XXXXX" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[var(--gold-400)]/50 transition" />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gold-400)]/50" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Email Address (Optional)</label>
                  <div className="relative">
                    <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="your@email.com" className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 pl-10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[var(--gold-400)]/50 transition" />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Special Requests</label>
                  <textarea value={form.notes} onChange={(e) => updateField("notes", e.target.value)} placeholder="Flight number, child seat required, or specific decoration for weddings..." rows={3} className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[var(--gold-400)]/50 transition resize-none" />
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar / Sticky Summary */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="rounded-2xl p-6 border border-[var(--gold-400)]/30 bg-gradient-to-br from-black to-[#0a0a0a] shadow-[0_0_30px_rgba(212,175,55,0.05)]">
              <h3 className="text-xl font-semibold mb-6 border-b border-white/10 pb-4">Estimated Quote</h3>
              
              {priceEstimate ? (
                <div className="space-y-4 text-sm animate-in fade-in">
                  <div className="flex justify-between text-white/60">
                    <span>Vehicle Base Rate</span>
                    <span>₹{selectedCar?.price.toLocaleString()}/day</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Duration</span>
                    <span>{priceEstimate.days} Day(s)</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>₹{priceEstimate.base.toLocaleString()}</span>
                  </div>
                  {/* <div className="flex justify-between text-white/60">
                    <span>Taxes & GST (18%)</span>
                    <span>₹{priceEstimate.gst.toLocaleString()}</span>
                  </div> */}
                  
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-white">Estimated Total</span>
                      <span className="text-2xl font-bold text-[var(--gold-400)]">₹{priceEstimate.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-white/30 text-sm flex flex-col items-center gap-3">
                  <Car className="w-8 h-8 opacity-50" />
                  Select a vehicle to see your real-time price estimate.
                </div>
              )}

              {!canSubmit && (
                <div className="mt-4 p-3 rounded-xl border border-white/10 bg-white/[0.02] text-xs text-white/50">
                  <span className="text-[var(--gold-400)] font-medium block mb-1.5">To unlock reservation, please complete:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      !form.carId && 'Select Vehicle',
                      !form.pickup && 'Pickup Location',
                      !form.pickupDate && 'Pickup Date',
                      !form.pickupTime && 'Pickup Time',
                      form.tripType === 'Round-Trip' && !form.returnDate && 'Return Date',
                      form.tripType === 'Round-Trip' && !form.returnTime && 'Return Time',
                      !form.name.trim() && 'Full Name',
                      !form.phone.trim() && 'Phone Number',
                    ]
                      .filter(Boolean)
                      .map((item) => (
                        <span key={item as string} className="px-2 py-0.5 rounded bg-white/5 text-white/70 text-[11px]">
                          • {item}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="w-full mt-6 flex justify-center items-center gap-2 px-8 py-4 rounded-xl font-bold text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] active:scale-95"
                style={{
                  background: canSubmit ? 'linear-gradient(135deg, var(--gold-300), var(--gold-400), var(--gold-500))' : 'rgba(255,255,255,0.1)',
                  color: canSubmit ? 'black' : 'rgba(255,255,255,0.3)',
                  boxShadow: canSubmit ? '0 4px 20px rgba(212, 175, 55, 0.3)' : 'none',
                }}
              >
                Proceed to Book <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Transparency disclosures */}
            <div className="rounded-2xl p-5 border border-white/5 bg-white/[0.01] space-y-4">
              <div className="flex gap-3">
                <ShieldCheck className="w-5 h-5 text-[var(--gold-400)]/70 shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-white/90">
                    {form.driverOption === "Without Driver (Self Drive)" ? "Refundable Security Deposit" : "Zero Security Deposit"}
                  </h4>
                  <p className="text-xs text-white/40 mt-1">
                    {form.driverOption === "Without Driver (Self Drive)"
                      ? `Refundable deposit of ${selectedCar?.securityDeposit || "₹25,000"} is held and released within 24–48h via UPI after vehicle return inspection.`
                      : "No security deposit required for our chauffeur-driven luxury trips."}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Fuel className="w-5 h-5 text-white/40 shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-white/80">Fuel & Tolls Policy</h4>
                  <p className="text-xs text-white/40 mt-1">
                    {form.driverOption === "Without Driver (Self Drive)"
                      ? "Full-to-Full fuel policy. Equipped with electronic FASTag for automatic expressway & airport toll lanes (actual tolls reconciled from deposit)."
                      : "Chauffeur trips include fuel and chauffeur allowances; intercity tolls and state border taxes are billed at actuals."}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Info className="w-5 h-5 text-white/40 shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-white/80">Kilometer Allowance</h4>
                  <p className="text-xs text-white/40 mt-1">100 km included per day. Extra km charges apply based on vehicle class.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
