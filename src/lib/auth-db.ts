import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'auth.db');
const AUTH_DB_PATH = path.join(process.cwd(), 'data', 'auth.db');

let _db: Database.Database | null = null;
let _authDb: Database.Database | null = null;

export function getAuthDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    initAuthSchema(_db);
  }
  return _db;
}

export function getOrgAuthDb(): Database.Database {
  if (!_authDb) {
    _authDb = new Database(AUTH_DB_PATH);
    _authDb.pragma('journal_mode = WAL');
    _authDb.pragma('foreign_keys = ON');
    initOrgAuthSchema(_authDb);
  }
  return _authDb;
}

function initAuthSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      org_name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL
    );

    CREATE TABLE IF NOT EXISTS roster_agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      name TEXT NOT NULL,
      emoji TEXT DEFAULT '🤖',
      title TEXT,
      description TEXT,
      loadout_slug TEXT NOT NULL,
      autonomy_level TEXT DEFAULT 'assistant',
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS agent_equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id INTEGER NOT NULL REFERENCES roster_agents(id),
      tool_name TEXT NOT NULL,
      tool_category TEXT,
      is_active INTEGER DEFAULT 1,
      equipped_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function initOrgAuthSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS orgs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      org_key TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL REFERENCES orgs(id),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      api_token TEXT UNIQUE NOT NULL,
      scopes TEXT NOT NULL DEFAULT 'browse',
      credits INTEGER NOT NULL DEFAULT 10,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS org_sessions (
      id TEXT PRIMARY KEY,
      org_id TEXT,
      agent_id TEXT,
      token TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS credit_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id TEXT NOT NULL REFERENCES agents(id),
      amount INTEGER NOT NULL,
      reason TEXT NOT NULL,
      package_slug TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// --- Org Auth Functions ---

export function createOrg(name: string, email: string, password: string): { id: string; org_key: string } | { error: string } {
  const db = getOrgAuthDb();
  const existing = db.prepare('SELECT id FROM orgs WHERE email = ?').get(email);
  if (existing) return { error: 'Email already registered' };
  const id = crypto.randomUUID();
  const org_key = crypto.randomBytes(32).toString('hex');
  const password_hash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO orgs (id, name, email, password_hash, org_key) VALUES (?, ?, ?, ?, ?)').run(id, name, email, password_hash, org_key);
  return { id, org_key };
}

export function getOrgByEmail(email: string) {
  const db = getOrgAuthDb();
  return db.prepare('SELECT * FROM orgs WHERE email = ?').get(email) as { id: string; name: string; email: string; password_hash: string; org_key: string; created_at: string } | undefined;
}

export function getOrgById(id: string) {
  const db = getOrgAuthDb();
  return db.prepare('SELECT id, name, email, org_key, created_at FROM orgs WHERE id = ?').get(id) as { id: string; name: string; email: string; org_key: string; created_at: string } | undefined;
}

export function getOrgByKey(orgKey: string) {
  const db = getOrgAuthDb();
  return db.prepare('SELECT id, name, email, org_key, created_at FROM orgs WHERE org_key = ?').get(orgKey) as { id: string; name: string; email: string; org_key: string; created_at: string } | undefined;
}

export function verifyOrgPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function createOrgSession(orgId: string): string {
  const db = getOrgAuthDb();
  const id = crypto.randomUUID();
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  db.prepare('INSERT INTO org_sessions (id, org_id, token, type, expires_at) VALUES (?, ?, ?, ?, ?)').run(id, orgId, token, 'human', expires);
  return token;
}

export function getOrgSessionByToken(token: string) {
  const db = getOrgAuthDb();
  return db.prepare(`
    SELECT o.id, o.name, o.email, o.org_key, o.created_at, s.type
    FROM org_sessions s JOIN orgs o ON s.org_id = o.id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token) as { id: string; name: string; email: string; org_key: string; created_at: string; type: string } | undefined;
}

export function deleteOrgSession(token: string) {
  const db = getOrgAuthDb();
  db.prepare('DELETE FROM org_sessions WHERE token = ?').run(token);
}

// --- Agent Functions ---

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function registerAgent(orgKey: string, agentName: string): { id: string; slug: string; api_token: string; credits: number } | { error: string } {
  const org = getOrgByKey(orgKey);
  if (!org) return { error: 'Invalid org key' };
  const db = getOrgAuthDb();
  const id = crypto.randomUUID();
  let slug = slugify(agentName);
  // Ensure unique slug
  const existing = db.prepare('SELECT id FROM agents WHERE slug = ?').get(slug);
  if (existing) slug = `${slug}-${crypto.randomBytes(3).toString('hex')}`;
  const api_token = crypto.randomBytes(32).toString('hex');
  const credits = 10;
  db.prepare('INSERT INTO agents (id, org_id, name, slug, api_token, credits) VALUES (?, ?, ?, ?, ?, ?)').run(id, org.id, agentName, slug, api_token, credits);
  // Record signup bonus
  db.prepare('INSERT INTO credit_transactions (agent_id, amount, reason) VALUES (?, ?, ?)').run(id, credits, 'signup_bonus');
  return { id, slug, api_token, credits };
}

export function getAgentByToken(token: string) {
  const db = getOrgAuthDb();
  return db.prepare('SELECT a.*, o.name as org_name FROM agents a JOIN orgs o ON a.org_id = o.id WHERE a.api_token = ?').get(token) as {
    id: string; org_id: string; name: string; slug: string; api_token: string; scopes: string; credits: number; created_at: string; org_name: string;
  } | undefined;
}

export function getAgentsByOrg(orgId: string) {
  const db = getOrgAuthDb();
  return db.prepare('SELECT id, name, slug, scopes, credits, created_at FROM agents WHERE org_id = ? ORDER BY created_at DESC').all(orgId) as Array<{
    id: string; name: string; slug: string; scopes: string; credits: number; created_at: string;
  }>;
}

export function getAgentCredits(agentId: string): number {
  const db = getOrgAuthDb();
  const row = db.prepare('SELECT credits FROM agents WHERE id = ?').get(agentId) as { credits: number } | undefined;
  return row?.credits ?? 0;
}

export function spendCredits(agentId: string, amount: number, reason: string, packageSlug?: string): boolean {
  const db = getOrgAuthDb();
  const agent = db.prepare('SELECT credits FROM agents WHERE id = ?').get(agentId) as { credits: number } | undefined;
  if (!agent || agent.credits < amount) return false;
  db.prepare('UPDATE agents SET credits = credits - ? WHERE id = ?').run(amount, agentId);
  db.prepare('INSERT INTO credit_transactions (agent_id, amount, reason, package_slug) VALUES (?, ?, ?, ?)').run(agentId, -amount, reason, packageSlug || null);
  return true;
}

export function earnCredits(agentId: string, amount: number, reason: string, packageSlug?: string): boolean {
  const db = getOrgAuthDb();
  const agent = db.prepare('SELECT id FROM agents WHERE id = ?').get(agentId);
  if (!agent) return false;
  db.prepare('UPDATE agents SET credits = credits + ? WHERE id = ?').run(amount, agentId);
  db.prepare('INSERT INTO credit_transactions (agent_id, amount, reason, package_slug) VALUES (?, ?, ?, ?)').run(agentId, amount, reason, packageSlug || null);
  return true;
}

export function getCreditHistory(agentId: string, limit = 50) {
  const db = getOrgAuthDb();
  return db.prepare('SELECT * FROM credit_transactions WHERE agent_id = ? ORDER BY created_at DESC LIMIT ?').all(agentId, limit);
}

// Password hashing using scrypt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  const verify = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === verify;
}

// Session management
export function createSession(userId: number): string {
  const db = getAuthDb();
  const id = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
  db.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)').run(id, userId, expires);
  return id;
}

export function getSessionUser(sessionId: string): { id: number; name: string; email: string; org_name: string } | null {
  const db = getAuthDb();
  const row = db.prepare(`
    SELECT u.id, u.name, u.email, u.org_name FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ? AND s.expires_at > datetime('now')
  `).get(sessionId) as { id: number; name: string; email: string; org_name: string } | undefined;
  return row || null;
}

export function deleteSession(sessionId: string) {
  const db = getAuthDb();
  db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
}

// User CRUD
export function createUser(name: string, email: string, password: string, orgName: string): { id: number } | { error: string } {
  const db = getAuthDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return { error: 'Email already registered' };
  const hash = hashPassword(password);
  const result = db.prepare('INSERT INTO users (name, email, password_hash, org_name) VALUES (?, ?, ?, ?)').run(name, email, hash, orgName);
  return { id: result.lastInsertRowid as number };
}

export function getUserByEmail(email: string): { id: number; name: string; email: string; password_hash: string; org_name: string } | null {
  const db = getAuthDb();
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as { id: number; name: string; email: string; password_hash: string; org_name: string } | null;
}

// Roster CRUD
export function getRosterAgents(userId: number) {
  const db = getAuthDb();
  return db.prepare('SELECT * FROM roster_agents WHERE user_id = ? ORDER BY created_at DESC').all(userId);
}

export function getRosterAgent(agentId: number, userId: number) {
  const db = getAuthDb();
  return db.prepare('SELECT * FROM roster_agents WHERE id = ? AND user_id = ?').get(agentId, userId);
}

export function createRosterAgent(data: { user_id: number; name: string; emoji: string; title?: string; description?: string; loadout_slug: string; autonomy_level: string }) {
  const db = getAuthDb();
  const result = db.prepare(
    'INSERT INTO roster_agents (user_id, name, emoji, title, description, loadout_slug, autonomy_level) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(data.user_id, data.name, data.emoji, data.title || null, data.description || null, data.loadout_slug, data.autonomy_level);
  return { id: result.lastInsertRowid as number };
}

export function updateRosterAgent(agentId: number, userId: number, data: Partial<{ name: string; emoji: string; title: string; description: string; autonomy_level: string; status: string }>) {
  const db = getAuthDb();
  const fields: string[] = [];
  const values: unknown[] = [];
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) { fields.push(`${key} = ?`); values.push(val); }
  }
  if (fields.length === 0) return;
  values.push(agentId, userId);
  db.prepare(`UPDATE roster_agents SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`).run(...values);
}

export function deleteRosterAgent(agentId: number, userId: number) {
  const db = getAuthDb();
  db.prepare('DELETE FROM agent_equipment WHERE agent_id = ?').run(agentId);
  db.prepare('DELETE FROM roster_agents WHERE id = ? AND user_id = ?').run(agentId, userId);
}

// Equipment CRUD
export function getAgentEquipment(agentId: number) {
  const db = getAuthDb();
  return db.prepare('SELECT * FROM agent_equipment WHERE agent_id = ? ORDER BY equipped_at').all(agentId);
}

export function addEquipment(agentId: number, toolName: string, toolCategory?: string) {
  const db = getAuthDb();
  const existing = db.prepare('SELECT id FROM agent_equipment WHERE agent_id = ? AND tool_name = ?').get(agentId, toolName);
  if (existing) return existing;
  const result = db.prepare('INSERT INTO agent_equipment (agent_id, tool_name, tool_category) VALUES (?, ?, ?)').run(agentId, toolName, toolCategory || null);
  return { id: result.lastInsertRowid };
}

export function toggleEquipment(equipmentId: number, isActive: boolean) {
  const db = getAuthDb();
  db.prepare('UPDATE agent_equipment SET is_active = ? WHERE id = ?').run(isActive ? 1 : 0, equipmentId);
}

export function removeEquipment(equipmentId: number) {
  const db = getAuthDb();
  db.prepare('DELETE FROM agent_equipment WHERE id = ?').run(equipmentId);
}
