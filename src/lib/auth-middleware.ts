import { NextRequest } from 'next/server';
import { getOrgSessionByToken, getAgentByToken } from './auth-db';

const SESSION_COOKIE = 'oc-session';

export function getSession(req: NextRequest) {
  // Try cookie first (human sessions)
  const cookie = req.cookies.get(SESSION_COOKIE)?.value;
  if (cookie) {
    const org = getOrgSessionByToken(cookie);
    if (org) return { type: 'human' as const, org };
  }
  // Try Authorization header (agent tokens)
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) {
    const token = auth.slice(7);
    const agent = getAgentByToken(token);
    if (agent) return { type: 'agent' as const, agent };
  }
  return null;
}

export function requireAuth(req: NextRequest) {
  const session = getSession(req);
  if (!session) throw new Error('Unauthorized');
  return session;
}

export function requireAgent(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) throw new Error('Agent token required');
  const agent = getAgentByToken(auth.slice(7));
  if (!agent) throw new Error('Invalid agent token');
  return agent;
}

export function getOrgSessionCookieName() {
  return SESSION_COOKIE;
}
