'use client';

import { profiles, defaultTheme } from '@/data/profiles';
import Link from 'next/link';

const statusColors = {
  online: 'bg-emerald-400',
  idle: 'bg-yellow-400',
  busy: 'bg-orange-400',
  offline: 'bg-zinc-500',
};

export default function ProfilesIndex() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🎮</span>
          <h1 className="text-3xl font-bold font-mono tracking-tight">The Roster</h1>
        </div>
        <p className="text-zinc-400 text-lg max-w-2xl">
          Meet the agents. Each one is equipped with a specialized Loadout — a curated bundle of tools for their role.
          Click an agent to inspect their full character sheet.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((agent) => {
          const t = agent.theme || defaultTheme;
          return (
          <Link
            key={agent.slug}
            href={`/profiles/${agent.slug}`}
            className={`group relative border border-zinc-800 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 transition-all duration-300 p-6 overflow-hidden ${t.cardHoverBorder}`}
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${t.cardGlowFrom} ${t.cardGlowTo}`} />
            
            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl w-14 h-14 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 transition-colors">
                    {agent.emoji}
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold font-mono transition-colors ${
                      t.accent === 'emerald' ? 'group-hover:text-emerald-400' :
                      t.accent === 'red' ? 'group-hover:text-red-400' :
                      t.accent === 'blue' ? 'group-hover:text-blue-400' :
                      'group-hover:text-emerald-400'
                    }`}>{agent.name}</h2>
                    <p className="text-zinc-500 text-sm">{agent.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${statusColors[agent.status]} ${agent.status === 'online' ? 'animate-pulse' : ''}`} />
                  <span className="text-xs text-zinc-500 capitalize font-mono">{agent.status}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{agent.description}</p>

              {/* Loadout badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-zinc-500 font-mono">LOADOUT</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono ${t.loadoutBg} border ${t.loadoutBorder} ${t.loadoutText}`}>
                  {agent.loadout.name}
                </span>
              </div>

              {/* Autonomy bar */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 font-mono">AUTONOMY</span>
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      agent.autonomyLevel === 'autonomous' ? 'w-3/4 bg-orange-400' :
                      agent.autonomyLevel === 'assistant' ? 'w-1/2 bg-yellow-400' :
                      agent.autonomyLevel === 'independent' ? 'w-full bg-red-400' :
                      'w-1/4 bg-blue-400'
                    }`}
                  />
                </div>
                <span className="text-xs text-zinc-400">{agent.autonomyEmoji} {agent.autonomyLabel}</span>
              </div>

              {/* Top abilities preview */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {agent.abilities.slice(0, 4).map((a) => (
                  <span key={a.name} className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-xs font-mono">
                    {a.name}
                  </span>
                ))}
                {agent.abilities.length > 4 && (
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-500 text-xs font-mono">
                    +{agent.abilities.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </Link>
          );
        })}
      </div>
    </div>
  );
}
