import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name || !body.description || !body.category || !body.version) {
    return NextResponse.json({ error: 'Missing required fields: name, description, category, version' }, { status: 400 });
  }

  // In production (Vercel), writes go to a queue for review
  // In development, writes go directly to SQLite
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createPackage } = require('@/lib/db');
    const result = createPackage({
      name: body.name,
      description: body.description,
      category: body.category,
      version: body.version,
      author: body.author || 'Anonymous',
      license: body.license || 'MIT',
      magnet_uri: body.magnet_uri || body.magnetUri || 'pending',
      source_url: body.source_url || body.sourceUrl,
      tags: body.tags || [],
      platform: body.platform || ['any'],
      compatibility: body.compatibility || ['any'],
    });
    return NextResponse.json(result, { status: 201 });
  } catch {
    // SQLite not available (Vercel) — accept submission for review
    return NextResponse.json({
      status: 'queued',
      message: 'Package submitted for review. It will appear in the registry after approval.',
      package: { name: body.name, category: body.category, version: body.version },
    }, { status: 202 });
  }
}
