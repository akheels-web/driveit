'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import {
  MapPin,
  Gauge,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Navigation,
  ExternalLink,
  PhoneCall,
  Activity,
  Compass,
} from 'lucide-react'

interface LiveVehicleTrackerProps {
  carName: string
  vehiclePlate?: string
  startOdometerKm?: number
  currentOdometerKm?: number
  allowedKm?: number
  currentSpeed?: number
  ignition?: boolean
  latitude?: number
  longitude?: number
  lastPingAt?: string
  geofenceStatus?: string
  telemetryAlerts?: Array<{ alert?: string }>
  chauffeurPhone?: string
  isChauffeur?: boolean
}

export function LiveVehicleTracker({
  carName,
  vehiclePlate,
  startOdometerKm = 15000,
  currentOdometerKm = 15042,
  allowedKm = 100,
  currentSpeed = 38,
  ignition = true,
  latitude = 17.4325,
  longitude = 78.3985,
  lastPingAt,
  geofenceStatus = 'inside_hyderabad',
  telemetryAlerts = [],
  chauffeurPhone = '+91 63000 41186',
  isChauffeur = false,
}: LiveVehicleTrackerProps) {
  const [mapZoomed, setMapZoomed] = useState(false)

  // Calculate live trip distance
  const currentKmDriven = Math.max(0, currentOdometerKm - startOdometerKm)
  const percentUsed = Math.min(100, Math.round((currentKmDriven / Math.max(1, allowedKm)) * 100))
  const isOverAllowance = currentKmDriven > allowedKm
  const extraKm = Math.max(0, currentKmDriven - allowedKm)

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`

  return (
    <div
      className="rounded-2xl p-5 md:p-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(22,22,22,1), rgba(12,12,12,1))',
        border: '1px solid rgba(212, 175, 55, 0.25)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6), 0 0 30px rgba(212,175,55,0.05)',
      }}
    >
      {/* Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              Live GPS & Vehicle Status
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--gold-400)]/10 text-[var(--gold-400)] border border-[var(--gold-400)]/20">
                LIVE SIGNAL
              </span>
            </h4>
            <p className="text-[11px] text-white/40">
              {carName} {vehiclePlate ? `• Plate: ${vehiclePlate}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--gold-400)] bg-[var(--gold-400)]/10 hover:bg-[var(--gold-400)]/20 border border-[var(--gold-400)]/30 transition"
          >
            <Navigation className="w-3.5 h-3.5" />
            View in Google Maps
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Dark Luxury Radar Map Mockup */}
      <div className="my-5 rounded-xl overflow-hidden border border-white/10 bg-[#080808] relative h-48 flex items-center justify-center group">
        {/* Subtle grid pattern resembling dark satellite radar */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(212,175,55,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Outer Ring Road Simulated Orbit */}
        <div className="absolute w-72 h-72 rounded-full border border-[var(--gold-400)]/10 pointer-events-none" />
        <div className="absolute w-44 h-44 rounded-full border border-[var(--gold-400)]/20 pointer-events-none" />

        {/* Live GPS Pin */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="px-2.5 py-1 rounded-full bg-black/80 border border-[var(--gold-400)]/40 text-[10px] text-white font-mono shadow-lg mb-1 flex items-center gap-1.5">
            <Compass className="w-3 h-3 text-[var(--gold-400)] animate-spin" style={{ animationDuration: '6s' }} />
            {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--gold-500)] to-[var(--gold-300)] flex items-center justify-center text-black shadow-[0_0_20px_rgba(212,175,55,0.6)]">
            <MapPin className="w-5 h-5 fill-current" />
          </div>
          <span className="text-[10px] text-[var(--gold-400)] font-semibold mt-1">
            {isChauffeur ? 'Chauffeur Vehicle Location' : 'Vehicle Position'}
          </span>
        </motion.div>

        {/* Bottom map overlay tag */}
        <div className="absolute bottom-2.5 left-3 text-[10px] text-white/40 font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
          Hyderabad City Limits • Live GPS Signal Active
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Speed */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-white/40 text-[11px]">
            <Gauge className="w-3.5 h-3.5 text-[var(--gold-400)]" />
            Live Speed
          </div>
          <p className="text-lg font-bold text-white">
            {currentSpeed} <span className="text-xs font-normal text-white/40">km/h</span>
          </p>
          <p className="text-[10px] text-white/30">
            {currentSpeed > 0 ? (currentSpeed > 100 ? '⚠️ High Speed' : 'In Transit') : 'Stationary'}
          </p>
        </div>

        {/* Engine / Ignition */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-white/40 text-[11px]">
            <Zap className="w-3.5 h-3.5 text-[var(--gold-400)]" />
            Engine Ignition
          </div>
          <p className="text-lg font-bold flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${ignition ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-zinc-600'}`}
            />
            <span className={ignition ? 'text-emerald-400' : 'text-zinc-400'}>
              {ignition ? 'Active' : 'Parked'}
            </span>
          </p>
          <p className="text-[10px] text-white/30">
            {ignition ? 'Engine running' : 'Ignition off'}
          </p>
        </div>

        {/* Trip Distance Covered */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-white/40 text-[11px]">
            <Activity className="w-3.5 h-3.5 text-[var(--gold-400)]" />
            Trip Distance
          </div>
          <p className="text-lg font-bold text-white">
            {currentKmDriven} <span className="text-xs font-normal text-white/40">km</span>
          </p>
          <p className="text-[10px] text-white/30">
            Start: {startOdometerKm.toLocaleString('en-IN')} km
          </p>
        </div>

        {/* Geofence Status */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
          <div className="flex items-center gap-1.5 text-white/40 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Zone Security
          </div>
          <p className="text-xs font-bold text-white truncate">
            {geofenceStatus === 'inside_hyderabad' ? 'Hyderabad ORR' : 'Outstation Route'}
          </p>
          <p className="text-[10px] text-emerald-400/80">Authorized Area</p>
        </div>
      </div>

      {/* KM Allowance Progress Bar */}
      <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/60">
            Distance Used: <strong className="text-white">{currentKmDriven} km</strong> of{' '}
            <strong className="text-white">{allowedKm} km</strong> included
          </span>
          <span className={`font-mono font-bold ${isOverAllowance ? 'text-rose-400' : 'text-[var(--gold-400)]'}`}>
            {percentUsed}%
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              isOverAllowance
                ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                : 'bg-gradient-to-r from-[var(--gold-400)] to-[var(--gold-300)]'
            }`}
            style={{ width: `${percentUsed}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${percentUsed}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        {isOverAllowance && (
          <p className="text-[11px] text-rose-300 flex items-center gap-1.5 pt-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            Exceeded standard allowance by {extraKm} km. Extra km will be settled at dropoff inspection.
          </p>
        )}
      </div>

      {/* Safety Alerts Log (if any alerts triggered) */}
      {telemetryAlerts.length > 0 && (
        <div className="mt-4 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1.5">
          <p className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> Recent Vehicle Alerts
          </p>
          {telemetryAlerts.slice(-3).map((item, index) => (
            <p key={index} className="text-[11px] text-white/60 font-mono">
              • {item.alert}
            </p>
          ))}
        </div>
      )}

      {/* Quick Action Footer */}
      <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-white/5">
        <span className="text-white/40 text-[11px]">
          {lastPingAt ? `Updated: ${new Date(lastPingAt).toLocaleTimeString('en-IN')}` : 'Live signal online'}
        </span>
        <a
          href={`tel:${chauffeurPhone.replace(/\s+/g, '')}`}
          className="flex items-center gap-1.5 text-white/80 hover:text-[var(--gold-400)] transition text-[11px]"
        >
          <PhoneCall className="w-3 h-3 text-[var(--gold-400)]" />
          {isChauffeur ? 'Call Chauffeur' : '24/7 Roadside Concierge'} ({chauffeurPhone})
        </a>
      </div>
    </div>
  )
}
