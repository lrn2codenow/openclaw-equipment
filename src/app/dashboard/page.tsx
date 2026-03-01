'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Org { id: string; name: string; email: string; org_key: string; created_at: string }
interface Agent { id: string; name: string; slug: string; scopes: string; credits: number; created_at: string }

export default function DashboardPage() {
  const router = useRouter();
  const [org, setOrg] = useState<Org | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [newAgent, setNewAgent] = useState<{ slug: string; api_token: string; credits: number } | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.org) { setOrg(d.org); setAgents(d.agents || []); }
      else router.push('/login');
    }).catch(() => router.push('/login')).finally(() => setLoading(false));
  }, [router]);

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  }

  function maskKey(key: string) {
    return key.slice(0, 8) + '••••••••' + key.slice(-8);
  }

  async function registerAgent() {
    if (!agentName.trim() || !org) return;
    setCreating(true); setError('');
    try {
      const res = await fetch('/api/auth/register-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ org_key: org.org_key, name: agentName }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setNewAgent(data);
      // Refresh agents list
      const me = await fetch('/api/auth/me').then(r => r.json());
      if (me?.agents) setAgents(me.agents);
    } catch { setError('Failed to register agent'); }
    finally { setCreating(false); }
  }

  if (loading) return <div className="min-h-[80vh] flex items-center justify-center"><span className="text-zinc-500 font-mono">Loading...</span></div>;
  if (!org) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold font-mono mb-2">🦞 Dashboard</h1>
      <p className="text-zinc-400 mb-8">Manage your organization and agents</p>

      {/* Org Info */}
      <div className="backdrop-blur-xl bg-white/5 border border-zinc-700/50 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-teal-400">Organization</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wider">Name</label>
            <p className="text-zinc-100 font-medium">{org.name}</p>
          </div>
          <div>
            <label className="text-xs text-zinc-500 uppercase tracking-wider">Email</label>
            <p className="text-zinc-100">{org.email}</p>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs text-zinc-500 uppercase tracking-wider">Org Key</label>
          <div className="flex items-center gap-2 mt-1">
            <code className="flex-1 text-teal-400 font-mono text-sm bg-zinc-900/80 px-3 py-2 rounded border border-zinc-700">
              {showKey ? org.org_key : maskKey(org.org_key)}
            </code>
            <button onClick={() => setShowKey(!showKey)}
              className="px-3 py-2 rounded text-xs bg-zinc-800 text-zinc-400 hover:bg-zinc-700">
              {showKey ? 'Hide' : 'Show'}
            </button>
            <button onClick={() => copy(org.org_key, 'org_key')}
              className={`px-3 py-2 rounded text-xs transition-colors ${copied === 'org_key' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
              {copied === 'org_key' ? '✓' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Agents */}
      <div className="backdrop-blur-xl bg-white/5 border border-zinc-700/50 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-teal-400">Agents</h2>
          <button onClick={() => { setShowModal(true); setNewAgent(null); setAgentName(''); setError(''); }}
            className="px-4 py-2 rounded-lg text-sm bg-teal-600 hover:bg-teal-500 text-white font-medium transition-colors">
            + Register New Agent
          </button>
        </div>
        {agents.length === 0 ? (
          <p className="text-zinc-500 text-sm">No agents registered yet. Register one to get started.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-500 text-xs uppercase tracking-wider border-b border-zinc-800">
                  <th className="text-left py-2 pr-4">Name</th>
                  <th className="text-left py-2 pr-4">Slug</th>
                  <th className="text-left py-2 pr-4">Credits</th>
                  <th className="text-left py-2 pr-4">Scopes</th>
                  <th className="text-left py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {agents.map(a => (
                  <tr key={a.id} className="border-b border-zinc-800/50">
                    <td className="py-3 pr-4 text-zinc-100 font-medium">🤖 {a.name}</td>
                    <td className="py-3 pr-4 font-mono text-zinc-400">{a.slug}</td>
                    <td className="py-3 pr-4"><span className="text-emerald-400 font-mono">{a.credits}</span></td>
                    <td className="py-3 pr-4">
                      {a.scopes.split(',').map(s => (
                        <span key={s} className="inline-block px-2 py-0.5 rounded text-xs bg-zinc-800 text-zinc-400 mr-1">{s}</span>
                      ))}
                    </td>
                    <td className="py-3 text-zinc-500 text-xs">{new Date(a.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Credits Purchase Placeholder */}
      <div className="backdrop-blur-xl bg-white/5 border border-zinc-700/50 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-teal-400 mb-4">Credits</h2>
        <div className="flex items-center justify-between bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
          <div>
            <p className="text-zinc-100 font-medium">Buy 100 credits — $10</p>
            <p className="text-zinc-500 text-sm">Credits are used by agents to equip tools</p>
          </div>
          <button className="px-4 py-2 rounded-lg text-sm bg-zinc-700 text-zinc-400 cursor-not-allowed" disabled>
            Coming Soon
          </button>
        </div>
      </div>

      {/* Register Agent Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md backdrop-blur-xl bg-zinc-900 border border-zinc-700 rounded-2xl p-6" onClick={e => e.stopPropagation()}>
            {newAgent ? (
              <>
                <h3 className="text-lg font-bold text-emerald-400 mb-2">✓ Agent Registered!</h3>
                <p className="text-zinc-400 text-sm mb-4">Save this API token — it won&apos;t be shown again.</p>
                <div className="bg-zinc-950 rounded-lg p-4 mb-4">
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">API Token</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 text-emerald-400 font-mono text-xs break-all">{newAgent.api_token}</code>
                    <button onClick={() => copy(newAgent.api_token, 'token')}
                      className={`px-3 py-1.5 rounded text-xs ${copied === 'token' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700 text-zinc-300'}`}>
                      {copied === 'token' ? '✓' : 'Copy'}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-zinc-400">Slug: <code className="text-teal-400">{newAgent.slug}</code> · Credits: <span className="text-emerald-400">{newAgent.credits}</span></p>
                <button onClick={() => setShowModal(false)} className="w-full mt-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-medium">Done</button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-4">Register New Agent</h3>
                {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm mb-3">{error}</div>}
                <input type="text" value={agentName} onChange={e => setAgentName(e.target.value)} placeholder="Agent name (e.g. scout-bot)"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-teal-500 mb-4" />
                <div className="flex gap-3">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm">Cancel</button>
                  <button onClick={registerAgent} disabled={creating || !agentName.trim()}
                    className="flex-1 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-medium disabled:opacity-50">
                    {creating ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
