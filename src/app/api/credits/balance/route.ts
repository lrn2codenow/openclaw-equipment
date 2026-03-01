import { NextRequest, NextResponse } from 'next/server';
import { requireAgent } from '@/lib/auth-middleware';

export async function GET(req: NextRequest) {
  try {
    const agent = requireAgent(req);
    return NextResponse.json({ agent_id: agent.id, credits: agent.credits });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
