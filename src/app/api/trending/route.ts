import { NextRequest, NextResponse } from 'next/server';
import { getTrending } from '@/lib/db';

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const packages = getTrending({
    timeframe: sp.get('timeframe') || undefined,
    category: sp.get('category') || undefined,
  });
  return NextResponse.json({ packages });
}
