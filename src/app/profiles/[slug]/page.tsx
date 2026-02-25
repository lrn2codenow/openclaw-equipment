'use client';

import { getProfile, profiles, defaultTheme, type Ability, type AgentTheme } from '@/data/profiles';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { use, useState } from 'react';

const statusColors = {
  online: 'bg-emerald-400 shadow-emerald-400/50',
  idle: 'bg-yellow-400 shadow-yellow-400/50',
  busy: 'bg-orange-400 shadow-orange-400/50',
  offline: 'bg-zinc-500',
};

const categoryColors = {
  core: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', bar: 'bg-emerald-400' },
  utility: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', bar: 'bg-cyan-400' },
  specialist: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', bar: 'bg-purple-400' },
};

function AbilityBar({ ability, index }: { ability: Ability; index: number }) {
  const colors = categoryColors[ability.category];
  return (
    <div
      className="group/ability flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-zinc-800/50 transition-colors"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="w-44 shrink-0">
        <span className={`text-sm font-mono ${colors.text}`}>{ability.name}</span>
      </div>
      <div className="flex-1 flex items-center gap-2">
        <div className="flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${colors.bar} transition-all duration-1000 ease-out`}
            style={{ width: `${ability.level * 10}%` }}
          />
        </div>
        <span className="text-xs text-zinc-500 font-mono w-6 text-right">{ability.level}</span>
      </div>
      <div className="flex items-center gap-1 w-20 justify-end">
        <span className="text-xs text-blue-400 font-mono">⚡ {ability.manaCost}k</span>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-3 text-center">
      <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-1">{label}</div>
      <div className="text-sm font-bold font-mono text-zinc-200">{value}</div>
    </div>
  );
}

