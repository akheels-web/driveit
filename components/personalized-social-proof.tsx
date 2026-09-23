import { getPayload } from 'payload'

import { auth } from '@/auth'
import configPromise from '@/payload.config'

/**
 * Server-rendered social proof.
 *
 * Previously this was a client component that fired a request per card on the
 * fleet page and animated with `animate-pulse`. It now runs on the server, so a
 * signed-out visitor costs nothing and a signed-in customer gets their real
 * count in the first paint.
 */
export async function PersonalizedSocialProof({
  carSlug,
  globalBookings,
}: {
  carSlug: string
  globalBookings?: number
}) {
  let personalCount = 0
  let signedIn = false

  const session = await auth()

  if (session?.user?.email) {
    signedIn = true
    try {
      const payload = await getPayload({ config: configPromise })
      const { totalDocs } = await payload.count({
        collection: 'bookings',
        where: {
          and: [
            { customerEmail: { equals: session.user.email.toLowerCase() } },
            { status: { in: ['confirmed', 'completed'] } },
            { or: [{ carSlug: { equals: carSlug } }, { carName: { equals: carSlug } }] },
          ],
        },
        overrideAccess: true,
      })
      personalCount = totalDocs || 0
    } catch (error) {
      console.error('[social-proof] count failed:', error)
    }
  }

  if (personalCount > 0) {
    return (
      <div className="text-[var(--gold-400)] font-medium bg-[var(--gold-400)]/10 px-2 py-0.5 rounded text-xs border border-[var(--gold-400)]/20">
        You&apos;ve booked this car {personalCount} time{personalCount > 1 ? 's' : ''}
      </div>
    )
  }

  // Only show a global counter when the CMS actually has one. No invented numbers.
  if (Number(globalBookings) > 0) {
    return <div className="text-white/60">Booked {globalBookings}+ times</div>
  }

  return (
    <div className="text-white/60">
      {signedIn ? 'New to your garage — be the first to book it' : 'Available for instant booking'}
    </div>
  )
}
