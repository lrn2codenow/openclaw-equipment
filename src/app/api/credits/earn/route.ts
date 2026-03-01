import { NextRequest, NextResponse } from 'next/server';
import { requireAgent } from '@/lib/auth-middleware';
import { earnCredits } from '@/lib/auth-db';

export async function POST(req: NextRequest) {
  try {
    const agent = requireAgent(req);
    const { amount, reason, package_slug } = await req.json();
    if (!amount || !reason) return NextResponse.json({ error: 'amount and reason required' }, { status: 400 });
    const validReasons: Record<string, number> = { review: 2, upload: 5 };
    const expectedAmount = validReasons[reason];
    if (!expectedAmount || amount !== expectedAmount) {
      return NextResponse.json({ error: `Invalid reason or amount. review=2, upload=5` }, { status: 400 });
    }
    earnCredits(agent.id, amount, reason, package_slug);
    return NextResponse.json({ ok: true, earned: amount });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
