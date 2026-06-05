import type React from "react"
import type { Metadata, Viewport } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Sidectabtn from "@/components/Sidectabtn"
import Script from "next/script"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "DRIVEIT - Premium Luxury Transportation Services in Hyderabad",
  description: "Experience unparalleled luxury with DRIVEIT. Premium car rental, private jet services, yacht charters, and luxury transportation in Hyderabad, India. VIP chauffeur services, wedding cars, and corporate transportation solutions.",
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
    // Hyderabad districts & key areas
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
  authors: [{ name: "DRIVEIT" }],
  creator: "DRIVEIT",
  publisher: "DRIVEIT",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.driveitluxury.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "DRIVEIT - Premium Luxury Transportation Services",
    description: "Experience unparalleled luxury with DRIVEIT. Premium car rental, private jet services, yacht charters, and luxury transportation in Hyderabad, India.",
    url: 'https://www.driveitluxury.com',
    siteName: 'DRIVEIT',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DRIVEIT Luxury Transportation Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DRIVEIT - Premium Luxury Transportation Services',
    description: 'Experience unparalleled luxury with DRIVEIT. Premium car rental, private jet services, yacht charters, and luxury transportation in Hyderabad, India.',
    images: ['/twitter-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'Luxury Transportation Services',
  classification: 'Premium Car Rental and Aviation Services',
  other: {
    'geo.region': 'IN-TG',
    'geo.placename': 'Hyderabad',
    'geo.position': '17.3850;78.4867',
    'ICBM': '17.3850, 78.4867',
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "DRIVEIT Luxury",
              "url": "https://www.driveitluxury.com",
              "telephone": "+91-XXXXXXXXXX",
              "email": "care@driveitluxury.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Banjara Hills",
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
        <Suspense fallback={null}>{children}</Suspense>
        <Sidectabtn />
        <Analytics />
        <Script src="//code.tidio.co/YOUR_TIDIO_CODE.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}