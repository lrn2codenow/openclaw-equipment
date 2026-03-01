import { NextRequest, NextResponse } from 'next/server';
import { getAgentByToken } from '@/lib/auth-db';

export async function POST(req: NextRequest) {
  const { token } = await req.json();
  const authHeader = req.headers.get('authorization');
  const apiToken = token || (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);
  if (!apiToken) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 });
  }
  const agent = getAgentByToken(apiToken);
  if (!agent) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  const { api_token: _, ...safe } = agent;
  return NextResponse.json({ agent: safe });
}
