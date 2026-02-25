'use client';
import { useState } from 'react';
import { loadouts } from '@/data/loadouts';

export default function LoadoutsPage() {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold font-mono mb-2">🦞 Loadout Catalog</h1>
        <p className="text-zinc-400">Pre-built role kits for every type of agent. Pick a loadout and deploy in minutes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loadouts.map(l => (
          <div key={l.slug} className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/50 hover:border-emerald-500/20 transition-all flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{l.emoji}</span>
              <div>
                <h2 className="text-lg font-bold">{l.name}</h2>
                <p className="text-zinc-500 text-xs">{l.coreTools.length} core · {l.optionalTools.length} optional tools</p>
              </div>
            </div>
            <p className="text-zinc-400 text-sm mb-4 flex-1">{l.description}</p>

            {preview === l.slug && (
              <div className="mb-4 p-3 bg-zinc-800/50 rounded-lg">
                <h4 className="text-xs font-medium text-zinc-400 mb-2">Core Tools</h4>
                <div className="space-y-1">
                  {l.coreTools.map(t => (
                    <div key={t.name} className="text-xs"><span className="text-emerald-500">●</span> <span className="font-mono text-zinc-300">{t.name}</span> — <span className="text-zinc-500">{t.description}</span></div>
                  ))}
                </div>
                {l.optionalTools.length > 0 && (
                  <>
                    <h4 className="text-xs font-medium text-zinc-400 mt-3 mb-2">Optional</h4>
                    {l.optionalTools.map(t => (
                      <div key={t.name} className="text-xs"><span className="text-zinc-600">○</span> <span className="font-mono text-zinc-400">{t.name}</span></div>
                    ))}
                  </>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => setPreview(preview === l.slug ? null : l.slug)}
                className="flex-1 px-3 py-2 border border-zinc-700 text-zinc-400 rounded-lg hover:border-zinc-500 transition-colors text-sm">
                {preview === l.slug ? 'Hide' : 'Preview'}
              </button>
              <a href={`/locker-room/add?loadout=${l.slug}`}
                className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-center rounded-lg transition-colors text-sm font-medium">
                Equip →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
