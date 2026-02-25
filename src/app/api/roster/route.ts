import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getRosterAgents, createRosterAgent, addEquipment } from '@/lib/auth-db';
import { getLoadoutBySlug } from '@/data/loadouts';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const agents = getRosterAgents(user.id);
  return NextResponse.json({ agents });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, emoji, title, description, loadout_slug, autonomy_level } = await req.json();
  if (!name || !loadout_slug) {
    return NextResponse.json({ error: 'Name and loadout required' }, { status: 400 });
  }

  const result = createRosterAgent({
    user_id: user.id,
    name,
    emoji: emoji || '🤖',
    title,
    description,
    loadout_slug,
    autonomy_level: autonomy_level || 'assistant',
  });

  // Auto-equip core tools from loadout
  const loadout = getLoadoutBySlug(loadout_slug);
  if (loadout) {
    for (const tool of loadout.coreTools) {
      addEquipment(result.id, tool.name, tool.category);
    }
  }

  return NextResponse.json({ id: result.id });
}
