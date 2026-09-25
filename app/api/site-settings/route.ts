import { NextResponse } from 'next/server'
import { getSiteSettings, resolveMediaUrl, SITE_DEFAULTS } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await getSiteSettings()

    const data = {
      siteName: settings.siteName || SITE_DEFAULTS.siteName,
      contactPhone: settings.contactPhone || SITE_DEFAULTS.contactPhone,
      contactEmail: settings.contactEmail || SITE_DEFAULTS.contactEmail,
      whatsappNumber: settings.whatsappNumber || SITE_DEFAULTS.whatsappNumber,
      promoBannerEnabled: settings.promoBannerEnabled !== false,
      promoBannerText:
        settings.promoBannerText || 'Exclusive Offer: Use code FIRST10 for 10% off your first luxury rental!',
      promoBannerCode: settings.promoBannerCode || 'FIRST10',
      headerLogo: resolveMediaUrl(settings.headerLogo, '/logo.png'),
      footerLogo: resolveMediaUrl(settings.footerLogo, resolveMediaUrl(settings.headerLogo, '/logo.png')),
      favicon: resolveMediaUrl(settings.favicon, '/favicon.ico'),
      appleTouchIcon: resolveMediaUrl(settings.appleTouchIcon, '/apple-touch-icon.png'),
      ogImage: resolveMediaUrl(settings.ogImage, '/og-image.jpg'),
      headerVideoUrl: settings.headerVideoUrl || '',
      heroImage: resolveMediaUrl(settings.heroImage, '/rolls-royce-phantom-night.png'),
      heroSubtitle: settings.heroSubtitle || 'Premium Luxury Transportation',
      heroHeadingLine1: settings.heroHeadingLine1 || 'The Art of',
      heroHeadingLine2: settings.heroHeadingLine2 || 'Luxury',
      missionBadge: settings.missionBadge || 'Who We Are',
      missionTitle: settings.missionTitle || 'Our Mission',
      missionText:
        settings.missionText ||
        'DRIVEIT Luxury aims to be the world’s leading luxury mobility platform, offering unmatched service, exclusivity, and innovation.',
      missionImage: resolveMediaUrl(settings.missionImage, '/luxury-flagship-cars-in-black-studio.png'),
      metaTitle: settings.metaTitle || 'DRIVEIT Luxury | Premium Luxury Car Rental Hyderabad',
      metaDescription: settings.metaDescription || 'Experience unparalleled luxury with DRIVEIT.',
      footerDescription:
        settings.footerDescription ||
        'Luxury mobility & aviation experiences—anytime, anywhere. Premium transportation services proudly serving Jubilee Hills, Banjara Hills, HITEC City, Gachibowli, Kokapet, Madhapur, and all of Hyderabad.',
      instagramUrl: settings.instagramUrl || 'https://instagram.com/driveitluxury',
      facebookUrl: settings.facebookUrl || 'https://facebook.com/driveitluxury',
      youtubeUrl: settings.youtubeUrl || 'https://youtube.com/@driveitluxury',
      linkedinUrl: settings.linkedinUrl || 'https://linkedin.com/company/driveitluxury',
      twitterUrl: settings.twitterUrl || 'https://twitter.com/driveitluxury',
      address: settings.address || SITE_DEFAULTS.address,
      mapEmbedUrl: settings.mapEmbedUrl || SITE_DEFAULTS.mapEmbedUrl,
      mapLink: settings.mapLink || SITE_DEFAULTS.mapLink,
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch (error) {
    console.error('[api/site-settings] Error:', error)
    return NextResponse.json(
      {
        siteName: SITE_DEFAULTS.siteName,
        contactPhone: SITE_DEFAULTS.contactPhone,
        contactEmail: SITE_DEFAULTS.contactEmail,
        whatsappNumber: SITE_DEFAULTS.whatsappNumber,
        headerLogo: '/logo.png',
        footerLogo: '/logo.png',
        favicon: '/favicon.ico',
        appleTouchIcon: '/apple-touch-icon.png',
        ogImage: '/og-image.jpg',
        headerVideoUrl: '',
        heroImage: '/rolls-royce-phantom-night.png',
        heroSubtitle: 'Premium Luxury Transportation',
        heroHeadingLine1: 'The Art of',
        heroHeadingLine2: 'Luxury',
        missionBadge: 'Who We Are',
        missionTitle: 'Our Mission',
        missionText: 'DRIVEIT Luxury aims to be the world’s leading luxury mobility platform...',
        missionImage: '/luxury-flagship-cars-in-black-studio.png',
        metaTitle: 'DRIVEIT Luxury',
        metaDescription: 'Luxury Car Rental',
        footerDescription: 'Luxury mobility & aviation experiences—anytime, anywhere.',
        instagramUrl: 'https://instagram.com/driveitluxury',
        facebookUrl: 'https://facebook.com/driveitluxury',
        youtubeUrl: 'https://youtube.com/@driveitluxury',
        linkedinUrl: 'https://linkedin.com/company/driveitluxury',
        twitterUrl: 'https://twitter.com/driveitluxury',
        address: SITE_DEFAULTS.address,
        mapEmbedUrl: SITE_DEFAULTS.mapEmbedUrl,
        mapLink: SITE_DEFAULTS.mapLink,
      },
      { status: 200 },
    )
  }
}
