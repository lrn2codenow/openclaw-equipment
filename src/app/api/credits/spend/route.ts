import { NextRequest, NextResponse } from 'next/server';
import { requireAgent } from '@/lib/auth-middleware';
import { spendCredits } from '@/lib/auth-db';

export async function POST(req: NextRequest) {
  try {
    const agent = requireAgent(req);
    const { amount = 1, reason = 'equip', package_slug } = await req.json();
    const ok = spendCredits(agent.id, amount, reason, package_slug);
    if (!ok) return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
    return NextResponse.json({ ok: true, remaining: agent.credits - amount });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
