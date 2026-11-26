import type { EngineType } from './engine-audio'

export interface HeroSceneConfig {
  id: string
  tabLabel: string
  kicker: string
  title: string
  subtitle: string
  badge: string
  src: string
  imageAlt: string
  ctaLabel: string
  ctaHref: string
}

export interface PickupHubConfig {
  label: string
  zoneTag: string
  active: boolean
}

export interface StudioHotspotConfig {
  id: string
  label: string
  specBadge: string
  detail: string
  x: number
  y: number
}

export interface StudioMachineConfig {
  id: string
  slug: string
  name: string
  brand: string
  category: string
  tagline: string
  src: string
  imageAlt: string
  seats: number
  powerHp: number
  zeroToHundred: string
  topSpeed: string
  pricePerDay: number
  selfDrivePricePerDay?: number
  chauffeurIncluded: boolean
  selfDriveAvailable: boolean
  acousticNote: string
  engineAudioProfile: EngineType
  studioHotspots: StudioHotspotConfig[]
}

export interface BeyondPanelConfig {
  key: string
  number: string
  eyebrow: string
  title: string
  subtitle: string
  capacity: string
  highlights: string[]
  src: string
  imageAlt: string
  href: string
  serviceName: string
  ctaLabel: string
  directBook: boolean
}

export interface VipCorridorConfig {
  id: string
  tag: string
  origin: string
  destination: string
  distanceKm: string
  etaMinutes: string
  fromCoord: { x: number; y: number; label: string }
  toCoord: { x: number; y: number; label: string }
  controlPoint: { x: number; y: number }
  recommendedCarSlug: string
  recommendedCarName: string
  priceFormatted: string
}

export interface ServiceShowcaseItem {
  badgeLabel: string
  model: string
  specs: string
  highlightTag: string
  src: string
  imageAlt: string
  ctaLabel: string
}

export interface BespokeProtocolConfig {
  id: string
  tag: string
  title: string
  subtitle: string
  description: string
  flagshipSlug: string
  flagshipName: string
  tariffFormatted: string
  serviceMode: 'chauffeur' | 'selfdrive'
  pickupHub: string
  bannerImage: string
  bannerImageAlt: string
  highlights: string[]
  flightSyncSupported?: boolean
}

export interface HomeSectionsConfig {
  studioStageEyebrow: string
  studioStageTitle: string
  fleetSectionEyebrow: string
  fleetSectionTitle: string
  fleetSectionSubtitle: string
  beyondEyebrow: string
  beyondTitle: string
  beyondSubtitle: string
  protocolEyebrow?: string
  protocolTitle?: string
  protocolSubtitle?: string
  radarEyebrow: string
  radarTitle: string
  radarSectorLabel: string
  radarDelayBadge: string
  radarDefaultFlightCode: string
  closingEyebrow: string
  closingTitle: string
  closingDescription: string
  closingBannerImage: string
  closingBannerImageAlt: string
  closingCtaLabel: string
  closingPassLabel: string
  closingPassTitle: string
  closingPassBenefits: string[]
}

export const DEFAULT_PICKUP_HUBS: PickupHubConfig[] = [
  { label: 'Banjara Hills', zoneTag: 'Flagship Studio', active: true },
  { label: 'Jubilee Hills', zoneTag: 'VIP Enclave', active: true },
  { label: 'RGIA Airport (Shamshabad)', zoneTag: 'Tarmac & Gates', active: true },
  { label: 'HITEC City', zoneTag: 'Executive Towers', active: true },
  { label: 'Financial District', zoneTag: 'Corporate HQ', active: true },
  { label: 'Taj Falaknuma Palace', zoneTag: 'Royal Heritage', active: true },
]

