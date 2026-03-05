import { NextResponse } from 'next/server';
import { getStaticPackages } from '@/lib/static-data';

export async function GET() {
  const pkgs = getStaticPackages().map(p => ({
    slug: p.slug, name: p.name, description: p.description,
    category: p.category, version: p.version, install: p.install,
    source_url: p.source_url,
  }));
  return NextResponse.json({ packages: pkgs, total: pkgs.length }, {
    headers: { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=600' },
  });
}
