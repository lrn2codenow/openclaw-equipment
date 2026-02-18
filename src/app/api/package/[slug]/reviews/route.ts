import { NextRequest, NextResponse } from 'next/server';
import { getPackageReviews, getPackageBySlug, createReview } from '@/lib/db';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const reviews = getPackageReviews(slug);
  return NextResponse.json({ reviews });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug) as { id: string } | undefined;
  if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 });

  const body = await request.json();
  if (!body.rating || body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
  }

  const result = createReview({
    package_id: pkg.id,
    reviewer: body.reviewer || 'Anonymous',
    reviewer_type: body.reviewer_type || 'human',
    rating: body.rating,
    review: body.review,
    works_on: body.works_on,
    issues: body.issues,
  });

  return NextResponse.json(result, { status: 201 });
}
