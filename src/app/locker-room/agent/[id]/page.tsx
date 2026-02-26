'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { loadouts } from '@/data/loadouts';

interface Agent {
  id: number;
  name: string;
  emoji: string;
  title: string | null;
  description: string | null;
  loadout_slug: string;
  autonomy_level: string;
  status: string;
  created_at: string;
}

interface Equipment {
  id: number;
  tool_name: string;
  tool_category: string | null;
  is_active: number;
}

const autonomyLevels = [
  { value: 'observer', label: 'Observer', icon: '👁️' },
  { value: 'assistant', label: 'Assistant', icon: '🤝' },
  { value: 'autonomous', label: 'Autonomous', icon: '⚡' },
  { value: 'full_trust', label: 'Full Trust', icon: '🔓' },
];

export default function AgentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [agent, setAgent] = useState<Agent | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTool, setShowAddTool] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/roster/${id}`);
    if (!res.ok) { router.push('/locker-room'); return; }
    const data = await res.json();
    setAgent(data.agent);
    setEquipment(data.equipment);
    setLoading(false);
  }, [id, router]);

  useEffect(() => { load(); }, [load]);

  async function toggleTool(eqId: number, isActive: boolean) {
    await fetch(`/api/roster/${id}/equipment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ equipment_id: eqId, is_active: !isActive }),
    });
    load();
  }

  async function addTool(toolName: string, toolCategory?: string) {
    await fetch(`/api/roster/${id}/equipment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_name: toolName, tool_category: toolCategory }),
    });
    setShowAddTool(false);
    load();
  }

  async function updateAutonomy(level: string) {
    await fetch(`/api/roster/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autonomy_level: level }),
    });
    load();
  }

  async function removeAgent() {
    await fetch(`/api/roster/${id}`, { method: 'DELETE' });
    router.push('/locker-room');
  }

  if (loading || !agent) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-zinc-500 font-mono">Loading...</div></div>;

  const loadout = loadouts.find(l => l.slug === agent.loadout_slug);
  const equippedNames = new Set(equipment.map(e => e.tool_name));
  const availableTools = loadout ? [...loadout.coreTools, ...loadout.optionalTools].filter(t => !equippedNames.has(t.name)) : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
        <a href="/locker-room" className="hover:text-emerald-400 transition-colors">Locker Room</a>
        <span>→</span>
        <span className="text-zinc-300">{agent.name}</span>
      </div>

      {/* Header */}
      <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/50 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{agent.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold">{agent.name}</h1>
              {agent.title && <p className="text-zinc-400">{agent.title}</p>}
              <div className="flex items-center gap-3 mt-1 text-sm">
                <span className="text-zinc-500">{loadout?.emoji} {loadout?.name || agent.loadout_slug}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-700/50 text-zinc-400 border border-zinc-700'}`}>
                  {agent.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        {agent.description && <p className="text-zinc-400 mt-4 text-sm">{agent.description}</p>}
      </div>

      {/* Autonomy Level */}
      <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/50 mb-6">
        <h2 className="text-lg font-bold mb-4">Autonomy Level</h2>
        <div className="grid grid-cols-4 gap-2">
          {autonomyLevels.map(a => (
            <button key={a.value} onClick={() => updateAutonomy(a.value)}
              className={`text-center border rounded-lg p-3 transition-all ${agent.autonomy_level === a.value ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-800 hover:border-zinc-600'}`}>
              <span className="text-xl block">{a.icon}</span>
              <span className="text-xs mt-1 block">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/50 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Equipment ({equipment.length} tools)</h2>
          <button onClick={() => setShowAddTool(true)}
            className="px-3 py-1.5 text-sm bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-colors">
            + Add Equipment
          </button>
        </div>
        <div className="space-y-2">
          {equipment.map(eq => (
            <div key={eq.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-zinc-800/50">
              <div className="flex items-center gap-3">
                <span className={`text-xs ${eq.is_active ? 'text-emerald-500' : 'text-zinc-600'}`}>●</span>
                <span className="font-mono text-sm">{eq.tool_name}</span>
                {eq.tool_category && <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded">{eq.tool_category}</span>}
              </div>
              <button onClick={() => toggleTool(eq.id, !!eq.is_active)}
                className={`w-10 h-5 rounded-full transition-colors relative ${eq.is_active ? 'bg-emerald-600' : 'bg-zinc-700'}`}>
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${eq.is_active ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Tool Modal */}
      {showAddTool && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAddTool(false)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Add Equipment</h3>
            {availableTools.length === 0 ? (
              <p className="text-zinc-500">All available tools are already equipped.</p>
            ) : (
              <div className="space-y-2">
                {availableTools.map(t => (
                  <button key={t.name} onClick={() => addTool(t.name, 'core')}
                    className="w-full text-left border border-zinc-800 rounded-lg p-3 hover:border-emerald-500/30 transition-all">
                    <div className="font-mono text-sm text-emerald-400">{t.name}</div>
                    <div className="text-zinc-500 text-xs mt-1">{t.description}</div>
                  </button>
                ))}
              </div>
            )}
            <button onClick={() => setShowAddTool(false)} className="mt-4 px-4 py-2 border border-zinc-700 text-zinc-400 rounded-lg hover:border-zinc-500 transition-colors">Close</button>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="border border-red-900/30 rounded-xl p-6 bg-red-950/10">
        <h2 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h2>
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} className="px-4 py-2 border border-red-800 text-red-400 rounded-lg hover:bg-red-900/20 transition-colors text-sm">
            Remove from Roster
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-zinc-400">Are you sure?</span>
            <button onClick={removeAgent} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors text-sm">Yes, Remove</button>
            <button onClick={() => setConfirmDelete(false)} className="px-4 py-2 border border-zinc-700 text-zinc-400 rounded-lg text-sm">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
