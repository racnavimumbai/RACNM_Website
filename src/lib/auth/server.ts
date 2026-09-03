import crypto from 'crypto';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { Database } from '@/lib/supabase/database.types';

export const ADMIN_COOKIE_NAME = 'rcnm_admin_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'rcnm_secure_fallback_admin_secret_salt_2026_magnum_opus'
  );
}

/**
 * Creates an HMAC-SHA256 signed session token containing timestamp and payload signature.
 */
export function createAdminSessionToken(): string {
  const timestamp = Date.now().toString();
  const secret = getSessionSecret();
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`admin:${timestamp}`);
  const signature = hmac.digest('hex');
  return `${timestamp}.${signature}`;
}

/**
 * Validates the HMAC-SHA256 signature and expiration of a session token.
 */
export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Verify TTL
  const now = Date.now();
  if (now - timestamp > SESSION_TTL_MS || timestamp > now + 60000) {
    return false; // Expired or future timestamp
  }

  const secret = getSessionSecret();
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(`admin:${timestampStr}`);
  const expectedSignature = hmac.digest('hex');

  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
}

/**
 * Verifies if the incoming request or server cookie context belongs to an authenticated administrator.
 * Checks both the secure HTTP-only signed session cookie AND Supabase Auth session if configured.
 */
export async function verifyAdminSession(request?: Request): Promise<boolean> {
  const cookieStore = await cookies();

  // 1. Check HTTP-only signed session cookie
  let sessionToken: string | undefined;

  if (request) {
    // Check Cookie header
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE_NAME}=([^;]+)`));
    if (match) {
      sessionToken = decodeURIComponent(match[1]);
    }
  }

  if (!sessionToken) {
    sessionToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  }

  if (verifyAdminSessionToken(sessionToken)) {
    return true;
  }

  // 2. Check Supabase server-side session if Supabase credentials are configured
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
              // Server component write ignored
            }
          }
        }
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return true;
      }
    } catch (err) {
      console.error('[verifyAdminSession] Supabase auth check error:', err);
    }
  }

  return false;
}
