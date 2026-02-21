import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/db';

export async function GET(request: NextRequest) {
  // Simple protection: require x-internal-key header or localhost
  const host = request.headers.get('host') || '';
  const internalKey = request.headers.get('x-internal-key');
  const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');

  if (!isLocal && internalKey !== process.env.ANALYTICS_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const summary = getAnalyticsSummary();
  return NextResponse.json(summary);
}
