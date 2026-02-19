import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const db = getDb();

  const pkg = db.prepare(`
    SELECT p.*, 
      COALESCE(AVG(r.rating), 0) as avg_rating,
      COUNT(r.id) as review_count
    FROM packages p
    LEFT JOIN reviews r ON r.package_id = p.id
    WHERE p.slug = ?
    GROUP BY p.id
  `).get(slug);

  if (!pkg) {
    return NextResponse.json({ error: 'Package not found' }, { status: 404 });
  }

  const versions = db.prepare(
    'SELECT * FROM versions WHERE package_id = ? ORDER BY created_at DESC'
  ).all((pkg as any).id);

  const reviews = db.prepare(
    'SELECT * FROM reviews WHERE package_id = ? ORDER BY created_at DESC LIMIT 10'
  ).all((pkg as any).id);

  return NextResponse.json({ ...pkg, versions, reviews });
}
