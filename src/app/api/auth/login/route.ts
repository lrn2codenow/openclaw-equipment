import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, verifyPassword, createSession } from '@/lib/auth-db';
import { getOrgByEmail, verifyOrgPassword, createOrgSession } from '@/lib/auth-db';
import { getSessionCookieName } from '@/lib/auth';
import { getOrgSessionCookieName } from '@/lib/auth-middleware';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  // Try new org system first
  const org = getOrgByEmail(email);
  if (org && verifyOrgPassword(password, org.password_hash)) {
    const sessionToken = createOrgSession(org.id);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(getOrgSessionCookieName(), sessionToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', maxAge: 24 * 60 * 60, path: '/',
    });
    // Also set legacy session if user exists there
    const legacyUser = getUserByEmail(email);
    if (legacyUser && verifyPassword(password, legacyUser.password_hash)) {
      const legacySession = createSession(legacyUser.id);
      res.cookies.set(getSessionCookieName(), legacySession, {
        httpOnly: true, secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', maxAge: 30 * 24 * 60 * 60, path: '/',
      });
    }
    return res;
  }

  // Fall back to legacy system
  const user = getUserByEmail(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const sessionId = createSession(user.id);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(getSessionCookieName(), sessionId, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', maxAge: 30 * 24 * 60 * 60, path: '/',
  });
  return res;
}
