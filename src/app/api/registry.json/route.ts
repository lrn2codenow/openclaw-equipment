import { NextResponse } from 'next/server';
import { getAllPackages, getCategories } from '@/lib/db';

export async function GET() {
  const packages = getAllPackages();
  const categories = getCategories();
  return NextResponse.json({
    registry: 'openclaw-equipment',
    version: '1.0.0',
    generated_at: new Date().toISOString(),
    categories,
    packages,
    total: packages.length,
  });
}
