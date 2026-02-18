import { getDb, searchPackages, getCategories, getStats } from '@/lib/db';
import { formatNumber, type Package, type Category } from '@/lib/utils';
import PackageCard from '@/components/PackageCard';
import SearchBar from '@/components/SearchBar';

export default function HomePage() {
  const stats = getStats();
  const categories = getCategories() as Category[];
  const { packages: featured } = searchPackages({ limit: 8, sort: 'downloads' });
  const featuredPkgs = featured as Package[];

  const categoryIcons: Record<string, string> = {
    'mcp-tools': '🔧',
    'software': '💻',
    'models': '🧠',
    'resources': '📦',
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            The package manager for{' '}
            <span className="text-emerald-400">AI agents</span>
          </h1>
          <p className="text-lg text-zinc-400 mb-8 max-w-xl mx-auto">
            Find, download, and install tools, software, models, and resources.
            Distributed peer-to-peer via WebTorrent.
          </p>
          <div className="max-w-xl mx-auto">
            <SearchBar large />
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-zinc-500">
            <span><strong className="text-zinc-300">{formatNumber(stats.total_packages)}</strong> packages</span>
            <span><strong className="text-zinc-300">{formatNumber(stats.total_downloads)}</strong> downloads</span>
            <span className="text-emerald-500"><strong>{formatNumber(stats.total_seeders)}</strong> seeders</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-xl font-semibold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/browse?category=${cat.slug}`}
              className="p-5 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-emerald-500/30 hover:bg-zinc-900 transition-all group"
            >
              <div className="text-3xl mb-3">{cat.icon || categoryIcons[cat.slug] || '📁'}</div>
              <h3 className="font-semibold text-sm group-hover:text-emerald-400 transition-colors">{cat.name}</h3>
              <p className="text-xs text-zinc-500 mt-1">{cat.package_count} packages</p>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Packages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Popular Packages</h2>
          <a href="/browse" className="text-sm text-emerald-400 hover:text-emerald-300">View all →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredPkgs.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="text-xl font-semibold mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-emerald-400">🤖</span> For AI Agents
            </h3>
            <div className="text-sm text-zinc-400 space-y-2">
              <p>Agents interact via WebMCP tools that auto-register in supported browsers:</p>
              <pre className="bg-zinc-950 p-3 rounded text-xs text-emerald-400 overflow-x-auto">{`// Agent calls:
search_packages("home assistant mcp")
// → structured results with ratings

download_package("ha-mcp-server")
// → P2P download via WebTorrent`}</pre>
            </div>
          </div>
          <div className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-emerald-400">👤</span> For Humans
            </h3>
            <div className="text-sm text-zinc-400 space-y-2">
              <p>Browse the directory, search for what you need, and download directly in your browser:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Search or browse packages by category</li>
                <li>Check ratings, reviews, and compatibility</li>
                <li>Download via WebTorrent P2P — fast and decentralized</li>
                <li>Publish your own tools for the community</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
