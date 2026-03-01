import { NextRequest, NextResponse } from 'next/server';
import { registerAgent } from '@/lib/auth-db';

export async function POST(req: NextRequest) {
  const { org_key, name } = await req.json();
  if (!org_key || !name) {
    return NextResponse.json({ error: 'org_key and name required' }, { status: 400 });
  }
  const result = registerAgent(org_key, name);
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result);
}
