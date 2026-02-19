import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'clawtools.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    initSchema(_db);
  }
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      long_description TEXT,
      category TEXT NOT NULL,
      subcategory TEXT,
      version TEXT NOT NULL,
      author TEXT NOT NULL,
      license TEXT DEFAULT 'MIT',
      magnet_uri TEXT NOT NULL,
      info_hash TEXT,
      checksum TEXT,
      size_bytes INTEGER,
      size_display TEXT,
      platform TEXT DEFAULT '["any"]',
      compatibility TEXT DEFAULT '["any"]',
      dependencies TEXT DEFAULT '[]',
      source_url TEXT,
      homepage TEXT,
      icon_url TEXT,
      tags TEXT DEFAULT '[]',
      downloads INTEGER DEFAULT 0,
      rating REAL DEFAULT 0,
      review_count INTEGER DEFAULT 0,
      seeders INTEGER DEFAULT 0,
      status TEXT DEFAULT 'published',
      featured INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS versions (
      id TEXT PRIMARY KEY,
      package_id TEXT NOT NULL REFERENCES packages(id),
      version TEXT NOT NULL,
      magnet_uri TEXT NOT NULL,
      checksum TEXT,
      size_bytes INTEGER,
      changelog TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      package_id TEXT NOT NULL REFERENCES packages(id),
      reviewer TEXT NOT NULL,
      reviewer_type TEXT DEFAULT 'agent',
      rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
      review TEXT,
      works_on TEXT DEFAULT '[]',
      issues TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      icon TEXT,
      parent_id TEXT REFERENCES categories(id),
      sort_order INTEGER DEFAULT 0
    );
  `);
}

export function searchPackages(opts: {
  q?: string;
  category?: string;
  platform?: string;
  compatibility?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}) {
  const db = getDb();
  const conditions: string[] = ['status = ?'];
  const params: unknown[] = ['published'];

  if (opts.q) {
    conditions.push('(name LIKE ? OR description LIKE ? OR tags LIKE ?)');
    const q = `%${opts.q}%`;
    params.push(q, q, q);
  }
  if (opts.category && opts.category !== 'all') {
    conditions.push('category = ?');
    params.push(opts.category);
  }
  if (opts.platform && opts.platform !== 'any') {
    conditions.push('platform LIKE ?');
    params.push(`%${opts.platform}%`);
  }
  if (opts.compatibility && opts.compatibility !== 'any') {
    conditions.push('compatibility LIKE ?');
    params.push(`%${opts.compatibility}%`);
  }

  let orderBy = 'downloads DESC';
  switch (opts.sort) {
    case 'rating': orderBy = 'rating DESC'; break;
    case 'newest': orderBy = 'created_at DESC'; break;
    case 'downloads': orderBy = 'downloads DESC'; break;
    case 'relevance': orderBy = opts.q ? 'CASE WHEN name LIKE ? THEN 0 ELSE 1 END, downloads DESC' : 'downloads DESC'; break;
  }

  const limit = Math.min(opts.limit || 20, 100);
  const offset = opts.offset || 0;

  let sql = `SELECT * FROM packages WHERE ${conditions.join(' AND ')} ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
  const finalParams = [...params];
  if (opts.sort === 'relevance' && opts.q) {
    finalParams.push(`%${opts.q}%`);
  }
  finalParams.push(limit, offset);

  const countSql = `SELECT COUNT(*) as total FROM packages WHERE ${conditions.join(' AND ')}`;

  const rows = db.prepare(sql).all(...finalParams);
  const { total } = db.prepare(countSql).get(...params) as { total: number };

  return { packages: rows, total, limit, offset };
}

export function getPackageBySlug(slug: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM packages WHERE slug = ?').get(slug);
}

export function getPackageVersions(slug: string) {
  const db = getDb();
  const pkg = db.prepare('SELECT id FROM packages WHERE slug = ?').get(slug) as { id: string } | undefined;
  if (!pkg) return [];
  return db.prepare('SELECT * FROM versions WHERE package_id = ? ORDER BY created_at DESC').all(pkg.id);
}