export const DEFAULT_HERO_SCENES: HeroSceneConfig[] = [
  {
    id: 'phantom',
    tabLabel: '01 / PHANTOM VIII',
    kicker: 'FLAGSHIP CHAUFFEUR SALOON · HYDERABAD',
    title: 'Rolls-Royce Phantom VIII',
    subtitle: 'Bespoke Starlight Headliner · Uniformed VVIP Chauffeur Protocol',
    badge: 'Flagship Saloon',
    src: '/rolls-royce-phantom-night.webp',
    imageAlt: 'Rolls-Royce Phantom VIII night editorial chauffeur flagship in Hyderabad',
    ctaLabel: 'Reserve Phantom',
    ctaHref: '/cars/rolls-royce-phantom',
  },
  {
    id: 'db12',
    tabLabel: '02 / ASTON DB12',
    kicker: 'SUPER TOURER · SELF-DRIVE OR CHAUFFEUR',
    title: 'Aston Martin DB12',
    subtitle: '671 BHP Hand-Built Twin-Turbo V8 · Doorstep Flatbed Delivery',
    badge: 'Super Tourer',
    src: '/aston-martin-db12-night.webp',
    imageAlt: 'Aston Martin DB12 grand tourer night architectural photograph in Hyderabad',
    ctaLabel: 'Book DB12',
    ctaHref: '/cars/aston-martin-db12',
  },
  {
    id: 'sf90',
    tabLabel: '03 / FERRARI SF90',
    kicker: 'MARANELLO PLUG-IN HYBRID FLAGSHIP',
    title: 'Ferrari SF90 Stradale',
    subtitle: '986 BHP All-Wheel Drive · 0–100 km/h in 2.5 Seconds',
    badge: 'Supercar Flagship',
    src: '/ferrari-sf90-stradale-black-studio.webp',
    imageAlt: 'Ferrari SF90 Stradale matte studio profile by DRIVEIT Luxury',
    ctaLabel: 'Commission SF90',
    ctaHref: '/cars/ferrari-sf90-stradale',
  },
  {
    id: 'jets',
    tabLabel: '04 / PRIVATE JETS',
    kicker: 'ON-DEMAND AVIATION · BEGUMPET & RGIA',
    title: 'Gulfstream G650ER Charter',
    subtitle: 'Direct Airside Ramp Access · Flight-Synced Maybach Transfer',
    badge: 'Private Aviation',
    src: '/gulfstream-g650-private-jet-on-tarmac-night.webp',
    imageAlt: 'Gulfstream G650ER long-range private jet awaiting tarmac boarding at night',
    ctaLabel: 'Request Flight Desk',
    ctaHref: '/services/private-jet-services',
  },
  {
    id: 'yachts',
    tabLabel: '05 / SUPERYACHTS',
    kicker: 'DRIVEIT PRIVÉ · MARINE & HARBOR CHARTERS',
    title: 'Benetti Oasis 40M Superyacht',
    subtitle: 'Bespoke Crew, Chef Galley & Sunset Harbor Soirées',
    badge: 'Superyacht Charter',
    src: '/yachts/benetti-oasis-40m-superyacht.webp',
    imageAlt: 'Benetti Oasis 40m private superyacht moored at twilight',
    ctaLabel: 'Request Marine Desk',
    ctaHref: '/services/yacht-services',
  },
]

