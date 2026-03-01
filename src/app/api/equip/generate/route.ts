import { NextRequest, NextResponse } from 'next/server';
import { generateAllFiles } from '@/lib/equip-generator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { loadoutSlug, agentName, agentEmoji, agentRole, model, channel, port } = body;

    if (!loadoutSlug || !agentName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const files = generateAllFiles({
      loadoutSlug,
      agentName,
      agentEmoji: agentEmoji || '🤖',
      agentRole: agentRole || 'Agent',
      model: model || 'claude-sonnet-4',
      channel: channel || 'telegram',
      port: port || 19003,
    });

    return NextResponse.json(files);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
