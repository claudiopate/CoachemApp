import { NextRequest, NextFetchEvent } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { authMiddleware } from '@clerk/nextjs';
import intlConfig from './next-intl.config'; // usa la config centralizzata

// Configurazione pubblica
const publicRoutes = [
  '/',
  '/login',
  '/sign-up',
  '/verify-email',
  '/sign-up/sso-callback',
  '/api/webhook/clerk',
  '/:locale/login',
  '/:locale/sign-up',
  '/:locale/verify-email',
  '/:locale/sign-up/sso-callback'
];

const ignoredRoutes = [
  '/api/webhook/clerk'
];

// Middleware Clerk
const clerk = authMiddleware({
  publicRoutes,
  ignoredRoutes
});

// Middleware next-intl
const intl = createMiddleware({
  ...intlConfig,
  localePrefix: 'always' // va messo qui, non nella config globale
});

// Middleware composito
export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const pathname = req.nextUrl.pathname;

  // Auth per /api prima di tutto
  if (pathname.startsWith('/api/')) {
    const authResult = clerk(req, event);
    if (authResult) return authResult;
    return;
  }

  // Per tutte le route NON pubbliche, passa prima da Clerk
  const isPublic = publicRoutes.some(route => {
    if (route.includes('/:locale')) {
      const noLocale = route.replace('/:locale', '');
      return pathname === noLocale || pathname.endsWith(noLocale);
    }
    return pathname === route;
  });

  if (!isPublic) {
    const authResult = clerk(req, event);
    if (authResult) return authResult;
  }

  // Poi passa da next-intl
  return intl(req);
}

// Matcher per Next.js middleware
export const config = {
  matcher: [
    '/((?!_next|_vercel|.*\\.[^/]*$).*)', // tutte tranne statiche
    '/(api|trpc)/(.*)'                   // API incluse
  ]
};
