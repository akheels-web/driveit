import { auth } from '@/auth'

/**
 * Next.js 16 renamed the `middleware` file convention to `proxy`.
 *
 * Unlike the previous passthrough middleware (which never actually blocked
 * anything), this enforces authentication on the server for every protected
 * route and remembers where the visitor wanted to go.
 *
 * `/checkout` is intentionally NOT protected — guests may book — it is instead
 * protected by server-side validation and per-IP rate limits.
 */
export default auth((request) => {
  if (request.auth?.user) return

  const signInUrl = new URL('/login', request.nextUrl.origin)
  signInUrl.searchParams.set('redirect', `${request.nextUrl.pathname}${request.nextUrl.search}`)
  return Response.redirect(signInUrl)
})

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard'],
}
