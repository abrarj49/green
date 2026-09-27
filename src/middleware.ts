import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except:
  // - API routes (/api/*)
  // - Admin routes (/admin/*)
  // - Next.js internals (_next/*)
  // - Static files (favicon, images, etc.)
  matcher: [
    '/',
    '/(en|ar)/:path*',
    '/((?!api|admin|_next|_vercel|.*\\..*).*)',
  ],
};
