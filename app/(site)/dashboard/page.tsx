import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import { Award, CalendarDays, Car, CheckCircle, Clock, User } from 'lucide-react'

import { auth } from '@/auth'
import config from '@/payload.config'
import { upsertCustomer } from '@/lib/customers'
import { GOLD_THRESHOLD, PLATINUM_THRESHOLD } from '@/lib/loyalty'
import { SiteHeader } from '@/components/site-header'
import { SignOutButton } from '@/components/sign-out-button'
import { PaymentStatusBadge } from '@/components/payment-status-badge'

export const metadata = { title: 'Dashboard | DRIVEIT Luxury', robots: { index: false } }

const statusStyles: Record<string, string> = {
  confirmed: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  completed: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
  cancelled: 'bg-red-400/10 text-red-400 border-red-400/20',
  pending: 'bg-[var(--gold-400)]/10 text-[var(--gold-400)] border-[var(--gold-400)]/20',
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.email) redirect('/login?redirect=/dashboard')

  const email = session.user.email.toLowerCase()
  const payload = await getPayload({ config })

  const [customer, recent] = await Promise.all([
    upsertCustomer(payload, { email, name: session.user.name ?? null }),
    payload.find({
      collection: 'bookings',
      where: { customerEmail: { equals: email } },
      sort: '-createdAt',
      limit: 5,
      depth: 0,
      overrideAccess: true, // scoped to the signed-in session email
    }),
  ])

  const bookings = recent.docs as Record<string, any>[]
  const allBookings = await payload.count({
    collection: 'bookings',
    where: { customerEmail: { equals: email } },
    overrideAccess: true,
  })

  const upcoming = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length
  const completed = bookings.filter((b) => b.status === 'completed').length

  const profile = customer as Record<string, any> | null
  const points = Number(profile?.loyaltyPoints) || 0
  const tier = (profile?.loyaltyTier as string) || 'silver'
  const nextThreshold = tier === 'platinum' ? PLATINUM_THRESHOLD : tier === 'gold' ? PLATINUM_THRESHOLD : GOLD_THRESHOLD
  const progress = Math.min(100, Math.round((points / nextThreshold) * 100))

  const displayName = profile?.name || session.user.name || email.split('@')[0]

  return (
    <>
      <SiteHeader />
      <section className="bg-[var(--luxury-bg)] text-white min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-white/40">Dashboard</span>
              <h1 className="text-2xl md:text-3xl font-[family-name:var(--font-playfair)] font-bold mt-1">
                Welcome, <span className="text-gradient-gold">{displayName}</span>
              </h1>
              <p className="text-sm text-white/40 mt-1">{email}</p>
            </div>
            <SignOutButton />
          </div>

          <div
            className="mb-10 relative overflow-hidden rounded-2xl p-6 md:p-8"
            style={{
              background:
                tier === 'platinum'
                  ? 'linear-gradient(135deg, #222, #444)'
                  : tier === 'gold'
                    ? 'linear-gradient(135deg, #b8860b, #6b4e00)'
                    : 'linear-gradient(135deg, #1a1a1a, #0a0a0a)',
              border: '1px solid rgba(212,175,55,0.2)',
            }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Award className="w-48 h-48" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/60 mb-2 font-semibold">
                  DriveIt Luxury Membership
                </p>
                <h2 className="text-3xl font-[family-name:var(--font-playfair)] font-bold capitalize mb-1">
                  {tier} Member
                </h2>
                <p className="text-sm text-white/80 font-medium">{points} Reward Points</p>
                <p className="text-xs text-white/50 mt-1">
                  Earn 100 points for every ₹10,000 of completed bookings.
                </p>
              </div>
              <div className="text-left md:text-right w-full md:w-auto">
                <div className="text-xs text-white/60 mb-2">
                  {tier === 'platinum' ? 'Max tier reached' : `Next tier at ${nextThreshold} pts`}
                </div>
                <div className="w-full md:w-48 h-1.5 bg-black/40 rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--gold-400)]" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: CalendarDays, label: 'Total Bookings', value: allBookings.totalDocs, color: 'var(--gold-400)' },
              { icon: Clock, label: 'Upcoming', value: upcoming, color: '#60a5fa' },
              { icon: CheckCircle, label: 'Completed', value: completed, color: '#34d399' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-5 text-center"
                style={{ background: 'rgba(22,22,22,1)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { href: '/cars', icon: Car, title: 'Book a Car', copy: 'Browse the luxury fleet' },
              { href: '/dashboard/bookings', icon: CalendarDays, title: 'View Bookings', copy: 'Full booking history' },
              { href: '/dashboard/profile', icon: User, title: 'Edit Profile', copy: 'Addresses & contact details' },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 rounded-xl p-4 transition-all hover:border-[var(--gold-400)]/20"
                style={{ background: 'rgba(22,22,22,1)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--gold-400)]/10 flex items-center justify-center">
                  <action.icon className="w-5 h-5 text-[var(--gold-400)]" />
                </div>
                <div>
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-[10px] text-white/30">{action.copy}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent bookings</h2>
            <Link href="/dashboard/bookings" className="text-xs text-[var(--gold-400)]">
              View all →
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div
              className="rounded-xl p-10 text-center"
              style={{ background: 'rgba(22,22,22,1)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <Car className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="text-sm text-white/30">No bookings yet</p>
              <Link href="/cars" className="text-xs text-[var(--gold-400)] inline-block mt-2">
                Book your first ride →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={String(booking.id)}
                  className="rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  style={{ background: 'rgba(22,22,22,1)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div>
                    <p className="text-sm font-medium">{booking.carName}</p>
                    <p className="text-[10px] text-white/30">
                      {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-IN') : '—'}
                      {booking.pickupLocation ? ` • ${booking.pickupLocation}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <PaymentStatusBadge booking={booking} />
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-medium border ${statusStyles[booking.status] ?? statusStyles.pending}`}
                    >
                      {booking.status}
                    </span>
                    <span className="text-sm font-medium text-[var(--gold-400)]">
                      ₹{Number(booking.totalPrice || 0).toLocaleString('en-IN')}
                    </span>
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
