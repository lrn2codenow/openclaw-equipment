import fs from 'fs';
import path from 'path';

export interface PackageData {
  slug: string;
  name: string;
  description: string;
  category: string;
  version: string;
  install: string;
  source_url: string;
  tags: string;
  platform: string;
  license: string;
  author: string;
}

let _cache: PackageData[] | null = null;

/**
 * Load packages from static JSON (works on Vercel where SQLite is unavailable).
 * Falls back to SQLite in development.
 */
export function getStaticPackages(): PackageData[] {
  if (_cache) return _cache;
  
  const jsonPath = path.join(process.cwd(), 'public', 'data', 'packages.json');
  
  if (fs.existsSync(jsonPath)) {
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    _cache = JSON.parse(raw);
    return _cache!;
  }
  
  // Fallback: try SQLite (dev mode)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getDb } = require('./db');
    const db = getDb();
    _cache = db.prepare('SELECT slug, name, description, category, version, install, source_url, tags, platform, license, author FROM packages ORDER BY name').all() as PackageData[];
    return _cache!;
  } catch {
    return [];
  }
}

export function searchStaticPackages(query: string, category?: string, limit = 10): { packages: PackageData[]; total: number } {
  let pkgs = getStaticPackages();
  
  if (category && category !== 'all') {
    pkgs = pkgs.filter(p => p.category === category);
  }
  
  if (query) {
    const q = query.toLowerCase();
    pkgs = pkgs.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      (p.tags && p.tags.toLowerCase().includes(q))
    );
  }
  
  return { packages: pkgs.slice(0, limit), total: pkgs.length };
}

export function getStaticPackage(slug: string): PackageData | undefined {
  return getStaticPackages().find(p => p.slug === slug);
}
