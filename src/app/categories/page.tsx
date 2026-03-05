import { getStaticPackages } from '@/lib/static-data';
import { type Package } from '@/lib/utils';
import PackageCard from '@/components/PackageCard';

export const metadata = { title: 'Categories — OpenClaw Equipment', description: 'Browse packages by category' };

const categoryMeta: Record<string, { icon: string; description: string }> = {
  'mcp-tools': { icon: '🔌', description: 'Model Context Protocol servers' },
  'dev-tools': { icon: '🛠️', description: 'Development utilities' },
  'ai-ml-tools': { icon: '🤖', description: 'AI and machine learning tools' },
  'web-api-tools': { icon: '🌐', description: 'Web APIs and integrations' },
  'productivity-automation': { icon: '⚡', description: 'Productivity and automation' },
  'openclaw-skills': { icon: '🦞', description: 'OpenClaw-native skills' },
};

export default function CategoriesPage() {
  const allPkgs = getStaticPackages();
  const catMap: Record<string, typeof allPkgs> = {};
  allPkgs.forEach(p => {
    if (!catMap[p.category]) catMap[p.category] = [];
    catMap[p.category].push(p);
  });

  const categories = Object.entries(catMap)
    .sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-2">Categories</h1>
      <p className="text-zinc-400 text-sm mb-8">Browse the OpenClaw Equipment directory by category.</p>

      <div className="space-y-12">
        {categories.map(([cat, pkgs]) => {
          const meta = categoryMeta[cat] || { icon: '📦', description: cat };
          return (
            <section key={cat}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{meta.icon}</span>
                  <div>
                    <h2 className="text-lg font-semibold">{cat}</h2>
                    <p className="text-xs text-zinc-500">{meta.description} • {pkgs.length} packages</p>
                  </div>
                </div>
                <a href={`/browse?category=${cat}`} className="text-sm text-emerald-400 hover:text-emerald-300">View all →</a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {pkgs.slice(0, 4).map(pkg => (
                  <PackageCard key={pkg.slug} pkg={pkg as unknown as Package} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
