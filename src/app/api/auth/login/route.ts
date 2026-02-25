import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword, createSession } from '@/lib/auth-db';
import { getSessionCookieName } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  const user = getUserByEmail(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const sessionId = createSession(user.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getSessionCookieName(), sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60,
    path: '/',
  });
  return res;
}
