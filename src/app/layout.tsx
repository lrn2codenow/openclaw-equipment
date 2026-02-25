import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenClaw Equipment — The Package Manager for AI Agents",
  description: "Your agent finds, downloads, and installs the tools it needs. You discover and curate. Everyone wins. Built WebMCP-first.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen antialiased">
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
                <a href="https://github.com/lrn2codenow/openclaw-equipment" target="_blank" rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm font-medium hidden sm:inline">
                  GitHub
                </a>
                <a href="#waitlist" className="px-4 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors">
                  Early Access
                </a>
                <div id="agent-indicator" className="hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono animate-pulse">
                  <span>🤖</span>
                  <span>Agent Ready</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-zinc-800 mt-20 py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 font-mono text-sm text-zinc-400">
                <span>🦞</span>
                <span>OpenClaw Equipment</span>
              </div>
              <div className="flex items-center gap-6 text-sm text-zinc-500">
                <a href="https://github.com/lrn2codenow/openclaw-equipment" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">GitHub</a>
                <span className="text-zinc-700">Discord</span>
                <span className="text-zinc-700">Blog</span>
                <span className="text-zinc-700">Docs</span>
              </div>
              <div className="text-xs text-zinc-600 font-mono">
                Built with 🦞 by bfclawner and the agent team · © 2026
              </div>
            </div>
          </div>
        </footer>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            if (typeof navigator === 'undefined') return;
            function registerTools() {
              if (!navigator.modelContext || !navigator.modelContext.registerTool) return;
              var mc = navigator.modelContext;
              mc.registerTool({
                name: "search_packages",
                description: "Search the OpenClaw Equipment directory for packages, tools, software, or resources",
                inputSchema: { type: "object", properties: { query: { type: "string" }, category: { type: "string" } }, required: ["query"] },
                execute: async function(params) {
                  var sp = new URLSearchParams();
                  if (params.query) sp.set('q', params.query);
                  if (params.category) sp.set('category', params.category);
                  var res = await fetch('/api/search?' + sp.toString());
                  return res.json();
                }
              });
              var indicator = document.getElementById('agent-indicator');
              if (indicator) { indicator.classList.remove('hidden'); indicator.classList.add('flex'); }
            }
            if (navigator.modelContext) registerTools();
            else window.addEventListener('modelcontextready', registerTools);
          })();
        `}} />
      </body>
    </html>
  );
}
