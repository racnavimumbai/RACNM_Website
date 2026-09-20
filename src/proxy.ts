import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get('rcnm_admin_session')?.value;
    
    // Check if Supabase auth cookies exist (prefixed with sb-)
    const hasSupabaseCookie = Array.from(request.cookies.getAll()).some(c =>
      c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
    );

    if (!sessionCookie && !hasSupabaseCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
