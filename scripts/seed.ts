import Database from 'better-sqlite3';
import path from 'path';
import { randomUUID } from 'crypto';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'clawtools.db');

// Delete existing DB and recreate
if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);

// Ensure data dir exists for analytics
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS packages (
    id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL, long_description TEXT, category TEXT NOT NULL,
    subcategory TEXT, version TEXT NOT NULL, author TEXT NOT NULL,
    license TEXT DEFAULT 'MIT', install TEXT,
    magnet_uri TEXT NOT NULL, info_hash TEXT,
    checksum TEXT, size_bytes INTEGER, size_display TEXT,
    platform TEXT DEFAULT '["any"]', compatibility TEXT DEFAULT '["any"]',
    dependencies TEXT DEFAULT '[]', source_url TEXT, homepage TEXT,
    icon_url TEXT, tags TEXT DEFAULT '[]', llm_summary TEXT,
    downloads INTEGER DEFAULT 0,
    rating REAL DEFAULT 0, review_count INTEGER DEFAULT 0,
    seeders INTEGER DEFAULT 0, status TEXT DEFAULT 'published',
    featured INTEGER DEFAULT 0, created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS versions (
    id TEXT PRIMARY KEY, package_id TEXT NOT NULL REFERENCES packages(id),
    version TEXT NOT NULL, magnet_uri TEXT NOT NULL, checksum TEXT,
    size_bytes INTEGER, changelog TEXT, created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY, package_id TEXT NOT NULL REFERENCES packages(id),
    reviewer TEXT NOT NULL, reviewer_type TEXT DEFAULT 'agent',
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5), review TEXT,
    works_on TEXT DEFAULT '[]', issues TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
    description TEXT, icon TEXT, parent_id TEXT REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0
  );
