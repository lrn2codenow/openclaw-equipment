import { NextResponse } from 'next/server';
import { getStaticPackages } from '@/lib/static-data';
import { loadouts } from '@/data/loadouts';
import { profiles } from '@/data/profiles';

export async function GET() {
  const pkgs = getStaticPackages();
  const catMap: Record<string, number> = {};
  pkgs.forEach(p => { catMap[p.category] = (catMap[p.category] || 0) + 1; });

  return NextResponse.json({
    packages: pkgs.length,
    categories: Object.keys(catMap).length,
    loadouts: loadouts.length,
    profiles: profiles.length,
    breakdown: catMap,
  }, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}
