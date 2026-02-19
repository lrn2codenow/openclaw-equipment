'use client';

import { useState } from 'react';

const steps = ['Basic Info', 'Metadata', 'Distribution', 'Review'];

export default function PublishPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', description: '', category: 'mcp-tools', version: '1.0.0',
    author: '', license: 'MIT', magnet_uri: '', source_url: '',
    platform: ['any'], compatibility: ['any'], tags: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; slug?: string; error?: string } | null>(null);

  const update = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (res.ok) setResult({ success: true, slug: data.slug });
      else setResult({ error: data.error || 'Failed to publish' });
    } catch {
      setResult({ error: 'Network error' });
    }
    setSubmitting(false);
  };

  if (result?.success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">Package Published!</h1>
        <p className="text-zinc-400 mb-6">Your package is now live on OpenClaw Equipment.</p>
        <a href={`/package/${result.slug}`} className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
          View Package →
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-2">Publish a Package</h1>
      <p className="text-zinc-400 text-sm mb-8">Share tools, software, models, or resources with the community.</p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${i === step ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : i < step ? 'bg-zinc-800 text-zinc-300 border-zinc-700 cursor-pointer' : 'bg-zinc-900 text-zinc-600 border-zinc-800'}`}
            >
              {i + 1}. {s}
            </button>
            {i < steps.length - 1 && <div className="w-4 h-px bg-zinc-800" />}
          </div>
        ))}
      </div>

      {result?.error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">{result.error}</div>
      )}

      <div className="space-y-4">
        {step === 0 && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Package Name *</label>
              <input value={form.name} onChange={e => update('name', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" placeholder="my-awesome-tool" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description *</label>
              <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={3} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 resize-none" placeholder="What does this package do?" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select value={form.category} onChange={e => update('category', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500">
                <option value="mcp-tools">MCP Tools</option>
                <option value="software">Software</option>
                <option value="models">Models</option>
                <option value="resources">Resources</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Version *</label>
                <input value={form.version} onChange={e => update('version', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Author *</label>
                <input value={form.author} onChange={e => update('author', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">License</label>
              <input value={form.license} onChange={e => update('license', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Source URL (GitHub)</label>
              <input value={form.source_url} onChange={e => update('source_url', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
              <input value={form.tags} onChange={e => update('tags', e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" placeholder="tool, automation, mcp" />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Magnet URI *</label>
              <textarea value={form.magnet_uri} onChange={e => update('magnet_uri', e.target.value)} rows={3} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-emerald-500 resize-none" placeholder="magnet:?xt=urn:btih:..." />
              <p className="text-xs text-zinc-500 mt-1">The magnet link for P2P distribution of your package.</p>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="p-5 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <h3 className="font-semibold mb-4">Review Your Package</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-zinc-500">Name:</span> {form.name || '—'}</div>
              <div><span className="text-zinc-500">Description:</span> {form.description || '—'}</div>
              <div><span className="text-zinc-500">Category:</span> {form.category}</div>
              <div><span className="text-zinc-500">Version:</span> {form.version}</div>
              <div><span className="text-zinc-500">Author:</span> {form.author || '—'}</div>
              <div><span className="text-zinc-500">License:</span> {form.license}</div>
              <div><span className="text-zinc-500">Magnet:</span> <span className="break-all font-mono text-xs">{form.magnet_uri || '—'}</span></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">← Back</button>
          ) : <div />}
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              Next →
            </button>
          ) : (
            <button onClick={submit} disabled={submitting || !form.name || !form.description || !form.magnet_uri} className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-700 disabled:text-zinc-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors">
              {submitting ? 'Publishing...' : 'Publish Package'}
            </button>
          )}
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          function register() {
            if (!navigator.modelContext || !navigator.modelContext.registerTool) return;
            navigator.modelContext.registerTool({
              name: "publish_package",
              description: "Publish a new package to OpenClaw Equipment",
              inputSchema: { type: "object", properties: { name: {type:"string"}, description: {type:"string"}, category: {type:"string"}, version: {type:"string"}, magnetUri: {type:"string"}, author: {type:"string"}, license: {type:"string"}, sourceUrl: {type:"string"}, tags: {type:"array",items:{type:"string"}} }, required: ["name","description","category","version","magnetUri"] },
              execute: async (p) => { const r = await fetch('/api/package', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(p) }); return r.json(); }
            });
          }
          if (navigator.modelContext) register();
          else window.addEventListener('modelcontextready', register);
        })();
      `}} />
    </div>
  );
}
