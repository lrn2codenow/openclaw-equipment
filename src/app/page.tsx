'use client';

import { useState, useEffect, useRef } from 'react';

function useTypingEffect(text: string, speed = 50) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    setDisplayed('');
    setDone(false);
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(interval); setDone(true); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return { displayed, done };
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
}

const categories = [
  { icon: '🔌', name: 'Integrations', desc: 'Gmail, Calendar, Slack, Discord, GitHub, databases' },
  { icon: '🌐', name: 'Web Tools', desc: 'Scrapers, fetchers, search APIs, browser automation' },
  { icon: '🏠', name: 'Smart Home', desc: 'Home Assistant, IoT controllers, device managers' },
  { icon: '📊', name: 'Data & Analytics', desc: 'Charting, reporting, CSV/Excel processing' },
  { icon: '🔧', name: 'Developer Tools', desc: 'Git helpers, deployment scripts, testing frameworks' },
  { icon: '🤖', name: 'Agent Skills', desc: 'Memory management, task planning, multi-agent coordination' },
  { icon: '🏥', name: 'Industry Specific', desc: 'Healthcare, finance, legal, education tools' },
  { icon: '🎨', name: 'Creative', desc: 'Image generation, video processing, audio/TTS' },
];

export default function HomePage() {
  const headline = 'The Package Manager for AI Agents';
  const { displayed, done } = useTypingEffect(headline, 45);

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 sm:py-32 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto">
          <div className="text-5xl mb-6 select-none" aria-hidden="true">🦞</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 font-mono">
            <span className="text-emerald-400">{displayed}</span>
            <span className={`inline-block w-[3px] h-[1em] bg-emerald-400 align-middle ml-1 ${done ? 'animate-pulse' : ''}`} />
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your agent finds, downloads, and installs the tools it needs.
            You discover and curate. Everyone wins.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 font-medium cursor-default">
              Browse Tools <span className="text-zinc-600 text-sm ml-1">(coming soon)</span>
            </button>
            <a href="#waitlist" className="px-8 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold transition-colors">
              Join the Waitlist →
            </a>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Section>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-center mb-16">Why This Exists</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Your agent is only as good as its tools.',
                body: 'Finding and installing agent tools means hunting through GitHub repos, copying config files, debugging dependencies. Your agent can\'t do this alone.',
                icon: '⚡',
              },
              {
                title: 'Humans shouldn\'t be the bottleneck.',
                body: 'When your agent needs a Gmail integration, a web scraper, or a database connector — it shouldn\'t have to wait for you to Google it.',
                icon: '🚧',
              },
              {
                title: 'There\'s no app store for agents.',
                body: 'Mobile has the App Store. Developers have npm. Servers have Docker Hub. Agents have... nothing. Until now.',
                icon: '🏪',
              },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-3 font-mono text-emerald-400">{item.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* How It Works — Two Paths */}
      <section className="bg-zinc-900/40 border-y border-zinc-800/60 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-center mb-4">Two Paths, One Platform</h2>
            <p className="text-zinc-500 text-center mb-16 max-w-xl mx-auto">Whether your agent finds tools on its own or you curate them — the result is the same.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Path A */}
              <div className="p-8 rounded-xl border border-cyan-500/20 bg-zinc-950/60">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">🤖</span>
                  <h3 className="font-bold text-lg font-mono text-cyan-400">Agent Self-Service</h3>
                </div>
                <div className="font-mono text-xs text-zinc-500 bg-zinc-900 rounded-lg p-4 mb-6 space-y-1.5 border border-zinc-800">
                  <div><span className="text-cyan-400">→</span> Agent needs a tool</div>
                  <div><span className="text-cyan-400">→</span> Browses openclaw.equipment</div>
                  <div><span className="text-cyan-400">→</span> Finds what it needs</div>
                  <div><span className="text-cyan-400">→</span> Downloads + installs</div>
                  <div><span className="text-emerald-400">✓</span> Back to work. No human required.</div>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                  Your agent navigates the site, finds exactly the tool it needs, and installs it — without UI complexity getting in the way.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  WebMCP makes the entire catalog agent-readable. Your agent browses like a human, but thinks like an engineer.
                </p>
              </div>
              {/* Path B */}
              <div className="p-8 rounded-xl border border-emerald-500/20 bg-zinc-950/60">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">👤</span>
                  <h3 className="font-bold text-lg font-mono text-emerald-400">Human Discovery</h3>
                </div>
                <div className="font-mono text-xs text-zinc-500 bg-zinc-900 rounded-lg p-4 mb-6 space-y-1.5 border border-zinc-800">
                  <div><span className="text-emerald-400">→</span> You browse the catalog</div>
                  <div><span className="text-emerald-400">→</span> Find something useful</div>
                  <div><span className="text-emerald-400">→</span> One click: &quot;Send to my agent&quot;</div>
                  <div><span className="text-emerald-400">→</span> Agent installs it</div>
                  <div><span className="text-cyan-400">✓</span> You curate, agent executes.</div>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed mb-3">
                  Explore tools you think would help your agent, and with one click, direct them to install it.
                </p>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  Browse, discover, curate. Let your agent handle the rest.
                </p>
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Section>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-center mb-4">What&apos;s Inside</h2>
          <p className="text-zinc-500 text-center mb-12 max-w-lg mx-auto">Real categories. Real tools on the way. No fake data.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div key={cat.name} className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-emerald-500/30 transition-colors group">
                <div className="text-2xl mb-3">{cat.icon}</div>
                <h3 className="font-semibold text-sm font-mono group-hover:text-emerald-400 transition-colors">{cat.name}</h3>
                <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">{cat.desc}</p>
                <span className="inline-block mt-3 text-[10px] font-mono text-zinc-600 bg-zinc-800/60 rounded px-2 py-0.5">coming soon</span>
              </div>
            ))}
          </div>
        </Section>
      </section>

      {/* WebMCP */}
      <section className="bg-zinc-900/40 border-y border-zinc-800/60 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Section>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-6">
                WebMCP Verified ✅
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-mono mb-6">The Secret Sauce: WebMCP</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
                WebMCP is a W3C proposal that lets AI agents interact with websites natively through the browser.
                No APIs to configure. No tokens to manage. Your agent just... uses the web.
              </p>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 max-w-2xl mx-auto text-left">
                <p className="text-sm text-zinc-400 mb-4">
                  OpenClaw Equipment is built <span className="text-emerald-400 font-semibold">WebMCP-first</span>. Every page, every tool listing, every install flow is designed for agents to navigate as easily as humans.
                </p>
                <div className="flex flex-wrap gap-3 text-xs font-mono">
                  <span className="px-3 py-1 rounded bg-zinc-800 text-zinc-400">Chrome 136+ supported</span>
                  <span className="px-3 py-1 rounded bg-zinc-800 text-zinc-400">Stable coming soon</span>
                  <span className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">Agent-native browsing</span>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Section>
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold font-mono mb-4">Get Early Access</h2>
            <p className="text-zinc-400 mb-2">We&apos;re building the catalog now. Real tools, tested by real agents.</p>
            <p className="text-zinc-500 text-sm mb-8">First 100 equipment providers get featured placement.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-8">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full sm:flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono text-sm"
              />
              <button type="submit" className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold transition-colors text-sm whitespace-nowrap">
                Join Waitlist
              </button>
            </form>
            <p className="text-xs text-zinc-600 font-mono">
              Currently in use: our own agents use OpenClaw Equipment daily to manage tools across 12+ projects.
            </p>
          </div>
        </Section>
      </section>

      {/* Open Source */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Section>
          <div className="text-center p-8 rounded-xl border border-zinc-800 bg-zinc-900/30">
            <h2 className="text-xl sm:text-2xl font-bold font-mono mb-4">Open Source &amp; Community</h2>
            <p className="text-zinc-400 mb-6">OpenClaw Equipment is open source. Built by agents, for agents.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <a href="https://github.com/lrn2codenow/openclaw-equipment" target="_blank" rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg border border-zinc-700 hover:border-emerald-500/40 text-sm font-mono text-zinc-300 hover:text-emerald-400 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                GitHub
              </a>
              <span className="px-5 py-2.5 rounded-lg border border-zinc-800 text-sm font-mono text-zinc-500 cursor-default">
                Discord — coming soon
              </span>
            </div>
            <p className="text-sm text-zinc-500">Submit your tools. Rate and review. Help build the ecosystem.</p>
          </div>
        </Section>
      </section>
    </div>
  );
}
