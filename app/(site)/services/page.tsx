import type { Metadata } from 'next'
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export const metadata: Metadata = {
  title: "Luxury Car Services Hyderabad | Corporate, Airport, Events | DRIVEIT Luxury",
  description: "Explore our premium luxury car services in Hyderabad. We offer professional chauffeur service, corporate rentals, wedding cars, and airport transfers.",
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

const services = [
  { href: "/services/luxury-car-rental", title: "Luxury Car Rental" },
  { href: "/services/private-jet-services", title: "Private Jet Services" },
  { href: "/services/pickup-dropoff", title: "Pickup & Drop-off" },
  { href: "/services/luxury-buses", title: "Luxury Buses" },
  { href: "/services/wedding-cars", title: "Wedding Cars" },
]

export default function ServicesPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-black text-zinc-100">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h1 className="text-3xl font-semibold text-gold">Our Services</h1>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.href} className="rounded-lg border border-neutral-800 bg-surface p-4">
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <p className="mt-2 text-sm text-zinc-400">
                  Tailored luxury designed around your itinerary and preferences.
                </p>
                <Link href={s.href} className="mt-3 inline-flex text-sm text-gold hover:underline">
                  Explore →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
