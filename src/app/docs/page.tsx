export const metadata = { title: 'API Documentation — Getware', description: 'API reference for Getware REST and WebMCP endpoints' };

const endpoints = [
  { method: 'GET', path: '/api/search', desc: 'Search packages', params: 'q, category, platform, compatibility, sort, limit, offset' },
  { method: 'GET', path: '/api/package/[slug]', desc: 'Get package details', params: 'slug (path)' },
  { method: 'GET', path: '/api/package/[slug]/versions', desc: 'Get package versions', params: 'slug (path)' },
  { method: 'GET', path: '/api/package/[slug]/reviews', desc: 'Get package reviews', params: 'slug (path)' },
  { method: 'POST', path: '/api/package', desc: 'Publish a new package', params: 'name, description, category, version, magnet_uri, author, ...' },
  { method: 'POST', path: '/api/package/[slug]/reviews', desc: 'Submit a review', params: 'reviewer, rating, review, works_on' },
  { method: 'GET', path: '/api/categories', desc: 'List all categories', params: 'none' },
  { method: 'GET', path: '/api/trending', desc: 'Get trending packages', params: 'timeframe, category' },
  { method: 'GET', path: '/api/stats', desc: 'Platform statistics', params: 'none' },
];

const webmcpTools = [
  { name: 'search_packages', scope: 'Global', desc: 'Search directory for packages', params: 'query, category?, platform?, sort?, limit?' },
  { name: 'get_categories', scope: 'Global', desc: 'List all categories with counts', params: 'none' },
  { name: 'get_trending', scope: 'Global', desc: 'Get trending packages', params: 'timeframe?, category?' },
  { name: 'get_package_details', scope: 'Package page', desc: 'Full package details', params: 'slug' },
  { name: 'download_package', scope: 'Package page', desc: 'Download via WebTorrent', params: 'slug, version?' },
  { name: 'get_install_instructions', scope: 'Package page', desc: 'Platform-specific install info', params: 'slug, platform?, agentType?' },
  { name: 'submit_review', scope: 'Package page', desc: 'Submit review/compatibility report', params: 'slug, rating, review?, worksOn?, issues?' },
  { name: 'list_downloads', scope: 'Downloads page', desc: 'List active downloads', params: 'none' },
  { name: 'publish_package', scope: 'Publish page', desc: 'Publish a new package', params: 'name, description, category, version, magnetUri, ...' },
];

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
      <p className="text-zinc-400 text-sm mb-10">REST API and WebMCP tool reference for Getware.</p>

      {/* REST API */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">REST API Endpoints</h2>
        <div className="space-y-3">
          {endpoints.map((ep, i) => (
            <div key={i} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center gap-3 mb-1">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${ep.method === 'GET' ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {ep.method}
                </span>
                <code className="text-sm font-mono text-zinc-200">{ep.path}</code>
              </div>
              <p className="text-sm text-zinc-400 mt-1">{ep.desc}</p>
              <p className="text-xs text-zinc-600 mt-1">Parameters: {ep.params}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WebMCP */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">WebMCP Tools</h2>
        <p className="text-sm text-zinc-400 mb-4">
          These tools are automatically registered via <code className="text-emerald-400 bg-zinc-900 px-1.5 py-0.5 rounded text-xs">navigator.modelContext</code> when an AI agent visits Getware in Chrome 146+.
        </p>
        <div className="space-y-3">
          {webmcpTools.map((tool, i) => (
            <div key={i} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
              <div className="flex items-center gap-3 mb-1">
                <code className="text-sm font-mono text-emerald-400">{tool.name}()</code>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-800 text-zinc-500">{tool.scope}</span>
              </div>
              <p className="text-sm text-zinc-400 mt-1">{tool.desc}</p>
              <p className="text-xs text-zinc-600 mt-1">Parameters: {tool.params}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Example */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Example: Agent Integration</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <pre className="text-sm text-emerald-400 overflow-x-auto whitespace-pre">{`// 1. Search for MCP tools
const results = await search_packages({
  query: "database",
  category: "mcp-tools",
  sort: "rating",
  limit: 5
});
// Returns: { packages: [...], total: 12 }

// 2. Get details for a specific package
const pkg = await get_package_details({
  slug: "postgresql-mcp"
});
// Returns: { name, description, version, magnet_uri, ... }

// 3. Download it
const download = await download_package({
  slug: "postgresql-mcp",
  version: "latest"
});
// Initiates WebTorrent P2P download

// 4. Submit a review
await submit_review({
  slug: "postgresql-mcp",
  rating: 5,
  review: "Works perfectly with Claude",
  worksOn: ["macos", "linux"]
});`}</pre>
        </div>
      </section>
    </div>
  );
}
