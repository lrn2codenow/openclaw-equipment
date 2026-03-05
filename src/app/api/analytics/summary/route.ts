import { NextResponse } from 'next/server';
import { getStaticPackages } from '@/lib/static-data';

export async function GET() {
  return NextResponse.json({
    total_packages: getStaticPackages().length,
    total_api_hits: 0,
    message: 'Analytics coming soon',
  }, { headers: { 'Access-Control-Allow-Origin': '*' } });
}
