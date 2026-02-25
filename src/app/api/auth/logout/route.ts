import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteSession } from '@/lib/auth-db';
import { getSessionCookieName } from '@/lib/auth';

export async function POST() {
  const cookieStore = await cookies();
  const session = cookieStore.get(getSessionCookieName());
  if (session?.value) {
    deleteSession(session.value);
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(getSessionCookieName());
  return res;
}
