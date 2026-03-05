import { NextRequest, NextResponse } from 'next/server';
import { getStaticPackage } from '@/lib/static-data';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const pkg = getStaticPackage(slug);

  if (!pkg) {
    return NextResponse.json({ error: 'Package not found' }, { status: 404, headers: corsHeaders });
  }

  return NextResponse.json(pkg, { headers: corsHeaders });
}
