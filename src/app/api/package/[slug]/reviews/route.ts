import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return NextResponse.json({ reviews: [], slug }, {
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
}
