import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import { ArrowLeft, CalendarDays, Car } from 'lucide-react'

import { auth } from '@/auth'
import config from '@/payload.config'
import { SiteHeader } from '@/components/site-header'
import { PaymentStatusBadge } from '@/components/payment-status-badge'

export const metadata = { title: 'My Bookings | DRIVEIT Luxury', robots: { index: false } }

const statusStyles: Record<string, string> = {
  confirmed: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  completed: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  cancelled: 'bg-red-400/10 text-red-400 border-red-400/20',
  pending: 'bg-[var(--gold-400)]/10 text-[var(--gold-400)] border-[var(--gold-400)]/20',
}

const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await auth()
  if (!session?.user?.email) redirect('/login?redirect=/dashboard/bookings')

  const { status } = await searchParams
  const activeFilter = FILTERS.includes((status ?? 'all') as (typeof FILTERS)[number])
    ? (status ?? 'all')
    : 'all'
  const email = session.user.email.toLowerCase()

  const payload = await getPayload({ config })

  // Filtering happens in the database — no more shipping every booking to the
  // browser and filtering there.
  const { docs } = await payload.find({
    collection: 'bookings',
    where: {
      and: [
        { customerEmail: { equals: email } },
        ...(activeFilter === 'all' ? [] : [{ status: { equals: activeFilter } }]),
      ],
    } as any,
    sort: '-createdAt',
    limit: 100,
    depth: 0,
    overrideAccess: true, // scoped to the session email above
  })

  const bookings = docs as Record<string, any>[]

  return (
    <>
      <SiteHeader />
      <section className="bg-[var(--luxury-bg)] text-white min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-white/30 hover:text-white/60">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-[family-name:var(--font-playfair)] font-bold">Your Bookings</h1>
                <p className="text-xs text-white/40">{bookings.length} shown</p>
              </div>
            </div>
            <Link
              href="/cars"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-black bg-[var(--gold-400)]"
            >
              <Car className="w-3.5 h-3.5" /> New Booking
            </Link>
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {FILTERS.map((filter) => (
              <Link
                key={filter}
                href={filter === 'all' ? '/dashboard/bookings' : `/dashboard/bookings?status=${filter}`}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-white/10 text-white border border-white/15'
                    : 'bg-white/[0.02] text-white/40 border border-white/5 hover:text-white/60'
                }`}
              >
                {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Link>
            ))}
          </div>

          {bookings.length === 0 ? (
            <div
              className="rounded-xl p-12 text-center"
              style={{ background: 'rgba(22,22,22,1)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <CalendarDays className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/30">No bookings in this view yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={String(booking.id)}
                  className="rounded-xl p-5"
                  style={{ background: 'rgba(22,22,22,1)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[var(--gold-400)]">
                          DRV-{String(booking.id).padStart(5, '0')}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusStyles[booking.status] ?? statusStyles.pending}`}
                        >
                          {booking.status}
                        </span>
                        <PaymentStatusBadge booking={booking} />
                      </div>
                      <h3 className="text-base font-semibold mt-1">{booking.carName}</h3>
                    </div>
                    <p className="text-lg font-bold text-[var(--gold-400)]">
                      ₹{Number(booking.totalPrice || 0).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                    <div>
                      <p className="text-white/30">Pickup date</p>
                      <p className="text-white/70">
                        {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN') : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/30">Return date</p>
                      <p className="text-white/70">
                        {booking.endDate ? new Date(booking.endDate).toLocaleDateString('en-IN') : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/30">Pickup</p>
                      <p className="text-white/70 truncate">{booking.pickupLocation || '—'}</p>
                    </div>
                    <div>
                      <p className="text-white/30">Service</p>
                      <p className="text-white/70 capitalize">{booking.serviceType || '—'}</p>
                    </div>
                  </div>

                  {/* Flight Info for Airport Trips */}
                  {booking.flightNumber && (
                    <div className="mb-4 p-3 rounded-lg bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-white/80">
                        <span className="text-[var(--gold-400)]">✈️ Flight:</span>
                        <span className="font-semibold text-white">{booking.flightNumber}</span>
                        <span className="text-white/40">({booking.airportTerminal || 'RGIA Airport'})</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-medium">✓ 60-min flight delay wait included</span>
                    </div>
                  )}

                  {/* Chauffeur Dossier (if assigned) */}
                  {booking.chauffeurDetails?.name && (
                    <div className="mb-4 p-3 rounded-lg bg-[var(--gold-400)]/5 border border-[var(--gold-400)]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[var(--gold-400)]/20 flex items-center justify-center text-[var(--gold-400)] font-bold text-xs">
                          {booking.chauffeurDetails.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white">Chauffeur: {booking.chauffeurDetails.name}</p>
                          <p className="text-[10px] text-white/40">
                            Vehicle Plate: <span className="text-[var(--gold-400)] font-mono">{booking.chauffeurDetails.vehicleNumber || 'Assigned'}</span> ({booking.chauffeurDetails.carColor || 'Obsidian Black'})
                          </p>
                        </div>
                      </div>
                      {booking.chauffeurDetails.phone && (
                        <a
                          href={`tel:${booking.chauffeurDetails.phone}`}
                          className="px-3 py-1 rounded-md bg-[var(--gold-400)] text-black font-semibold text-[11px] hover:bg-[var(--gold-300)] text-center transition"
                        >
                          Call Chauffeur
                        </a>
                      )}
                    </div>
                  )}

                  {/* Security Deposit & Refund Tracker (for Self-Drive) */}
                  {booking.securityDepositStatus && booking.securityDepositStatus !== 'na' && (
                    <div className="mb-4 p-3.5 rounded-lg bg-black/40 border border-white/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[var(--gold-400)]" />
                          Security Deposit Tracker
                        </span>
                        <span className="text-xs font-bold text-[var(--gold-400)]">
                          ₹{Number(booking.securityDepositAmount || 25000).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* 4-Step Progress Stepper */}
                      <div className="grid grid-cols-4 gap-1 text-center pt-1">
                        <div className="space-y-1">
                          <div className="h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[9px] text-emerald-400 font-medium">1. Held</span>
                        </div>
                        <div className="space-y-1">
                          <div
                            className={`h-1.5 rounded-full ${
                              ['inspection_passed', 'refunded'].includes(booking.securityDepositStatus)
                                ? 'bg-emerald-500'
                                : 'bg-white/10'
                            }`}
                          />
                          <span
                            className={`text-[9px] ${
                              ['inspection_passed', 'refunded'].includes(booking.securityDepositStatus)
                                ? 'text-emerald-400 font-medium'
                                : 'text-white/30'
                            }`}
                          >
                            2. Inspected
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div
                            className={`h-1.5 rounded-full ${
                              ['inspection_passed', 'refunded'].includes(booking.securityDepositStatus)
                                ? 'bg-emerald-500'
                                : 'bg-white/10'
                            }`}
                          />
                          <span
                            className={`text-[9px] ${
                              ['inspection_passed', 'refunded'].includes(booking.securityDepositStatus)
                                ? 'text-emerald-400 font-medium'
                                : 'text-white/30'
                            }`}
                          >
                            3. Approved
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div
                            className={`h-1.5 rounded-full ${
                              booking.securityDepositStatus === 'refunded' ? 'bg-emerald-500' : 'bg-white/10'
                            }`}
                          />
                          <span
                            className={`text-[9px] ${
                              booking.securityDepositStatus === 'refunded'
                                ? 'text-emerald-400 font-medium'
                                : 'text-white/30'
                            }`}
                          >
                            4. Refunded
                          </span>
                        </div>
                      </div>

                      {booking.securityDepositStatus === 'refunded' && booking.depositRefundUtr && (
                        <p className="text-[10px] text-emerald-400 font-mono pt-1">
                          ✓ Refund Dispatched via UPI. Bank UTR: <strong>{booking.depositRefundUtr}</strong>
                        </p>
                      )}
                      {booking.securityDepositStatus === 'held' && (
                        <p className="text-[10px] text-white/40">
                          Refund released via UPI within 24–48 hours after vehicle return inspection.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                    <Link
                      href={`/dashboard/invoices/${booking.id}`}
                      className="text-xs text-zinc-400 hover:text-[var(--gold-400)] border border-white/10 rounded-lg px-4 py-2 bg-white/5"
                    >
                      View invoice
                    </Link>
                    {booking.carSlug && (
                      <Link
                        href={`/cars/${booking.carSlug}`}
                        className="text-xs bg-[var(--gold-400)] text-black px-4 py-2 rounded-lg font-semibold"
                      >
                        Re-book
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
