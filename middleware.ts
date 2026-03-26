import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n/request'

export default createMiddleware({
  locales,
  defaultLocale: 'fr',
  localePrefix: 'always'
})

export const config = {
  matcher: ['/', '/(fr|en)/:path*', '/((?!api|_next|_vercel|studio|.*\\..*).*)']
}
