import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /studio routes (except /studio/login)
  if (pathname.startsWith('/studio') && pathname !== '/studio/login') {
    const sessionCookie = request.cookies.get('rcnm_admin_session')?.value;
    
    // Check if Supabase auth cookies exist (prefixed with sb-)
    const hasSupabaseCookie = Array.from(request.cookies.getAll()).some(c =>
      c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
    );

    if (!sessionCookie && !hasSupabaseCookie) {
      const loginUrl = new URL('/studio/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/studio/:path*'],
};
