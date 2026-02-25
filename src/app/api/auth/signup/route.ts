import { NextRequest, NextResponse } from 'next/server';
import { createUser, createSession } from '@/lib/auth-db';
import { getSessionCookieName } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { name, email, password, org_name } = await req.json();
  if (!name || !email || !password || !org_name) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  const result = createUser(name, email, password, org_name);
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  const sessionId = createSession(result.id);
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
