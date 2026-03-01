import { NextRequest } from 'next/server';
import { profiles } from '@/data/profiles';
import { jsonResponse, errorResponse, optionsResponse } from '../../cors';

export function OPTIONS() { return optionsResponse(); }

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const profile = profiles.find(p => p.slug === slug);

  if (!profile) {
    return errorResponse('Agent profile not found', 404);
  }

  return jsonResponse({
    name: profile.name,
    slug: profile.slug,
    emoji: profile.emoji,
    title: profile.title,
    description: profile.description,
    abilities: profile.abilities.map(a => ({
      name: a.name,
      level: a.level,
      category: a.category,
    })),
    loadout: profile.loadout,
    autonomyLevel: profile.autonomyLevel,
    status: profile.status,
    stats: profile.stats,
  });
}
