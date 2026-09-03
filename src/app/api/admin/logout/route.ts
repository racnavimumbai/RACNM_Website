import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME } from '@/lib/auth/server';
import { createServerClient } from '@supabase/ssr';
import { Database } from '@/lib/supabase/database.types';

export async function POST() {
  const cookieStore = await cookies();

  // Clear HTTP-only session cookie
  cookieStore.delete(ADMIN_COOKIE_NAME);

  // If Supabase is configured, also sign out of Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase-url')) {
    try {
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
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Logged out successfully.'
  });
}
