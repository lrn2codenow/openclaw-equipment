import { getPackageBySlug, getPackageVersions, getPackageReviews, searchPackages } from '@/lib/db';
import { formatNumber, type Package, type Review } from '@/lib/utils';
import { notFound } from 'next/navigation';

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug) as Package | undefined;
  if (!pkg) notFound();

  const versions = getPackageVersions(slug) as Array<{ id: string; version: string; changelog: string; created_at: string }>;
  const reviews = getPackageReviews(slug) as Review[];
  const tags = JSON.parse(pkg.tags || '[]') as string[];
  const platforms = JSON.parse(pkg.platform || '["any"]') as string[];
  const compatibility = JSON.parse(pkg.compatibility || '["any"]') as string[];
  const { packages: related } = searchPackages({ category: pkg.category, limit: 4 });
  const relatedPkgs = (related as Package[]).filter(p => p.id !== pkg.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main */}
        <div className="flex-1">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{pkg.name}</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v{pkg.version}
              </span>
            </div>
            <p className="text-zinc-400">{pkg.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-zinc-500">
              <span>by <strong className="text-zinc-300">{pkg.author}</strong></span>
              <span className="flex items-center gap-1"><span className="text-amber-400">★</span> {pkg.rating.toFixed(1)} ({pkg.review_count})</span>
              <span>↓ {formatNumber(pkg.downloads)}</span>
              <span className="text-emerald-500">● {pkg.seeders} seeders</span>
            </div>
          </div>

          {/* Install */}
          <div className="p-5 rounded-lg border border-zinc-800 bg-zinc-900/50 mb-6">
            <h2 className="font-semibold mb-3">Install</h2>
            <div className="bg-zinc-950 p-3 rounded font-mono text-sm text-emerald-400 mb-3 break-all">
              {pkg.magnet_uri}
            </div>
            <button
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
              data-magnet={pkg.magnet_uri}
              data-slug={pkg.slug}
            >
              ⬇ Download with WebTorrent
            </button>
            {pkg.size_display && (
              <p className="text-xs text-zinc-500 mt-2 text-center">Size: {pkg.size_display} • License: {pkg.license}</p>
            )}
          </div>

          {/* Details */}
          <div className="p-5 rounded-lg border border-zinc-800 bg-zinc-900/50 mb-6">
            <h2 className="font-semibold mb-3">Details</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-zinc-500">Category:</span> <span className="capitalize">{pkg.category.replace('-', ' ')}</span></div>
              {pkg.subcategory && <div><span className="text-zinc-500">Subcategory:</span> <span className="capitalize">{pkg.subcategory.replace('-', ' ')}</span></div>}
              <div><span className="text-zinc-500">License:</span> {pkg.license}</div>
              <div><span className="text-zinc-500">Platforms:</span> {platforms.join(', ')}</div>
              <div><span className="text-zinc-500">Compatibility:</span> {compatibility.join(', ')}</div>
              {pkg.checksum && <div className="col-span-2"><span className="text-zinc-500">Checksum:</span> <code className="text-xs">{pkg.checksum}</code></div>}
            </div>
            {pkg.source_url && (
              <a href={pkg.source_url} target="_blank" className="inline-flex items-center gap-1 mt-3 text-sm text-emerald-400 hover:text-emerald-300">
                Source Code →
              </a>
            )}
          </div>

          {/* Versions */}
          {versions.length > 0 && (
            <div className="p-5 rounded-lg border border-zinc-800 bg-zinc-900/50 mb-6">
              <h2 className="font-semibold mb-3">Version History</h2>
              <div className="space-y-3">
                {versions.map(v => (
                  <div key={v.id} className="flex items-center justify-between text-sm border-b border-zinc-800 pb-2 last:border-0">
                    <div>
                      <span className="font-medium">v{v.version}</span>
                      {v.changelog && <span className="text-zinc-500 ml-2">— {v.changelog}</span>}
                    </div>
                    <span className="text-xs text-zinc-500">{new Date(v.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="p-5 rounded-lg border border-zinc-800 bg-zinc-900/50 mb-6">
            <h2 className="font-semibold mb-3">Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-sm text-zinc-500">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map(r => (
                  <div key={r.id} className="border-b border-zinc-800 pb-3 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{r.reviewer}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${r.reviewer_type === 'agent' ? 'bg-blue-500/10 text-blue-400' : 'bg-zinc-800 text-zinc-400'}`}>
                          {r.reviewer_type}
                        </span>
                      </div>
                      <span className="text-amber-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </div>
                    {r.review && <p className="text-sm text-zinc-400">{r.review}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-72 shrink-0">
          <div className="p-5 rounded-lg border border-zinc-800 bg-zinc-900/50 mb-4 sticky top-20">
            <h3 className="font-semibold text-sm mb-3">Tags</h3>
            <div className="flex flex-wrap gap-1 mb-4">
              {tags.map(tag => (
                <a key={tag} href={`/browse?q=${tag}`} className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-700 transition-colors">
                  {tag}
                </a>
              ))}
            </div>

            {relatedPkgs.length > 0 && (
              <>
                <h3 className="font-semibold text-sm mb-3 mt-4 pt-4 border-t border-zinc-800">Related Packages</h3>
                <div className="space-y-2">
                  {relatedPkgs.map(p => (
                    <a key={p.id} href={`/package/${p.slug}`} className="block text-sm text-zinc-400 hover:text-emerald-400 transition-colors">
                      {p.name} <span className="text-zinc-600">v{p.version}</span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {/* WebMCP tools for this page */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          function register() {
            if (!navigator.modelContext || !navigator.modelContext.registerTool) return;
            const mc = navigator.modelContext;
            mc.registerTool({
              name: "get_package_details",
              description: "Get full details about ${pkg.name}",
              inputSchema: { type: "object", properties: { slug: { type: "string" } } },
              execute: async (p) => { const r = await fetch('/api/package/' + (p.slug || '${slug}')); return r.json(); }
            });
            mc.registerTool({
              name: "download_package",
              description: "Download ${pkg.name} via WebTorrent",
              inputSchema: { type: "object", properties: { slug: { type: "string" }, version: { type: "string" } } },
              execute: async () => ({ magnet: "${pkg.magnet_uri.replace(/"/g, '\\"')}", status: "ready" })
            });
            mc.registerTool({
              name: "get_install_instructions",
              description: "Get install instructions for ${pkg.name}",
              inputSchema: { type: "object", properties: { slug: { type: "string" }, platform: { type: "string" } } },
              execute: async () => ({ magnet: "${pkg.magnet_uri.replace(/"/g, '\\"')}", platforms: ${pkg.platform}, instructions: "Download via magnet link and extract" })
            });
            mc.registerTool({
              name: "submit_review",
              description: "Submit a review for ${pkg.name}",
              inputSchema: { type: "object", properties: { rating: { type: "number" }, review: { type: "string" } }, required: ["rating"] },
              execute: async (p) => { const r = await fetch('/api/package/${slug}/reviews', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(p) }); return r.json(); }
            });
          }
          if (navigator.modelContext) register();
          else window.addEventListener('modelcontextready', register);
        })();
      `}} />
    </div>
  );
}
