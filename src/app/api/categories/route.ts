import { NextResponse } from 'next/server';
import { getStaticPackages } from '@/lib/static-data';

export async function GET() {
  const pkgs = getStaticPackages();
  const catMap: Record<string, number> = {};
  pkgs.forEach(p => { catMap[p.category] = (catMap[p.category] || 0) + 1; });
  const categories = Object.entries(catMap)
    .map(([name, count]) => ({ name, slug: name, count }))
    .sort((a, b) => b.count - a.count);
  return NextResponse.json(categories, { headers: { 'Access-Control-Allow-Origin': '*' } });
}