export const DEFAULT_BEYOND_PANELS: BeyondPanelConfig[] = [
  {
    key: 'jets',
    number: '01',
    eyebrow: 'BEGUMPET VVIP GATE & RGIA',
    title: 'Private Jet Charters',
    subtitle: 'Gulfstream G650ER, Global 7500 & Midsize Citations',
    capacity: 'Up to 18 Guests · Airside Tarmac Transfer',
    highlights: [
      'Direct airside tarmac pickup via Begumpet & RGIA',
      'Flight-synced chauffeur dispatch with zero terminal wait',
      'Bespoke in-flight dining & private customs clearance',
    ],
    src: '/gulfstream-g650-private-jet-on-tarmac-night.webp',
    imageAlt: 'Gulfstream G650ER private jet charter tarmac boarding — DRIVEIT Privé',
    href: '/services/private-jet-services',
    serviceName: 'Private Jet & Airside Tarmac Charter (Contact Only)',
    ctaLabel: 'Request Aviation',
    directBook: false,
  },
  {
    key: 'yachts',
    number: '02',
    eyebrow: 'DRIVEIT PRIVÉ MARINE DESK',
    title: 'Superyacht Charters',
    subtitle: 'Benetti, Azimut & Ferretti Private Ocean Vessels',
    capacity: '12 to 60 Guests · Dedicated Crew & Sommelier',
    highlights: [
      'Private sunset decks & coastal celebration charters',
      'Synchronized limousine dockside pickup & drop-off',
      'Custom maritime chef & hospitality provisioning',
    ],
    src: '/yachts/benetti-oasis-40m-superyacht.webp',
    imageAlt: 'Benetti Oasis 40m private superyacht twilight charter — DRIVEIT Privé',
    href: '/services/yacht-services',
    serviceName: 'Superyacht & Marine Charter (Contact Only)',
    ctaLabel: 'Request Yacht',
    directBook: false,
  },
  {
    key: 'coaches',
    number: '03',
    eyebrow: 'DELEGATION & FAMILY CONVOYS',
    title: 'Luxury Lounge Coaches',
    subtitle: 'Mercedes V-Class Lounge, Custom Sprinter & 45-Seaters',
    capacity: '7 to 45 Guests · VIP Entourage Mobility',
    highlights: [
      'Aircraft-style captain recliners & Starlink Wi-Fi cabins',
      'Synchronized wedding family & corporate delegate convoys',
      'Dedicated luggage vans & route protocol marshal',
    ],
    src: '/luxury-coach-interior-black-gold.webp',
    imageAlt: 'Executive black and gold leather VIP lounge coach interior — DRIVEIT Privé',
    href: '/services/luxury-buses',
    serviceName: 'Luxury Coach & Delegation Convoy (Contact Only)',
    ctaLabel: 'Request Coach',
    directBook: false,
  },
  {
    key: 'weddings',
    number: '04',
    eyebrow: 'PALACE GALAS & BARAAT CONVOYS',
    title: 'Royal Wedding Fleet',
    subtitle: 'Phantom VIII Bridal Flagship & White-Glove Motorcades',
    capacity: 'Curated Motorcades · Falaknuma & Golkonda',
    highlights: [
      'Satin ribbon & bespoke fresh-floral bonnet styling',
      'Red-carpet chauffeur protocol for bride & groom arrivals',
      'Coordinated fleet of Maybachs, S-Classes & V-Class vans',
    ],
    src: '/rolls-royce-wedding-ribbon.webp',
    imageAlt: 'Rolls-Royce bridal flagship wedding car decorated with ivory silk ribbon — DRIVEIT',
    href: '/services/wedding-cars',
    serviceName: 'Royal Bridal & Wedding Convoy',
    ctaLabel: 'Configure Convoy',
    directBook: false,
  },
]

