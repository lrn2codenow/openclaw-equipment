import { NextRequest, NextResponse } from 'next/server';
import { getStaticPackage } from '@/lib/static-data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const pkg = getStaticPackage(slug);
  if (!pkg) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ versions: [{ version: pkg.version, slug }] }, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}
