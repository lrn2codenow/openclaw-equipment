import { NextRequest } from 'next/server';
import { loadouts } from '@/data/loadouts';
import { jsonResponse, optionsResponse } from '../cors';

export function OPTIONS() { return optionsResponse(); }

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');

  let filtered = loadouts;
  if (category) {
    filtered = loadouts.filter(l => l.category.toLowerCase() === category.toLowerCase());
  }

  const result = filtered.map(l => ({
    name: l.name,
    slug: l.slug,
    emoji: l.emoji,
    description: l.description,
    category: l.category,
    toolCount: l.coreTools.length + l.optionalTools.length,
    workflowCount: l.workflows.length,
  }));

  return jsonResponse({ loadouts: result });
}