export const DEFAULT_VIP_CORRIDORS: VipCorridorConfig[] = [
  {
    id: 'rgia-falaknuma',
    tag: 'CORRIDOR 01 · ROYAL ARRIVAL',
    origin: 'RGIA Airport (Shamshabad)',
    destination: 'Taj Falaknuma Palace',
    distanceKm: '22 km',
    etaMinutes: '28 min',
    fromCoord: { x: 240, y: 318, label: 'RGIA Shamshabad' },
    toCoord: { x: 430, y: 240, label: 'Taj Falaknuma' },
    controlPoint: { x: 350, y: 300 },
    recommendedCarSlug: 'rolls-royce-phantom',
    recommendedCarName: 'Rolls-Royce Phantom',
    priceFormatted: '₹1,85,000/day',
  },
  {
    id: 'begumpet-jubilee',
    tag: 'CORRIDOR 02 · PRIVATE AVIATION',
    origin: 'Begumpet Private Jet Terminal',
    destination: 'Jubilee Hills',
    distanceKm: '9 km',
    etaMinutes: '16 min',
    fromCoord: { x: 382, y: 122, label: 'Begumpet VVIP' },
    toCoord: { x: 280, y: 175, label: 'Jubilee Hills' },
    controlPoint: { x: 332, y: 112 },
    recommendedCarSlug: 'aston-martin-db12',
    recommendedCarName: 'Aston Martin DB12',
    priceFormatted: '₹1,45,000/day',
  },
  {
    id: 'banjara-fd',
    tag: 'CORRIDOR 03 · BOARDROOM EXPRESS',
    origin: 'Banjara Hills',
    destination: 'Financial District',
    distanceKm: '15 km',
    etaMinutes: '22 min',
    fromCoord: { x: 328, y: 185, label: 'Banjara Hills' },
    toCoord: { x: 168, y: 196, label: 'Financial District' },
    controlPoint: { x: 246, y: 150 },
    recommendedCarSlug: 'mercedes-gls-400d',
    recommendedCarName: 'Mercedes-Benz GLS 400d',
    priceFormatted: '₹22,000/day',
  },
  {
    id: 'jubilee-rgia',
    tag: 'CORRIDOR 04 · SUPERCAR RUN',
    origin: 'Jubilee Hills',
    destination: 'RGIA Airport (Shamshabad)',
    distanceKm: '34 km',
    etaMinutes: '35 min',
    fromCoord: { x: 280, y: 175, label: 'Jubilee Hills' },
    toCoord: { x: 240, y: 318, label: 'RGIA Shamshabad' },
    controlPoint: { x: 195, y: 248 },
    recommendedCarSlug: 'ferrari-sf90-stradale',
    recommendedCarName: 'Ferrari SF90 Stradale',
    priceFormatted: '₹1,65,000/day',
  },
]

