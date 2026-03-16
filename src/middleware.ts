import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const authenticated = request.cookies.get('authenticated')?.value === 'true';
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/destinations') && !authenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname === '/' && authenticated) {
    return NextResponse.redirect(new URL('/destinations', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/destinations/:path*'],
};
