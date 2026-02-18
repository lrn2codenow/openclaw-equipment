import { NextRequest, NextResponse } from 'next/server';
import { searchPackages } from '@/lib/db';

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const result = searchPackages({
    q: sp.get('q') || undefined,
    category: sp.get('category') || undefined,
    platform: sp.get('platform') || undefined,
    compatibility: sp.get('compatibility') || undefined,
    sort: sp.get('sort') || undefined,
    limit: sp.get('limit') ? parseInt(sp.get('limit')!) : undefined,
    offset: sp.get('offset') ? parseInt(sp.get('offset')!) : undefined,
  });
  return NextResponse.json(result);
}