export const DEFAULT_PROTOCOLS: BespokeProtocolConfig[] = [
  {
    id: 'airside-protocol',
    tag: 'PROTOCOL 01 · AIRSIDE TRANSFERS',
    title: 'RGIA & Begumpet Airside Protocol',
    subtitle: 'Tarmac ramp pickup & private terminal arrivals',
    description:
      'Direct airside tarmac or arrival gate meet-and-greet with our uniformed chauffeur standing by 60 minutes before touchdown. Zero terminal friction or curbside delay.',
    flagshipSlug: 'rolls-royce-phantom',
    flagshipName: 'Rolls-Royce Phantom VIII',
    tariffFormatted: '₹1,85,000 / Day',
    serviceMode: 'chauffeur',
    pickupHub: 'RGIA Airport (Shamshabad)',
    bannerImage: '/black-chauffeur-sedan-night-city.webp',
    bannerImageAlt: 'Black luxury chauffeur saloon waiting on evening airside tarmac in Hyderabad',
    highlights: [
      '60-Min Complimentary Touchdown Delay Buffer',
      'Flight-Synced Standby at RGIA & Begumpet VVIP Gate',
      'Discreet Luggage Escort & Dedicated Protocol Marshal',
    ],
    flightSyncSupported: true,
  },
  {
    id: 'palace-gala',
    tag: 'PROTOCOL 02 · ROYAL BARAAT & PALACES',
    title: 'Palace Gala & Ceremonial Motorcade',
    subtitle: 'Taj Falaknuma Palace & Golkonda heritage galas',
    description:
      'Bespoke bridal and red-carpet arrivals curated for iconic heritage addresses. Coordinated flagship entrances with silk ribbon couture and shadow SUV support.',
    flagshipSlug: 'rolls-royce-phantom',
    flagshipName: 'Rolls-Royce Phantom VIII',
    tariffFormatted: '₹1,85,000 / Day',
    serviceMode: 'chauffeur',
    pickupHub: 'Taj Falaknuma Palace',
    bannerImage: '/rolls-royce-wedding-ribbon.webp',
    bannerImageAlt: 'Rolls-Royce Phantom bridal car adorned with ivory silk ribbon in Hyderabad',
    highlights: [
      'Ivory Satin Ribbon & Fresh Floral Bonnet Styling',
      'Synchronized Multi-Car Motorcade Dispatch',
      'Red-Carpet Chauffeur Attire & Ceremonial Etiquette',
    ],
    flightSyncSupported: false,
  },
  {
    id: 'boardroom-express',
    tag: 'PROTOCOL 03 · DIPLOMATIC & C-SUITE',
    title: 'Executive Boardroom & Diplomatic Convoy',
    subtitle: 'HITEC City, Financial District & Kokapet corridors',
    description:
      'Continuous mobility for visiting executive delegations, board meetings, and summit delegations. Confidential NDA-bound chauffeurs with multi-point dispatch.',
    flagshipSlug: 'mercedes-gls-400d',
    flagshipName: 'Mercedes-Benz GLS 400d',
    tariffFormatted: '₹22,000 / Day',
    serviceMode: 'chauffeur',
    pickupHub: 'Banjara Hills',
    bannerImage: '/luxury-flagship-cars-in-black-studio.webp',
    bannerImageAlt: 'DRIVEIT Luxury executive chauffeur motorcade lined up in dark studio',
    highlights: [
      'Confidential NDA-Bound Uniformed Chauffeurs',
      'Inter-District Express Routing & Route Marshaling',
      'Dedicated Baggage Support & Multi-Stop Itineraries',
    ],
    flightSyncSupported: false,
  },
  {
    id: 'grand-touring',
    tag: 'PROTOCOL 04 · OPEN-ROAD GRAND TOURING',
    title: 'Supercar Highway & Weekend Escape',
    subtitle: 'Self-drive freedom on outer ring roads & hill retreats',
    description:
      'Pure driving exhilaration behind the wheel of British or Italian exotics. Verified self-drive unlock with full commercial insurance and zero hidden deductibles.',
    flagshipSlug: 'aston-martin-db12',
    flagshipName: 'Aston Martin DB12 Super Tourer',
    tariffFormatted: '₹1,45,000 / Day',
    serviceMode: 'selfdrive',
    pickupHub: 'Jubilee Hills',
    bannerImage: '/aston-martin-db12-night.webp',
    bannerImageAlt: 'Aston Martin DB12 super tourer parked at golden twilight in Hyderabad',
    highlights: [
      '100% Commercial Insurance & Comprehensive Protection',
      'Instant Digital KYC Verification Vault Approval',
      'Full-to-Full Fuel & Active FASTag Pre-Loaded',
    ],
    flightSyncSupported: false,
  },
]

export const DEFAULT_HOME_SECTIONS: HomeSectionsConfig = {
  studioStageEyebrow: '01 / INTERACTIVE GARAGE STAGE',
  studioStageTitle: 'Inspect Flagship Specs',
  fleetSectionEyebrow: '02 / CURATED HYDERABAD FLEET',
  fleetSectionTitle: 'The Garage Collection',
  fleetSectionSubtitle: 'Toggle chauffeur or self-drive privilege and compare up to 3 flagships side-by-side.',
  beyondEyebrow: '02B / DRIVEIT PRIVÉ COLLECTION',
  beyondTitle: 'Beyond The Boulevard',
  beyondSubtitle: 'Private jet tarmac access, bespoke marine vessels, wedding convoys & executive lounges.',
  protocolEyebrow: '03 / CURATED PROTOCOLS · HYDERABAD',
  protocolTitle: 'Signature Mobility Protocols',
  protocolSubtitle:
    'Whether arriving on the private tarmac at RGIA or making a grand entrance at Taj Falaknuma, explore white-glove itineraries engineered for absolute distinction.',
  radarEyebrow: '03 / LIVE TELEMETRY · HYDERABAD VVIP CORRIDORS',
  radarTitle: 'Flight-Sync & Route Radar',
  radarSectorLabel: 'HYDERABAD METROPOLITAN SECTOR · 17.3850° N, 78.4867° E',
  radarDelayBadge: '60-MIN FLIGHT DELAY BUFFER INCLUDED',
  radarDefaultFlightCode: 'EK-526',
  closingEyebrow: '04 / WHITE-GLOVE DISPATCH · BANJARA HILLS',
  closingTitle: 'Command The Road On Your Terms',
  closingDescription:
    'Whether arriving via private airside gate at RGIA or stepping out for a black-tie gala at Taj Falaknuma, our Banjara Hills concierge stands ready 24/7.',
  closingBannerImage: '/black-chauffeur-sedan-night-city.webp',
  closingBannerImageAlt: 'Black DRIVEIT luxury chauffeur flagship sedan gliding through night city boulevard',
  closingCtaLabel: 'Explore Complete Fleet',
  closingPassLabel: 'INVITATION PROTOCOL',
  closingPassTitle: 'DRIVEIT PRIVÉ PASS',
  closingPassBenefits: [
    'Priority Rolls-Royce & Ferrari fleet allocation in Hyderabad',
    'Complimentary 60-minute RGIA & Begumpet tarmac waiting buffer',
    'Dedicated 24/7 WhatsApp concierge desk & instant digital invoicing',
  ],
}

