import { notFound } from 'next/navigation';
import Link from 'next/link';
import { loadouts, getLoadoutBySlug } from '@/data/loadouts';

export function generateStaticParams() {
  return loadouts.map(l => ({ slug: l.slug }));
}

export default async function LoadoutDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const loadout = getLoadoutBySlug(slug);
  if (!loadout) notFound();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative">
          <Link href="/loadouts" className="text-zinc-500 hover:text-zinc-300 text-sm font-mono mb-6 inline-block transition-colors">
            ← All Loadouts
          </Link>
          <div className="flex items-start gap-5 mb-6">
            <span className="text-6xl sm:text-7xl">{loadout.emoji}</span>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold font-mono text-zinc-100 mb-2">{loadout.name}</h1>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                {loadout.category}
              </span>
            </div>
          </div>
          <p className="text-zinc-400 text-lg max-w-3xl">{loadout.longDescription}</p>

          <div className="flex items-center gap-4 mt-6">
            <span className="flex items-center gap-2 text-sm font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-zinc-300">{loadout.coreTools.length} core tools</span>
            </span>
            <span className="flex items-center gap-2 text-sm font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span className="text-zinc-300">{loadout.workflows.length} workflows</span>
            </span>
            <span className="flex items-center gap-2 text-sm font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
              <span className="text-zinc-400">{loadout.optionalTools.length} optional</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">
        {/* Core Tools */}
        <section>
          <h2 className="text-2xl font-bold font-mono mb-6 text-zinc-100">
            <span className="text-emerald-500">●</span> Core Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loadout.coreTools.map(tool => (
              <div key={tool.name} className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/50 hover:border-emerald-500/20 transition-colors">
                <div className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <div>
                    <h3 className="font-mono font-medium text-zinc-200">{tool.name}</h3>
                    <p className="text-zinc-500 text-sm mt-1">{tool.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Optional Tools */}
        {loadout.optionalTools.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold font-mono mb-6 text-zinc-100">
              <span className="text-zinc-600">○</span> Optional Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {loadout.optionalTools.map(tool => (
                <div key={tool.name} className="border border-zinc-800/50 rounded-lg p-3 bg-zinc-900/30">
                  <h3 className="font-mono text-sm text-zinc-300">{tool.name}</h3>
                  <p className="text-zinc-600 text-xs mt-1">{tool.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Workflows */}
        <section>
          <h2 className="text-2xl font-bold font-mono mb-6 text-zinc-100">
            <span className="text-cyan-500">⚡</span> Workflows
          </h2>
          <div className="space-y-3">
            {loadout.workflows.map(wf => (
              <div key={wf.name} className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/50 hover:border-cyan-500/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-mono font-medium text-zinc-200">{wf.name}</h3>
                    <p className="text-zinc-500 text-sm mt-1">{wf.description}</p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    {wf.trigger}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sample SOUL.md */}
        <section>
          <h2 className="text-2xl font-bold font-mono mb-6 text-zinc-100">
            <span className="text-purple-400">💜</span> Sample SOUL.md
          </h2>
          <div className="border border-zinc-800 rounded-lg p-6 bg-zinc-900/50 font-mono text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
            {loadout.sampleSoul}
          </div>
        </section>

        {/* Agents Using This Loadout */}
        {loadout.agentSlugs.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold font-mono mb-6 text-zinc-100">
              <span className="text-emerald-400">🤖</span> Agents Using This Loadout
            </h2>
            <div className="flex flex-wrap gap-3">
              {loadout.agentSlugs.map(slug => (
                <Link
                  key={slug}
                  href={`/profiles/${slug}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-emerald-500/30 transition-colors"
                >
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-sm text-zinc-300">{slug}</span>
                  <span className="text-zinc-600 text-xs">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Deploy CTA */}
        <section className="text-center pt-4">
          <div className="border border-emerald-500/20 rounded-xl p-8 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5">
            <h3 className="text-xl font-bold font-mono text-zinc-100 mb-2">Ready to deploy?</h3>
            <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
              Equip your agent with the {loadout.name} loadout and get running in minutes.
            </p>
            <Link
              href={`/locker-room/add?loadout=${loadout.slug}`}
              className="inline-block px-8 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
            >
              Deploy This Loadout →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
