'use client';
import { useEquip } from '../EquipContext';
import { Stepper } from '../Stepper';
import { CopyButton } from '../CopyButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const checklistItems = [
  { key: 'botfather', label: 'Created Telegram bot via @BotFather' },
  { key: 'token', label: 'Pasted bot token into config' },
  { key: 'script', label: 'Ran deploy script' },
  { key: 'paired', label: 'Paired on Telegram' },
  { key: 'responding', label: 'Agent is responding ✅' },
];

export default function DeployPage() {
  const { state } = useEquip();
  const router = useRouter();
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  const allDone = checklistItems.every(c => checks[c.key]);
  const files = state.generatedFiles;

  if (!files) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Stepper current={4} />
        <div className="text-center py-20">
          <p className="text-zinc-400 mb-4">Please generate files first.</p>
          <button onClick={() => router.push('/equip')} className="text-emerald-400 hover:underline">
            ← Start over
          </button>
        </div>
      </div>
    );
  }

  const name = state.agentName.toLowerCase().replace(/[^a-z0-9]/g, '');

  const downloadScript = () => {
    const blob = new Blob([files.deploy], { type: 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deploy-${name}.sh`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Stepper current={4} />
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold font-mono mb-2">
          🚀 Deploy {state.agentEmoji} {state.agentName}
        </h1>
        <p className="text-zinc-400">Copy the script, paste in terminal, and your agent goes live</p>
      </div>

      {/* Big deploy buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="flex-1">
          <CopyButton text={files.deploy} label="📋 Copy Deploy Script" />
        </div>
        <button
          onClick={downloadScript}
          className="px-6 py-3 rounded-lg font-bold text-sm border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all"
        >
          ⬇️ Download deploy-{name}.sh
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <h2 className="font-bold text-lg mb-4 font-mono">📖 Quick Start</h2>
        <ol className="space-y-3 text-sm text-zinc-300">
          <li className="flex gap-3">
            <span className="text-emerald-400 font-bold">1.</span>
            <span>Open Telegram, search <strong>@BotFather</strong>, send <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs">/newbot</code></span>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-400 font-bold">2.</span>
            <span>Copy the bot token and replace <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs">PASTE_YOUR_BOT_TOKEN_HERE</code> in the deploy script</span>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-400 font-bold">3.</span>
            <span>Open Terminal, paste the script, press Enter</span>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-400 font-bold">4.</span>
            <span>Message your new bot on Telegram — it will ask to pair</span>
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-400 font-bold">5.</span>
            <span>Approve the pairing and you&apos;re live! 🎉</span>
          </li>
        </ol>
      </div>

      {/* Checklist */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <h2 className="font-bold text-lg mb-4 font-mono">✅ Deployment Checklist</h2>
        <div className="space-y-3">
          {checklistItems.map(item => (
            <label key={item.key} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={checks[item.key] || false}
                onChange={() => toggle(item.key)}
                className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500/50 accent-emerald-500"
              />
              <span className={`text-sm transition-colors ${
                checks[item.key] ? 'text-emerald-400 line-through' : 'text-zinc-300 group-hover:text-zinc-100'
              }`}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Success state */}
      {allDone && (
        <div className="text-center bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-emerald-400 mb-2">
            {state.agentEmoji} {state.agentName} is Live!
          </h2>
          <p className="text-zinc-400 mb-6">Your agent is deployed and responding. Welcome to the team.</p>
          <a
            href="/locker-room"
            className="inline-block px-6 py-3 rounded-lg font-bold text-sm bg-emerald-500 text-black hover:bg-emerald-400 transition-all"
          >
            🏟️ Add to Locker Room
          </a>
        </div>
      )}

      {/* Git memory section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg font-mono">💾 Git Memory (Optional)</h2>
          <CopyButton text={files.memory} label="Copy Script" />
        </div>
        <p className="text-sm text-zinc-400 mb-3">
          Initialize git-backed memory for automatic workspace versioning:
        </p>
        <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs font-mono text-zinc-400 overflow-x-auto whitespace-pre-wrap">
          {files.memory}
        </pre>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => router.push('/equip/generate')}
          className="px-5 py-3 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          ← Back to Files
        </button>
      </div>
    </div>
  );
}
