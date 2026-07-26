import { auth as middleware } from '@/auth'
export default middleware

export const config = {
  matcher: ['/dashboard/:path*', '/checkout/:path*'],
}
