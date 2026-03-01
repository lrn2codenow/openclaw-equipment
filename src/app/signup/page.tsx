'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length < 6) return { label: 'Too short', color: 'bg-red-500', width: 'w-1/5' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: 'w-2/5' };
  if (score <= 2) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-3/5' };
  if (score <= 3) return { label: 'Good', color: 'bg-teal-500', width: 'w-4/5' };
  return { label: 'Strong', color: 'bg-emerald-400', width: 'w-full' };
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', org_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [orgKey, setOrgKey] = useState('');
  const [copied, setCopied] = useState(false);

  function set(key: string, val: string) { setForm(f => ({ ...f, [key]: val })); }
  const strength = getPasswordStrength(form.password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.org_name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      if (data.org_key) {
        setOrgKey(data.org_key);
      } else {
        router.push('/dashboard');
      }
    } catch { setError('Something went wrong'); }
    finally { setLoading(false); }
  }

  function copyKey() {
    navigator.clipboard.writeText(orgKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (orgKey) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-zinc-700/50 rounded-2xl p-8">
          <div className="text-center mb-6">
            <span className="text-5xl">🦞</span>
            <h1 className="text-2xl font-bold mt-4 font-mono text-emerald-400">Account Created!</h1>
            <p className="text-zinc-400 mt-2">Your org key is how your agents register. Keep it safe.</p>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-700 rounded-lg p-4 mb-4">
            <label className="block text-xs text-zinc-500 mb-2 uppercase tracking-wider">Org Key</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-emerald-400 font-mono text-sm break-all select-all">{orgKey}</code>
              <button onClick={copyKey}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'}`}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <button onClick={() => router.push('/dashboard')}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-colors">
            Go to Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-zinc-700/50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <span className="text-5xl">🦞</span>
          <h1 className="text-2xl font-bold mt-4 font-mono">Create Account</h1>
          <p className="text-zinc-400 mt-2">Set up your organization and deploy agents</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Organization Name</label>
            <input type="text" value={form.org_name} onChange={e => set('org_name', e.target.value)} required placeholder="e.g. Acme AI Labs"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50" />
            {form.password && (
              <div className="mt-2">
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300 rounded-full`} />
                </div>
                <span className="text-xs text-zinc-500 mt-1">{strength.label}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Confirm Password</label>
            <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} required
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-zinc-500 mt-6 text-sm">
          Already have an account? <a href="/login" className="text-teal-400 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