`);

// Categories
const categories = [
  { id: 'cat-mcp', name: 'MCP Tools', slug: 'mcp-tools', description: 'Model Context Protocol servers and tools for AI agents', icon: '🔧', sort_order: 1 },
  { id: 'cat-skills', name: 'OpenClaw Skills', slug: 'openclaw-skills', description: 'Skills for OpenClaw AI agents', icon: '🐾', sort_order: 2 },
  { id: 'cat-devtools', name: 'Developer Tools', slug: 'dev-tools', description: 'CLI tools and utilities for developers and agents', icon: '🛠️', sort_order: 3 },
  { id: 'cat-software', name: 'Software', slug: 'software', description: 'Applications, dev tools, operating systems, and utilities', icon: '💻', sort_order: 4 },
  { id: 'cat-models', name: 'Models', slug: 'models', description: 'AI/ML models, weights, and fine-tuned variants', icon: '🧠', sort_order: 5 },
  { id: 'cat-resources', name: 'Resources', slug: 'resources', description: 'Configs, templates, datasets, and documentation', icon: '📦', sort_order: 6 },
];

const insertCat = db.prepare('INSERT INTO categories (id, name, slug, description, icon, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
for (const c of categories) {
  insertCat.run(c.id, c.name, c.slug, c.description, c.icon, c.sort_order);
}

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function fakeMagnet(name: string) {
  const hash = Buffer.from(name).toString('hex').padEnd(40, '0').slice(0, 40);
  return `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(name)}`;
}

interface PkgData {
  name: string; description: string; long_description?: string; category: string;
  subcategory?: string; version: string; author: string; license?: string;
  install?: string; magnet_uri?: string; size_bytes?: number; size_display?: string;
  platform?: string[]; compatibility?: string[]; source_url?: string;
  homepage?: string; tags?: string[]; llm_summary?: string;
  downloads?: number; rating?: number; review_count?: number;
  seeders?: number; featured?: number;
}

const insertPkg = db.prepare(`INSERT INTO packages (id, name, slug, description, long_description, category, subcategory, version, author, license, install, magnet_uri, info_hash, checksum, size_bytes, size_display, platform, compatibility, dependencies, source_url, homepage, icon_url, tags, llm_summary, downloads, rating, review_count, seeders, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
const insertVersion = db.prepare('INSERT INTO versions (id, package_id, version, magnet_uri, changelog) VALUES (?, ?, ?, ?, ?)');

function addPkg(data: PkgData) {
  const id = randomUUID();
  const s = slug(data.name);
  const magnet = data.magnet_uri || fakeMagnet(data.name);
  insertPkg.run(
    id, data.name, s, data.description, data.long_description || null,
    data.category, data.subcategory || null, data.version, data.author,
    data.license || 'MIT', data.install || null, magnet, null, null,
    data.size_bytes || null, data.size_display || null,
    JSON.stringify(data.platform || ['any']), JSON.stringify(data.compatibility || ['any']),
    '[]', data.source_url || null, data.homepage || null, null,
    JSON.stringify(data.tags || []), data.llm_summary || null,
    data.downloads || 0, data.rating || 0, data.review_count || 0,
    data.seeders || 0, 'published', data.featured || 0
  );
  insertVersion.run(randomUUID(), id, data.version, magnet, 'Initial release');
  return id;
}

// =====================================================
// 20 REAL PACKAGES — researched, real URLs, real installs
// =====================================================

const packages: PkgData[] = [
  // ---- MCP SERVERS (8) ----
  {
    name: 'Filesystem MCP Server',
    description: 'Secure file operations — read, write, search, and manage files and directories via MCP.',
    category: 'mcp-tools',
    version: '2025.7.1',
    author: 'Anthropic',
    license: 'MIT',
    install: 'npx -y @modelcontextprotocol/server-filesystem /path/to/allowed/dir',
    source_url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem',
    homepage: 'https://modelcontextprotocol.io',
    compatibility: ['claude', 'openai', 'openclaw'],
    tags: ['filesystem', 'files', 'io', 'mcp'],
    llm_summary: 'MCP server for local filesystem access. Provides tools: read_file, write_file, list_directory, search_files, get_file_info, move_file, create_directory. Requires allowed directories as CLI args. Install: npx -y @modelcontextprotocol/server-filesystem /path/to/dir',
    downloads: 95000, featured: 1, seeders: 800,
  },
  {
    name: 'GitHub MCP Server',
    description: 'Access GitHub repos, issues, PRs, branches, and file contents through MCP.',
    category: 'mcp-tools',
    version: '2025.6.18',
    author: 'Anthropic',
    license: 'MIT',
    install: 'npx -y @modelcontextprotocol/server-github',
    source_url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github',
    homepage: 'https://modelcontextprotocol.io',
    compatibility: ['claude', 'openai', 'openclaw'],
    tags: ['github', 'git', 'vcs', 'code', 'mcp'],
    llm_summary: 'MCP server for GitHub API. Tools: create_or_update_file, search_repositories, create_issue, create_pull_request, list_commits, get_file_contents, push_files, fork_repository. Requires GITHUB_PERSONAL_ACCESS_TOKEN env var.',
    downloads: 89000, featured: 1, seeders: 700,
  },
  {
    name: 'Brave Search MCP Server',
    description: 'Web and local search using the Brave Search API via MCP.',
    category: 'mcp-tools',
    version: '2025.6.18',
    author: 'Anthropic',
    license: 'MIT',
    install: 'npx -y @modelcontextprotocol/server-brave-search',
    source_url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search',
    compatibility: ['claude', 'openai', 'openclaw'],
    tags: ['search', 'brave', 'web', 'mcp'],
    llm_summary: 'MCP server for Brave Search API. Tools: brave_web_search (paginated web results), brave_local_search (local business/place results). Requires BRAVE_API_KEY env var. Free tier: 2000 queries/month.',
    downloads: 48000, featured: 1, seeders: 400,
  },
  {
    name: 'SQLite MCP Server',
    description: 'Query and manage SQLite databases with natural language through MCP.',
    category: 'mcp-tools',
    version: '2025.6.18',
    author: 'Anthropic',
    license: 'MIT',
    install: 'npx -y @modelcontextprotocol/server-sqlite --db-path /path/to/db.sqlite',
    source_url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite',
    compatibility: ['claude', 'openai', 'openclaw'],
    tags: ['sqlite', 'database', 'sql', 'mcp'],
    llm_summary: 'MCP server for SQLite databases. Tools: read_query, write_query, create_table, list_tables, describe_table, append_insight. Pass --db-path to specify database file. Read-only mode available with --read-only flag.',
    downloads: 41000, seeders: 350,
  },
  {
    name: 'Puppeteer MCP Server',
    description: 'Browser automation with Puppeteer — navigate, screenshot, click, fill forms via MCP.',
    category: 'mcp-tools',
    version: '2025.6.18',
    author: 'Anthropic',
    license: 'MIT',
    install: 'npx -y @modelcontextprotocol/server-puppeteer',
    source_url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer',
    compatibility: ['claude', 'openai', 'openclaw'],
    tags: ['puppeteer', 'browser', 'automation', 'scraping', 'mcp'],
    llm_summary: 'MCP server for browser automation via Puppeteer. Tools: puppeteer_navigate, puppeteer_screenshot, puppeteer_click, puppeteer_fill, puppeteer_evaluate. Launches headless Chromium. No API key required.',
    downloads: 39000, seeders: 300,
  },
  {
    name: 'Slack MCP Server',
    description: 'Send messages, manage channels, and search Slack workspaces through MCP.',
    category: 'mcp-tools',
    version: '2025.6.18',
    author: 'Anthropic',
    license: 'MIT',
    install: 'npx -y @modelcontextprotocol/server-slack',
    source_url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack',
    compatibility: ['claude', 'openai', 'openclaw'],
    tags: ['slack', 'messaging', 'chat', 'mcp'],
    llm_summary: 'MCP server for Slack API. Tools: slack_list_channels, slack_post_message, slack_reply_to_thread, slack_get_channel_history, slack_search_messages, slack_get_users. Requires SLACK_BOT_TOKEN and SLACK_TEAM_ID env vars.',
    downloads: 67000, featured: 1, seeders: 500,
  },
  {
    name: 'Google Drive MCP Server',
    description: 'Search and read Google Drive files including Docs, Sheets, and PDFs via MCP.',
    category: 'mcp-tools',
    version: '2025.6.18',
    author: 'Anthropic',
    license: 'MIT',
    install: 'npx -y @modelcontextprotocol/server-google-drive',
    source_url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive',
    compatibility: ['claude', 'openai', 'openclaw'],
    tags: ['google', 'drive', 'files', 'storage', 'mcp'],
    llm_summary: 'MCP server for Google Drive. Tools: search (query files), read contents of Docs/Sheets/PDFs. Requires Google Cloud OAuth credentials (client_id, client_secret). Exports Docs as plain text, Sheets as CSV.',
    downloads: 55000, seeders: 400,
  },
  {
    name: 'PostgreSQL MCP Server',
    description: 'Query PostgreSQL databases with read-only access through MCP.',
    category: 'mcp-tools',
    version: '2025.6.18',
    author: 'Anthropic',
    license: 'MIT',
    install: 'npx -y @modelcontextprotocol/server-postgres postgresql://user:pass@localhost/dbname',
    source_url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres',
    compatibility: ['claude', 'openai', 'openclaw'],
    tags: ['postgres', 'database', 'sql', 'mcp'],
    llm_summary: 'MCP server for PostgreSQL. Provides read-only database access. Tools: query (run SELECT statements). Resources: table schemas exposed as mcp resources. Pass connection string as CLI argument.',
    downloads: 72000, featured: 1, seeders: 500,
  },

  // ---- OPENCLAW SKILLS (5) ----
  {
    name: 'OpenClaw Weather Skill',
    description: 'Get weather forecasts and current conditions for any location worldwide.',
    category: 'openclaw-skills',
    version: '1.0.0',
    author: 'OpenClaw',
    license: 'MIT',
    install: 'openclaw skill install weather',
    source_url: 'https://github.com/openclaw-ai/skills',
    compatibility: ['openclaw'],
    tags: ['weather', 'forecast', 'location'],
    llm_summary: 'OpenClaw skill for weather data. Uses NWS API (US) and Open-Meteo (global). No API key required. Returns current conditions, hourly forecast, and 7-day outlook as structured JSON.',
    downloads: 20000, seeders: 100,
  },
  {
    name: 'OpenClaw GitHub Skill',
    description: 'Manage GitHub repositories, issues, and PRs from your OpenClaw agent.',
    category: 'openclaw-skills',
    version: '1.0.0',
    author: 'OpenClaw',
    license: 'MIT',
    install: 'openclaw skill install github',
    source_url: 'https://github.com/openclaw-ai/skills',
    compatibility: ['openclaw'],
    tags: ['github', 'git', 'code'],
    llm_summary: 'OpenClaw skill wrapping GitHub API. Manage repos, issues, PRs, and code search. Requires GITHUB_TOKEN. Integrates with OpenClaw agent memory for context-aware operations.',
    downloads: 15000, seeders: 80,
  },
  {
    name: 'OpenClaw 1Password Skill',
    description: 'Securely access 1Password vaults and items from your OpenClaw agent.',
    category: 'openclaw-skills',
    version: '1.0.0',
    author: 'OpenClaw',
    license: 'MIT',
    install: 'openclaw skill install 1password',
    source_url: 'https://github.com/openclaw-ai/skills',
    compatibility: ['openclaw'],
    tags: ['1password', 'security', 'secrets', 'passwords'],
    llm_summary: 'OpenClaw skill for 1Password integration via 1Password CLI (op). Read vault items, lookup credentials, and list vaults. Requires 1Password CLI installed and authenticated.',
    downloads: 8000, seeders: 50,
  },
  {
    name: 'OpenClaw Discord Skill',
    description: 'Send messages, manage servers, and interact with Discord communities.',
    category: 'openclaw-skills',
    version: '1.0.0',
    author: 'OpenClaw',
    license: 'MIT',
    install: 'openclaw skill install discord',
    source_url: 'https://github.com/openclaw-ai/skills',
    compatibility: ['openclaw'],
    tags: ['discord', 'chat', 'community', 'messaging'],
    llm_summary: 'OpenClaw skill for Discord bot integration. Send/read messages, manage channels, react to messages. Requires DISCORD_BOT_TOKEN. Supports text channels and DMs.',
    downloads: 12000, seeders: 60,
  },
  {
    name: 'Video Quote Finder',
    description: 'Search video transcripts to find exact quotes and timestamps.',
    category: 'openclaw-skills',
    version: '0.9.0',
    author: 'OpenClaw',
    license: 'MIT',
    install: 'openclaw skill install video-quote-finder',
    source_url: 'https://github.com/openclaw-ai/skills',
    compatibility: ['openclaw'],
    tags: ['video', 'quotes', 'transcripts', 'search', 'youtube'],
    llm_summary: 'OpenClaw skill that searches YouTube video transcripts for specific quotes. Returns exact timestamps and surrounding context. Uses yt-dlp for transcript extraction. No API key needed.',
    downloads: 5000, seeders: 30,
  },

  // ---- DEVELOPER TOOLS (5) ----
  {
    name: 'yt-dlp',
    description: 'Feature-rich command-line audio/video downloader. Supports YouTube, Twitter, and 1000+ sites.',
    category: 'dev-tools',
    version: '2026.01.31',
    author: 'yt-dlp',
    license: 'Unlicense',
    install: 'pip install yt-dlp  # or: brew install yt-dlp',
    source_url: 'https://github.com/yt-dlp/yt-dlp',
    homepage: 'https://github.com/yt-dlp/yt-dlp',
    platform: ['macos', 'linux', 'windows'],
    tags: ['youtube', 'video', 'download', 'audio', 'cli'],
    llm_summary: 'CLI video/audio downloader supporting 1000+ sites. Fork of youtube-dl with active development. Install: pip install yt-dlp or brew install yt-dlp. Key flags: -x (audio only), -f (format), --write-subs, -o (output template).',
    downloads: 275000, featured: 1, seeders: 1200,
  },
  {
    name: 'ffmpeg',
    description: 'Universal media toolkit — convert, stream, record, and process any audio/video format.',
    category: 'dev-tools',
    version: '7.1',
    author: 'FFmpeg Team',
    license: 'LGPL/GPL',
    install: 'brew install ffmpeg  # or: apt install ffmpeg',
    source_url: 'https://github.com/FFmpeg/FFmpeg',
    homepage: 'https://ffmpeg.org',
    platform: ['macos', 'linux', 'windows'],
    tags: ['ffmpeg', 'video', 'audio', 'media', 'conversion', 'cli'],
    llm_summary: 'Swiss army knife for media processing. Convert formats, extract audio, resize video, add subtitles, stream. Install: brew install ffmpeg (macOS), apt install ffmpeg (Ubuntu). Commonly used with: -i input, -c:v codec, -c:a codec.',
    downloads: 275000, seeders: 1200,
  },
  {
    name: 'ImageMagick',
    description: 'Create, edit, compose, or convert images from the command line. Supports 200+ formats.',
    category: 'dev-tools',
    version: '7.1.1-43',
    author: 'ImageMagick Studio LLC',
    license: 'Apache-2.0',
    install: 'brew install imagemagick  # or: apt install imagemagick',
    source_url: 'https://github.com/ImageMagick/ImageMagick',
    homepage: 'https://imagemagick.org',
    platform: ['macos', 'linux', 'windows'],
    tags: ['imagemagick', 'images', 'conversion', 'graphics', 'cli'],
    llm_summary: 'CLI image processing tool. Resize, crop, rotate, convert between 200+ formats, add text/watermarks, create GIFs. Commands: magick convert, magick identify, magick composite. Install: brew install imagemagick.',
    downloads: 145000, seeders: 600,
  },
  {
    name: 'jq',
    description: 'Lightweight and flexible command-line JSON processor.',
    category: 'dev-tools',
    version: '1.7.1',
    author: 'Stephen Dolan',
    license: 'MIT',
    install: 'brew install jq  # or: apt install jq',
    source_url: 'https://github.com/jqlang/jq',
    homepage: 'https://jqlang.github.io/jq/',
    platform: ['macos', 'linux', 'windows'],
    tags: ['jq', 'json', 'cli', 'parser', 'filter'],
    llm_summary: 'CLI JSON processor. Slice, filter, map, and transform structured data. Pipe JSON in and get formatted output. Key syntax: .field, .[] (iterate), select(), map(), keys. Install: brew install jq or apt install jq.',
    downloads: 200000, seeders: 600,
  },
  {
    name: 'ripgrep',
    description: 'Blazingly fast line-oriented search tool — a better, faster grep.',
    category: 'dev-tools',
    version: '14.1.1',
    author: 'Andrew Gallant',
    license: 'MIT',
    install: 'brew install ripgrep  # or: apt install ripgrep  # binary: rg',
    source_url: 'https://github.com/BurntSushi/ripgrep',
    platform: ['macos', 'linux', 'windows'],
    tags: ['ripgrep', 'rg', 'search', 'grep', 'cli'],
    llm_summary: 'Fast recursive search tool (command: rg). Respects .gitignore, supports regex, searches compressed files. 2-5x faster than grep. Install: brew install ripgrep. Usage: rg "pattern" /path. Key flags: -i (case-insensitive), -l (files only), -t (file type).',
    downloads: 165000, seeders: 550,
  },
  {
    name: 'Memory MCP Server',
    description: 'Persistent memory and knowledge graph for AI agents using a local JSON file.',
    category: 'mcp-tools',
    version: '2025.6.18',
    author: 'Anthropic',
    license: 'MIT',
    install: 'npx -y @modelcontextprotocol/server-memory',
    source_url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/memory',
    compatibility: ['claude', 'openai', 'openclaw'],
    tags: ['memory', 'knowledge-graph', 'persistence', 'mcp'],
    llm_summary: 'MCP server for persistent agent memory via a knowledge graph stored in a local JSON file. Tools: create_entities, create_relations, search_nodes, open_nodes, delete_entities. Stores in memory.json by default.',
    downloads: 56000, featured: 1, seeders: 450,
  },
  {
    name: 'Fetch MCP Server',
    description: 'Fetch and extract content from URLs — web pages, APIs, and raw data via MCP.',
    category: 'mcp-tools',
    version: '2025.6.18',
    author: 'Anthropic',
    license: 'MIT',
    install: 'npx -y @modelcontextprotocol/server-fetch',
    source_url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/fetch',
    compatibility: ['claude', 'openai', 'openclaw'],
    tags: ['fetch', 'http', 'web', 'api', 'scraping', 'mcp'],
    llm_summary: 'MCP server for fetching web content. Tools: fetch (get URL content as markdown, text, or raw HTML). Supports User-Agent customization, robots.txt checking, and content size limits. No API key required.',
    downloads: 71000, seeders: 550,
  },
];

// Insert all
const insertAll = db.transaction(() => {
  for (const pkg of packages) {
    addPkg(pkg);
  }
});
insertAll();

const totalPkgs = (db.prepare('SELECT COUNT(*) as c FROM packages').get() as { c: number }).c;
const totalVersions = (db.prepare('SELECT COUNT(*) as c FROM versions').get() as { c: number }).c;

console.log(`✅ Seeded database with:`);
console.log(`   📦 ${totalPkgs} packages`);
console.log(`   🏷️  ${totalVersions} versions`);
console.log(`   📁 ${categories.length} categories`);

db.close();
