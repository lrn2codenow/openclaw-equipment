import { NextRequest, NextResponse } from 'next/server';
import { getStaticPackage } from '@/lib/static-data';

const cors = { 'Access-Control-Allow-Origin': '*' };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const pkg = getStaticPackage(slug);
  if (!pkg) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: cors });
  return NextResponse.json(pkg, { headers: cors });
}
