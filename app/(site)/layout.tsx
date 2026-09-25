import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display } from "next/font/google"
import { Suspense } from "react"
import Sidectabtn from "@/components/Sidectabtn"
import Script from "next/script"
import "../globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
})

import { getSiteSettings, resolveMediaUrl, SITE_DEFAULTS } from "@/lib/cms"
import { SessionProvider } from "@/components/providers/session-provider"
import { PageProgressBar } from "@/components/page-progress-bar"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = settings.siteName || SITE_DEFAULTS.siteName
  const title = settings.metaTitle || "DRIVEIT - Premium Luxury Transportation Services in Hyderabad"
  const description =
    settings.metaDescription ||
    "Experience unparalleled luxury with DRIVEIT. Premium car rental, private jet services, yacht charters, and luxury transportation in Hyderabad, India. VIP chauffeur services, wedding cars, and corporate transportation solutions."
  const favicon = resolveMediaUrl(settings.favicon, '/favicon.ico')
  const appleTouchIcon = resolveMediaUrl(settings.appleTouchIcon, '/apple-touch-icon.png')
  const ogImage = resolveMediaUrl(settings.ogImage, '/og-image.jpg')

  return {
    title,
    description,
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: appleTouchIcon,
    },
    keywords: [
      "luxury car rental",
      "private jet services",
      "yacht charter",
      "Hyderabad",
      "premium transportation",
      "chauffeur service",
      "wedding cars",
      "corporate travel",
      "luxury buses",
      "airport transfer",
      "VIP transportation",
      "Gachibowli",
      "Madhapur",
      "HITEC City",
      "Jubilee Hills",
      "Banjara Hills",
      "Kondapur",
      "Kokapet",
      "Financial District",
      "Nanakramguda",
      "Begumpet",
      "Secunderabad",
      "Shamshabad",
      "RGIA Airport",
      "Somajiguda",
      "Kukatpally",
      "Manikonda",
      "LB Nagar",
      "Uppal",
      "Miyapur",
      "Kompally",
      "Dilsukhnagar",
    ],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.com'),
    openGraph: {
      title,
      description,
      url: 'https://www.driveitluxury.com',
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteName} Luxury Transportation Services`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
      : {}),
    category: 'Luxury Transportation Services',
    classification: 'Premium Car Rental and Aviation Services',
    other: {
      'geo.region': 'IN-TG',
      'geo.placename': 'Hyderabad',
      'geo.position': '17.3850;78.4867',
      'ICBM': '17.3850, 78.4867',
    },
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSiteSettings()
  const siteName = settings.siteName || SITE_DEFAULTS.siteName
  const phone = settings.contactPhone || SITE_DEFAULTS.contactPhone
  const email = settings.contactEmail || SITE_DEFAULTS.contactEmail
  const address = settings.address || SITE_DEFAULTS.address
  const favicon = resolveMediaUrl(settings.favicon, '/favicon.ico')
  const appleTouchIcon = resolveMediaUrl(settings.appleTouchIcon, '/apple-touch-icon.png')

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href={favicon} sizes="any" />
        <link rel="apple-touch-icon" href={appleTouchIcon} />
        <link rel="alternate" type="application/rss+xml" title={`${siteName} Journal RSS Feed`} href="/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": siteName,
              "url": "https://www.driveitluxury.com",
              "telephone": phone,
              "email": email,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": address,
                "addressLocality": "Hyderabad",
                "postalCode": "500034",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 17.4126,
                "longitude": 78.4071
              },
              "openingHours": "Mo-Su 00:00-23:59",
              "priceRange": "₹₹₹"
            })
          }}
        />
      </head>
      <body
        className={`bg-background text-foreground antialiased font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfair.variable}`}
      >
        <SessionProvider>
          <Suspense fallback={null}>
            <PageProgressBar />
          </Suspense>
          <Suspense fallback={null}>{children}</Suspense>
          <Sidectabtn />
          {process.env.NEXT_PUBLIC_TIDIO_CODE && (
            <Script src={`//code.tidio.co/${process.env.NEXT_PUBLIC_TIDIO_CODE}.js`} strategy="lazyOnload" />
          )}
        </SessionProvider>
      </body>
    </html>
  )
}