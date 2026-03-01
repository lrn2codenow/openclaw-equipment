import { NextRequest } from 'next/server';
import { searchPackages, trackApiHit } from '@/lib/db';
import { jsonResponse, errorResponse, optionsResponse } from '../cors';

export function OPTIONS() { return optionsResponse(); }

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const query = sp.get('query') || sp.get('q');

  if (!query) {
    return errorResponse('Missing required parameter: query');
  }

  trackApiHit({
    endpoint: 'webmcp_search',
    query,
    userAgent: request.headers.get('user-agent') || undefined,
    referrer: request.headers.get('referer') || undefined,
  });

  const limit = Math.min(Math.max(parseInt(sp.get('limit') || '10') || 10, 1), 50);

  const result = searchPackages({
    q: query,
    category: sp.get('category') || undefined,
    limit,
  });

  const packages = (result.packages || []).map((p: Record<string, unknown>) => ({
    name: p.name,
    slug: p.slug,
    description: p.description,
    category: p.category,
    version: p.version,
    install: p.install,
  }));

  return jsonResponse({ packages, total: result.total, query });
}
