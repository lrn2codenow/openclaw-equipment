import { describe, it, expect, beforeAll } from 'vitest';
import { execSync } from 'child_process';
import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'clawtools.db');

let db: Database.Database;

beforeAll(() => {
  // Ensure seeded
  if (!require('fs').existsSync(DB_PATH)) {
    execSync('npm run seed', { cwd: process.cwd() });
  }
  db = new Database(DB_PATH, { readonly: true });
});

describe('Database - Seed Data', () => {
  it('has 200+ packages', () => {
    const { count } = db.prepare('SELECT COUNT(*) as count FROM packages').get() as { count: number };
    expect(count).toBeGreaterThanOrEqual(200);
  });

  it('has 4 categories', () => {
    const { count } = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
    expect(count).toBe(4);
  });

  it('has versions', () => {
    const { versions } = db.prepare('SELECT COUNT(*) as versions FROM versions').get() as { versions: number };
    expect(versions).toBeGreaterThanOrEqual(200);
  });

  it('has reviews', () => {
    const { count } = db.prepare('SELECT COUNT(*) as count FROM reviews').get() as { count: number };
    expect(count).toBeGreaterThan(50);
  });
});

describe('Database - Package CRUD', () => {
  it('can query packages by category', () => {
    const rows = db.prepare("SELECT * FROM packages WHERE category = 'mcp-tools' LIMIT 5").all();
    expect(rows.length).toBeGreaterThan(0);
  });

  it('can query packages by name search', () => {
    const rows = db.prepare("SELECT * FROM packages WHERE name LIKE '%GitHub%'").all();
    expect(rows.length).toBeGreaterThan(0);
  });

  it('packages have required fields', () => {
    const pkg = db.prepare('SELECT * FROM packages LIMIT 1').get() as Record<string, unknown>;
    expect(pkg.name).toBeTruthy();
    expect(pkg.slug).toBeTruthy();
    expect(pkg.description).toBeTruthy();
    expect(pkg.category).toBeTruthy();
    expect(pkg.magnet_uri).toBeTruthy();
  });

  it('categories have correct slugs', () => {
    const cats = db.prepare('SELECT slug FROM categories ORDER BY sort_order').all() as Array<{ slug: string }>;
    const slugs = cats.map(c => c.slug);
    expect(slugs).toContain('mcp-tools');
    expect(slugs).toContain('software');
    expect(slugs).toContain('models');
    expect(slugs).toContain('resources');
  });
});

describe('Database - Reviews', () => {
  it('reviews have valid ratings (1-5)', () => {
    const bad = db.prepare('SELECT COUNT(*) as count FROM reviews WHERE rating < 1 OR rating > 5').get() as { count: number };
    expect(bad.count).toBe(0);
  });

  it('package rating matches review average', () => {
    const pkg = db.prepare('SELECT id, rating FROM packages WHERE review_count > 0 LIMIT 1').get() as { id: string; rating: number };
    const { avg } = db.prepare('SELECT AVG(rating) as avg FROM reviews WHERE package_id = ?').get(pkg.id) as { avg: number };
    expect(Math.abs(pkg.rating - avg)).toBeLessThan(0.2);
  });
});

describe('Database - Search', () => {
  it('full-text search on name works', () => {
    const rows = db.prepare("SELECT * FROM packages WHERE name LIKE '%MCP%' AND status = 'published'").all();
    expect(rows.length).toBeGreaterThan(10);
  });

  it('full-text search on tags works', () => {
    const rows = db.prepare("SELECT * FROM packages WHERE tags LIKE '%docker%' AND status = 'published'").all();
    expect(rows.length).toBeGreaterThan(0);
  });

  it('platform filter works', () => {
    const rows = db.prepare("SELECT * FROM packages WHERE platform LIKE '%macos%' AND status = 'published'").all();
    expect(rows.length).toBeGreaterThan(0);
  });

  it('can sort by downloads', () => {
    const rows = db.prepare("SELECT downloads FROM packages WHERE status = 'published' ORDER BY downloads DESC LIMIT 5").all() as Array<{ downloads: number }>;
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i - 1].downloads).toBeGreaterThanOrEqual(rows[i].downloads);
    }
  });
});

describe('Database - Versions', () => {
  it('versions reference valid packages', () => {
    const orphans = db.prepare('SELECT COUNT(*) as count FROM versions v LEFT JOIN packages p ON v.package_id = p.id WHERE p.id IS NULL').get() as { count: number };
    expect(orphans.count).toBe(0);
  });
});
