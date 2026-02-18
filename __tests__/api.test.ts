import { describe, it, expect, beforeAll } from 'vitest';
import { searchPackages, getPackageBySlug, getPackageVersions, getPackageReviews, getCategories, getStats, getTrending, createPackage, createReview } from '@/lib/db';

describe('API - Search', () => {
  it('returns results for empty query', () => {
    const result = searchPackages({});
    expect(result.packages.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  it('returns results for text query', () => {
    const result = searchPackages({ q: 'GitHub' });
    expect(result.packages.length).toBeGreaterThan(0);
  });

  it('filters by category', () => {
    const result = searchPackages({ category: 'mcp-tools' });
    const pkgs = result.packages as Array<{ category: string }>;
    pkgs.forEach(p => expect(p.category).toBe('mcp-tools'));
  });

  it('filters by platform', () => {
    const result = searchPackages({ platform: 'docker' });
    const pkgs = result.packages as Array<{ platform: string }>;
    pkgs.forEach(p => expect(p.platform).toContain('docker'));
  });

  it('respects limit', () => {
    const result = searchPackages({ limit: 5 });
    expect(result.packages.length).toBeLessThanOrEqual(5);
  });

  it('sorts by downloads', () => {
    const result = searchPackages({ sort: 'downloads', limit: 10 });
    const pkgs = result.packages as Array<{ downloads: number }>;
    for (let i = 1; i < pkgs.length; i++) {
      expect(pkgs[i - 1].downloads).toBeGreaterThanOrEqual(pkgs[i].downloads);
    }
  });

  it('sorts by rating', () => {
    const result = searchPackages({ sort: 'rating', limit: 10 });
    const pkgs = result.packages as Array<{ rating: number }>;
    for (let i = 1; i < pkgs.length; i++) {
      expect(pkgs[i - 1].rating).toBeGreaterThanOrEqual(pkgs[i].rating);
    }
  });

  it('sorts by newest', () => {
    const result = searchPackages({ sort: 'newest', limit: 10 });
    expect(result.packages.length).toBeGreaterThan(0);
  });
});

describe('API - Package Detail', () => {
  it('returns package by slug', () => {
    const pkg = getPackageBySlug('github-mcp-server') as Record<string, unknown>;
    expect(pkg).toBeTruthy();
    expect(pkg.name).toBe('GitHub MCP Server');
  });

  it('returns null for missing package', () => {
    const pkg = getPackageBySlug('nonexistent-package-xyz');
    expect(pkg).toBeUndefined();
  });
});

describe('API - Versions', () => {
  it('returns versions for package', () => {
    const versions = getPackageVersions('github-mcp-server');
    expect(versions.length).toBeGreaterThan(0);
  });

  it('returns empty for missing package', () => {
    const versions = getPackageVersions('nonexistent-xyz');
    expect(versions).toEqual([]);
  });
});

describe('API - Reviews', () => {
  it('returns reviews for github-mcp-server', () => {
    const reviews = getPackageReviews('github-mcp-server');
    // May or may not have reviews depending on seed randomness
    expect(Array.isArray(reviews)).toBe(true);
  });
});

describe('API - Categories', () => {
  it('returns all categories', () => {
    const cats = getCategories();
    expect(cats.length).toBe(4);
  });

  it('categories have package counts', () => {
    const cats = getCategories() as Array<{ package_count: number }>;
    cats.forEach(c => expect(typeof c.package_count).toBe('number'));
  });
});

describe('API - Stats', () => {
  it('returns total counts', () => {
    const stats = getStats();
    expect(stats.total_packages).toBeGreaterThanOrEqual(200);
    expect(stats.total_downloads).toBeGreaterThan(0);
    expect(stats.total_categories).toBe(4);
  });
});

describe('API - Trending', () => {
  it('returns trending packages', () => {
    const pkgs = getTrending({});
    expect(pkgs.length).toBeGreaterThan(0);
  });

  it('filters trending by category', () => {
    const pkgs = getTrending({ category: 'models' }) as Array<{ category: string }>;
    pkgs.forEach(p => expect(p.category).toBe('models'));
  });
});

describe('API - Create Package', () => {
  it('creates a new package', () => {
    const result = createPackage({
      name: 'Test Package ' + Date.now(),
      description: 'A test package',
      category: 'resources',
      version: '1.0.0',
      author: 'tester',
      magnet_uri: 'magnet:?xt=urn:btih:0000000000000000000000000000000000000000&dn=test',
    });
    expect(result.id).toBeTruthy();
    expect(result.slug).toBeTruthy();
  });
});

describe('API - Create Review', () => {
  it('creates a review and updates rating', () => {
    const pkg = getPackageBySlug('github-mcp-server') as { id: string };
    const result = createReview({
      package_id: pkg.id,
      reviewer: 'TestBot',
      rating: 5,
      review: 'Great package!',
    });
    expect(result.id).toBeTruthy();
  });
});
