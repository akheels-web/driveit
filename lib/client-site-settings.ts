export interface ClientSiteSettings {
  siteName?: string
  promoBannerEnabled?: boolean
  promoBannerText?: string
  promoBannerCode?: string
  headerLogo?: string
  headerLogoAlt?: string
  footerLogo?: string
  footerLogoAlt?: string
  instagramUrl?: string
  youtubeUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
}

let cachedSettings: ClientSiteSettings | null = null
let inflightRequest: Promise<ClientSiteSettings | null> | null = null

/**
 * Fetches public site settings once and shares the result across Header, Footer, and PromoBanner
 * so client navigations never issue redundant /api/site-settings requests.
 */
export function fetchClientSiteSettings(): Promise<ClientSiteSettings | null> {
  if (cachedSettings) return Promise.resolve(cachedSettings)
  if (!inflightRequest) {
    inflightRequest = fetch('/api/site-settings')
      .then((res) => (res.ok ? (res.json() as Promise<ClientSiteSettings>) : null))
      .then((data) => {
        if (data) cachedSettings = data
        return data
      })
      .catch(() => null)
      .finally(() => {
        inflightRequest = null
      })
  }
  return inflightRequest
}

