import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Jost } from "next/font/google"
import { Suspense } from "react"
import Sidectabtn from "@/components/Sidectabtn"
import Script from "next/script"
import "../globals.css"

// Display face: a light geometric sans with wide tracking (Hype-style editorial caps).
const displayFace = Jost({
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
})

// Alias playfair variable to the display face to eliminate all serif fonts site-wide
const playfair = { variable: "--font-playfair font-luxury" }

import { getSiteSettings, resolveMediaUrl, SITE_DEFAULTS } from "@/lib/cms"
import { SessionProvider } from "@/components/providers/session-provider"
import { PageProgressBar } from "@/components/page-progress-bar"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.in').replace(/\/$/, '')
  const siteName = settings.siteName || SITE_DEFAULTS.siteName
  const title = settings.metaTitle || "DRIVEIT - Premium Luxury Transportation Services in Hyderabad"
  const description =
    settings.metaDescription ||
    "Experience unparalleled luxury with DRIVEIT. Premium car rental, private jet services, yacht charters, and luxury transportation in Hyderabad, India. VIP chauffeur services, wedding cars, and corporate transportation solutions."
  const favicon = resolveMediaUrl(settings.favicon, '/logo.png')
  const appleTouchIcon = resolveMediaUrl(settings.appleTouchIcon, '/logo.png')
  const ogImage = resolveMediaUrl(settings.ogImage, '/rolls-royce-phantom-night.webp')

  const defaultKeywords = [
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
  ]
  const cmsKeywords =
    typeof settings.seoKeywords === 'string' && settings.seoKeywords.trim()
      ? settings.seoKeywords.split(',').map((k: string) => k.trim()).filter(Boolean)
      : []
  const mergedKeywords = Array.from(new Set([...cmsKeywords, ...defaultKeywords]))
  const googleVerification =
    (typeof settings.googleSiteVerification === 'string' && settings.googleSiteVerification.trim()) ||
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

  return {
    title,
    description,
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: appleTouchIcon,
    },
    keywords: mergedKeywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    openGraph: {
      title,
      description,
      url: siteUrl,
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
    ...(googleVerification ? { verification: { google: googleVerification } } : {}),
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
  viewportFit: "cover",
  themeColor: "#0a0a0a",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSiteSettings()
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.driveitluxury.in').replace(/\/$/, '')
  const siteName = settings.siteName || SITE_DEFAULTS.siteName
  const phone = settings.contactPhone || SITE_DEFAULTS.contactPhone
  const email = settings.contactEmail || SITE_DEFAULTS.contactEmail
  const address = settings.address || SITE_DEFAULTS.address
  const favicon = resolveMediaUrl(settings.favicon, '/logo.png')
  const appleTouchIcon = resolveMediaUrl(settings.appleTouchIcon, '/logo.png')
  const ogImage = resolveMediaUrl(settings.ogImage, '/rolls-royce-phantom-night.webp')
  const absOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href={favicon} sizes="any" />
        <link rel="apple-touch-icon" href={appleTouchIcon} />
        <link rel="alternate" type="application/rss+xml" title={`${siteName} Blog RSS Feed`} href="/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["LocalBusiness", "AutoRental"],
              "name": siteName,
              "url": siteUrl,
              "image": absOgImage,
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
        className={`bg-background text-foreground antialiased font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfair.variable} ${displayFace.variable}`}
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