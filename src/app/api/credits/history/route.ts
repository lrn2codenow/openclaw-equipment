import { NextRequest, NextResponse } from 'next/server';
import { requireAgent } from '@/lib/auth-middleware';
import { getCreditHistory } from '@/lib/auth-db';

export async function GET(req: NextRequest) {
  try {
    const agent = requireAgent(req);
    const history = getCreditHistory(agent.id);
    return NextResponse.json({ agent_id: agent.id, credits: agent.credits, history });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
