import { NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/auth/server';

export async function GET(request: Request) {
  const authenticated = await verifyAdminSession(request);
  if (!authenticated) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
