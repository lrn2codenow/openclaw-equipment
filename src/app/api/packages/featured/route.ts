import { NextResponse } from 'next/server';
import { getFeaturedPackages } from '@/lib/db';

export async function GET() {
  const packages = getFeaturedPackages();
  return NextResponse.json({ packages, total: packages.length });
}
