import type { Metadata } from 'next'
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "DRIVEIT Luxury | Premium Luxury Car Rental Hyderabad",
  description: "Book premium luxury cars in Hyderabad. Choose from our elite fleet of Rolls Royce, Mercedes, BMW, and more for weddings, corporate travel, and airport transfers.",
}
import { SiteFooter } from "@/components/site-footer"
import { RevealOnScroll } from "@/components/reveal-on-scroll"
import Hero from "@/components/hero"
import { Stats } from "@/components/stats"
import { Showcase } from "@/components/showcase"
import { About } from "@/components/about"
import { TrendingGrid } from "@/components/trending-grid"
import { ProcessTimeline } from "@/components/process-timeline"
import { FAQ } from "@/components/faq"
import Mision from "@/components/Mision"
import Testomonials from "@/components/Testomonials"

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-black text-zinc-100">
        <RevealOnScroll>
          {/* Home Section */}
          <section id="home">
            <Hero/>
            <Stats />
            <Showcase />
            <Mision />
          </section>
          
          {/* Services Section */}
          <section id="services">
            <TrendingGrid />
            <ProcessTimeline />
          </section>
          
          {/* About Section */}
          <section id="about">
            <FAQ />
            <Testomonials/>
            <About />
          </section>
          
          {/* Contact Section */}
          <section id="contact">
            <SiteFooter />
          </section>
        </RevealOnScroll>
      </main>
    </>
  )
}
