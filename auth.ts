import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

import { requiredSecret } from '@/lib/env'

const googleConfigured = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)

if (!googleConfigured) {
  console.warn(
    '[auth] AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET are not set — Google sign-in will not work until they are configured.',
  )
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || '',
      clientSecret: process.env.AUTH_GOOGLE_SECRET || '',
    }),
  ],
  callbacks: {
    /**
     * Creates or updates the customer record in Payload CMS immediately upon Google sign-in.
     */
    async signIn({ user }) {
      if (user?.email) {
        try {
          const { getPayload } = await import('payload')
          const config = (await import('@/payload.config')).default
          const { upsertCustomer } = await import('@/lib/customers')
          const payload = await getPayload({ config })
          await upsertCustomer(payload, {
            email: user.email,
            name: user.name ?? null,
          })
        } catch (err) {
          console.error('[auth] Failed to upsert customer on signIn callback:', err)
        }
      }
      return true
    },
    /**
     * Consumed by `proxy.ts` — returning false makes NextAuth redirect the
     * request to the sign-in page, so protected routes are enforced on the
     * server instead of only in client-side effects.
     */
    authorized({ auth }) {
      return Boolean(auth?.user)
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days persistent session cookie
  },
  trustHost: true,
  // Never falls back to a hardcoded secret — see lib/env.ts
  secret: requiredSecret('AUTH_SECRET', 'driveit-dev-only-insecure-auth-secret'),
})
