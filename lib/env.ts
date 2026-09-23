/**
 * Environment helpers.
 *
 * Secrets must never silently fall back to a hardcoded value in production —
 * a known secret means forgeable auth tokens and CMS sessions.
 */

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
const isProd = process.env.NODE_ENV === 'production'

/**
 * Returns the value of a required secret.
 *
 * - At runtime in production: throws when missing.
 * - During `next build` (e.g. `docker build`, where env vars are usually absent
 *   because they are injected at runtime) a placeholder is used so the build can
 *   complete; the app still refuses to boot without the real value.
 * - In development: optional insecure fallback, with a loud warning.
 */
export function requiredSecret(name: string, devFallback?: string): string {
  const value = process.env[name]?.trim()
  if (value) return value

  if (isBuildPhase) {
    console.warn(`[env] ${name} is not set during build — using a build-time placeholder.`)
    return `build-time-placeholder-${name.toLowerCase()}`
  }

  if (!isProd && devFallback) {
    console.warn(`[env] ${name} is not set — falling back to an INSECURE development value.`)
    return devFallback
  }

  throw new Error(
    `[env] Missing required environment variable ${name}. Refusing to start with an insecure default. ` +
      `Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`,
  )
}

/** Absolute origin used for links inside emails/WhatsApp messages. */
export function serverUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SERVER_URL?.trim() || process.env.AUTH_URL?.trim() || 'http://localhost:3000'
  return configured.replace(/\/$/, '')
}

export const isProduction = isProd