export const DEFAULT_JET_SHOWCASE: ServiceShowcaseItem[] = [
  {
    badgeLabel: 'GULFSTREAM AEROSPACE',
    model: 'Gulfstream G650ER',
    specs: 'Up to 18 Guests · 7,500 nm Ultra-Long Range · Mach 0.925',
    highlightTag: 'Begumpet & RGIA Direct Ramp',
    src: '/studio/gulfstream-g650er-tarmac.webp',
    imageAlt: 'Gulfstream G650ER ultra-long-range private jet parked on private tarmac by DRIVEIT Aviation',
    ctaLabel: 'Inquire Flight',
  },
  {
    badgeLabel: 'EMBRAER EXECUTIVE JETS',
    model: 'Embraer Praetor 600',
    specs: '9 Guests · 4,018 nm Range · Super-Midsize Fly-By-Wire',
    highlightTag: 'Non-Stop Dubai / Singapore / London',
    src: '/studio/embraer-praetor-600.webp',
    imageAlt: 'Embraer Praetor 600 super-midsize business jet studio showcase by DRIVEIT Aviation',
    ctaLabel: 'Inquire Flight',
  },
  {
    badgeLabel: 'BOMBARDIER AVIATION',
    model: 'Bombardier Global 7500',
    specs: '19 Guests · 7,700 nm Range · 4-Zone Private Master Suite',
    highlightTag: 'Airside Maybach & Customs Escort',
    src: '/studio/bombardier-global-7500.webp',
    imageAlt: 'Bombardier Global 7500 private jet departing at golden hour — DRIVEIT Aviation',
    ctaLabel: 'Inquire Flight',
  },
  {
    badgeLabel: 'HEAVY CABIN CHARTER',
    model: 'Gulfstream G650 / Falcon 8X',
    specs: '14–16 Guests · High-Speed Wi-Fi & Fine Dining Galley',
    highlightTag: 'Flight-Synced Chauffeur On Arrival',
    src: '/studio/gulfstream-g650-high-altitude.webp',
    imageAlt: 'Gulfstream G650 high-altitude private charter aircraft above clouds — DRIVEIT Aviation',
    ctaLabel: 'Inquire Flight',
  },
]

