export const metadata = { title: 'About — Getware', description: 'Learn about Getware, the package manager for AI agents' };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">About Getware</h1>

      <div className="prose prose-invert prose-emerald max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">What is Getware?</h2>
          <p className="text-zinc-400 leading-relaxed">
            Getware is <strong className="text-zinc-200">the package manager for AI agents</strong>. It&apos;s a directory where agents (and humans) can find, download, and install everything they need — MCP tools, software, AI models, and resources — all distributed peer-to-peer via WebTorrent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">How WebMCP Works</h2>
          <p className="text-zinc-400 leading-relaxed mb-3">
            WebMCP (Web Model Context Protocol) allows AI agents to interact with web pages through structured tools rather than scraping HTML. When an agent visits Getware in a compatible browser (Chrome 146+), tools are automatically registered via <code className="text-emerald-400 bg-zinc-900 px-1.5 py-0.5 rounded text-xs">navigator.modelContext</code>.
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <pre className="text-sm text-emerald-400 overflow-x-auto">{`// Agent searches for packages
const results = await search_packages({
  query: "home assistant mcp",
  category: "mcp-tools",
  sort: "rating"
});

// Agent downloads a package
await download_package({
  slug: "ha-mcp-server",
  version: "latest"
});`}</pre>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">How WebTorrent Works</h2>
          <p className="text-zinc-400 leading-relaxed">
            Getware uses WebTorrent for peer-to-peer distribution. When you download a package, you&apos;re downloading from other users who have the same file — no central server needed. This means faster downloads, better resilience, and zero hosting costs for package authors.
          </p>
          <ul className="list-disc list-inside text-zinc-400 mt-3 space-y-1">
            <li>Downloads happen directly in your browser</li>
            <li>You automatically seed files you&apos;ve downloaded</li>
            <li>More popular packages have more seeders = faster downloads</li>
            <li>Real magnet links for open-source software (Linux ISOs, etc.)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Chrome 146+ Setup</h2>
          <p className="text-zinc-400 leading-relaxed mb-3">
            To use WebMCP features with AI agents:
          </p>
          <ol className="list-decimal list-inside text-zinc-400 space-y-2">
            <li>Use Chrome 146 or newer (Canary/Dev channel)</li>
            <li>Enable the WebMCP flag: <code className="text-emerald-400 bg-zinc-900 px-1.5 py-0.5 rounded text-xs">chrome://flags/#web-model-context</code></li>
            <li>Navigate to Getware — tools auto-register</li>
            <li>Your AI agent can now use structured tools on the page</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">For Publishers</h2>
          <p className="text-zinc-400 leading-relaxed">
            Anyone can publish a package to Getware. You need a magnet URI (torrent) for your package and some metadata. Visit the <a href="/publish" className="text-emerald-400 hover:text-emerald-300">Publish page</a> or use the WebMCP <code className="text-emerald-400 bg-zinc-900 px-1.5 py-0.5 rounded text-xs">publish_package</code> tool.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">API</h2>
          <p className="text-zinc-400 leading-relaxed">
            Getware provides a REST API for programmatic access. See the <a href="/docs" className="text-emerald-400 hover:text-emerald-300">API Documentation</a> for details.
          </p>
        </section>
      </div>
    </div>
  );
}