export function getPackageReviews(slug: string) {
  const db = getDb();
  const pkg = db.prepare('SELECT id FROM packages WHERE slug = ?').get(slug) as { id: string } | undefined;
  if (!pkg) return [];
  return db.prepare('SELECT * FROM reviews WHERE package_id = ? ORDER BY created_at DESC').all(pkg.id);
}

export function createPackage(data: Record<string, unknown>) {
  const db = getDb();
  const id = data.id as string || crypto.randomUUID();
  const slug = (data.slug as string) || (data.name as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const stmt = db.prepare(`
    INSERT INTO packages (id, name, slug, description, long_description, category, subcategory, version, author, license, magnet_uri, info_hash, checksum, size_bytes, size_display, platform, compatibility, dependencies, source_url, homepage, icon_url, tags, downloads, rating, review_count, seeders, status, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id, data.name, slug, data.description, data.long_description || null,
    data.category, data.subcategory || null, data.version, data.author,
    data.license || 'MIT', data.magnet_uri, data.info_hash || null,
    data.checksum || null, data.size_bytes || null, data.size_display || null,
    JSON.stringify(data.platform || ['any']), JSON.stringify(data.compatibility || ['any']),
    JSON.stringify(data.dependencies || []), data.source_url || null,
    data.homepage || null, data.icon_url || null, JSON.stringify(data.tags || []),
    data.downloads || 0, data.rating || 0, data.review_count || 0,
    data.seeders || 0, data.status || 'published', data.featured || 0
  );

  return { id, slug };
}

export function createReview(data: { package_id: string; reviewer: string; reviewer_type?: string; rating: number; review?: string; works_on?: string[]; issues?: string[] }) {
  const db = getDb();
  const id = crypto.randomUUID();
  
  db.prepare(`INSERT INTO reviews (id, package_id, reviewer, reviewer_type, rating, review, works_on, issues) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(id, data.package_id, data.reviewer, data.reviewer_type || 'agent', data.rating, data.review || null, JSON.stringify(data.works_on || []), JSON.stringify(data.issues || []));

  // Update package rating
  const stats = db.prepare('SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE package_id = ?').get(data.package_id) as { avg_rating: number; count: number };
  db.prepare('UPDATE packages SET rating = ?, review_count = ? WHERE id = ?').run(Math.round(stats.avg_rating * 10) / 10, stats.count, data.package_id);

  return { id };
}

export function getCategories() {
  const db = getDb();
  const cats = db.prepare('SELECT * FROM categories ORDER BY sort_order').all() as Array<Record<string, unknown>>;
  // Add package counts
  return cats.map(cat => {
    const { count } = db.prepare('SELECT COUNT(*) as count FROM packages WHERE category = ? AND status = ?').get(cat.slug, 'published') as { count: number };
    return { ...cat, package_count: count };
  });
}

export function getStats() {
  const db = getDb();
  const { total } = db.prepare('SELECT COUNT(*) as total FROM packages WHERE status = ?').get('published') as { total: number };
  const { downloads } = db.prepare('SELECT COALESCE(SUM(downloads), 0) as downloads FROM packages').get() as { downloads: number };
  const { seeders } = db.prepare('SELECT COALESCE(SUM(seeders), 0) as seeders FROM packages').get() as { seeders: number };
  const { categories } = db.prepare('SELECT COUNT(*) as categories FROM categories').get() as { categories: number };
  return { total_packages: total, total_downloads: downloads, total_seeders: seeders, total_categories: categories };
}

export function getTrending(opts: { timeframe?: string; category?: string }) {
  const db = getDb();
  const conditions: string[] = ['status = ?'];
  const params: unknown[] = ['published'];
  
  if (opts.category && opts.category !== 'all') {
    conditions.push('category = ?');
    params.push(opts.category);
  }

  return db.prepare(`SELECT * FROM packages WHERE ${conditions.join(' AND ')} ORDER BY downloads DESC LIMIT 20`).all(...params);
}
