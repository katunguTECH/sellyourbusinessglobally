export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/social-listening/:path*',
    '/dashboard/:path*',
    '/campaigns/:path*',
    '/leads/:path*',
    '/outreach/:path*',
    '/analytics/:path*',
    '/settings/:path*',
  ],
}