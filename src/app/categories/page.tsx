import { getCategories, searchPackagesRaw } from '@/lib/db';
import { type Category, type Package, formatNumber } from '@/lib/utils';
import PackageCard from '@/components/PackageCard';

export const metadata = { title: 'Categories — OpenClaw Equipment', description: 'Browse packages by category' };

export default function CategoriesPage() {
  const categories = getCategories() as Category[];
  
  const categoryPackages: Record<string, Package[]> = {};
  for (const cat of categories) {
    const { packages } = searchPackagesRaw({ category: cat.slug, limit: 4, sort: 'downloads' });
    categoryPackages[cat.slug] = packages as Package[];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-2">Categories</h1>
      <p className="text-zinc-400 text-sm mb-8">Browse the OpenClaw Equipment directory by category.</p>

      <div className="space-y-12">
        {categories.map(cat => (
          <section key={cat.id}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h2 className="text-lg font-semibold">{cat.name}</h2>
                  <p className="text-xs text-zinc-500">{cat.description} • {cat.package_count} packages</p>
                </div>
              </div>
              <a href={`/browse?category=${cat.slug}`} className="text-sm text-emerald-400 hover:text-emerald-300">View all →</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryPackages[cat.slug]?.map(pkg => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
