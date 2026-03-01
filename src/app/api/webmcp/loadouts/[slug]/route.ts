import { NextRequest } from 'next/server';
import { loadouts } from '@/data/loadouts';
import { jsonResponse, errorResponse, optionsResponse } from '../../cors';

export function OPTIONS() { return optionsResponse(); }

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const loadout = loadouts.find(l => l.slug === slug);

  if (!loadout) {
    return errorResponse('Loadout not found', 404);
  }

  return jsonResponse({
    name: loadout.name,
    slug: loadout.slug,
    emoji: loadout.emoji,
    description: loadout.description,
    longDescription: loadout.longDescription,
    category: loadout.category,
    coreTools: loadout.coreTools,
    optionalTools: loadout.optionalTools,
    workflows: loadout.workflows,
    sampleSoul: loadout.sampleSoul,
  });
}
