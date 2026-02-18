'use client';

import { formatNumber, type Package } from '@/lib/utils';

const categoryColors: Record<string, string> = {
  'mcp-tools': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'software': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'models': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'resources': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
};

const categoryLabels: Record<string, string> = {
  'mcp-tools': 'MCP Tool',
  'software': 'Software',
  'models': 'Model',
  'resources': 'Resource',
};

export default function PackageCard({ pkg }: { pkg: Package }) {
  const tags = JSON.parse(pkg.tags || '[]') as string[];
  const platforms = JSON.parse(pkg.platform || '["any"]') as string[];

  return (
    <a
      href={`/package/${pkg.slug}`}
      className="block p-4 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-emerald-500/30 hover:bg-zinc-900 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm group-hover:text-emerald-400 transition-colors truncate">
          {pkg.name}
        </h3>
        <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded-full border ${categoryColors[pkg.category] || 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
          {categoryLabels[pkg.category] || pkg.category}
        </span>
      </div>
      <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{pkg.description}</p>
      <div className="flex items-center justify-between text-[11px] text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="text-amber-400">★</span> {pkg.rating.toFixed(1)}
          </span>
          <span>↓ {formatNumber(pkg.downloads)}</span>
          {pkg.seeders > 0 && <span className="text-emerald-500">● {pkg.seeders} seeds</span>}
        </div>
        <span className="text-zinc-600">v{pkg.version}</span>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">{tag}</span>
          ))}
        </div>
      )}
    </a>
  );
}
