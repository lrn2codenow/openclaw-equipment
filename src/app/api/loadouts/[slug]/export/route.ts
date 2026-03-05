import { NextRequest, NextResponse } from 'next/server';
import { getStaticPackage } from '@/lib/static-data';
import { loadouts } from '@/data/loadouts';
import { toolToPackages } from '@/data/tool-mappings';

const cors = { 'Access-Control-Allow-Origin': '*' };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const loadout = loadouts.find(l => l.slug === slug);
  if (!loadout) {
    return NextResponse.json({ error: 'Loadout not found' }, { status: 404, headers: cors });
  }

  const tools = loadout.coreTools.map(tool => {
    const slugs = toolToPackages[tool.name] || [];
    const packages = slugs.map(s => getStaticPackage(s)).filter(Boolean);
    return { capability: tool.name, packages };
  });

  return NextResponse.json({
    slug: loadout.slug,
    name: loadout.name,
    soul_md: loadout.sampleSoul,
    tools,
    workflows: loadout.workflows,
  }, { headers: cors });
}
