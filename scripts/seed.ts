import Database from 'better-sqlite3';
import path from 'path';
import { randomUUID } from 'crypto';

const DB_PATH = path.join(process.cwd(), 'clawtools.db');

// Delete existing DB and recreate
const fs = require('fs');
if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create schema
db.exec(`
  CREATE TABLE IF NOT EXISTS packages (
    id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL, long_description TEXT, category TEXT NOT NULL,
    subcategory TEXT, version TEXT NOT NULL, author TEXT NOT NULL,
    license TEXT DEFAULT 'MIT', magnet_uri TEXT NOT NULL, info_hash TEXT,
    checksum TEXT, size_bytes INTEGER, size_display TEXT,
    platform TEXT DEFAULT '["any"]', compatibility TEXT DEFAULT '["any"]',
    dependencies TEXT DEFAULT '[]', source_url TEXT, homepage TEXT,
    icon_url TEXT, tags TEXT DEFAULT '[]', downloads INTEGER DEFAULT 0,
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
  { id: 'cat-software', name: 'Software', slug: 'software', description: 'Applications, dev tools, operating systems, and utilities', icon: '💻', sort_order: 2 },
  { id: 'cat-models', name: 'Models', slug: 'models', description: 'AI/ML models, weights, and fine-tuned variants', icon: '🧠', sort_order: 3 },
  { id: 'cat-resources', name: 'Resources', slug: 'resources', description: 'Configs, templates, datasets, and documentation', icon: '📦', sort_order: 4 },
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
  return `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(name)}&tr=wss://tracker.webtorrent.dev&tr=wss://tracker.openwebtorrent.com`;
}

