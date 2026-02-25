'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { loadouts } from '@/data/loadouts';

interface Agent {
  id: number;
  name: string;
  emoji: string;
  title: string | null;
  loadout_slug: string;
  autonomy_level: string;
  status: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  org_name: string;
}

const autonomyLabels: Record<string, string> = {
  observer: '👁️ Observer',
  assistant: '🤝 Assistant',
  autonomous: '⚡ Autonomous',
  full_trust: '🔓 Full Trust',
};

const autonomyColors: Record<string, string> = {
  observer: 'text-zinc-400',
  assistant: 'text-emerald-400',
  autonomous: 'text-cyan-400',
  full_trust: 'text-purple-400',
};

export default function LockerRoom() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [userRes, rosterRes] = await Promise.all([
      fetch('/api/auth/me'),
      fetch('/api/roster'),
    ]);
    if (!userRes.ok) { router.push('/login'); return; }
    const userData = await userRes.json();
    setUser(userData.user);
    if (rosterRes.ok) {
      const rosterData = await rosterRes.json();
      setAgents(rosterData.agents);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-zinc-500 font-mono">Loading...</div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono">The Locker Room</h1>
            <span className="text-xs px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full font-mono">
              {user?.org_name}
            </span>
          </div>
          <p className="text-zinc-500 mt-1">{agents.length} agent{agents.length !== 1 ? 's' : ''} on roster</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/locker-room/add"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
            <span>+</span> Add Agent to Roster
          </a>
        </div>
      </div>

      {/* Agent Grid */}
      {agents.length === 0 ? (
        <div className="border border-zinc-800 border-dashed rounded-xl p-16 text-center">
          <span className="text-6xl block mb-4">🦞</span>
          <h2 className="text-xl font-bold mb-2">No agents deployed yet</h2>
          <p className="text-zinc-500 mb-6">Your roster is empty. Deploy your first agent to get started.</p>
          <a href="/locker-room/add"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors">
            Deploy Your First Agent →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map(agent => {
            const loadout = loadouts.find(l => l.slug === agent.loadout_slug);
            return (
              <a key={agent.id} href={`/locker-room/agent/${agent.id}`}
                className="group block border border-zinc-800 rounded-xl p-5 bg-zinc-900/50 hover:border-emerald-500/30 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)] transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{agent.emoji}</span>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-emerald-400 transition-colors">{agent.name}</h3>
                      {agent.title && <p className="text-zinc-500 text-sm">{agent.title}</p>}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-700/50 text-zinc-400 border border-zinc-700'}`}>
                    {agent.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-zinc-500">{loadout?.emoji} {loadout?.name || agent.loadout_slug}</span>
                  <span className="text-zinc-700">·</span>
                  <span className={autonomyColors[agent.autonomy_level] || 'text-zinc-400'}>
                    {autonomyLabels[agent.autonomy_level] || agent.autonomy_level}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
