import { NextResponse } from 'next/server';
import { getStaticPackages } from '@/lib/static-data';

export async function GET() {
  // Return first 10 as "trending" (no real download stats yet)
  const trending = getStaticPackages().slice(0, 10).map(p => ({
    slug: p.slug, name: p.name, description: p.description,
    category: p.category, version: p.version,
  }));
  return NextResponse.json({ packages: trending }, { headers: { 'Access-Control-Allow-Origin': '*' } });
}
