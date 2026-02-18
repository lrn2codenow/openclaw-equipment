'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import PackageCard from '@/components/PackageCard';
import SearchBar from '@/components/SearchBar';
import { type Package } from '@/lib/utils';

const categories = [
  { slug: 'all', name: 'All' },
  { slug: 'mcp-tools', name: 'MCP Tools' },
  { slug: 'software', name: 'Software' },
  { slug: 'models', name: 'Models' },
  { slug: 'resources', name: 'Resources' },
];

const platforms = ['any', 'macos', 'linux', 'windows', 'docker', 'browser'];
const compatibilities = ['any', 'claude', 'gpt', 'gemini', 'openclaw'];
const sortOptions = [
  { value: 'downloads', label: 'Most Downloads' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'relevance', label: 'Relevance' },
];

function BrowseContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  
  const [packages, setPackages] = useState<Package[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);
  const [platform, setPlatform] = useState('any');
  const [compatibility, setCompatibility] = useState('any');
  const [sort, setSort] = useState(q ? 'relevance' : 'downloads');

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (category !== 'all') params.set('category', category);
    if (platform !== 'any') params.set('platform', platform);
    if (compatibility !== 'any') params.set('compatibility', compatibility);
    params.set('sort', sort);
    params.set('limit', '40');

    setLoading(true);
    fetch(`/api/search?${params.toString()}`)
      .then(r => r.json())
      .then(data => {
        setPackages(data.packages || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [q, category, platform, compatibility, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <SearchBar defaultValue={q} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Category</h3>
            <div className="flex flex-row lg:flex-col gap-1 flex-wrap">
              {categories.map(c => (
                <button
                  key={c.slug}
                  onClick={() => setCategory(c.slug)}
                  className={`text-left px-3 py-1.5 rounded text-sm transition-colors ${category === c.slug ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Platform</h3>
            <div className="flex flex-row lg:flex-col gap-1 flex-wrap">
              {platforms.map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`text-left px-3 py-1.5 rounded text-sm capitalize transition-colors ${platform === p ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
                >
                  {p === 'any' ? 'All Platforms' : p}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Compatible With</h3>
            <div className="flex flex-row lg:flex-col gap-1 flex-wrap">
              {compatibilities.map(c => (
                <button
                  key={c}
                  onClick={() => setCompatibility(c)}
                  className={`text-left px-3 py-1.5 rounded text-sm capitalize transition-colors ${compatibility === c ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'}`}
                >
                  {c === 'any' ? 'All' : c}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-zinc-400">
              {loading ? 'Loading...' : `${total} packages found`}
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:border-emerald-500"
            >
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-36 rounded-lg border border-zinc-800 bg-zinc-900/50 animate-pulse" />
              ))}
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">
              <p className="text-lg mb-2">No packages found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><div className="h-96 animate-pulse bg-zinc-900 rounded-lg" /></div>}>
      <BrowseContent />
    </Suspense>
  );
}
