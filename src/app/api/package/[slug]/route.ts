import { NextRequest, NextResponse } from 'next/server';
import { getPackageBySlug } from '@/lib/db';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 });
  return NextResponse.json(pkg);
}