export const DEFAULT_YACHT_SHOWCASE: ServiceShowcaseItem[] = [
  {
    badgeLabel: 'BENETTI YACHTS',
    model: 'Benetti Oasis 40M',
    specs: '40m Length · 12 Overnight / 35 Day Guests · Beach Club Infinity Pool',
    highlightTag: 'Fold-Out Terraces & Michelin Chef Galley',
    src: '/yachts/benetti-oasis-40m-superyacht.webp',
    imageAlt: 'Benetti Oasis 40M luxury motor superyacht with infinity beach club deck — DRIVEIT Privé',
    ctaLabel: 'Inquire Charter',
  },
  {
    badgeLabel: 'AZIMUT YACHTS',
    model: 'Azimut Grande 36M',
    specs: '36m Length · 10 Overnight / 25 Day Guests · Carbon Tech Superstructure',
    highlightTag: 'Flybridge Sky Lounge & Limo Dockside Pickup',
    src: '/yachts/azimut-grande-36m-yacht.webp',
    imageAlt: 'Azimut Grande 36M Italian motor yacht cruising coastal waters — DRIVEIT Privé',
    ctaLabel: 'Inquire Charter',
  },
  {
    badgeLabel: 'FERRETTI GROUP',
    model: 'Ferretti Yachts 1000',
    specs: '30m Length · 5 Suites / 20 Event Guests · Panorama Teak Upper Deck',
    highlightTag: 'Dedicated Marine Crew & Sunset Soundstage',
    src: '/yachts/ferretti-yachts-1000.webp',
    imageAlt: 'Ferretti Yachts 1000 widebody flagship motor yacht — DRIVEIT Privé',
    ctaLabel: 'Inquire Charter',
  },
  {
    badgeLabel: 'SUNSEEKER',
    model: 'Sunseeker 90 Ocean',
    specs: '27.1m Length · 8 Overnight / 24 Event Guests · X-TEND Sunbed System',
    highlightTag: 'Water Toys, Seadoo Tenders & Concierge Provisioning',
    src: '/yachts/sunseeker-90-ocean-yacht.webp',
    imageAlt: 'Sunseeker 90 Ocean luxury charter yacht in twilight marina — DRIVEIT Privé',
    ctaLabel: 'Inquire Charter',
  },
]

export const DEFAULT_COACH_SHOWCASE: ServiceShowcaseItem[] = [
  {
    badgeLabel: 'EXECUTIVE COACH',
    model: 'Mercedes-Benz Commuter Lounge Coach',
    specs: '14–45 Guests · Individual Leather Recliners · Starlink Wi-Fi',
    highlightTag: 'Aircraft-style seating & entertainment gallery',
    src: '/suv/toyota-commuter-custom.webp',
    imageAlt: 'Customized executive Toyota Commuter luxury lounge coach in Hyderabad',
    ctaLabel: 'Inquire',
  },
  {
    badgeLabel: 'VIP ENTOURAGE VAN',
    model: 'Mercedes-Benz V-Class Presidential Lounge',
    specs: '6–7 Guests · Ottoman Captain Seats · Dual-Zone Chill Bar',
    highlightTag: 'Tinted privacy cabin for corporate & bridal entourages',
    src: '/trending/mercedes-v-class.webp',
    imageAlt: 'Mercedes-Benz V-Class presidential lounge van with leather captain seats',
    ctaLabel: 'Inquire',
  },
  {
    badgeLabel: 'GALA CABIN SUITE',
    model: 'Bespoke Obsidian & Gold Fleet Cabin',
    specs: 'Ambient Lounge Lighting · Dedicated Marshal & Luggage Escort',
    highlightTag: 'Bespoke black and gold wedding convoy specification',
    src: '/luxury-coach-interior-black-gold.webp',
    imageAlt: 'Bespoke obsidian leather and gold accent luxury coach cabin interior',
    ctaLabel: 'Inquire',
  },
  {
    badgeLabel: 'DELEGATION CONVOY',
    model: 'Flagship Multi-Car Chauffeur Motorcade',
    specs: 'Synchronized Timing · Falaknuma, HITEC & Airport Terminals',
    highlightTag: 'Synchronized multi-vehicle wedding & summit dispatch',
    src: '/luxury-flagship-cars-in-black-studio.webp',
    imageAlt: 'DRIVEIT Luxury flagship motorcade vehicles arranged in obsidian studio',
    ctaLabel: 'Inquire',
  },
]

