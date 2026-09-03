import { NextResponse } from 'next/server';
import { submitJoinApplication } from '@/lib/data/api';
import { sendJoinNotificationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const full_name = body.full_name || body.name;
    const email = body.email;
    const phone = body.phone;
    const occupation = body.occupation || 'Student / Professional';
    const age = body.age ? parseInt(body.age, 10) : 21;
    const motivation = body.motivation || body.reason || '';

    if (!full_name || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and phone number are required fields.' },
        { status: 400 }
      );
    }

    // 1. Save application to database / storage
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

    // 2. Trigger instant email notification to recipient email IDs
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
      message: 'Application submitted and email notification sent successfully.',
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
