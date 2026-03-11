import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "./NavBar";

export const metadata: Metadata = {
  title: "OpenClaw Equipment — The Package Manager for AI Agents",
  description: "Your agent finds, downloads, and installs the tools it needs. You discover and curate. Everyone wins. Built WebMCP-first.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen antialiased">
        <NavBar />
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

              // 1. Search packages
              mc.registerTool({
                name: "search_packages",
                description: "Search the OpenClaw Equipment registry for packages, MCP servers, tools, or resources. Returns matching packages with install commands.",
                inputSchema: {
                  type: "object",
                  properties: {
                    query: { type: "string", description: "Search query (e.g. 'calendar', 'slack', 'database')" },
                    category: { type: "string", description: "Filter by category: mcp-tools, dev-tools, ai-ml-tools, web-api-tools, productivity-automation, openclaw-skills" },
                    limit: { type: "number", description: "Max results (default 10)" }
                  },
                  required: ["query"]
                },
                execute: async function(params) {
                  var sp = new URLSearchParams();
                  sp.set('q', params.query);
                  if (params.category) sp.set('category', params.category);
                  if (params.limit) sp.set('limit', String(params.limit));
                  var res = await fetch('/api/packages/search?' + sp.toString());
                  return res.json();
                }
              });

              // 2. Get install instructions for a package
              mc.registerTool({
                name: "get_install_instructions",
                description: "Get the install command and MCP config for a specific package by its slug. Use after searching to get everything needed to install a tool.",
                inputSchema: {
                  type: "object",
                  properties: {
                    slug: { type: "string", description: "Package slug (e.g. 'brave-search-mcp-server', 'slack-mcp-server')" }
                  },
                  required: ["slug"]
                },
                execute: async function(params) {
                  var res = await fetch('/api/v1/install/' + encodeURIComponent(params.slug));
                  return res.json();
                }
              });

              // 3. Get package details
              mc.registerTool({
                name: "get_package_details",
                description: "Get full details about a package including description, version, author, source URL, tags, and install command.",
                inputSchema: {
                  type: "object",
                  properties: {
                    slug: { type: "string", description: "Package slug" }
                  },
                  required: ["slug"]
                },
                execute: async function(params) {
                  var res = await fetch('/api/packages/' + encodeURIComponent(params.slug));
                  return res.json();
                }
              });

              // 4. Browse loadouts
              mc.registerTool({
                name: "browse_loadouts",
                description: "List all available loadouts (curated tool bundles for agent roles like Chief of Staff, Smart Home, Sysadmin, etc). Each loadout includes tools, workflows, and a SOUL.md.",
                inputSchema: { type: "object", properties: {} },
                execute: async function() {
                  var res = await fetch('/api/webmcp/loadouts');
                  return res.json();
                }
              });

              // 5. Get loadout bundle
              mc.registerTool({
                name: "get_loadout",
                description: "Get a complete loadout bundle including SOUL.md, all tool packages with install commands, workflows, and an install script. Use this to fully equip an agent for a role.",
                inputSchema: {
                  type: "object",
                  properties: {
                    slug: { type: "string", description: "Loadout slug: chief-of-staff, smart-home, executive-assistant, cfo-finance, sysadmin, content-creator" }
                  },
                  required: ["slug"]
                },
                execute: async function(params) {
                  var res = await fetch('/api/v1/loadouts/' + encodeURIComponent(params.slug));
                  return res.json();
                }
              });

              // 6. Browse categories
              mc.registerTool({
                name: "browse_categories",
                description: "List all package categories with counts. Use to understand what types of tools are available.",
                inputSchema: { type: "object", properties: {} },
                execute: async function() {
                  var res = await fetch('/api/categories');
                  return res.json();
                }
              });

              // 7. Get registry stats
              mc.registerTool({
                name: "get_registry_stats",
                description: "Get overall registry statistics: total packages, categories, loadouts, and agent profiles.",
                inputSchema: { type: "object", properties: {} },
                execute: async function() {
                  var res = await fetch('/api/stats');
                  return res.json();
                }
              });

              // 8. Submit a package
              mc.registerTool({
                name: "submit_package",
                description: "Submit a new package to the OpenClaw Equipment registry. Package will be queued for review.",
                inputSchema: {
                  type: "object",
                  properties: {
                    name: { type: "string", description: "Package name" },
                    description: { type: "string", description: "What the package does" },
                    category: { type: "string", description: "Category: mcp-tools, dev-tools, ai-ml-tools, web-api-tools, productivity-automation, openclaw-skills" },
                    version: { type: "string", description: "Version (e.g. '1.0.0')" },
                    install: { type: "string", description: "Install command (e.g. 'npx -y @my/package')" },
                    source_url: { type: "string", description: "GitHub or source URL" },
                    author: { type: "string", description: "Author name" }
                  },
                  required: ["name", "description", "category", "version"]
                },
                execute: async function(params) {
                  var res = await fetch('/api/package', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(params)
                  });
                  return res.json();
                }
              });

              // Show agent indicator
              var indicator = document.getElementById('agent-indicator');
              if (indicator) { indicator.classList.remove('hidden'); indicator.classList.add('flex'); }
              console.log('[WebMCP] OpenClaw Equipment: 8 tools registered');
            }
            if (navigator.modelContext) registerTools();
            else window.addEventListener('modelcontextready', registerTools);
          })();
        `}} />
      </body>
    </html>
  );
}
