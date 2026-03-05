import { NextResponse } from 'next/server';
import { getStaticPackages } from '@/lib/static-data';
import { loadouts } from '@/data/loadouts';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    version: '1.0.0',
    packages: getStaticPackages().length,
    loadouts: loadouts.length,
  }, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}
