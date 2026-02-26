'use client';
import { useState } from 'react';
import Link from 'next/link';
import { loadouts, loadoutCategories } from '@/data/loadouts';

export default function LoadoutsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? loadouts
    : loadouts.filter(l => l.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative">
          <h1 className="text-4xl sm:text-5xl font-bold font-mono text-center mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Loadouts
            </span>
            <span className="text-zinc-300"> — Everything Your Agent Needs for the Job</span>
          </h1>
          <p className="text-zinc-400 text-center text-lg max-w-2xl mx-auto">
            Curated tool bundles. Pick a role, equip your agent, deploy in minutes.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {loadoutCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : 'bg-zinc-800/50 border border-zinc-700/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(l => (
            <Link
              key={l.slug}
              href={`/loadouts/${l.slug}`}
              className="group relative border border-zinc-800 rounded-xl p-6 bg-zinc-900/50 hover:border-emerald-500/30 transition-all duration-300 flex flex-col"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative flex flex-col h-full">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-5xl">{l.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                      {l.name}
                    </h2>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-mono text-zinc-500 bg-zinc-800/80">
                      {l.category}
                    </span>
                  </div>
                </div>

                <p className="text-zinc-400 text-sm mb-5 flex-1">{l.description}</p>

                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-zinc-400">{l.coreTools.length} tools</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span className="text-zinc-400">{l.workflows.length} workflows</span>
                  </span>
                  {l.optionalTools.length > 0 && (
                    <span className="flex items-center gap-1.5 text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-zinc-600" />
                      <span className="text-zinc-500">+{l.optionalTools.length} optional</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
                    View Loadout →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
