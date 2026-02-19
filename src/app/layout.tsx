import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenClaw Equipment — The Package Manager for AI Agents",
  description: "Find, download, and install tools, software, models, and resources for AI agents. Distributed peer-to-peer via WebTorrent.",
};

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm font-medium">
      {children}
    </a>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src="https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js" defer />
      </head>
      <body className="bg-zinc-950 text-zinc-100 min-h-screen antialiased">
        <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-8">
                <a href="/" className="flex items-center gap-2 font-bold text-lg">
                  <span className="text-emerald-400">📦</span>
                  <span>OpenClaw Equipment</span>
                </a>
                <div className="hidden md:flex items-center gap-6">
                  <NavLink href="/browse">Browse</NavLink>
                  <NavLink href="/categories">Categories</NavLink>
                  <NavLink href="/downloads">Downloads</NavLink>
                  <NavLink href="/publish">Publish</NavLink>
                  <NavLink href="/docs">API Docs</NavLink>
                  <NavLink href="/about">About</NavLink>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div id="agent-indicator" className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium animate-pulse">
                  <span>🤖</span>
                  <span>Agent Ready</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-zinc-800 mt-20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold text-sm mb-3">Platform</h3>
                <div className="flex flex-col gap-2 text-sm text-zinc-400">
                  <a href="/browse" className="hover:text-zinc-200">Browse Packages</a>
                  <a href="/categories" className="hover:text-zinc-200">Categories</a>
                  <a href="/publish" className="hover:text-zinc-200">Publish</a>
                  <a href="/downloads" className="hover:text-zinc-200">Downloads</a>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-3">Resources</h3>
                <div className="flex flex-col gap-2 text-sm text-zinc-400">
                  <a href="/docs" className="hover:text-zinc-200">API Documentation</a>
                  <a href="/about" className="hover:text-zinc-200">About OpenClaw Equipment</a>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-3">Categories</h3>
                <div className="flex flex-col gap-2 text-sm text-zinc-400">
                  <a href="/browse?category=mcp-tools" className="hover:text-zinc-200">MCP Tools</a>
                  <a href="/browse?category=software" className="hover:text-zinc-200">Software</a>
                  <a href="/browse?category=models" className="hover:text-zinc-200">Models</a>
                  <a href="/browse?category=resources" className="hover:text-zinc-200">Resources</a>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-3">OpenClaw Equipment</h3>
                <p className="text-sm text-zinc-500">The package manager for AI agents. Find, download, install — peer-to-peer.</p>
                <p className="text-sm text-zinc-600 mt-4">© 2025 OpenClaw Equipment</p>
              </div>
            </div>
          </div>
        </footer>
        <script dangerouslySetInnerHTML={{ __html: `
          // WebMCP global tools registration
          (function() {
            if (typeof navigator === 'undefined') return;
            function registerTools() {
              if (!navigator.modelContext || !navigator.modelContext.registerTool) return;
              const mc = navigator.modelContext;
              mc.registerTool({
                name: "search_packages",
                description: "Search the OpenClaw Equipment directory for packages, tools, software, or resources",
                inputSchema: { type: "object", properties: { query: { type: "string" }, category: { type: "string" }, platform: { type: "string" }, sort: { type: "string" }, limit: { type: "number" } }, required: ["query"] },
                execute: async (params) => {
                  const sp = new URLSearchParams();
                  if (params.query) sp.set('q', params.query);
                  if (params.category) sp.set('category', params.category);
                  if (params.platform) sp.set('platform', params.platform);
                  if (params.sort) sp.set('sort', params.sort);
                  if (params.limit) sp.set('limit', String(params.limit));
                  const res = await fetch('/api/search?' + sp.toString());
                  return res.json();
                }
              });
              mc.registerTool({
                name: "get_categories",
                description: "List all package categories with counts",
                inputSchema: { type: "object", properties: {} },
                execute: async () => { const res = await fetch('/api/categories'); return res.json(); }
              });
              mc.registerTool({
                name: "get_trending",
                description: "Get trending packages",
                inputSchema: { type: "object", properties: { timeframe: { type: "string" }, category: { type: "string" } } },
                execute: async (params) => {
                  const sp = new URLSearchParams();
                  if (params.timeframe) sp.set('timeframe', params.timeframe);
                  if (params.category) sp.set('category', params.category);
                  const res = await fetch('/api/trending?' + sp.toString());
                  return res.json();
                }
              });
              const indicator = document.getElementById('agent-indicator');
              if (indicator) {
                indicator.classList.remove('hidden');
                indicator.classList.add('flex');
                indicator.querySelector('span:last-child').textContent = 'Agent Ready — 3 tools';
              }
            }
            if (navigator.modelContext) registerTools();
            else window.addEventListener('modelcontextready', registerTools);
          })();
        `}} />
      </body>
    </html>
  );
}
