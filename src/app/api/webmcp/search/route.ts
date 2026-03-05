import { NextRequest } from 'next/server';
import { searchStaticPackages } from '@/lib/static-data';
import { jsonResponse, errorResponse, optionsResponse } from '../cors';

export function OPTIONS() { return optionsResponse(); }

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const query = sp.get('query') || sp.get('q');

  if (!query) {
    return errorResponse('Missing required parameter: query');
  }

  const limit = Math.min(Math.max(parseInt(sp.get('limit') || '10') || 10, 1), 50);
  const result = searchStaticPackages(query, sp.get('category') || undefined, limit);

  const packages = result.packages.map(p => ({
    name: p.name, slug: p.slug, description: p.description,
    category: p.category, version: p.version, install: p.install,
  }));

  return jsonResponse({ packages, total: result.total, query });
}
