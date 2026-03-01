import { NextRequest, NextResponse } from 'next/server';
import { createUser, createSession } from '@/lib/auth-db';
import { createOrg, createOrgSession } from '@/lib/auth-db';
import { getSessionCookieName } from '@/lib/auth';
import { getOrgSessionCookieName } from '@/lib/auth-middleware';

export async function POST(req: NextRequest) {
  const { name, email, password, org_name } = await req.json();

  // Support both old (user-based) and new (org-based) signup
  // New system: name = org name, no separate user name
  const orgName = org_name || name;
  if (!orgName || !email || !password) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
  }

  // Create org in new system
  const orgResult = createOrg(orgName, email, password);
  if ('error' in orgResult) {
    return NextResponse.json({ error: orgResult.error }, { status: 409 });
  }

  const sessionToken = createOrgSession(orgResult.id);

  // Also create in legacy system for backward compat
  const legacyResult = createUser(org_name ? (name || orgName) : orgName, email, password, orgName);
  if (!('error' in legacyResult)) {
    const legacySession = createSession(legacyResult.id);
    const res = NextResponse.json({ ok: true, org_key: orgResult.org_key });
    res.cookies.set(getSessionCookieName(), legacySession, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', maxAge: 30 * 24 * 60 * 60, path: '/',
    });
    res.cookies.set(getOrgSessionCookieName(), sessionToken, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', maxAge: 24 * 60 * 60, path: '/',
    });
    return res;
  }

  // If legacy fails (email exists there), just set org session
  const res = NextResponse.json({ ok: true, org_key: orgResult.org_key });
  res.cookies.set(getOrgSessionCookieName(), sessionToken, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', maxAge: 24 * 60 * 60, path: '/',
  });
  return res;
}
