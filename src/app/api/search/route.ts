import { NextRequest, NextResponse } from 'next/server';
import { searchStaticPackages } from '@/lib/static-data';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  const category = request.nextUrl.searchParams.get('category') || undefined;
  const limit = parseInt(request.nextUrl.searchParams.get('limit') || '20');
  const result = searchStaticPackages(q, category, limit);
  return NextResponse.json(result, { headers: { 'Access-Control-Allow-Origin': '*' } });
}
