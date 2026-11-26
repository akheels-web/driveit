/**
 * Bootstrap content for the marketing sections.
 *
 * These values are only used while the matching Payload collection/global field
 * is empty, so a fresh install never renders an empty homepage. Anything an
 * editor saves in /admin always wins.
 */

export type TestimonialView = {
  name: string
  role: string
  image: string
  imageAlt?: string
  quote: string
  rating: number
  fromCms: boolean
}

export type ServiceView = {
  title: string
  slug: string
  href: string
  summary: string
  price?: string
  image?: string
  fromCms: boolean
}

export type StatView = {
  label: string
  value: number
  suffix: string
}

export type FaqView = {
  q: string
  a: string
}

/**
 * Fallbacks for the Site Settings global. Safe to import from client components.
 */
export const SITE_DEFAULTS = {
  siteName: 'DriveIt Luxury Transportation',
  contactPhone: '+91 63000 41186',
  contactEmail: 'info@driveitluxury.in',
  whatsappNumber: '+916300041186',
  address: 'Banjara Hills, Hyderabad, Telangana 500034',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.2137599390176!2d78.4565279!3d17.4015263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb97844e874967%3A0xec0fefe2fefa1e15!2sDriveit%20-%20Selfdrive%20Cars%20-%20Luxury%20Wedding%20Cars%20-%20Cabs%20for%20outstation%20-%20Luxury%20Buses!5e0!3m2!1sen!2sin!4v1756574982222!5m2!1sen!2sin',
  mapLink: 'https://maps.app.goo.gl/z6g9rBdGoT1gzxku8',
} as const

export const testimonialSeed: TestimonialView[] = [
  {
    name: 'Rajesh Kumar',
    role: 'CEO, TechSolutions India',
    image: '/placeholder-user.webp',
    quote:
      "DRIVEIT's luxury car service in Hyderabad is exceptional. Their Rolls-Royce for our corporate events always impresses our international clients. Professional chauffeurs and impeccable service.",
    rating: 5,
    fromCms: false,
  },
  {
    name: 'Priya Sharma',
    role: 'Wedding Planner, Elegant Events',
    image: '/placeholder-user.webp',
    quote:
      'Used DRIVEIT for multiple luxury weddings in Hyderabad. Their wedding car collection is stunning and the service is flawless. Every bride feels like royalty on their special day.',
    rating: 5,
    fromCms: false,
  },
  {
    name: 'Arjun Reddy',
    role: 'Managing Director, RedTech Industries',
    image: '/placeholder-user.webp',
    quote:
      'For our executive transportation needs in Hyderabad, DRIVEIT is our go-to choice. Their luxury fleet and professional service make every business trip memorable and comfortable.',
    rating: 5,
    fromCms: false,
  },
  {
    name: 'Anjali Patel',
    role: 'Luxury Travel Consultant',
    image: '/placeholder-user.webp',
    quote:
      "DRIVEIT's private jet services from Hyderabad are world-class. They handle everything from airport transfers to international travel seamlessly. Highly recommended for luxury travel.",
    rating: 5,
    fromCms: false,
  },
  {
    name: 'Vikram Singh',
    role: 'Director, Singh Hospitality Group',
    image: '/placeholder-user.webp',
    quote:
      'Outstanding luxury transportation service in Hyderabad. Their fleet of premium cars and attention to detail is unmatched. Perfect for our high-profile guests and events.',
    rating: 5,
    fromCms: false,
  },
  {
    name: 'Meera Iyer',
    role: 'Event Manager, Grand Celebrations',
    image: '/placeholder-user.webp',
    quote:
      "DRIVEIT's luxury bus service for our corporate events in Hyderabad is excellent. Comfortable, punctual, and adds a touch of elegance to any group transportation need.",
    rating: 5,
    fromCms: false,
  },
]

