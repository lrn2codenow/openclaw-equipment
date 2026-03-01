'use client';
import { useEquip } from '../EquipContext';
import { Stepper } from '../Stepper';
import { CopyButton } from '../CopyButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const checklist = [
  { id: 'botfather', label: 'Created Telegram bot via @BotFather' },
  { id: 'token', label: 'Pasted bot token into openclaw.json config' },
  { id: 'script', label: 'Ran the deploy script' },
  { id: 'paired', label: 'Paired on Telegram — sent first message' },
];

export default function DeployPage() {
  const { state } = useEquip();
  const router = useRouter();
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const allChecked = checklist.every(c => checks[c.id]);
  const files = state.generatedFiles;

  if (!files || !state.agentName) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Stepper current={4} />
        <div className="text-center py-20">
          <p className="text-zinc-400 mb-4">Please complete the previous steps first.</p>
          <button onClick={() => router.push('/equip')} className="text-emerald-400 hover:underline">
            ← Start over
          </button>
        </div>
      </div>
    );
  }

  const downloadScript = () => {
    const blob = new Blob([files.deploy], { type: 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deploy-${state.agentName.toLowerCase().replace(/[^a-z0-9]/g, '')}.sh`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Stepper current={4} />

      <div className="text-center mb-10">
        <div className="text-5xl mb-4">{state.agentEmoji}</div>
        <h1 className="text-2xl sm:text-3xl font-bold font-mono mb-2">
          Deploy {state.agentName}
        </h1>
        <p className="text-zinc-400">Almost there — follow the checklist below</p>
      </div>

      {/* Deploy buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
        <div className="flex-1 max-w-xs">
          <CopyButton text={files.deploy} label="📋 Copy Deploy Script" />
        </div>
        <button
          onClick={downloadScript}
          className="px-6 py-3 rounded-lg font-bold text-sm bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700 hover:border-zinc-600 transition-all"
        >
          ⬇️ Download as .sh
        </button>
      </div>

      {/* Checklist */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-10 backdrop-blur-sm">
        <h2 className="text-lg font-bold font-mono mb-4 text-zinc-200">Deployment Checklist</h2>
        <div className="space-y-4">
          {checklist.map((item, i) => (
            <label
              key={item.id}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  checked={!!checks[item.id]}
                  onChange={() => setChecks(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                  className="peer sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                  checks[item.id]
                    ? 'bg-emerald-500 border-emerald-500 text-black'
                    : 'border-zinc-600 group-hover:border-zinc-500'
                }`}>
                  {checks[item.id] && <span className="text-xs font-bold">✓</span>}
                </div>
              </div>
              <div>
                <span className="text-zinc-500 font-mono text-xs mr-2">Step {i + 1}.</span>
                <span className={`text-sm ${checks[item.id] ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                  {item.label}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Success state */}
      {allChecked && (
        <div className="text-center py-8 px-6 rounded-xl border border-emerald-500/30 bg-emerald-500/5 mb-10 animate-in fade-in">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold font-mono text-emerald-400 mb-2">
            Agent is Live!
          </h2>
          <p className="text-zinc-400 mb-1">
            {state.agentEmoji} <strong>{state.agentName}</strong> is running on port {state.port}
          </p>
          <p className="text-zinc-500 text-sm">
            Send a message on {state.channel} to start chatting with your new agent.
          </p>
        </div>
      )}

      {/* Quick reference */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-sm font-bold font-mono text-zinc-400 mb-3">Quick Reference</h3>
        <pre className="text-xs font-mono text-zinc-500 space-y-1 leading-relaxed">{`# Check agent status
launchctl list | grep openclaw

# View logs
tail -f ~/.openclaw-${state.agentName.toLowerCase().replace(/[^a-z0-9]/g, '')}/logs/stdout.log

# Stop agent
launchctl unload ~/Library/LaunchAgents/ai.openclaw.gateway.${state.agentName.toLowerCase().replace(/[^a-z0-9]/g, '')}.plist

# Restart agent
launchctl unload ~/Library/LaunchAgents/ai.openclaw.gateway.${state.agentName.toLowerCase().replace(/[^a-z0-9]/g, '')}.plist
launchctl load ~/Library/LaunchAgents/ai.openclaw.gateway.${state.agentName.toLowerCase().replace(/[^a-z0-9]/g, '')}.plist`}</pre>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => router.push('/equip/generate')}
          className="px-5 py-3 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          ← Back to Files
        </button>
        <button
          onClick={() => router.push('/equip')}
          className="px-6 py-3 rounded-lg font-bold text-sm bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700 transition-all"
        >
          Deploy Another Agent
        </button>
      </div>
    </div>
  );
}
