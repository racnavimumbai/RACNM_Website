import { NextResponse } from 'next/server';
import { submitJoinApplication } from '@/lib/data/api';
import { sendJoinNotificationEmail } from '@/lib/email';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9+\s().-]{7,20}$/;

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting (max 3 submissions per 10 minutes per IP)
    const clientIp = getClientIp(request);
    const rl = rateLimit(clientIp, 3, 10 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        {
          error: `Too many submissions from this connection. Please wait ${rl.resetSeconds} seconds before submitting again.`
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rl.resetSeconds) }
        }
      );
    }

    const body = await request.json();

    // 2. Invisible Bot Honeypot Trap
    // Automated spam bots fill all hidden form inputs
    if (body.website || body.company_url || body.fax_number) {
      console.warn(`[Anti-Spam] Bot detected and silently dropped (IP: ${clientIp})`);
      return NextResponse.json({
        success: true,
        message: 'Application submitted successfully.'
      });
    }

    // 3. Strict Input Sanitization & Validation
    const full_name = typeof body.full_name === 'string' ? body.full_name.trim() : (typeof body.name === 'string' ? body.name.trim() : '');
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const occupation = typeof body.occupation === 'string' ? body.occupation.trim().slice(0, 100) : 'Student / Professional';
    const motivation = typeof body.motivation === 'string' ? body.motivation.trim().slice(0, 2000) : (typeof body.reason === 'string' ? body.reason.trim().slice(0, 2000) : '');

    let age = 21;
    if (body.age) {
      const parsedAge = parseInt(String(body.age), 10);
      if (!isNaN(parsedAge) && parsedAge >= 12 && parsedAge <= 100) {
        age = parsedAge;
      }
    }

    if (!full_name || full_name.length < 2 || full_name.length > 100) {
      return NextResponse.json(
        { error: 'Please enter a valid full name (2-100 characters).' },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email) || email.length > 100) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!phone || !PHONE_REGEX.test(phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid phone number (7-20 digits).' },
        { status: 400 }
      );
    }

    // 4. Save application record
    const savedApp = await submitJoinApplication({
      name: full_name,
      full_name,
      email,
      phone,
      age,
      occupation,
      reason: motivation,
      motivation
    });

    // 5. Send notification email to club directors
    await sendJoinNotificationEmail({
      full_name,
      email,
      phone,
      age,
      occupation,
      motivation
    });

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully. Our team will contact you soon.',
      data: savedApp
    });
  } catch (error: unknown) {
    console.error('[API /api/join error]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process application.' },
      { status: 500 }
    );
  }
}
