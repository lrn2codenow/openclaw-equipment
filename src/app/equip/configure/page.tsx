'use client';
import { useEquip } from '../EquipContext';
import { Stepper } from '../Stepper';
import { useRouter } from 'next/navigation';
import { getLoadoutBySlug } from '@/data/loadouts';

const models = ['claude-sonnet-4', 'claude-opus-4', 'gpt-5.2'];
const channels = ['telegram', 'discord', 'whatsapp'];

export default function ConfigurePage() {
  const { state, update } = useEquip();
  const router = useRouter();
  const loadout = getLoadoutBySlug(state.loadoutSlug);

  if (!loadout) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Stepper current={2} />
        <div className="text-center py-20">
          <p className="text-zinc-400 mb-4">No loadout selected.</p>
          <button onClick={() => router.push('/equip')} className="text-emerald-400 hover:underline">
            ← Go back and choose one
          </button>
        </div>
      </div>
    );
  }

  const canProceed = state.agentName.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Stepper current={2} />
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold font-mono mb-2">Configure Your Agent</h1>
        <p className="text-zinc-400">Loadout: {loadout.emoji} {loadout.name}</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Agent Name *</label>
          <input
            type="text"
            value={state.agentName}
            onChange={e => update({ agentName: e.target.value })}
            placeholder="e.g. Jarvis, Friday, Marvin..."
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Emoji</label>
            <input
              type="text"
              value={state.agentEmoji}
              onChange={e => update({ agentEmoji: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-emerald-500 focus:outline-none text-2xl text-center"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Port</label>
            <input
              type="number"
              value={state.port}
              onChange={e => update({ port: parseInt(e.target.value) || 19003 })}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-emerald-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Role / Title</label>
          <input
            type="text"
            value={state.agentRole}
            onChange={e => update({ agentRole: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Model</label>
          <select
            value={state.model}
            onChange={e => update({ model: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 focus:border-emerald-500 focus:outline-none font-mono"
          >
            {models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Channel</label>
          <div className="flex gap-3">
            {channels.map(ch => (
              <button
                key={ch}
                onClick={() => update({ channel: ch })}
                className={`px-4 py-2 rounded-lg border text-sm font-mono capitalize transition-all ${
                  state.channel === ch
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                {ch === 'telegram' ? '📱' : ch === 'discord' ? '💬' : '📞'} {ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button
          onClick={() => router.push('/equip')}
          className="px-5 py-3 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          ← Back
        </button>
        <button
          disabled={!canProceed}
          onClick={() => router.push('/equip/generate')}
          className="px-6 py-3 rounded-lg font-bold text-sm bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next: Generate Files →
        </button>
      </div>
    </div>
  );
}
