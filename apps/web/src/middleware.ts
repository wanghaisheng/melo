import { REDIRECT_LOGIN_PAGE_URL } from '@/web/env';
import { fireauth } from '@/web/firebase/init';
import { signInAnonymously, signOut } from 'firebase/auth';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - auth/ ( authentication routes )
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|auth|static).*)',
  ],
}

export function middleware(request: NextRequest) {
  const user = fireauth.currentUser;

  if (!user) return NextResponse.redirect(new URL(REDIRECT_LOGIN_PAGE_URL, request.url));
  
  return NextResponse.next();
}