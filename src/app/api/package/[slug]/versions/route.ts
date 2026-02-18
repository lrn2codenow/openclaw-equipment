import { NextRequest, NextResponse } from 'next/server';
import { getPackageVersions } from '@/lib/db';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const versions = getPackageVersions(slug);
  return NextResponse.json({ versions });
}
