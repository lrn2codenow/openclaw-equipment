'use client';
import { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  org_name: string;
}

export function NavBar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.user) setUser(d.user);
    }).catch(() => {});
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  }

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <a href="/" className="flex items-center gap-2 font-bold text-lg">
            <span>🦞</span>
            <span className="font-mono">OpenClaw Equipment</span>
          </a>
          <div className="flex items-center gap-4">
            <a href="/profiles"
              className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm font-medium hidden sm:inline">
              🎮 Agents
            </a>
            <a href="/loadouts"
              className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm font-medium hidden sm:inline">
              📦 Loadouts
            </a>
            {user && (
              <>
                <a href="/dashboard"
                  className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm font-medium hidden sm:inline">
                  📊 Dashboard
                </a>
                <a href="/locker-room"
                  className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm font-medium hidden sm:inline">
                  🏟️ Locker Room
                </a>
              </>
            )}
            <a href="/api-docs"
              className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm font-medium hidden sm:inline">
              📡 API
            </a>
            <a href="https://github.com/lrn2codenow/openclaw-equipment" target="_blank" rel="noopener noreferrer"
              className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm font-medium hidden sm:inline">
              GitHub
            </a>
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 font-mono hidden sm:inline">{user.name}</span>
                <button onClick={logout}
                  className="px-3 py-1.5 rounded-md text-zinc-400 text-sm hover:text-zinc-200 transition-colors">
                  Sign Out
                </button>
              </div>
            ) : (
              <a href="/login" className="px-4 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors">
                Sign In
              </a>
            )}
            <div id="agent-indicator" className="hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono animate-pulse">
              <span>🤖</span>
              <span>Agent Ready</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