export const serviceSeed: ServiceView[] = [
  {
    title: 'Luxury Chauffeur & Self-Drive Fleet',
    slug: 'luxury-car-rental',
    href: '/services/luxury-car-rental',
    summary:
      'Reserve Rolls-Royce, Mercedes-Maybach, Ferrari, and Lamborghini online with instant hold protection.',
    price: 'Instant Online Reservation · ₹0 Chauffeur Deposit',
    image: '/rolls-royce-phantom-night.webp',
    fromCms: false,
  },
  {
    title: 'Private Jet & Helicopter Charters',
    slug: 'private-jet-services',
    href: '/services/private-jet-services',
    summary:
      'On-demand heavy jets, super-midsize aircraft, and helicopters from Begumpet & RGIA with apron Rolls-Royce meet.',
    price: 'Private Commission · Contact Only',
    image: '/gulfstream-g650-private-jet-on-tarmac-night.webp',
    fromCms: false,
  },
  {
    title: 'Superyacht & Marine Charters',
    slug: 'yacht-services',
    href: '/services/yacht-services',
    summary:
      'Bespoke sunset cruises, private deck soirées, and coastal superyacht voyages with private chef and crew.',
    price: 'Private Commission · Contact Only',
    image: '/yachts/benetti-oasis-40m-superyacht.webp',
    fromCms: false,
  },
  {
    title: 'Luxury Coaches & Diplomatic Convoys',
    slug: 'luxury-buses',
    href: '/services/luxury-buses',
    summary:
      '14 to 50-seater custom black-and-gold reclining lounge coaches for wedding entourages and C-suite delegations.',
    price: 'Private Commission · Contact Only',
    image: '/luxury-coach-interior-black-gold.webp',
    fromCms: false,
  },
  {
    title: 'Royal Wedding Motorcades',
    slug: 'wedding-cars',
    href: '/services/wedding-cars',
    summary:
      'Synchronized Rolls-Royce Phantom & Maybach bridal entrances with floral couture and shadow security SUVs.',
    price: 'Online Configurator & Bespoke Convoy Desk',
    image: '/rolls-royce-wedding-ribbon.webp',
    fromCms: false,
  },
  {
    title: 'VIP Airport Tarmac & Terminal Transfers',
    slug: 'pickup-dropoff',
    href: '/services/pickup-dropoff',
    summary:
      'Punctual RGIA Shamshabad & Begumpet arrivals with live flight telemetry and 60-minute delay protection.',
    price: 'Instant Online Reservation',
    image: '/maybach-s680-night.webp',
    fromCms: false,
  },
]

export const statsSeed: StatView[] = [
  { label: 'Luxury Cars', value: 2000, suffix: '+' },
  { label: 'Private Jets', value: 10, suffix: '+' },
  { label: 'Weddings Served', value: 500, suffix: '+' },
  { label: 'Chauffeurs', value: 24, suffix: '/7' },
]

export const faqSeed: FaqView[] = [
  {
    q: 'Do you offer 24/7 concierge service?',
    a: "Yes, our luxury concierge team operates 24/7 to accommodate last-minute bookings, changes, and special requests. We're always available to ensure your luxury travel experience is seamless.",
  },
  {
    q: 'Can I request a professional chauffeur?',
    a: 'Absolutely. Professional, trained chauffeurs are available for all our luxury vehicles. They are experienced in providing discreet, high-quality service for corporate and personal travel.',
  },
  {
    q: 'What documents are required for luxury car rental?',
    a: "For self-drive rentals, we require a valid driver's license, passport/ID, and a security deposit. For chauffeur services, only your booking confirmation is needed.",
  },
  {
    q: 'Do you arrange intercity and international travel?',
    a: 'Yes, we provide comprehensive intercity travel services and coordinate private jet charters for international routes. Our team handles all logistics and arrangements.',
  },
  {
    q: 'What types of luxury vehicles do you offer?',
    a: 'Our fleet includes flagship luxury cars, private jets, yachts, luxury buses, and wedding cars. We offer everything from Rolls-Royce and Bentley to private aviation and marine vessels.',
  },
  {
    q: 'How far in advance should I book?',
    a: 'For peak seasons and special events, we recommend booking 2-4 weeks in advance. However, we can accommodate last-minute requests subject to availability.',
  },
  {
    q: 'Do you provide airport transfer services?',
    a: 'Yes, we offer premium airport transportation with meet-and-greet services, flight tracking, and luggage assistance. Our drivers ensure timely arrivals and departures.',
  },
  {
    q: 'How do I contact you for bookings?',
    a: 'You can reach us 24/7 at +91 63000 41186, email us at info@driveitluxury.in, or use our contact form. Our team will assist you with all your luxury transportation needs.',
  },
]
