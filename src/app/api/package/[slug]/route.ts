import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// Legacy route used by frontend pages — returns raw DB fields
export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getDb();
  const pkg = db.prepare('SELECT * FROM packages WHERE slug = ?').get(slug);
  if (!pkg) return NextResponse.json({ error: 'Package not found' }, { status: 404 });

  // Parse JSON fields for frontend
  const p = pkg as Record<string, unknown>;
  try { p.tags = JSON.parse(p.tags as string); } catch { /* keep as-is */ }
  try { p.platform = JSON.parse(p.platform as string); } catch { /* keep as-is */ }
  try { p.compatibility = JSON.parse(p.compatibility as string); } catch { /* keep as-is */ }

  return NextResponse.json(p);
}
