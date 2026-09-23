/**
 * Seeds a running DriveIt instance through the Payload REST API.
 *
 *   npm run seed                      # targets http://localhost:3000
 *   SEED_BASE_URL=https://staging… npm run seed
 *
 * Why REST instead of the Payload local API: this script only needs `fetch`, so
 * it runs on every Node version/OS. It also exercises the real access-control
 * layer — if the seed can write, so can a signed-in admin.
 *
 * Idempotent: documents whose business key (slug, or author for reviews) already
 * exists are skipped, so it is safe to run repeatedly.
 *
 * Credentials:
 *   • On a fresh install (no staff accounts yet) it registers the first admin
 *     via /api/users/first-register using SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD,
 *     generating a strong password when SEED_ADMIN_PASSWORD is not set. The
 *     generated password is printed once — save it, it is never stored in git.
 *   • On an existing install it logs in with those credentials.
 *
 * Review counters (rating / reviewsCount / bookingsCount) are seeded as 0: the
 * marketing UI hides them at 0 and we never publish invented social proof.
 * Fill them in /admin once real numbers exist.
 */
import { carsData } from '../lib/cars'
import { faqSeed, SITE_DEFAULTS, serviceSeed, statsSeed, testimonialSeed } from '../lib/content-seed'
import { blogSeedPosts } from '../lib/blog-seed'
import {
  ADMIN_EMAIL,
  api,
  authenticate,
  BASE,
  createDocument,
  documentExists,
  errorMessage,
  log,
} from './lib/admin-client'

async function main() {
  const { token, password } = await authenticate()

  // Print credentials before doing any content work — a failure halfway through
  // must never leave an admin account with a password nobody knows.
  if (password) {
    log('──────────────────────────────────────────────────────────────')
    log(`ADMIN LOGIN  ${ADMIN_EMAIL}`)
    log(`PASSWORD     ${password}`)
    log('Save this now — it is shown once and is not stored anywhere.')
    log('──────────────────────────────────────────────────────────────')
  }

  // ── Fleet ────────────────────────────────────────────────────────────────
  let cars = 0
  for (const [index, car] of carsData.entries()) {
    if (await documentExists('cars', { slug: car.slug }, token)) continue
    await createDocument(
      'cars',
      {
        name: car.name,
        slug: car.slug,
        brand: car.brand,
        category: car.category,
        pricePerDay: car.price,
        imageSrc: car.src,
        gallery: [{ src: car.src }],
        transmission: car.transmission,
        fuel: car.fuel,
        seats: car.seats,
        services: car.services,
        specs: car.specs,
        kmAllowance: car.kmAllowance,
        securityDeposit: car.securityDeposit,
        cancellationPolicy: car.cancellationPolicy,
        rating: 0,
        reviewsCount: 0,
        bookingsCount: 0,
        sortOrder: index,
        isActive: true,
      },
      token,
    )
    cars += 1
  }
  log(`fleet: ${cars} created (${carsData.length - cars} already present)`)

  // ── Services ─────────────────────────────────────────────────────────────
  let services = 0
  for (const [index, service] of serviceSeed.entries()) {
    if (await documentExists('services', { slug: service.slug }, token)) continue
    await createDocument(
      'services',
      {
        title: service.title,
        slug: service.slug,
        shortDescription: service.summary,
        price: service.price,
        sortOrder: index,
        isPublished: true,
      },
      token,
    )
    services += 1
  }
  log(`services: ${services} created`)

  // ── Reviews ──────────────────────────────────────────────────────────────
  let reviews = 0
  for (const [index, review] of testimonialSeed.entries()) {
    if (await documentExists('testimonials', { author: review.name }, token)) continue
    await createDocument(
      'testimonials',
      {
        author: review.name,
        role: review.role,
        content: review.quote,
        rating: review.rating,
        avatarSrc: review.image,
        sortOrder: index,
        isPublished: true,
      },
      token,
    )
    reviews += 1
  }
  log(`reviews: ${reviews} created`)

  // ── Journal ──────────────────────────────────────────────────────────────
  let posts = 0
  for (const post of blogSeedPosts) {
    if (await documentExists('blogs', { slug: post.slug }, token)) continue
    const published = new Date(post.date)
    await createDocument(
      'blogs',
      {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImageSrc: post.image,
        author: post.author,
        category: post.category,
        readTimeMinutes: post.readTimeMinutes,
        publishedDate: Number.isNaN(published.getTime()) ? new Date().toISOString() : published.toISOString(),
        isPublished: true,
      },
      token,
    )
    posts += 1
  }
  log(`journal: ${posts} created`)

  // ── Branding, counters, FAQs ─────────────────────────────────────────────
  const settings = await api('/api/globals/site-settings', {
    method: 'POST',
    token,
    body: JSON.stringify({
      siteName: SITE_DEFAULTS.siteName,
      contactPhone: SITE_DEFAULTS.contactPhone,
      contactEmail: SITE_DEFAULTS.contactEmail,
      whatsappNumber: SITE_DEFAULTS.whatsappNumber,
      address: SITE_DEFAULTS.address,
      mapEmbedUrl: SITE_DEFAULTS.mapEmbedUrl,
      mapLink: SITE_DEFAULTS.mapLink,
      stats: statsSeed,
      faqs: faqSeed.map((faq) => ({ question: faq.q, answer: faq.a })),
    }),
  })
  if (!settings.ok) {
    throw new Error(`Updating site settings failed (HTTP ${settings.status}): ${errorMessage(settings.body)}`)
  }
  log('site settings, homepage counters and FAQs written')

  log(`done — open ${BASE}/admin to manage everything that was seeded`)
}

main().catch((error) => {
  console.error(`[seed] ${error instanceof Error ? error.message : error}`)
  process.exit(1)
})
