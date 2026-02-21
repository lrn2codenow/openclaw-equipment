import { NextRequest, NextResponse } from 'next/server';
import { searchPackages, trackApiHit } from '@/lib/db';

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const q = sp.get('q') || undefined;
  const category = sp.get('category') || undefined;

  trackApiHit({
    endpoint: 'search',
    query: q,
    userAgent: request.headers.get('user-agent') || undefined,
    referrer: request.headers.get('referer') || undefined,
  });

  const result = searchPackages({
    q,
    category,
    platform: sp.get('platform') || undefined,
    compatibility: sp.get('compatibility') || undefined,
    sort: sp.get('sort') || undefined,
    limit: sp.get('limit') ? parseInt(sp.get('limit')!) : undefined,
    offset: sp.get('offset') ? parseInt(sp.get('offset')!) : undefined,
  });

  return NextResponse.json(result);
}