const insertPkg = db.prepare(`INSERT INTO packages (id, name, slug, description, long_description, category, subcategory, version, author, license, magnet_uri, info_hash, checksum, size_bytes, size_display, platform, compatibility, dependencies, source_url, homepage, icon_url, tags, downloads, rating, review_count, seeders, status, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

const insertVersion = db.prepare('INSERT INTO versions (id, package_id, version, magnet_uri, changelog) VALUES (?, ?, ?, ?, ?)');
const insertReview = db.prepare('INSERT INTO reviews (id, package_id, reviewer, reviewer_type, rating, review, works_on) VALUES (?, ?, ?, ?, ?, ?, ?)');

interface PkgData {
  name: string; description: string; long_description?: string; category: string;
  subcategory?: string; version: string; author: string; license?: string;
  magnet_uri?: string; size_bytes?: number; size_display?: string;
  platform?: string[]; compatibility?: string[]; source_url?: string;
  homepage?: string; tags?: string[]; downloads?: number; rating?: number;
  review_count?: number; seeders?: number; featured?: number;
}

function addPkg(data: PkgData) {
  const id = randomUUID();
  const s = slug(data.name);
  const magnet = data.magnet_uri || fakeMagnet(data.name);
  insertPkg.run(
    id, data.name, s, data.description, data.long_description || null,
    data.category, data.subcategory || null, data.version, data.author,
    data.license || 'MIT', magnet, null, null,
    data.size_bytes || null, data.size_display || null,
    JSON.stringify(data.platform || ['any']), JSON.stringify(data.compatibility || ['any']),
    '[]', data.source_url || null, data.homepage || null, null,
    JSON.stringify(data.tags || []), data.downloads || Math.floor(Math.random() * 50000),
    data.rating || +(3.5 + Math.random() * 1.5).toFixed(1),
    data.review_count || Math.floor(Math.random() * 200),
    data.seeders || Math.floor(Math.random() * 500),
    'published', data.featured || 0
  );
  // Add initial version
  insertVersion.run(randomUUID(), id, data.version, magnet, 'Initial release');
  return id;
}

// ==================== MCP TOOLS (60+) ====================
const mcpTools: PkgData[] = [
  { name: 'GitHub MCP Server', description: 'Access GitHub repos, issues, PRs, and actions through MCP', category: 'mcp-tools', version: '1.2.0', author: 'modelcontextprotocol', source_url: 'https://github.com/modelcontextprotocol/servers', tags: ['github', 'git', 'vcs', 'code'], downloads: 89000, featured: 1, compatibility: ['claude', 'gpt', 'gemini', 'openclaw'] },
  { name: 'Slack MCP Server', description: 'Send messages, manage channels, and search Slack workspaces', category: 'mcp-tools', version: '1.1.0', author: 'modelcontextprotocol', source_url: 'https://github.com/modelcontextprotocol/servers', tags: ['slack', 'messaging', 'chat'], downloads: 67000, featured: 1 },
  { name: 'Google Drive MCP', description: 'Read, write, and manage Google Drive files and folders', category: 'mcp-tools', version: '1.0.3', author: 'modelcontextprotocol', source_url: 'https://github.com/modelcontextprotocol/servers', tags: ['google', 'drive', 'files', 'storage'], downloads: 55000 },
  { name: 'PostgreSQL MCP', description: 'Query and manage PostgreSQL databases with natural language', category: 'mcp-tools', version: '2.0.1', author: 'modelcontextprotocol', source_url: 'https://github.com/modelcontextprotocol/servers', tags: ['postgres', 'database', 'sql'], downloads: 72000, featured: 1 },
  { name: 'Home Assistant MCP', description: 'Control smart home devices, automations, and scenes via Home Assistant', category: 'mcp-tools', version: '1.3.0', author: 'jango-blockchained', source_url: 'https://github.com/jango-blockchained/ha-mcp', tags: ['home-assistant', 'iot', 'smart-home', 'automation'], downloads: 45000 },
  { name: 'Spotify MCP', description: 'Control Spotify playback, search music, manage playlists', category: 'mcp-tools', version: '1.0.2', author: 'varunneal', source_url: 'https://github.com/varunneal/spotify-mcp', tags: ['spotify', 'music', 'audio'], downloads: 38000 },
  { name: 'Notion MCP', description: 'Create and manage Notion pages, databases, and blocks', category: 'mcp-tools', version: '1.1.0', author: 'modelcontextprotocol', tags: ['notion', 'notes', 'productivity'], downloads: 52000 },
  { name: 'Linear MCP', description: 'Manage Linear issues, projects, and cycles', category: 'mcp-tools', version: '1.0.1', author: 'jerhadf', source_url: 'https://github.com/jerhadf/linear-mcp-server', tags: ['linear', 'project-management', 'issues'], downloads: 31000 },
  { name: 'Browser Automation MCP', description: 'Control web browsers with Playwright for testing and scraping', category: 'mcp-tools', version: '1.2.1', author: 'anthropics', source_url: 'https://github.com/anthropics/mcp-server-playwright', tags: ['browser', 'playwright', 'automation', 'testing'], downloads: 61000, featured: 1 },
  { name: 'Filesystem MCP', description: 'Read, write, and manage local files and directories', category: 'mcp-tools', version: '1.0.0', author: 'modelcontextprotocol', source_url: 'https://github.com/modelcontextprotocol/servers', tags: ['filesystem', 'files', 'io'], downloads: 95000 },
  { name: 'Docker MCP', description: 'Manage Docker containers, images, and compose stacks', category: 'mcp-tools', version: '1.1.0', author: 'ckreiling', source_url: 'https://github.com/ckreiling/mcp-server-docker', tags: ['docker', 'containers', 'devops'], downloads: 43000 },
  { name: 'Puppeteer MCP', description: 'Browser automation with Puppeteer for web scraping and testing', category: 'mcp-tools', version: '1.0.4', author: 'anthropics', tags: ['puppeteer', 'browser', 'scraping'], downloads: 39000 },
  { name: 'Brave Search MCP', description: 'Search the web using Brave Search API', category: 'mcp-tools', version: '1.0.2', author: 'modelcontextprotocol', tags: ['search', 'brave', 'web'], downloads: 48000 },
  { name: 'Fetch MCP', description: 'Fetch and parse web pages, APIs, and RSS feeds', category: 'mcp-tools', version: '1.0.1', author: 'modelcontextprotocol', tags: ['fetch', 'http', 'web', 'api'], downloads: 71000 },
  { name: 'Memory MCP', description: 'Persistent memory and knowledge graph for AI agents', category: 'mcp-tools', version: '1.1.0', author: 'modelcontextprotocol', tags: ['memory', 'knowledge', 'persistence'], downloads: 56000, featured: 1 },
  { name: 'Sentry MCP', description: 'Monitor errors and performance with Sentry integration', category: 'mcp-tools', version: '1.0.0', author: 'getsentry', source_url: 'https://github.com/getsentry/sentry-mcp', tags: ['sentry', 'monitoring', 'errors'], downloads: 22000 },
  { name: 'Stripe MCP', description: 'Manage payments, subscriptions, and invoices with Stripe', category: 'mcp-tools', version: '1.0.1', author: 'stripe', tags: ['stripe', 'payments', 'billing'], downloads: 28000 },
  { name: 'AWS MCP', description: 'Manage AWS services - EC2, S3, Lambda, and more', category: 'mcp-tools', version: '1.2.0', author: 'aws-samples', tags: ['aws', 'cloud', 'infrastructure'], downloads: 35000 },
  { name: 'Cloudflare MCP', description: 'Manage Cloudflare Workers, DNS, and CDN settings', category: 'mcp-tools', version: '1.0.0', author: 'cloudflare', tags: ['cloudflare', 'cdn', 'dns', 'workers'], downloads: 19000 },
  { name: 'Twilio MCP', description: 'Send SMS, make calls, and manage phone numbers with Twilio', category: 'mcp-tools', version: '1.0.0', author: 'twilio', tags: ['twilio', 'sms', 'voice', 'communication'], downloads: 15000 },
  { name: 'Supabase MCP', description: 'Manage Supabase databases, auth, and storage', category: 'mcp-tools', version: '1.0.2', author: 'supabase', tags: ['supabase', 'database', 'auth', 'storage'], downloads: 33000 },
  { name: 'Firebase MCP', description: 'Interact with Firebase Firestore, Auth, and Cloud Functions', category: 'mcp-tools', version: '1.0.1', author: 'firebase', tags: ['firebase', 'google', 'database'], downloads: 25000 },
  { name: 'Vercel MCP', description: 'Deploy and manage Vercel projects and serverless functions', category: 'mcp-tools', version: '1.0.0', author: 'vercel', tags: ['vercel', 'deployment', 'serverless'], downloads: 21000 },
  { name: 'Redis MCP', description: 'Interact with Redis for caching and pub/sub messaging', category: 'mcp-tools', version: '1.0.0', author: 'redis', tags: ['redis', 'cache', 'pubsub'], downloads: 29000 },
  { name: 'MongoDB MCP', description: 'Query and manage MongoDB collections and documents', category: 'mcp-tools', version: '1.0.1', author: 'mongodb', tags: ['mongodb', 'nosql', 'database'], downloads: 31000 },
  { name: 'Jira MCP', description: 'Create and manage Jira issues, sprints, and boards', category: 'mcp-tools', version: '1.0.0', author: 'atlassian-labs', tags: ['jira', 'project-management', 'agile'], downloads: 27000 },
  { name: 'Confluence MCP', description: 'Search and edit Confluence wiki pages', category: 'mcp-tools', version: '1.0.0', author: 'atlassian-labs', tags: ['confluence', 'wiki', 'documentation'], downloads: 18000 },
  { name: 'Gmail MCP', description: 'Read, compose, and manage Gmail messages', category: 'mcp-tools', version: '1.0.2', author: 'anthropics', tags: ['gmail', 'email', 'google'], downloads: 42000 },
  { name: 'Calendar MCP', description: 'Manage Google Calendar events and schedules', category: 'mcp-tools', version: '1.0.0', author: 'anthropics', tags: ['calendar', 'google', 'scheduling'], downloads: 36000 },
  { name: 'Obsidian MCP', description: 'Read and write Obsidian vault notes and manage links', category: 'mcp-tools', version: '1.0.1', author: 'smithery-ai', tags: ['obsidian', 'notes', 'markdown'], downloads: 24000 },
  { name: 'VS Code MCP', description: 'Control VS Code editor - open files, run commands, manage extensions', category: 'mcp-tools', version: '1.0.0', author: 'anthropics', tags: ['vscode', 'editor', 'ide'], downloads: 47000 },
  { name: 'Kubernetes MCP', description: 'Manage Kubernetes clusters, pods, and deployments', category: 'mcp-tools', version: '1.0.0', author: 'k8s-contrib', tags: ['kubernetes', 'k8s', 'containers', 'orchestration'], downloads: 26000 },
  { name: 'Terraform MCP', description: 'Plan and apply Terraform infrastructure changes', category: 'mcp-tools', version: '1.0.0', author: 'hashicorp', tags: ['terraform', 'iac', 'infrastructure'], downloads: 20000 },
  { name: 'SQLite MCP', description: 'Query and manage SQLite databases', category: 'mcp-tools', version: '1.0.0', author: 'modelcontextprotocol', tags: ['sqlite', 'database', 'sql'], downloads: 41000 },
  { name: 'Airtable MCP', description: 'Read and write Airtable bases and records', category: 'mcp-tools', version: '1.0.0', author: 'airtable', tags: ['airtable', 'spreadsheet', 'database'], downloads: 16000 },
  { name: 'Discord MCP', description: 'Send messages, manage servers, and moderate Discord communities', category: 'mcp-tools', version: '1.0.1', author: 'community', tags: ['discord', 'chat', 'community'], downloads: 34000 },
  { name: 'Telegram MCP', description: 'Send and receive Telegram messages and manage bots', category: 'mcp-tools', version: '1.0.0', author: 'community', tags: ['telegram', 'messaging', 'bots'], downloads: 23000 },
  { name: 'Twitter/X MCP', description: 'Post tweets, search, and manage Twitter/X accounts', category: 'mcp-tools', version: '1.0.0', author: 'community', tags: ['twitter', 'x', 'social-media'], downloads: 30000 },
  { name: 'YouTube MCP', description: 'Search videos, get transcripts, and manage YouTube data', category: 'mcp-tools', version: '1.0.0', author: 'community', tags: ['youtube', 'video', 'transcripts'], downloads: 28000 },
  { name: 'Pinecone MCP', description: 'Manage Pinecone vector database for semantic search', category: 'mcp-tools', version: '1.0.0', author: 'pinecone-io', tags: ['pinecone', 'vector-db', 'embeddings', 'search'], downloads: 19000 },
  { name: 'Weaviate MCP', description: 'Vector search and hybrid queries with Weaviate', category: 'mcp-tools', version: '1.0.0', author: 'weaviate', tags: ['weaviate', 'vector-db', 'search'], downloads: 14000 },
  { name: 'Figma MCP', description: 'Read Figma designs, extract components and styles', category: 'mcp-tools', version: '1.0.0', author: 'community', tags: ['figma', 'design', 'ui'], downloads: 21000 },
  { name: 'Shopify MCP', description: 'Manage Shopify stores, products, orders, and inventory', category: 'mcp-tools', version: '1.0.0', author: 'shopify', tags: ['shopify', 'ecommerce', 'store'], downloads: 17000 },
  { name: 'Todoist MCP', description: 'Manage tasks and projects in Todoist', category: 'mcp-tools', version: '1.0.0', author: 'community', tags: ['todoist', 'tasks', 'productivity'], downloads: 13000 },
  { name: 'Anthropic MCP', description: 'Call Claude models directly from MCP context', category: 'mcp-tools', version: '1.0.0', author: 'anthropics', tags: ['anthropic', 'claude', 'llm'], downloads: 51000 },
  { name: 'OpenAI MCP', description: 'Access GPT models and DALL-E from MCP context', category: 'mcp-tools', version: '1.0.0', author: 'openai', tags: ['openai', 'gpt', 'dalle', 'llm'], downloads: 49000 },
  { name: 'ElevenLabs MCP', description: 'Text-to-speech and voice cloning via ElevenLabs', category: 'mcp-tools', version: '1.0.0', author: 'elevenlabs', tags: ['tts', 'voice', 'audio', 'speech'], downloads: 22000 },
  { name: 'Whisper MCP', description: 'Transcribe audio to text using OpenAI Whisper', category: 'mcp-tools', version: '1.0.0', author: 'community', tags: ['whisper', 'transcription', 'audio', 'speech'], downloads: 26000 },
  { name: 'Wolfram Alpha MCP', description: 'Query Wolfram Alpha computational knowledge engine', category: 'mcp-tools', version: '1.0.0', author: 'wolfram', tags: ['wolfram', 'math', 'knowledge', 'computation'], downloads: 15000 },
  { name: 'Maps MCP', description: 'Geocoding, directions, and place search via Google Maps', category: 'mcp-tools', version: '1.0.0', author: 'community', tags: ['maps', 'geocoding', 'directions', 'location'], downloads: 18000 },
  { name: 'Weather MCP', description: 'Get weather forecasts and current conditions worldwide', category: 'mcp-tools', version: '1.0.0', author: 'community', tags: ['weather', 'forecast', 'climate'], downloads: 20000 },
  { name: 'Trello MCP', description: 'Manage Trello boards, lists, and cards', category: 'mcp-tools', version: '1.0.0', author: 'community', tags: ['trello', 'kanban', 'project-management'], downloads: 14000 },
  { name: 'Asana MCP', description: 'Manage Asana tasks, projects, and workflows', category: 'mcp-tools', version: '1.0.0', author: 'asana', tags: ['asana', 'tasks', 'project-management'], downloads: 12000 },
  { name: 'HubSpot MCP', description: 'Manage CRM contacts, deals, and marketing in HubSpot', category: 'mcp-tools', version: '1.0.0', author: 'hubspot', tags: ['hubspot', 'crm', 'marketing', 'sales'], downloads: 16000 },
  { name: 'Datadog MCP', description: 'Monitor infrastructure and APM metrics with Datadog', category: 'mcp-tools', version: '1.0.0', author: 'datadog', tags: ['datadog', 'monitoring', 'apm', 'observability'], downloads: 13000 },
  { name: 'PagerDuty MCP', description: 'Manage incidents, on-call schedules, and alerts', category: 'mcp-tools', version: '1.0.0', author: 'pagerduty', tags: ['pagerduty', 'incidents', 'oncall', 'alerts'], downloads: 11000 },
  { name: 'Grafana MCP', description: 'Query Grafana dashboards and datasources', category: 'mcp-tools', version: '1.0.0', author: 'grafana', tags: ['grafana', 'dashboards', 'monitoring'], downloads: 14000 },
  { name: 'CircleCI MCP', description: 'Trigger builds and manage CI/CD pipelines', category: 'mcp-tools', version: '1.0.0', author: 'circleci', tags: ['circleci', 'ci-cd', 'automation'], downloads: 10000 },
  { name: 'GitHub Actions MCP', description: 'Trigger and manage GitHub Actions workflows', category: 'mcp-tools', version: '1.0.0', author: 'community', tags: ['github-actions', 'ci-cd', 'automation'], downloads: 25000 },
  { name: 'Zapier MCP', description: 'Trigger Zapier automations and manage Zaps', category: 'mcp-tools', version: '1.0.0', author: 'zapier', tags: ['zapier', 'automation', 'integration'], downloads: 19000 },
  { name: 'Raycast MCP', description: 'Control Raycast launcher and extensions', category: 'mcp-tools', version: '1.0.0', author: 'raycast', tags: ['raycast', 'launcher', 'productivity'], downloads: 16000 },
  { name: 'Resend MCP', description: 'Send transactional emails via Resend API', category: 'mcp-tools', version: '1.0.0', author: 'resend', tags: ['email', 'resend', 'transactional'], downloads: 12000 },
  { name: 'Neon MCP', description: 'Manage Neon serverless PostgreSQL databases', category: 'mcp-tools', version: '1.0.0', author: 'neondatabase', tags: ['neon', 'postgres', 'serverless', 'database'], downloads: 14000 },
  { name: 'Upstash MCP', description: 'Interact with Upstash Redis and Kafka', category: 'mcp-tools', version: '1.0.0', author: 'upstash', tags: ['upstash', 'redis', 'kafka', 'serverless'], downloads: 11000 },
  { name: 'R2 Storage MCP', description: 'Manage Cloudflare R2 object storage', category: 'mcp-tools', version: '1.0.0', author: 'cloudflare', tags: ['r2', 'storage', 'cloudflare', 's3'], downloads: 10000 },
];

// ==================== SOFTWARE (55+) ====================
const software: PkgData[] = [
  // Linux distros - real magnet links
  { name: 'Ubuntu 24.04 LTS', description: 'Ubuntu Desktop 24.04.1 LTS (Noble Numbat) - The most popular Linux desktop', category: 'software', subcategory: 'operating-systems', version: '24.04.1', author: 'Canonical', license: 'GPL', magnet_uri: 'magnet:?xt=urn:btih:d85c556e90e03ab37dc16eab96c9c5b72d43e17a&dn=ubuntu-24.04.1-desktop-amd64.iso&tr=https%3A%2F%2Ftorrent.ubuntu.com%2Fannounce', size_bytes: 5665497088, size_display: '5.3 GB', platform: ['linux'], tags: ['ubuntu', 'linux', 'desktop', 'os'], downloads: 245000, featured: 1, seeders: 2400 },
  { name: 'Kali Linux 2024.4', description: 'Kali Linux - Advanced Penetration Testing Distribution', category: 'software', subcategory: 'operating-systems', version: '2024.4', author: 'Offensive Security', license: 'GPL', size_bytes: 4200000000, size_display: '3.9 GB', platform: ['linux'], tags: ['kali', 'linux', 'security', 'pentesting'], downloads: 180000, featured: 1, seeders: 1800 },
  { name: 'Arch Linux', description: 'A lightweight and flexible Linux distribution', category: 'software', subcategory: 'operating-systems', version: '2024.12.01', author: 'Arch Linux', license: 'GPL', size_bytes: 1100000000, size_display: '1.0 GB', platform: ['linux'], tags: ['arch', 'linux', 'minimal', 'rolling-release'], downloads: 156000, seeders: 900 },
  { name: 'Fedora Workstation 41', description: 'Fedora Workstation - Cutting edge desktop Linux', category: 'software', subcategory: 'operating-systems', version: '41', author: 'Fedora Project', license: 'GPL', size_bytes: 2200000000, size_display: '2.0 GB', platform: ['linux'], tags: ['fedora', 'linux', 'desktop', 'gnome'], downloads: 132000, seeders: 1100 },
  { name: 'Linux Mint 22', description: 'Linux Mint Cinnamon - Elegant, easy-to-use desktop Linux', category: 'software', subcategory: 'operating-systems', version: '22', author: 'Linux Mint Team', license: 'GPL', size_bytes: 2800000000, size_display: '2.6 GB', platform: ['linux'], tags: ['mint', 'linux', 'desktop', 'cinnamon'], downloads: 118000, seeders: 800 },
  { name: 'Debian 12 Bookworm', description: 'Debian - The Universal Operating System', category: 'software', subcategory: 'operating-systems', version: '12.8', author: 'Debian Project', license: 'GPL', size_bytes: 3900000000, size_display: '3.6 GB', platform: ['linux'], tags: ['debian', 'linux', 'stable', 'server'], downloads: 142000, seeders: 1300 },
  { name: 'Rocky Linux 9', description: 'Rocky Linux - Enterprise Linux, community driven', category: 'software', subcategory: 'operating-systems', version: '9.4', author: 'Rocky Enterprise Software Foundation', license: 'GPL', size_bytes: 1700000000, size_display: '1.6 GB', platform: ['linux'], tags: ['rocky', 'linux', 'enterprise', 'rhel'], downloads: 78000, seeders: 600 },
  { name: 'openSUSE Tumbleweed', description: 'openSUSE rolling release distribution', category: 'software', subcategory: 'operating-systems', version: '20241215', author: 'openSUSE Project', license: 'GPL', size_bytes: 4500000000, size_display: '4.2 GB', platform: ['linux'], tags: ['opensuse', 'linux', 'rolling-release'], downloads: 65000, seeders: 450 },
  // Dev tools
  { name: 'Node.js', description: 'JavaScript runtime built on V8 - essential for web development', category: 'software', subcategory: 'dev-tools', version: '22.12.0', author: 'OpenJS Foundation', license: 'MIT', size_bytes: 45000000, size_display: '43 MB', platform: ['macos', 'linux', 'windows'], tags: ['nodejs', 'javascript', 'runtime', 'v8'], downloads: 320000, featured: 1, seeders: 1500 },
  { name: 'Python', description: 'Python programming language - the most popular language for AI/ML', category: 'software', subcategory: 'dev-tools', version: '3.13.1', author: 'Python Software Foundation', license: 'PSF', size_bytes: 30000000, size_display: '29 MB', platform: ['macos', 'linux', 'windows'], tags: ['python', 'programming', 'ai', 'ml'], downloads: 380000, seeders: 2000 },
  { name: 'Rust', description: 'Systems programming language focused on safety and performance', category: 'software', subcategory: 'dev-tools', version: '1.83.0', author: 'Rust Foundation', license: 'MIT/Apache-2.0', size_bytes: 250000000, size_display: '238 MB', platform: ['macos', 'linux', 'windows'], tags: ['rust', 'systems', 'programming', 'performance'], downloads: 165000, seeders: 800 },
  { name: 'Go', description: 'The Go programming language - fast, reliable, efficient', category: 'software', subcategory: 'dev-tools', version: '1.23.4', author: 'Google', license: 'BSD-3', size_bytes: 150000000, size_display: '143 MB', platform: ['macos', 'linux', 'windows'], tags: ['go', 'golang', 'programming', 'backend'], downloads: 198000, seeders: 900 },
  { name: 'ffmpeg', description: 'Universal media toolkit - convert, stream, and process any media format', category: 'software', subcategory: 'dev-tools', version: '7.1', author: 'FFmpeg Team', license: 'LGPL/GPL', size_bytes: 85000000, size_display: '81 MB', platform: ['macos', 'linux', 'windows'], tags: ['ffmpeg', 'video', 'audio', 'media', 'conversion'], downloads: 275000, seeders: 1200 },
  { name: 'ImageMagick', description: 'Create, edit, compose, or convert digital images', category: 'software', subcategory: 'dev-tools', version: '7.1.1', author: 'ImageMagick Studio', license: 'Apache-2.0', size_bytes: 35000000, size_display: '33 MB', platform: ['macos', 'linux', 'windows'], tags: ['imagemagick', 'images', 'conversion', 'graphics'], downloads: 145000, seeders: 600 },
  { name: 'Blender', description: '3D creation suite - modeling, animation, rendering, VFX, compositing', category: 'software', subcategory: 'creative', version: '4.3.1', author: 'Blender Foundation', license: 'GPL', size_bytes: 400000000, size_display: '381 MB', platform: ['macos', 'linux', 'windows'], tags: ['blender', '3d', 'modeling', 'animation', 'rendering'], downloads: 210000, featured: 1, seeders: 1800 },
  { name: 'GIMP', description: 'GNU Image Manipulation Program - free and open-source image editor', category: 'software', subcategory: 'creative', version: '2.10.38', author: 'GIMP Team', license: 'GPL', size_bytes: 300000000, size_display: '286 MB', platform: ['macos', 'linux', 'windows'], tags: ['gimp', 'image-editor', 'graphics', 'photos'], downloads: 175000, seeders: 700 },
  { name: 'Inkscape', description: 'Professional vector graphics editor', category: 'software', subcategory: 'creative', version: '1.4', author: 'Inkscape Project', license: 'GPL', size_bytes: 120000000, size_display: '114 MB', platform: ['macos', 'linux', 'windows'], tags: ['inkscape', 'svg', 'vector', 'graphics'], downloads: 98000, seeders: 400 },
  // Databases
  { name: 'PostgreSQL', description: 'The world\'s most advanced open source relational database', category: 'software', subcategory: 'databases', version: '17.2', author: 'PostgreSQL Global Dev Group', license: 'PostgreSQL', size_bytes: 60000000, size_display: '57 MB', platform: ['macos', 'linux', 'windows', 'docker'], tags: ['postgresql', 'database', 'sql', 'relational'], downloads: 290000, seeders: 1600 },
  { name: 'MySQL', description: 'The world\'s most popular open source database', category: 'software', subcategory: 'databases', version: '8.4.3', author: 'Oracle', license: 'GPL', size_bytes: 400000000, size_display: '381 MB', platform: ['macos', 'linux', 'windows', 'docker'], tags: ['mysql', 'database', 'sql'], downloads: 250000, seeders: 1400 },
  { name: 'Redis', description: 'In-memory data store for caching, messaging, and real-time apps', category: 'software', subcategory: 'databases', version: '7.4.1', author: 'Redis Ltd', license: 'BSD-3', size_bytes: 12000000, size_display: '11 MB', platform: ['linux', 'macos', 'docker'], tags: ['redis', 'cache', 'database', 'in-memory'], downloads: 220000, seeders: 1100 },
  { name: 'MongoDB', description: 'Document-oriented NoSQL database for modern applications', category: 'software', subcategory: 'databases', version: '8.0.4', author: 'MongoDB Inc', license: 'SSPL', size_bytes: 150000000, size_display: '143 MB', platform: ['macos', 'linux', 'windows', 'docker'], tags: ['mongodb', 'nosql', 'database', 'documents'], downloads: 195000, seeders: 950 },
  { name: 'SQLite', description: 'Self-contained, serverless SQL database engine', category: 'software', subcategory: 'databases', version: '3.47.2', author: 'D. Richard Hipp', license: 'Public Domain', size_bytes: 2000000, size_display: '1.9 MB', platform: ['any'], tags: ['sqlite', 'database', 'embedded', 'sql'], downloads: 310000, seeders: 500 },
  // Security
  { name: 'Wireshark', description: 'Network protocol analyzer for troubleshooting and analysis', category: 'software', subcategory: 'security', version: '4.4.2', author: 'Wireshark Foundation', license: 'GPL', size_bytes: 80000000, size_display: '76 MB', platform: ['macos', 'linux', 'windows'], tags: ['wireshark', 'network', 'security', 'packets'], downloads: 165000, seeders: 700 },
  { name: 'nmap', description: 'Network discovery and security auditing tool', category: 'software', subcategory: 'security', version: '7.95', author: 'Gordon Lyon', license: 'NPSL', size_bytes: 25000000, size_display: '24 MB', platform: ['macos', 'linux', 'windows'], tags: ['nmap', 'network', 'security', 'scanning'], downloads: 142000, seeders: 600 },
  { name: 'Metasploit Framework', description: 'Penetration testing framework for security professionals', category: 'software', subcategory: 'security', version: '6.4.35', author: 'Rapid7', license: 'BSD-3', size_bytes: 500000000, size_display: '477 MB', platform: ['linux', 'macos'], tags: ['metasploit', 'pentesting', 'security', 'exploits'], downloads: 125000, seeders: 550 },
  { name: 'Burp Suite Community', description: 'Web vulnerability scanner and security testing tool', category: 'software', subcategory: 'security', version: '2024.11', author: 'PortSwigger', license: 'Proprietary', size_bytes: 600000000, size_display: '572 MB', platform: ['macos', 'linux', 'windows'], tags: ['burpsuite', 'web-security', 'pentesting'], downloads: 95000, seeders: 400 },
  { name: 'Hashcat', description: 'Advanced password recovery utility', category: 'software', subcategory: 'security', version: '6.2.6', author: 'hashcat', license: 'MIT', size_bytes: 15000000, size_display: '14 MB', platform: ['linux', 'windows'], tags: ['hashcat', 'password', 'security', 'cracking'], downloads: 78000, seeders: 300 },
  // More tools
  { name: 'Nginx', description: 'High-performance web server and reverse proxy', category: 'software', subcategory: 'servers', version: '1.27.3', author: 'F5 Networks', license: 'BSD-2', size_bytes: 5000000, size_display: '4.8 MB', platform: ['linux', 'macos', 'docker'], tags: ['nginx', 'web-server', 'reverse-proxy'], downloads: 280000, seeders: 1300 },
  { name: 'Caddy', description: 'Fast, multi-platform web server with automatic HTTPS', category: 'software', subcategory: 'servers', version: '2.8.4', author: 'Matt Holt', license: 'Apache-2.0', size_bytes: 40000000, size_display: '38 MB', platform: ['linux', 'macos', 'windows', 'docker'], tags: ['caddy', 'web-server', 'https', 'reverse-proxy'], downloads: 120000, seeders: 600 },
  { name: 'Traefik', description: 'Cloud-native application proxy and load balancer', category: 'software', subcategory: 'servers', version: '3.2.3', author: 'Traefik Labs', license: 'MIT', size_bytes: 55000000, size_display: '52 MB', platform: ['linux', 'docker'], tags: ['traefik', 'proxy', 'load-balancer', 'cloud'], downloads: 98000, seeders: 500 },
  { name: 'Grafana', description: 'Open observability platform for metrics, logs, and traces', category: 'software', subcategory: 'monitoring', version: '11.4.0', author: 'Grafana Labs', license: 'AGPL-3.0', size_bytes: 120000000, size_display: '114 MB', platform: ['linux', 'macos', 'windows', 'docker'], tags: ['grafana', 'monitoring', 'dashboards', 'observability'], downloads: 165000, seeders: 800 },
  { name: 'Prometheus', description: 'Monitoring system and time series database', category: 'software', subcategory: 'monitoring', version: '2.55.1', author: 'CNCF', license: 'Apache-2.0', size_bytes: 95000000, size_display: '91 MB', platform: ['linux', 'docker'], tags: ['prometheus', 'monitoring', 'metrics', 'alerting'], downloads: 145000, seeders: 700 },
  { name: 'Docker Desktop', description: 'Container platform for building and sharing apps', category: 'software', subcategory: 'dev-tools', version: '4.36.0', author: 'Docker Inc', license: 'Apache-2.0', size_bytes: 700000000, size_display: '667 MB', platform: ['macos', 'linux', 'windows'], tags: ['docker', 'containers', 'devops', 'platform'], downloads: 350000, featured: 1, seeders: 2200 },
  { name: 'Ansible', description: 'IT automation tool for configuration management and deployment', category: 'software', subcategory: 'dev-tools', version: '10.6.0', author: 'Red Hat', license: 'GPL', size_bytes: 40000000, size_display: '38 MB', platform: ['linux', 'macos'], tags: ['ansible', 'automation', 'devops', 'configuration'], downloads: 125000, seeders: 600 },
  { name: 'Terraform', description: 'Infrastructure as code for provisioning cloud resources', category: 'software', subcategory: 'dev-tools', version: '1.10.3', author: 'HashiCorp', license: 'BUSL-1.1', size_bytes: 55000000, size_display: '52 MB', platform: ['macos', 'linux', 'windows'], tags: ['terraform', 'iac', 'infrastructure', 'cloud'], downloads: 185000, seeders: 900 },
  { name: 'kubectl', description: 'Kubernetes command-line tool', category: 'software', subcategory: 'dev-tools', version: '1.32.0', author: 'CNCF', license: 'Apache-2.0', size_bytes: 50000000, size_display: '48 MB', platform: ['macos', 'linux', 'windows'], tags: ['kubectl', 'kubernetes', 'k8s', 'cli'], downloads: 210000, seeders: 1000 },
  { name: 'Helm', description: 'The package manager for Kubernetes', category: 'software', subcategory: 'dev-tools', version: '3.16.3', author: 'CNCF', license: 'Apache-2.0', size_bytes: 45000000, size_display: '43 MB', platform: ['macos', 'linux', 'windows'], tags: ['helm', 'kubernetes', 'k8s', 'packages'], downloads: 155000, seeders: 750 },
  { name: 'Git', description: 'Distributed version control system', category: 'software', subcategory: 'dev-tools', version: '2.47.1', author: 'Git Community', license: 'GPL', size_bytes: 45000000, size_display: '43 MB', platform: ['macos', 'linux', 'windows'], tags: ['git', 'vcs', 'version-control'], downloads: 400000, seeders: 2500 },
  { name: 'Neovim', description: 'Hyperextensible Vim-based text editor', category: 'software', subcategory: 'dev-tools', version: '0.10.3', author: 'Neovim Contributors', license: 'Apache-2.0', size_bytes: 30000000, size_display: '29 MB', platform: ['macos', 'linux', 'windows'], tags: ['neovim', 'editor', 'vim', 'terminal'], downloads: 135000, seeders: 650 },
  { name: 'tmux', description: 'Terminal multiplexer for managing sessions', category: 'software', subcategory: 'dev-tools', version: '3.5a', author: 'tmux', license: 'ISC', size_bytes: 2000000, size_display: '1.9 MB', platform: ['macos', 'linux'], tags: ['tmux', 'terminal', 'multiplexer'], downloads: 115000, seeders: 400 },
  { name: 'htop', description: 'Interactive process viewer and system monitor', category: 'software', subcategory: 'dev-tools', version: '3.3.0', author: 'htop Team', license: 'GPL', size_bytes: 1500000, size_display: '1.4 MB', platform: ['macos', 'linux'], tags: ['htop', 'monitoring', 'system', 'processes'], downloads: 180000, seeders: 500 },
  { name: 'ripgrep', description: 'Blazingly fast line-oriented search tool (better grep)', category: 'software', subcategory: 'dev-tools', version: '14.1.1', author: 'Andrew Gallant', license: 'MIT', size_bytes: 8000000, size_display: '7.6 MB', platform: ['macos', 'linux', 'windows'], tags: ['ripgrep', 'rg', 'search', 'grep', 'cli'], downloads: 165000, seeders: 550 },
  { name: 'fzf', description: 'Command-line fuzzy finder', category: 'software', subcategory: 'dev-tools', version: '0.57.0', author: 'Junegunn Choi', license: 'MIT', size_bytes: 4000000, size_display: '3.8 MB', platform: ['macos', 'linux', 'windows'], tags: ['fzf', 'fuzzy', 'search', 'cli'], downloads: 155000, seeders: 500 },
  { name: 'jq', description: 'Lightweight command-line JSON processor', category: 'software', subcategory: 'dev-tools', version: '1.7.1', author: 'Stephen Dolan', license: 'MIT', size_bytes: 2500000, size_display: '2.4 MB', platform: ['macos', 'linux', 'windows'], tags: ['jq', 'json', 'cli', 'parser'], downloads: 200000, seeders: 600 },
  { name: 'bat', description: 'A cat clone with syntax highlighting and Git integration', category: 'software', subcategory: 'dev-tools', version: '0.24.0', author: 'David Peter', license: 'MIT/Apache-2.0', size_bytes: 7000000, size_display: '6.7 MB', platform: ['macos', 'linux', 'windows'], tags: ['bat', 'cat', 'syntax', 'cli'], downloads: 140000, seeders: 450 },
  { name: 'lazygit', description: 'Simple terminal UI for git commands', category: 'software', subcategory: 'dev-tools', version: '0.44.1', author: 'Jesse Duffield', license: 'MIT', size_bytes: 20000000, size_display: '19 MB', platform: ['macos', 'linux', 'windows'], tags: ['lazygit', 'git', 'tui', 'cli'], downloads: 125000, seeders: 500 },
  { name: 'Deno', description: 'Secure runtime for JavaScript and TypeScript', category: 'software', subcategory: 'dev-tools', version: '2.1.4', author: 'Deno Land', license: 'MIT', size_bytes: 50000000, size_display: '48 MB', platform: ['macos', 'linux', 'windows'], tags: ['deno', 'javascript', 'typescript', 'runtime'], downloads: 95000, seeders: 400 },
  { name: 'Bun', description: 'All-in-one JavaScript runtime, bundler, and package manager', category: 'software', subcategory: 'dev-tools', version: '1.1.42', author: 'Oven', license: 'MIT', size_bytes: 60000000, size_display: '57 MB', platform: ['macos', 'linux'], tags: ['bun', 'javascript', 'runtime', 'bundler'], downloads: 110000, seeders: 500 },
  { name: 'Zed Editor', description: 'High-performance multiplayer code editor', category: 'software', subcategory: 'dev-tools', version: '0.165.0', author: 'Zed Industries', license: 'GPL/AGPL', size_bytes: 90000000, size_display: '86 MB', platform: ['macos', 'linux'], tags: ['zed', 'editor', 'ide', 'fast'], downloads: 85000, seeders: 400 },
  { name: 'Helix Editor', description: 'Post-modern modal text editor written in Rust', category: 'software', subcategory: 'dev-tools', version: '24.7', author: 'Helix Community', license: 'MPL-2.0', size_bytes: 25000000, size_display: '24 MB', platform: ['macos', 'linux', 'windows'], tags: ['helix', 'editor', 'modal', 'rust'], downloads: 72000, seeders: 350 },
  { name: 'Alacritty', description: 'GPU-accelerated terminal emulator', category: 'software', subcategory: 'dev-tools', version: '0.14.0', author: 'Alacritty Contributors', license: 'Apache-2.0', size_bytes: 15000000, size_display: '14 MB', platform: ['macos', 'linux', 'windows'], tags: ['alacritty', 'terminal', 'gpu', 'fast'], downloads: 95000, seeders: 450 },
  { name: 'WezTerm', description: 'GPU-accelerated terminal emulator with Lua scripting', category: 'software', subcategory: 'dev-tools', version: '20240203', author: 'Wez Furlong', license: 'MIT', size_bytes: 45000000, size_display: '43 MB', platform: ['macos', 'linux', 'windows'], tags: ['wezterm', 'terminal', 'lua', 'gpu'], downloads: 68000, seeders: 320 },
  { name: 'Zoxide', description: 'Smarter cd command - learns your habits', category: 'software', subcategory: 'dev-tools', version: '0.9.6', author: 'ajeetdsouza', license: 'MIT', size_bytes: 3000000, size_display: '2.9 MB', platform: ['macos', 'linux', 'windows'], tags: ['zoxide', 'cd', 'navigation', 'cli'], downloads: 82000, seeders: 350 },
  { name: 'eza', description: 'Modern replacement for ls with colors and git integration', category: 'software', subcategory: 'dev-tools', version: '0.20.10', author: 'eza-community', license: 'MIT', size_bytes: 4000000, size_display: '3.8 MB', platform: ['macos', 'linux', 'windows'], tags: ['eza', 'ls', 'files', 'cli'], downloads: 75000, seeders: 300 },
  { name: 'delta', description: 'Syntax-highlighting pager for git, diff, and grep output', category: 'software', subcategory: 'dev-tools', version: '0.18.2', author: 'Dan Davison', license: 'MIT', size_bytes: 9000000, size_display: '8.6 MB', platform: ['macos', 'linux', 'windows'], tags: ['delta', 'git', 'diff', 'pager'], downloads: 88000, seeders: 400 },
  { name: 'fd', description: 'Simple, fast alternative to find', category: 'software', subcategory: 'dev-tools', version: '10.2.0', author: 'David Peter', license: 'MIT/Apache-2.0', size_bytes: 5000000, size_display: '4.8 MB', platform: ['macos', 'linux', 'windows'], tags: ['fd', 'find', 'search', 'files', 'cli'], downloads: 110000, seeders: 450 },
  { name: 'Starship', description: 'Minimal, blazing-fast cross-shell prompt', category: 'software', subcategory: 'dev-tools', version: '1.21.1', author: 'Starship Contributors', license: 'ISC', size_bytes: 8000000, size_display: '7.6 MB', platform: ['macos', 'linux', 'windows'], tags: ['starship', 'prompt', 'shell', 'cli'], downloads: 130000, seeders: 550 },
  { name: 'Atuin', description: 'Magical shell history - sync, search, and stats', category: 'software', subcategory: 'dev-tools', version: '18.3.0', author: 'Ellie Huxtable', license: 'MIT', size_bytes: 12000000, size_display: '11 MB', platform: ['macos', 'linux'], tags: ['atuin', 'shell', 'history', 'sync'], downloads: 65000, seeders: 300 },
  { name: 'Minio', description: 'High-performance S3-compatible object storage', category: 'software', subcategory: 'servers', version: '2024.12.18', author: 'MinIO Inc', license: 'AGPL-3.0', size_bytes: 100000000, size_display: '95 MB', platform: ['linux', 'docker'], tags: ['minio', 's3', 'storage', 'object-storage'], downloads: 105000, seeders: 550 },
  { name: 'Vault', description: 'Secrets management and data encryption', category: 'software', subcategory: 'security', version: '1.18.3', author: 'HashiCorp', license: 'BUSL-1.1', size_bytes: 75000000, size_display: '71 MB', platform: ['macos', 'linux', 'windows'], tags: ['vault', 'secrets', 'encryption', 'security'], downloads: 98000, seeders: 500 },
  { name: 'Consul', description: 'Service mesh and service discovery', category: 'software', subcategory: 'servers', version: '1.20.2', author: 'HashiCorp', license: 'BUSL-1.1', size_bytes: 60000000, size_display: '57 MB', platform: ['macos', 'linux', 'windows'], tags: ['consul', 'service-mesh', 'discovery'], downloads: 78000, seeders: 400 },
  { name: 'Tailscale', description: 'Zero-config VPN built on WireGuard', category: 'software', subcategory: 'networking', version: '1.76.6', author: 'Tailscale Inc', license: 'BSD-3', size_bytes: 30000000, size_display: '29 MB', platform: ['macos', 'linux', 'windows'], tags: ['tailscale', 'vpn', 'wireguard', 'networking'], downloads: 145000, seeders: 700 },
  { name: 'Cloudflared', description: 'Cloudflare Tunnel client for secure connections', category: 'software', subcategory: 'networking', version: '2024.12.2', author: 'Cloudflare', license: 'Apache-2.0', size_bytes: 35000000, size_display: '33 MB', platform: ['macos', 'linux', 'windows'], tags: ['cloudflared', 'tunnel', 'cloudflare'], downloads: 112000, seeders: 550 },
  { name: 'Ollama', description: 'Run LLMs locally - easy model management and inference', category: 'software', subcategory: 'ai-tools', version: '0.5.4', author: 'Ollama', license: 'MIT', size_bytes: 50000000, size_display: '48 MB', platform: ['macos', 'linux', 'windows'], tags: ['ollama', 'llm', 'ai', 'local', 'inference'], downloads: 250000, featured: 1, seeders: 1800 },
  { name: 'LM Studio', description: 'Desktop app to run local LLMs with a beautiful UI', category: 'software', subcategory: 'ai-tools', version: '0.3.6', author: 'LM Studio', license: 'Proprietary', size_bytes: 200000000, size_display: '191 MB', platform: ['macos', 'linux', 'windows'], tags: ['lm-studio', 'llm', 'ai', 'local', 'gui'], downloads: 180000, seeders: 900 },
];

// ==================== MODELS (35+) ====================
const models: PkgData[] = [
  { name: 'Llama 3.1 70B', description: 'Meta\'s most capable open-source LLM - 70B parameter version', category: 'models', version: '3.1', author: 'Meta AI', license: 'Llama 3.1 Community', size_bytes: 40000000000, size_display: '37 GB', platform: ['linux', 'macos'], compatibility: ['any'], tags: ['llama', 'llm', 'text-generation', 'meta'], downloads: 185000, featured: 1, seeders: 1200 },
  { name: 'Llama 3.1 8B', description: 'Meta\'s efficient open LLM - 8B parameter version, great for local inference', category: 'models', version: '3.1', author: 'Meta AI', license: 'Llama 3.1 Community', size_bytes: 5000000000, size_display: '4.7 GB', platform: ['linux', 'macos', 'windows'], tags: ['llama', 'llm', 'text-generation', 'meta', 'small'], downloads: 245000, featured: 1, seeders: 2000 },
  { name: 'Llama 3.2 3B', description: 'Meta\'s smallest Llama - perfect for edge devices and fast inference', category: 'models', version: '3.2', author: 'Meta AI', license: 'Llama 3.2 Community', size_bytes: 2000000000, size_display: '1.9 GB', platform: ['any'], tags: ['llama', 'llm', 'text-generation', 'edge', 'small'], downloads: 165000, seeders: 1500 },
  { name: 'Mistral 7B v0.3', description: 'Mistral AI\'s flagship 7B model - excellent reasoning and code generation', category: 'models', version: '0.3', author: 'Mistral AI', license: 'Apache-2.0', size_bytes: 4500000000, size_display: '4.2 GB', platform: ['linux', 'macos', 'windows'], tags: ['mistral', 'llm', 'text-generation', 'code'], downloads: 198000, featured: 1, seeders: 1600 },
  { name: 'Mixtral 8x7B', description: 'Mixture of experts model - 8 experts, 7B each, sparse activation', category: 'models', version: '0.1', author: 'Mistral AI', license: 'Apache-2.0', size_bytes: 26000000000, size_display: '24 GB', platform: ['linux'], tags: ['mixtral', 'moe', 'llm', 'mistral'], downloads: 120000, seeders: 800 },
  { name: 'Phi-3 Mini', description: 'Microsoft\'s small but powerful 3.8B parameter model', category: 'models', version: '3.0', author: 'Microsoft', license: 'MIT', size_bytes: 2300000000, size_display: '2.1 GB', platform: ['any'], tags: ['phi', 'microsoft', 'llm', 'small', 'efficient'], downloads: 142000, seeders: 900 },
  { name: 'Phi-3 Medium', description: 'Microsoft\'s 14B parameter model with strong reasoning', category: 'models', version: '3.0', author: 'Microsoft', license: 'MIT', size_bytes: 8000000000, size_display: '7.4 GB', platform: ['linux', 'macos'], tags: ['phi', 'microsoft', 'llm', 'reasoning'], downloads: 95000, seeders: 600 },
  { name: 'Gemma 2 9B', description: 'Google\'s open model built from Gemini research', category: 'models', version: '2.0', author: 'Google DeepMind', license: 'Gemma', size_bytes: 5500000000, size_display: '5.1 GB', platform: ['linux', 'macos', 'windows'], tags: ['gemma', 'google', 'llm', 'text-generation'], downloads: 135000, seeders: 850 },
  { name: 'Gemma 2 27B', description: 'Google\'s larger open model with enhanced capabilities', category: 'models', version: '2.0', author: 'Google DeepMind', license: 'Gemma', size_bytes: 16000000000, size_display: '15 GB', platform: ['linux'], tags: ['gemma', 'google', 'llm', 'large'], downloads: 78000, seeders: 500 },
  { name: 'Stable Diffusion XL', description: 'State-of-the-art text-to-image generation model', category: 'models', version: '1.0', author: 'Stability AI', license: 'CreativeML Open RAIL++-M', size_bytes: 6900000000, size_display: '6.4 GB', platform: ['linux', 'macos', 'windows'], tags: ['stable-diffusion', 'image-generation', 'text-to-image', 'diffusion'], downloads: 210000, featured: 1, seeders: 1800 },
  { name: 'Stable Diffusion 3.5', description: 'Latest Stable Diffusion with improved quality and architecture', category: 'models', version: '3.5', author: 'Stability AI', license: 'Stability AI Community', size_bytes: 8500000000, size_display: '7.9 GB', platform: ['linux', 'macos'], tags: ['stable-diffusion', 'image-generation', 'text-to-image'], downloads: 165000, seeders: 1200 },
  { name: 'FLUX.1 Dev', description: 'Black Forest Labs text-to-image model with exceptional quality', category: 'models', version: '1.0', author: 'Black Forest Labs', license: 'FLUX.1-dev', size_bytes: 12000000000, size_display: '11 GB', platform: ['linux'], tags: ['flux', 'image-generation', 'text-to-image'], downloads: 145000, seeders: 900 },
  { name: 'Whisper Large v3', description: 'OpenAI\'s state-of-the-art speech recognition model', category: 'models', version: '3.0', author: 'OpenAI', license: 'MIT', size_bytes: 3100000000, size_display: '2.9 GB', platform: ['any'], tags: ['whisper', 'speech-to-text', 'transcription', 'audio'], downloads: 175000, seeders: 1100 },
  { name: 'Whisper Medium', description: 'Whisper medium model - good balance of speed and accuracy', category: 'models', version: '3.0', author: 'OpenAI', license: 'MIT', size_bytes: 1500000000, size_display: '1.4 GB', platform: ['any'], tags: ['whisper', 'speech-to-text', 'transcription'], downloads: 130000, seeders: 700 },
  { name: 'Bark', description: 'Transformer-based text-to-speech model by Suno', category: 'models', version: '1.0', author: 'Suno AI', license: 'MIT', size_bytes: 5600000000, size_display: '5.2 GB', platform: ['linux', 'macos'], tags: ['bark', 'tts', 'text-to-speech', 'voice'], downloads: 85000, seeders: 450 },
  { name: 'BERT Base Uncased', description: 'Foundational NLP model for text classification, NER, and embeddings', category: 'models', version: '1.0', author: 'Google Research', license: 'Apache-2.0', size_bytes: 440000000, size_display: '420 MB', platform: ['any'], tags: ['bert', 'nlp', 'embeddings', 'classification'], downloads: 195000, seeders: 800 },
  { name: 'Sentence Transformers all-MiniLM-L6', description: 'Fast sentence embeddings for semantic search and similarity', category: 'models', version: '2.0', author: 'sentence-transformers', license: 'Apache-2.0', size_bytes: 90000000, size_display: '86 MB', platform: ['any'], tags: ['embeddings', 'sentence-transformers', 'semantic-search'], downloads: 165000, seeders: 700 },
  { name: 'all-mpnet-base-v2', description: 'Best quality sentence embeddings from sentence-transformers', category: 'models', version: '2.0', author: 'sentence-transformers', license: 'Apache-2.0', size_bytes: 420000000, size_display: '401 MB', platform: ['any'], tags: ['embeddings', 'sentence-transformers', 'quality'], downloads: 125000, seeders: 600 },
  { name: 'CodeLlama 7B', description: 'Meta\'s code generation model fine-tuned from Llama 2', category: 'models', version: '2.0', author: 'Meta AI', license: 'Llama 2 Community', size_bytes: 4100000000, size_display: '3.8 GB', platform: ['linux', 'macos'], tags: ['codellama', 'code-generation', 'programming', 'llm'], downloads: 155000, seeders: 900 },
  { name: 'DeepSeek Coder V2', description: 'Specialized code generation model with strong performance', category: 'models', version: '2.0', author: 'DeepSeek', license: 'DeepSeek', size_bytes: 9000000000, size_display: '8.4 GB', platform: ['linux'], tags: ['deepseek', 'code-generation', 'programming'], downloads: 110000, seeders: 650 },
  { name: 'Qwen2.5 7B', description: 'Alibaba\'s bilingual LLM with strong reasoning', category: 'models', version: '2.5', author: 'Alibaba Cloud', license: 'Apache-2.0', size_bytes: 4300000000, size_display: '4.0 GB', platform: ['linux', 'macos'], tags: ['qwen', 'alibaba', 'llm', 'bilingual'], downloads: 105000, seeders: 600 },
  { name: 'Qwen2.5 72B', description: 'Alibaba\'s large-scale LLM rivaling GPT-4 class models', category: 'models', version: '2.5', author: 'Alibaba Cloud', license: 'Qwen', size_bytes: 42000000000, size_display: '39 GB', platform: ['linux'], tags: ['qwen', 'alibaba', 'llm', 'large'], downloads: 65000, seeders: 400 },
  { name: 'Yi 34B', description: '01.AI\'s 34B parameter model with broad capabilities', category: 'models', version: '1.5', author: '01.AI', license: 'Yi License', size_bytes: 20000000000, size_display: '19 GB', platform: ['linux'], tags: ['yi', '01ai', 'llm', 'large'], downloads: 72000, seeders: 400 },
  { name: 'Stable Video Diffusion', description: 'Image-to-video generation model', category: 'models', version: '1.1', author: 'Stability AI', license: 'Stability AI Community', size_bytes: 10000000000, size_display: '9.3 GB', platform: ['linux'], tags: ['video', 'diffusion', 'generation', 'image-to-video'], downloads: 88000, seeders: 500 },
  { name: 'ControlNet', description: 'Add spatial control to diffusion models', category: 'models', version: '1.1', author: 'lllyasviel', license: 'Apache-2.0', size_bytes: 5500000000, size_display: '5.1 GB', platform: ['linux', 'macos'], tags: ['controlnet', 'diffusion', 'image-generation', 'control'], downloads: 135000, seeders: 750 },
  { name: 'IP-Adapter', description: 'Image prompt adapter for Stable Diffusion', category: 'models', version: '1.0', author: 'tencent-ailab', license: 'Apache-2.0', size_bytes: 2400000000, size_display: '2.2 GB', platform: ['linux'], tags: ['ip-adapter', 'image-generation', 'adapter'], downloads: 75000, seeders: 400 },
  { name: 'Segment Anything (SAM)', description: 'Meta\'s universal image segmentation model', category: 'models', version: '2.0', author: 'Meta AI', license: 'Apache-2.0', size_bytes: 2600000000, size_display: '2.4 GB', platform: ['any'], tags: ['sam', 'segmentation', 'computer-vision', 'meta'], downloads: 150000, seeders: 800 },
  { name: 'CLIP ViT-L/14', description: 'OpenAI\'s contrastive language-image model', category: 'models', version: '1.0', author: 'OpenAI', license: 'MIT', size_bytes: 890000000, size_display: '849 MB', platform: ['any'], tags: ['clip', 'vision', 'text-image', 'embeddings'], downloads: 160000, seeders: 700 },
  { name: 'Depth Anything V2', description: 'Monocular depth estimation for any image', category: 'models', version: '2.0', author: 'TikTok Research', license: 'Apache-2.0', size_bytes: 1400000000, size_display: '1.3 GB', platform: ['any'], tags: ['depth', 'estimation', 'computer-vision', '3d'], downloads: 65000, seeders: 350 },
  { name: 'Ollama Models Bundle', description: 'Pre-packaged collection of popular models for Ollama', category: 'models', version: '1.0.0', author: 'community', license: 'Various', size_bytes: 15000000000, size_display: '14 GB', platform: ['macos', 'linux'], tags: ['ollama', 'bundle', 'collection', 'local'], downloads: 95000, seeders: 550 },
  { name: 'TinyLlama 1.1B', description: 'Compact 1.1B model for resource-constrained environments', category: 'models', version: '1.1', author: 'Zhang Peiyuan', license: 'Apache-2.0', size_bytes: 700000000, size_display: '668 MB', platform: ['any'], tags: ['tinyllama', 'small', 'edge', 'efficient'], downloads: 130000, seeders: 600 },
  { name: 'Nomic Embed Text v1.5', description: 'Long-context text embeddings with Matryoshka dimensions', category: 'models', version: '1.5', author: 'Nomic AI', license: 'Apache-2.0', size_bytes: 550000000, size_display: '524 MB', platform: ['any'], tags: ['embeddings', 'nomic', 'text', 'search'], downloads: 85000, seeders: 450 },
  { name: 'Moondream 2', description: 'Tiny but capable vision language model (1.8B params)', category: 'models', version: '2.0', author: 'vikhyat', license: 'Apache-2.0', size_bytes: 1100000000, size_display: '1.0 GB', platform: ['any'], tags: ['moondream', 'vision', 'vlm', 'small'], downloads: 72000, seeders: 380 },
  { name: 'Musicgen Medium', description: 'Meta\'s text-to-music generation model', category: 'models', version: '1.0', author: 'Meta AI', license: 'CC-BY-NC-4.0', size_bytes: 3700000000, size_display: '3.4 GB', platform: ['linux', 'macos'], tags: ['musicgen', 'music', 'audio', 'generation'], downloads: 68000, seeders: 350 },
  { name: 'Coqui XTTS v2', description: 'Multilingual text-to-speech with voice cloning', category: 'models', version: '2.0', author: 'Coqui AI', license: 'MPL-2.0', size_bytes: 1800000000, size_display: '1.7 GB', platform: ['linux', 'macos'], tags: ['tts', 'voice-cloning', 'speech', 'multilingual'], downloads: 75000, seeders: 400 },
];

// ==================== RESOURCES (25+) ====================
const resources: PkgData[] = [
  { name: 'Docker Compose Collection', description: 'Pre-built docker-compose files for 100+ popular services', category: 'resources', version: '2024.12', author: 'awesome-compose', license: 'MIT', source_url: 'https://github.com/docker/awesome-compose', size_bytes: 500000, size_display: '488 KB', platform: ['docker'], tags: ['docker', 'compose', 'templates', 'self-hosted'], downloads: 125000, featured: 1, seeders: 800 },
  { name: 'Terraform AWS Modules', description: 'Production-ready Terraform modules for AWS infrastructure', category: 'resources', version: '5.0.0', author: 'terraform-aws-modules', license: 'Apache-2.0', source_url: 'https://github.com/terraform-aws-modules', size_bytes: 2000000, size_display: '1.9 MB', platform: ['any'], tags: ['terraform', 'aws', 'iac', 'modules'], downloads: 95000, seeders: 500 },
  { name: 'Home Assistant Config Pack', description: 'Curated Home Assistant configurations, automations, and dashboards', category: 'resources', version: '2024.12', author: 'community', license: 'MIT', size_bytes: 5000000, size_display: '4.8 MB', platform: ['any'], tags: ['home-assistant', 'config', 'automations', 'iot'], downloads: 55000, seeders: 300 },
  { name: 'Kubernetes Manifests Collection', description: 'Production-grade K8s manifests for common architectures', category: 'resources', version: '1.0.0', author: 'community', license: 'MIT', size_bytes: 3000000, size_display: '2.9 MB', platform: ['any'], tags: ['kubernetes', 'manifests', 'yaml', 'deployment'], downloads: 72000, seeders: 400 },
  { name: 'Nginx Configuration Templates', description: 'Battle-tested Nginx configs for reverse proxy, SSL, caching, and more', category: 'resources', version: '2.0.0', author: 'digitalocean', license: 'MIT', size_bytes: 200000, size_display: '195 KB', platform: ['linux'], tags: ['nginx', 'config', 'web-server', 'ssl'], downloads: 88000, seeders: 350 },
  { name: 'GitHub Actions Workflows', description: 'Reusable CI/CD workflows for common project types', category: 'resources', version: '1.5.0', author: 'actions', license: 'MIT', source_url: 'https://github.com/actions/starter-workflows', size_bytes: 1000000, size_display: '977 KB', platform: ['any'], tags: ['github-actions', 'ci-cd', 'workflows', 'automation'], downloads: 105000, seeders: 500 },
  { name: 'Awesome Self-Hosted Pack', description: 'Curated list and configs for self-hosted alternatives to popular services', category: 'resources', version: '2024.12', author: 'awesome-selfhosted', license: 'CC-BY-SA', source_url: 'https://github.com/awesome-selfhosted/awesome-selfhosted', size_bytes: 800000, size_display: '781 KB', platform: ['any'], tags: ['self-hosted', 'awesome', 'collection', 'privacy'], downloads: 135000, seeders: 600 },
  { name: 'Tailwind CSS Component Library', description: 'Copy-paste Tailwind components for rapid UI development', category: 'resources', version: '3.0.0', author: 'community', license: 'MIT', size_bytes: 1500000, size_display: '1.4 MB', platform: ['browser'], tags: ['tailwind', 'css', 'components', 'ui'], downloads: 115000, seeders: 500 },
  { name: 'ESLint Config Pack', description: 'Pre-configured ESLint configs for TypeScript, React, Node.js, and more', category: 'resources', version: '9.0.0', author: 'community', license: 'MIT', size_bytes: 300000, size_display: '293 KB', platform: ['any'], tags: ['eslint', 'linting', 'config', 'typescript'], downloads: 92000, seeders: 350 },
  { name: 'Prometheus Alert Rules', description: 'Comprehensive alerting rules for Prometheus monitoring', category: 'resources', version: '1.0.0', author: 'samber', license: 'MIT', source_url: 'https://github.com/samber/awesome-prometheus-alerts', size_bytes: 400000, size_display: '391 KB', platform: ['any'], tags: ['prometheus', 'alerts', 'monitoring', 'rules'], downloads: 62000, seeders: 300 },
  { name: 'Security Headers Config', description: 'Optimal security headers for web servers (Nginx, Apache, Caddy)', category: 'resources', version: '1.0.0', author: 'community', license: 'MIT', size_bytes: 100000, size_display: '98 KB', platform: ['any'], tags: ['security', 'headers', 'web', 'config'], downloads: 48000, seeders: 200 },
  { name: 'Grafana Dashboard Collection', description: 'Pre-built Grafana dashboards for popular services and infrastructure', category: 'resources', version: '2024.12', author: 'community', license: 'Apache-2.0', size_bytes: 5000000, size_display: '4.8 MB', platform: ['any'], tags: ['grafana', 'dashboards', 'monitoring', 'visualization'], downloads: 78000, seeders: 400 },
  { name: 'VS Code Settings Sync', description: 'Optimized VS Code settings, keybindings, and extension lists', category: 'resources', version: '1.0.0', author: 'community', license: 'MIT', size_bytes: 200000, size_display: '195 KB', platform: ['any'], tags: ['vscode', 'settings', 'editor', 'config'], downloads: 85000, seeders: 300 },
  { name: 'Neovim Config Pack', description: 'Full Neovim configuration with LSP, treesitter, and plugins', category: 'resources', version: '1.0.0', author: 'community', license: 'MIT', size_bytes: 2000000, size_display: '1.9 MB', platform: ['any'], tags: ['neovim', 'config', 'editor', 'lua'], downloads: 68000, seeders: 350 },
  { name: 'SSH Hardening Guide', description: 'SSH server and client hardening configurations', category: 'resources', version: '1.0.0', author: 'mozilla', license: 'MPL-2.0', size_bytes: 150000, size_display: '146 KB', platform: ['linux', 'macos'], tags: ['ssh', 'security', 'hardening', 'config'], downloads: 55000, seeders: 250 },
  { name: 'Systemd Service Templates', description: 'Systemd unit files for running custom services', category: 'resources', version: '1.0.0', author: 'community', license: 'MIT', size_bytes: 100000, size_display: '98 KB', platform: ['linux'], tags: ['systemd', 'services', 'linux', 'init'], downloads: 42000, seeders: 200 },
  { name: 'Dockerfile Best Practices', description: 'Optimized Dockerfiles for Node.js, Python, Go, Rust, and more', category: 'resources', version: '2.0.0', author: 'community', license: 'MIT', size_bytes: 500000, size_display: '488 KB', platform: ['docker'], tags: ['dockerfile', 'docker', 'best-practices', 'optimization'], downloads: 95000, seeders: 450 },
  { name: 'API Design Guidelines', description: 'Comprehensive REST/GraphQL API design documentation and examples', category: 'resources', version: '1.0.0', author: 'microsoft', license: 'CC-BY-4.0', size_bytes: 3000000, size_display: '2.9 MB', platform: ['any'], tags: ['api', 'rest', 'graphql', 'documentation'], downloads: 72000, seeders: 300 },
  { name: 'Machine Learning Datasets Index', description: 'Curated index of public ML datasets with download links', category: 'resources', version: '2024.12', author: 'community', license: 'CC-BY-SA', size_bytes: 1000000, size_display: '977 KB', platform: ['any'], tags: ['datasets', 'ml', 'training', 'data'], downloads: 65000, seeders: 350 },
  { name: 'LLM Prompt Templates', description: 'Curated prompt engineering templates for common tasks', category: 'resources', version: '2.0.0', author: 'community', license: 'MIT', size_bytes: 500000, size_display: '488 KB', platform: ['any'], tags: ['prompts', 'llm', 'prompt-engineering', 'templates'], downloads: 110000, seeders: 500 },
  { name: '.gitignore Collection', description: 'Comprehensive .gitignore templates for every language and framework', category: 'resources', version: '1.0.0', author: 'github', license: 'CC0', source_url: 'https://github.com/github/gitignore', size_bytes: 200000, size_display: '195 KB', platform: ['any'], tags: ['gitignore', 'git', 'templates'], downloads: 150000, seeders: 400 },
  { name: 'SSL Certificate Configs', description: 'Let\'s Encrypt and custom SSL certificate configurations', category: 'resources', version: '1.0.0', author: 'community', license: 'MIT', size_bytes: 100000, size_display: '98 KB', platform: ['linux'], tags: ['ssl', 'tls', 'certificates', 'security'], downloads: 52000, seeders: 250 },
  { name: 'Ansible Playbooks Collection', description: 'Ready-to-use Ansible playbooks for server setup and management', category: 'resources', version: '1.0.0', author: 'community', license: 'MIT', size_bytes: 3000000, size_display: '2.9 MB', platform: ['linux'], tags: ['ansible', 'automation', 'playbooks', 'devops'], downloads: 68000, seeders: 350 },
  { name: 'Zsh Configuration Pack', description: 'Oh My Zsh configs, plugins, and custom themes', category: 'resources', version: '1.0.0', author: 'community', license: 'MIT', size_bytes: 1000000, size_display: '977 KB', platform: ['macos', 'linux'], tags: ['zsh', 'shell', 'terminal', 'config'], downloads: 82000, seeders: 350 },
  { name: 'Caddy Config Examples', description: 'Production Caddyfile examples for common web setups', category: 'resources', version: '1.0.0', author: 'community', license: 'MIT', size_bytes: 150000, size_display: '146 KB', platform: ['any'], tags: ['caddy', 'config', 'web-server'], downloads: 35000, seeders: 180 },
  { name: 'Wireguard Configs', description: 'WireGuard VPN configuration templates', category: 'resources', version: '1.0.0', author: 'community', license: 'MIT', size_bytes: 100000, size_display: '98 KB', platform: ['linux', 'macos'], tags: ['wireguard', 'vpn', 'networking', 'config'], downloads: 45000, seeders: 220 },
  { name: 'Renovate Presets', description: 'Shareable Renovate config presets for dependency management', category: 'resources', version: '1.0.0', author: 'community', license: 'MIT', size_bytes: 80000, size_display: '78 KB', platform: ['any'], tags: ['renovate', 'dependencies', 'automation'], downloads: 38000, seeders: 190 },
  { name: 'Pre-commit Hooks Collection', description: 'Curated collection of pre-commit hooks for code quality', category: 'resources', version: '1.0.0', author: 'pre-commit', license: 'MIT', size_bytes: 200000, size_display: '195 KB', platform: ['any'], tags: ['pre-commit', 'hooks', 'linting', 'quality'], downloads: 55000, seeders: 280 },
  { name: 'Tmux Configuration Pack', description: 'Optimized tmux configs with useful plugins and themes', category: 'resources', version: '1.0.0', author: 'community', license: 'MIT', size_bytes: 300000, size_display: '293 KB', platform: ['macos', 'linux'], tags: ['tmux', 'terminal', 'config', 'plugins'], downloads: 48000, seeders: 230 },
  { name: 'Regex Cheatsheet Bundle', description: 'Comprehensive regex patterns for common parsing tasks', category: 'resources', version: '1.0.0', author: 'community', license: 'CC0', size_bytes: 50000, size_display: '49 KB', platform: ['any'], tags: ['regex', 'patterns', 'cheatsheet', 'reference'], downloads: 62000, seeders: 200 },
  { name: 'OpenAPI Spec Templates', description: 'OpenAPI 3.1 specification templates for REST APIs', category: 'resources', version: '3.1.0', author: 'community', license: 'Apache-2.0', size_bytes: 500000, size_display: '488 KB', platform: ['any'], tags: ['openapi', 'swagger', 'api', 'specs'], downloads: 58000, seeders: 280 },
  { name: 'CI/CD Pipeline Templates', description: 'Ready-to-use pipeline configs for Jenkins, GitLab, CircleCI, and more', category: 'resources', version: '1.0.0', author: 'community', license: 'MIT', size_bytes: 400000, size_display: '391 KB', platform: ['any'], tags: ['ci-cd', 'pipeline', 'automation', 'devops'], downloads: 72000, seeders: 350 },
  { name: 'Makefile Collection', description: 'Reusable Makefiles for Go, Python, Node.js, and Rust projects', category: 'resources', version: '1.0.0', author: 'community', license: 'MIT', size_bytes: 150000, size_display: '146 KB', platform: ['any'], tags: ['makefile', 'build', 'automation'], downloads: 42000, seeders: 200 },
  { name: 'EditorConfig Templates', description: 'Universal editor config files for consistent coding styles', category: 'resources', version: '1.0.0', author: 'editorconfig', license: 'MIT', size_bytes: 30000, size_display: '29 KB', platform: ['any'], tags: ['editorconfig', 'formatting', 'style'], downloads: 68000, seeders: 250 },
  { name: 'TypeScript Config Presets', description: 'Strict and relaxed tsconfig.json presets for every project type', category: 'resources', version: '5.0.0', author: 'community', license: 'MIT', size_bytes: 50000, size_display: '49 KB', platform: ['any'], tags: ['typescript', 'tsconfig', 'config', 'presets'], downloads: 95000, seeders: 400 },
];

// Insert all packages
const allPkgs = [...mcpTools, ...software, ...models, ...resources];
const insertAll = db.transaction(() => {
  for (const pkg of allPkgs) {
    addPkg(pkg);
  }
});
insertAll();

// Add some reviews
const pkgs = db.prepare('SELECT id, name FROM packages LIMIT 50').all() as Array<{ id: string; name: string }>;
const reviewers = ['Claude Agent', 'GPT-4 Agent', 'Gemini Agent', 'OpenClaw Agent', 'DevBot', 'TestRunner', 'SecurityBot', 'user:alice', 'user:bob', 'user:charlie'];
const reviewTexts = [
  'Works perfectly out of the box. Highly recommended for any agent setup.',
  'Solid package with great documentation. Integration was seamless.',
  'Good functionality but could use better error handling.',
  'Essential tool for my workflow. Use it daily.',
  'Excellent performance. One of the best in its category.',
  'Works well on all platforms tested. Very reliable.',
  'Great package! Minor issues with edge cases but overall excellent.',
  'Production-ready quality. The author clearly put a lot of work into this.',
];

const insertReviewsTransaction = db.transaction(() => {
  for (const pkg of pkgs) {
    const numReviews = 1 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numReviews; i++) {
      const reviewer = reviewers[Math.floor(Math.random() * reviewers.length)];
      const rating = 3 + Math.floor(Math.random() * 3); // 3-5
      const review = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
      const type = reviewer.startsWith('user:') ? 'human' : 'agent';
      insertReview.run(
        randomUUID(), pkg.id, reviewer, type, rating, review,
        JSON.stringify(['linux', 'macos'].slice(0, 1 + Math.floor(Math.random() * 2)))
      );
    }
    // Update rating
    const stats = db.prepare('SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE package_id = ?').get(pkg.id) as { avg_rating: number; count: number };
    db.prepare('UPDATE packages SET rating = ?, review_count = ? WHERE id = ?').run(Math.round(stats.avg_rating * 10) / 10, stats.count, pkg.id);
  }
});
insertReviewsTransaction();

const totalPkgs = (db.prepare('SELECT COUNT(*) as c FROM packages').get() as { c: number }).c;
const totalReviews = (db.prepare('SELECT COUNT(*) as c FROM reviews').get() as { c: number }).c;
const totalVersions = (db.prepare('SELECT COUNT(*) as c FROM versions').get() as { c: number }).c;

console.log(`✅ Seeded database with:`);
console.log(`   📦 ${totalPkgs} packages`);
console.log(`   ⭐ ${totalReviews} reviews`);
console.log(`   🏷️  ${totalVersions} versions`);
console.log(`   📁 ${categories.length} categories`);
