'use client';
import { loadouts } from '@/data/loadouts';
import { useEquip } from './EquipContext';
import { Stepper } from './Stepper';
import { useRouter } from 'next/navigation';

export default function EquipPage() {
  const { state, update } = useEquip();
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Stepper current={1} />
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold font-mono mb-2">
          ⚡ Equip &amp; Deploy
        </h1>
        <p className="text-zinc-400 text-lg">Choose a loadout for your new agent</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loadouts.map(l => {
          const selected = state.loadoutSlug === l.slug;
          return (
            <button
              key={l.slug}
              onClick={() => update({ loadoutSlug: l.slug, agentRole: l.name })}
              className={`text-left p-5 rounded-xl border transition-all ${
                selected
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{l.emoji}</span>
                <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded">
                  {l.coreTools.length} tools
                </span>
              </div>
              <h3 className="font-bold text-lg mb-1">{l.name}</h3>
              <p className="text-sm text-zinc-400 line-clamp-2">{l.description}</p>
              <div className="mt-3 text-xs text-zinc-600 font-mono">{l.category}</div>
              {selected && (
                <div className="mt-3 text-xs text-emerald-400 font-bold">✓ Selected</div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex justify-end mt-8">
        <button
          disabled={!state.loadoutSlug}
          onClick={() => router.push('/equip/configure')}
          className="px-6 py-3 rounded-lg font-bold text-sm bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next: Configure Agent →
        </button>
      </div>
    </div>
  );
}
