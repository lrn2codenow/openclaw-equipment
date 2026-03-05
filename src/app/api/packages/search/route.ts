import { NextRequest, NextResponse } from 'next/server';
import { searchStaticPackages } from '@/lib/static-data';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const q = sp.get('q') || '';
  const category = sp.get('category') || undefined;
  const limit = sp.get('limit') ? parseInt(sp.get('limit')!) : 10;

  try {
    const result = searchStaticPackages(q, category, limit);

    const packages = result.packages.map(p => ({
      slug: p.slug,
      name: p.name,
      description: p.description,
      category: p.category,
      version: p.version,
      install: p.install,
      source_url: p.source_url,
    }));

    return NextResponse.json({ packages, total: result.total, query: q, category }, { headers: corsHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Search failed';
    return NextResponse.json({ error: message, packages: [], total: 0 }, { status: 500, headers: corsHeaders });
  }
}
