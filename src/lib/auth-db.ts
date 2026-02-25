import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';

const DB_PATH = path.join(process.cwd(), 'auth.db');

let _db: Database.Database | null = null;

export function getAuthDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    initAuthSchema(_db);
  }
  return _db;
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
