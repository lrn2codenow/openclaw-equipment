import { NextResponse } from 'next/server';
import { getStaticPackages } from '@/lib/static-data';

export async function GET() {
  // Featured = first 12 packages (curated order in static data)
  const featured = getStaticPackages().slice(0, 12).map(p => ({
    slug: p.slug, name: p.name, description: p.description,
    category: p.category, version: p.version, install: p.install,
  }));

  return NextResponse.json({ packages: featured }, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}
