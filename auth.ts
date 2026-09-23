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
  session: { strategy: 'jwt' },
  trustHost: true,
  // Never falls back to a hardcoded secret — see lib/env.ts
  secret: requiredSecret('AUTH_SECRET', 'driveit-dev-only-insecure-auth-secret'),
})