export default function ProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const agent = getProfile(slug);

  if (!agent) return notFound();

  const theme = agent.theme || defaultTheme;
  const coreAbilities = agent.abilities.filter((a) => a.category === 'core');
  const utilityAbilities = agent.abilities.filter((a) => a.category === 'utility');
  const specialistAbilities = agent.abilities.filter((a) => a.category === 'specialist');
  const totalMana = agent.abilities.reduce((sum, a) => sum + a.manaCost, 0);
  const avgLevel = (agent.abilities.reduce((sum, a) => sum + a.level, 0) / agent.abilities.length).toFixed(1);

  const autonomyPercent =
    agent.autonomyLevel === 'supervised' ? 25 :
    agent.autonomyLevel === 'assistant' ? 50 :
    agent.autonomyLevel === 'autonomous' ? 75 : 100;

  const autonomyBarColor =
    agent.autonomyLevel === 'supervised' ? 'bg-blue-400' :
    agent.autonomyLevel === 'assistant' ? 'bg-yellow-400' :
    agent.autonomyLevel === 'autonomous' ? 'bg-orange-400' : 'bg-red-400';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-sm font-mono">
        <Link href="/profiles" className="text-zinc-500 hover:text-emerald-400 transition-colors">Roster</Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-300">{agent.name}</span>
      </div>

      {/* ═══ HERO SECTION ═══ */}
      <div className="relative border border-zinc-800 rounded-2xl bg-zinc-900/50 overflow-hidden mb-8">
        {/* Background gradient glow */}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.gradient}`} />
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 ${theme.glowBg} blur-3xl rounded-full`} />

        <div className="relative p-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 flex items-center justify-center text-5xl rounded-2xl bg-zinc-800 border-2 border-zinc-700 shadow-lg shadow-zinc-900/50">
                {agent.emoji}
              </div>
              {/* Status dot */}
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-zinc-900 ${statusColors[agent.status]} ${agent.status === 'online' ? 'animate-pulse shadow-lg' : ''}`} />
            </div>

            {/* Name & Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold font-mono tracking-tight">{agent.name}</h1>
                <span className={`px-2 py-0.5 rounded-full text-xs font-mono capitalize ${agent.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : agent.status === 'idle' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                  {agent.status}
                </span>
              </div>
              <p className="text-zinc-400 text-lg mb-2">{agent.title}</p>
              <p className="text-zinc-500 max-w-xl">{agent.description}</p>
              {agent.statusMessage && (
                <p className="text-xs text-zinc-600 font-mono mt-2 flex items-center gap-1.5">
                  <span className={theme.toolDot}>▸</span> {agent.statusMessage}
                </p>
              )}
            </div>

            {/* Quick stats */}
            <div className="flex flex-col gap-2 text-right">
              <div className="text-xs text-zinc-500 font-mono">POWER LEVEL</div>
              <div className={`text-3xl font-bold font-mono ${theme.powerLevelText}`}>{avgLevel}</div>
              <div className="text-xs text-zinc-600 font-mono">avg across {agent.abilities.length} abilities</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ═══ LEFT COLUMN — Main content ═══ */}
        <div className="lg:col-span-2 space-y-6">

          {/* About */}
          <section className="border border-zinc-800 rounded-xl bg-zinc-900/50 p-6">
            <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-3">About</h2>
            <p className="text-zinc-300 leading-relaxed">{agent.longDescription}</p>
          </section>

          {/* Abilities — RPG stat bars */}
          <section className="border border-zinc-800 rounded-xl bg-zinc-900/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-wider">Abilities</h2>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Core</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Utility</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400" /> Specialist</span>
              </div>
            </div>

            <div className="space-y-0.5">
              {[...coreAbilities, ...utilityAbilities, ...specialistAbilities].map((ability, i) => (
                <AbilityBar key={ability.name} ability={ability} index={i} />
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Total token cost: <span className="text-blue-400">⚡ {totalMana}k</span> per full activation</span>
              <span>{agent.abilities.length} abilities equipped</span>
            </div>
          </section>

          {/* Equipped Loadout */}
          <section className="border border-zinc-800 rounded-xl bg-zinc-900/50 p-6">
            <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-4">Equipped Loadout</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className={`px-3 py-1.5 rounded-lg ${theme.loadoutBg} border ${theme.loadoutBorder}`}>
                <span className={`${theme.loadoutText} font-mono font-bold`}>{agent.loadout.name}</span>
              </div>
              <Link href={`/roles/${agent.loadout.slug}`} className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors font-mono">
                View Loadout →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {agent.loadout.tools.map((tool) => (
                <div key={tool} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/50 border border-zinc-800">
                  <span className={`${theme.toolDot} text-xs`}>◆</span>
                  <span className="text-xs font-mono text-zinc-300">{tool}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ═══ RIGHT COLUMN — Sidebar ═══ */}
        <div className="space-y-6">

          {/* Autonomy Level */}
          <section className="border border-zinc-800 rounded-xl bg-zinc-900/50 p-6">
            <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-4">Autonomy Level</h2>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{agent.autonomyEmoji}</span>
              <span className="font-mono font-bold text-zinc-200">{agent.autonomyLabel}</span>
            </div>
            <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden mb-3">
              <div className={`absolute inset-y-0 left-0 rounded-full ${autonomyBarColor} transition-all duration-1000`} style={{ width: `${autonomyPercent}%` }} />
              {/* Tick marks */}
              <div className="absolute inset-0 flex justify-between px-0">
                {[25, 50, 75].map((tick) => (
                  <div key={tick} className="w-px h-full bg-zinc-700" style={{ marginLeft: `${tick}%` }} />
                ))}
              </div>
            </div>
            <div className="flex justify-between text-xs text-zinc-600 font-mono">
              <span>Supervised</span>
              <span>Independent</span>
            </div>
            <p className="mt-3 text-xs text-zinc-500">
              {agent.autonomyLevel === 'autonomous'
                ? 'Acts freely within guardrails, reports after.'
                : agent.autonomyLevel === 'assistant'
                ? 'Asks before purchases or physical changes.'
                : agent.autonomyLevel === 'supervised'
                ? 'Requires approval for all actions.'
                : 'Full independence, minimal oversight.'}
            </p>
          </section>

          {/* Security Level (only if present) */}
          {agent.securityLevel && (
            <section className="border border-red-900/50 rounded-xl bg-zinc-900/50 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent" />
              <div className="relative">
                <h2 className="text-sm font-mono text-red-400/70 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Security Level
                </h2>
                <div className="flex items-start gap-2">
                  <span className="text-lg">{agent.securityEmoji}</span>
                  <p className="text-sm font-mono text-red-300 leading-relaxed">{agent.securityLevel}</p>
                </div>
              </div>
            </section>
          )}

          {/* Stats */}
          <section className="border border-zinc-800 rounded-xl bg-zinc-900/50 p-6">
            <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-4">Stats</h2>
            <div className="grid grid-cols-2 gap-2">
              {agent.stats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
          </section>

          {/* Platform */}
          <section className="border border-zinc-800 rounded-xl bg-zinc-900/50 p-6">
            <h2 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-3">Platform</h2>
            <div className="flex items-center gap-3">
              <span className="text-lg">💻</span>
              <div>
                <p className="text-sm font-mono text-zinc-300">{agent.platform}</p>
                <p className={`text-xs font-mono ${agent.platformStatus === 'active' ? 'text-emerald-400' : agent.platformStatus === 'pending' ? 'text-yellow-400' : 'text-zinc-500'}`}>
                  {agent.platformStatus === 'active' ? '● Active' : agent.platformStatus === 'pending' ? '◐ Pending Setup' : '○ Offline'}
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <section className="border border-zinc-800 rounded-xl bg-zinc-900/50 p-4">
            <Link
              href="/profiles"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-sm font-mono text-zinc-300 transition-colors"
            >
              ← Browse All Agents
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
