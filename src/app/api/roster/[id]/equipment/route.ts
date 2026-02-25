import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getRosterAgent, addEquipment, toggleEquipment, removeEquipment } from '@/lib/auth-db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const agent = getRosterAgent(Number(id), user.id);
  if (!agent) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { tool_name, tool_category } = await req.json();
  if (!tool_name) return NextResponse.json({ error: 'tool_name required' }, { status: 400 });
  const result = addEquipment(Number(id), tool_name, tool_category);
  return NextResponse.json(result);
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { equipment_id, is_active } = await req.json();
  toggleEquipment(equipment_id, is_active);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { equipment_id } = await req.json();
  removeEquipment(equipment_id);
  return NextResponse.json({ ok: true });
}
