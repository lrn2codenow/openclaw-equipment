import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getRosterAgent, updateRosterAgent, deleteRosterAgent, getAgentEquipment } from '@/lib/auth-db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const agent = getRosterAgent(Number(id), user.id);
  if (!agent) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const equipment = getAgentEquipment(Number(id));
  return NextResponse.json({ agent, equipment });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const data = await req.json();
  updateRosterAgent(Number(id), user.id, data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  deleteRosterAgent(Number(id), user.id);
  return NextResponse.json({ ok: true });
}
