import { cookies } from 'next/headers';
import { getSessionUser } from './auth-db';

const SESSION_COOKIE = 'oc_session';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  if (!session?.value) return null;
  return getSessionUser(session.value);
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}
