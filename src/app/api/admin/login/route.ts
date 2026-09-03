import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { createAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth/server';
import { createServerClient } from '@supabase/ssr';
import { Database } from '@/lib/supabase/database.types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required.' },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    let authenticated = false;

    // 1. Live Environment: Authenticate strictly via Supabase Auth users
    if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase-url')) {
      if (!email || typeof email !== 'string') {
        return NextResponse.json(
          { error: 'Email address is required for admin authentication.' },
          { status: 400 }
        );
      }

      const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore
            }
          }
        }
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error || !data.session) {
        return NextResponse.json(
          { error: error?.message || 'Invalid email or password.' },
          { status: 401 }
        );
      }

      authenticated = true;
    } else {
      // 2. Offline / Mock Mode Only: Passcode fallback when Supabase is not connected
      const serverPasscode = process.env.ADMIN_PASSCODE || 'MAGNUMOPUS2026';
      const inputBuffer = Buffer.from(password);
      const expectedBuffer = Buffer.from(serverPasscode);

      if (inputBuffer.length === expectedBuffer.length) {
        authenticated = crypto.timingSafeEqual(inputBuffer, expectedBuffer);
      }

      if (!authenticated) {
        return NextResponse.json(
          { error: 'Invalid credentials. Access Denied.' },
          { status: 401 }
        );
      }
    }

    // Issue secure signed HTTP-only session cookie
    const token = createAdminSessionToken();
    const isProd = process.env.NODE_ENV === 'production';

    cookieStore.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
    });

    return NextResponse.json({
      success: true,
      message: 'Authenticated successfully.'
    });
  } catch (error: unknown) {
    console.error('[Admin Login Error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Authentication failed.' },
      { status: 500 }
    );
  }
}
