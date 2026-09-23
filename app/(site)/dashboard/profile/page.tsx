import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import { ArrowLeft } from 'lucide-react'

import { auth } from '@/auth'
import config from '@/payload.config'
import { findCustomerByEmail } from '@/lib/customers'
import { SiteHeader } from '@/components/site-header'
import { ProfileForm } from '@/components/profile-form'
import type { CustomerProfile } from '@/lib/types'

export const metadata = { title: 'Edit Profile | DRIVEIT Luxury', robots: { index: false } }

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.email) redirect('/login?redirect=/dashboard/profile')

  const payload = await getPayload({ config })
  const customer = (await findCustomerByEmail(payload, session.user.email)) as Record<string, any> | null

  const initial: CustomerProfile = {
    name: customer?.name ?? null,
    phone: customer?.phone ?? null,
    homeAddress: customer?.homeAddress ?? null,
    officeAddress: customer?.officeAddress ?? null,
    airportAddress: customer?.airportAddress ?? null,
    loyaltyPoints: Number(customer?.loyaltyPoints) || 0,
    loyaltyTier: (customer?.loyaltyTier as CustomerProfile['loyaltyTier']) || 'silver',
    completedBookings: Number(customer?.completedBookings) || 0,
  }

  return (
    <>
      <SiteHeader />
      <section className="bg-[var(--luxury-bg)] text-white min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-lg px-4">
          <div className="flex items-center gap-3 mb-8">
            <Link href="/dashboard" className="text-white/30 hover:text-white/60">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-[family-name:var(--font-playfair)] font-bold">Edit profile</h1>
              <p className="text-xs text-white/40">
                {initial.completedBookings} completed booking(s) • {initial.loyaltyPoints} points
              </p>
            </div>
          </div>

          <ProfileForm email={session.user.email} initial={initial} />
        </div>
      </section>
    </>
  )
}
