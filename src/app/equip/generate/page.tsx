'use client';
import { useEquip } from '../EquipContext';
import { Stepper } from '../Stepper';
import { CopyButton } from '../CopyButton';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const tabs = [
  { key: 'soul', label: 'SOUL.md', icon: '🧠' },
  { key: 'agents', label: 'AGENTS.md', icon: '📋' },
  { key: 'config', label: 'openclaw.json', icon: '⚙️' },
  { key: 'plist', label: 'LaunchAgent', icon: '🍎' },
  { key: 'deploy', label: 'Deploy Script', icon: '🚀' },
  { key: 'memory', label: 'Git Memory', icon: '💾' },
] as const;

type TabKey = typeof tabs[number]['key'];

export default function GeneratePage() {
  const { state, update } = useEquip();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('soul');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!state.loadoutSlug || !state.agentName) return;
    if (state.generatedFiles) return;

    setLoading(true);
    fetch('/api/equip/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        loadoutSlug: state.loadoutSlug,
        agentName: state.agentName,
        agentEmoji: state.agentEmoji,
        agentRole: state.agentRole,
        model: state.model,
        channel: state.channel,
        port: state.port,
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else update({ generatedFiles: data });
      })
      .catch(() => setError('Failed to generate files'))
      .finally(() => setLoading(false));
  }, [state.loadoutSlug, state.agentName]);

  if (!state.loadoutSlug || !state.agentName) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Stepper current={3} />
        <div className="text-center py-20">
          <p className="text-zinc-400 mb-4">Please complete the previous steps first.</p>
          <button onClick={() => router.push('/equip')} className="text-emerald-400 hover:underline">
            ← Start over
          </button>
        </div>
      </div>
    );
  }

  const files = state.generatedFiles;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Stepper current={3} />
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold font-mono mb-2">
          {state.agentEmoji} {state.agentName} — Generated Files
        </h1>
        <p className="text-zinc-400">Review the files that will be created for your agent</p>
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="inline-block animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-zinc-400">Generating files...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-20">
          <p className="text-red-400 mb-4">❌ {error}</p>
          <button onClick={() => router.push('/equip/configure')} className="text-emerald-400 hover:underline">
            ← Go back
          </button>
        </div>
      )}

      {files && (
        <>
          {/* Tab bar */}
          <div className="flex flex-wrap gap-1 mb-4 border-b border-zinc-800 pb-2">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-3 py-2 rounded-t text-sm font-mono transition-all ${
                  activeTab === t.key
                    ? 'bg-zinc-800 text-emerald-400 border-b-2 border-emerald-500'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="relative">
            <div className="absolute top-3 right-3 z-10">
              <CopyButton text={files[activeTab]} label="Copy" />
            </div>
            <pre className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 overflow-x-auto text-sm font-mono text-zinc-300 max-h-[60vh] overflow-y-auto leading-relaxed whitespace-pre-wrap">
              {files[activeTab]}
            </pre>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => router.push('/equip/configure')}
              className="px-5 py-3 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              ← Back
            </button>
            <button
              onClick={() => router.push('/equip/deploy')}
              className="px-6 py-3 rounded-lg font-bold text-sm bg-emerald-500 text-black hover:bg-emerald-400 transition-all"
            >
              Next: Deploy →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
