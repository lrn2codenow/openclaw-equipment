import { NextRequest, NextResponse } from 'next/server';
import { getStaticPackages } from '@/lib/static-data';

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const category = sp.get('category');
  const format = sp.get('format') || 'full';
  
  let pkgs = getStaticPackages();
  
  if (category) {
    pkgs = pkgs.filter(p => p.category === category);
  }

  const packages = pkgs.map(p => {
    if (format === 'compact') {
      return { slug: p.slug, version: p.version, category: p.category };
    }
    let tags: string[] = [];
    try { tags = JSON.parse(p.tags || '[]'); } catch { /* */ }
    let platform: string[] = [];
    try { platform = JSON.parse(p.platform || '["any"]'); } catch { /* */ }
    return {
      slug: p.slug, name: p.name, description: p.description,
      category: p.category, version: p.version, install: p.install,
      source_url: p.source_url, tags, platform, license: p.license,
    };
  });

  // Compute categories
  const catMap: Record<string, number> = {};
  getStaticPackages().forEach(p => { catMap[p.category] = (catMap[p.category] || 0) + 1; });
  const categories = Object.entries(catMap).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count);

  return NextResponse.json({
    registry: 'openclaw-equipment',
    version: '1.0.0',
    url: 'https://openclaw.equipment',
    total: packages.length,
    categories,
    packages,
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300, s-maxage=600',
    },
  });
}
