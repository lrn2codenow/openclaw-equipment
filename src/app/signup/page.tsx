'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', org_name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(key: string, val: string) { setForm(f => ({ ...f, [key]: val })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      router.push('/locker-room');
    } catch { setError('Something went wrong'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🦞</span>
          <h1 className="text-2xl font-bold mt-4 font-mono">Create Account</h1>
          <p className="text-zinc-400 mt-2">Set up your organization and deploy agents</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Your Name</label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)} required minLength={6}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Organization Name</label>
            <input type="text" value={form.org_name} onChange={e => set('org_name', e.target.value)} required placeholder="e.g. Acme AI Labs"
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-zinc-500 mt-6 text-sm">
          Already have an account? <a href="/login" className="text-emerald-400 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
