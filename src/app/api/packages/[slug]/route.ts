import { NextRequest, NextResponse } from 'next/server';
import { getPackageBySlug, getPackageVersions, getPackageReviews, trackApiHit } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  trackApiHit({
    endpoint: 'package_detail',
    slug,
    userAgent: request.headers.get('user-agent') || undefined,
    referrer: request.headers.get('referer') || undefined,
  });

  const pkg = getPackageBySlug(slug);
  if (!pkg) {
    return NextResponse.json({ error: 'Package not found' }, { status: 404 });
  }

  const versions = getPackageVersions(slug);
  const reviews = getPackageReviews(slug);

  return NextResponse.json({ ...pkg, versions, reviews });
}
