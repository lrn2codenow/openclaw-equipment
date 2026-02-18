import { NextRequest, NextResponse } from 'next/server';
import { createPackage } from '@/lib/db';

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.name || !body.description || !body.category || !body.version || !body.magnet_uri) {
    return NextResponse.json({ error: 'Missing required fields: name, description, category, version, magnet_uri' }, { status: 400 });
  }

  try {
    const result = createPackage({
      name: body.name,
      description: body.description,
      category: body.category,
      version: body.version,
      author: body.author || 'Anonymous',
      license: body.license || 'MIT',
      magnet_uri: body.magnet_uri || body.magnetUri,
      source_url: body.source_url || body.sourceUrl,
      tags: body.tags || [],
      platform: body.platform || ['any'],
      compatibility: body.compatibility || ['any'],
    });
    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create package';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
