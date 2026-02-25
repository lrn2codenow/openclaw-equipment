'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadouts } from '@/data/loadouts';

const autonomyLevels = [
  { value: 'observer', label: 'Observer', icon: '👁️', desc: 'Watches and reports. Never acts independently.' },
  { value: 'assistant', label: 'Assistant', icon: '🤝', desc: 'Suggests actions. Asks before executing.' },
  { value: 'autonomous', label: 'Autonomous', icon: '⚡', desc: 'Acts independently within guardrails.' },
  { value: 'full_trust', label: 'Full Trust', icon: '🔓', desc: 'Full autonomy. Unrestricted operation.' },
];

const popularEmojis = ['🤖', '🦞', '🧠', '⚡', '🔥', '🎯', '💎', '🚀', '🛡️', '👾', '🦾', '🌟'];

export default function AddAgentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedLoadout, setSelectedLoadout] = useState('');
  const [form, setForm] = useState({ name: '', emoji: '🤖', title: '', description: '', autonomy_level: 'assistant' });
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r => { if (!r.ok) router.push('/login'); else setAuthed(true); });
  }, [router]);

  const loadout = loadouts.find(l => l.slug === selectedLoadout);

  async function deploy() {
    setLoading(true);
    const res = await fetch('/api/roster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, loadout_slug: selectedLoadout }),
    });
    if (res.ok) router.push('/locker-room');
    setLoading(false);
  }

  if (!authed) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${s <= step ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>{s}</div>
            {s < 4 && <div className={`w-12 h-0.5 ${s < step ? 'bg-emerald-600' : 'bg-zinc-800'}`} />}
          </div>
        ))}
        <span className="ml-3 text-zinc-500 text-sm font-mono">
          {step === 1 ? 'Choose Loadout' : step === 2 ? 'Customize' : step === 3 ? 'Review' : 'Deploy'}
        </span>
      </div>

      {/* Step 1: Choose Loadout */}
      {step === 1 && (
        <div>
          <h1 className="text-2xl font-bold font-mono mb-2">Draft Your Agent</h1>
          <p className="text-zinc-400 mb-6">Choose a loadout — the role kit that defines what tools your agent gets.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loadouts.map(l => (
              <button key={l.slug} onClick={() => { setSelectedLoadout(l.slug); setStep(2); }}
                className={`text-left border rounded-xl p-5 transition-all hover:border-emerald-500/30 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)] ${selectedLoadout === l.slug ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/50'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{l.emoji}</span>
                  <div>
                    <h3 className="font-bold text-lg">{l.name}</h3>
                    <p className="text-zinc-500 text-xs">{l.coreTools.length} core tools · {l.optionalTools.length} optional</p>
                  </div>
                </div>
                <p className="text-zinc-400 text-sm">{l.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Customize */}
      {step === 2 && (
        <div>
          <h1 className="text-2xl font-bold font-mono mb-2">Customize Your Agent</h1>
          <p className="text-zinc-400 mb-6">Give your agent a name, identity, and set how much freedom it gets.</p>
          <div className="space-y-6 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Agent Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Jarvis, Friday, HAL"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Emoji</label>
              <div className="flex flex-wrap gap-2">
                {popularEmojis.map(e => (
                  <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${form.emoji === e ? 'bg-emerald-600/20 border-2 border-emerald-500 scale-110' : 'bg-zinc-800 border border-zinc-700 hover:border-zinc-500'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Title (optional)</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Head of Home Ops"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Description (optional)</label>
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="What's this agent's mission?"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-3">Autonomy Level</label>
              <div className="grid grid-cols-2 gap-3">
                {autonomyLevels.map(a => (
                  <button key={a.value} onClick={() => setForm(f => ({ ...f, autonomy_level: a.value }))}
                    className={`text-left border rounded-lg p-3 transition-all ${form.autonomy_level === a.value ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span>{a.icon}</span>
                      <span className="font-medium text-sm">{a.label}</span>
                    </div>
                    <p className="text-zinc-500 text-xs">{a.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-4 py-2 border border-zinc-700 text-zinc-400 rounded-lg hover:border-zinc-500 transition-colors">Back</button>
              <button onClick={() => { if (form.name) setStep(3); }} disabled={!form.name}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && loadout && (
        <div>
          <h1 className="text-2xl font-bold font-mono mb-2">Review Deployment</h1>
          <p className="text-zinc-400 mb-6">Confirm your agent configuration before deploying.</p>
          <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/50 max-w-lg">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-5xl">{form.emoji}</span>
              <div>
                <h2 className="text-xl font-bold">{form.name}</h2>
                {form.title && <p className="text-zinc-400 text-sm">{form.title}</p>}
                <p className="text-zinc-500 text-xs mt-1">{loadout.emoji} {loadout.name} Loadout</p>
              </div>
            </div>
            {form.description && <p className="text-zinc-400 text-sm mb-4">{form.description}</p>}
            <div className="mb-4">
              <span className="text-sm text-zinc-500">Autonomy:</span>
              <span className="ml-2 text-sm">{autonomyLevels.find(a => a.value === form.autonomy_level)?.icon} {autonomyLevels.find(a => a.value === form.autonomy_level)?.label}</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-400 mb-2">Equipment ({loadout.coreTools.length} tools)</h3>
              <div className="space-y-1">
                {loadout.coreTools.map(t => (
                  <div key={t.name} className="flex items-center gap-2 text-sm">
                    <span className="text-emerald-500">●</span>
                    <span className="font-mono text-zinc-300">{t.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(2)} className="px-4 py-2 border border-zinc-700 text-zinc-400 rounded-lg hover:border-zinc-500 transition-colors">Back</button>
            <button onClick={deploy} disabled={loading}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
              {loading ? 'Deploying...' : '🚀 Deploy Agent'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
