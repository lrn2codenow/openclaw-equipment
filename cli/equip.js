#!/usr/bin/env node
// equip - The Package Manager for AI Agents
// https://openclaw.equipment

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// ── Constants ──────────────────────────────────────────────────────────
const VERSION = '0.1.0';
const DEFAULT_REGISTRY = 'https://openclaw.equipment';
const CACHE_DIR = path.join(process.env.HOME || '~', '.equip', 'cache');
const CACHE_TTL = 15 * 60 * 1000; // 15 min

// ── ANSI Colors ────────────────────────────────────────────────────────
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
};

const NO_COLOR = process.env.NO_COLOR || process.env.TERM === 'dumb';
const color = (code, text) => NO_COLOR ? text : `${code}${text}${c.reset}`;

// ── Box Drawing ────────────────────────────────────────────────────────
const box = {
  tl: '╭', tr: '╮', bl: '╰', br: '╯',
  h: '─', v: '│', t: '┬', b: '┴', l: '├', r: '┤', x: '┼',
};

function banner() {
  const w = 52;
  const pad = (s, len) => s + ' '.repeat(Math.max(0, len - stripAnsi(s).length));
  const line = (s) => `  ${color(c.dim, box.v)} ${pad(s, w)} ${color(c.dim, box.v)}`;
  console.log();
  console.log(`  ${color(c.dim, box.tl + box.h.repeat(w + 2) + box.tr)}`);
  console.log(line(`${color(c.bold + c.red, '🦞 equip')} ${color(c.dim, `v${VERSION}`)}  ${color(c.cyan, '— The Package Manager for AI Agents')}`));
  console.log(`  ${color(c.dim, box.bl + box.h.repeat(w + 2) + box.br)}`);
  console.log();
}

function stripAnsi(s) {
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

// ── Registry / Fetch ───────────────────────────────────────────────────
function getRegistry() {
  const idx = process.argv.indexOf('--registry');
  if (idx !== -1 && process.argv[idx + 1]) return process.argv[idx + 1];
  return process.env.EQUIP_REGISTRY || DEFAULT_REGISTRY;
}

function ensureCacheDir() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function cacheKey(url) {
  // simple hash
  let h = 0;
  for (let i = 0; i < url.length; i++) h = ((h << 5) - h + url.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

function readCache(url) {
  try {
    const file = path.join(CACHE_DIR, cacheKey(url) + '.json');
    const stat = fs.statSync(file);
    if (Date.now() - stat.mtimeMs < CACHE_TTL) {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    }
  } catch {}
  return null;
}

function writeCache(url, data) {
  try {
    ensureCacheDir();
    fs.writeFileSync(path.join(CACHE_DIR, cacheKey(url) + '.json'), JSON.stringify(data));
  } catch {}
}

async function api(endpoint) {
  const url = `${getRegistry()}${endpoint}`;
  const cached = readCache(url);
  if (cached) return cached;

  const res = await fetch(url, {
    headers: { 'User-Agent': `equip-cli/${VERSION}` },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText} (${url})`);
  }
  const data = await res.json();
  writeCache(url, data);
  return data;
}

// ── Prompt ──────────────────────────────────────────────────────────────
function confirm(question) {
  if (process.argv.includes('--yes') || process.argv.includes('-y')) return Promise.resolve(true);
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(`  ${color(c.yellow, '?')} ${question} ${color(c.dim, '[y/N]')} `, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y' || answer.trim().toLowerCase() === 'yes');
    });
  });
}

// ── Format Helpers ──────────────────────────────────────────────────────
function formatDownloads(n) {
  if (!n) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

function categoryBadge(cat) {
  const colors = {
    'mcp-tools': c.blue,
    'a2a-tools': c.magenta,
    'ai-tools': c.cyan,
    'dev-tools': c.green,
    'data-tools': c.yellow,
  };
  return color(colors[cat] || c.dim, `[${cat}]`);
}

function pkgLine(pkg) {
  const name = color(c.bold + c.white, pkg.name || pkg.slug);
  const badge = categoryBadge(pkg.category);
  const dl = color(c.dim, `↓${formatDownloads(pkg.downloads)}`);
  const desc = color(c.dim, (pkg.description || '').slice(0, 60));
  console.log(`  ${name} ${badge} ${dl}`);
  console.log(`    ${desc}`);
}

// ── Commands ────────────────────────────────────────────────────────────

async function cmdSearch(query) {
  if (!query) {
    console.error(color(c.red, '  ✗ Usage: equip search <query>'));
    process.exit(1);
  }
  banner();
  console.log(`  ${color(c.dim, 'Searching for')} ${color(c.cyan, query)}${color(c.dim, '...')}\n`);

  const data = await api(`/api/packages/search?q=${encodeURIComponent(query)}`);
  const packages = data.packages || data.results || data;

  if (!Array.isArray(packages) || packages.length === 0) {
    console.log(`  ${color(c.yellow, '⚠')} No packages found for "${query}"`);
    return;
  }

  console.log(`  ${color(c.green, `✓ ${packages.length} package(s) found`)}\n`);
  for (const pkg of packages) {
    pkgLine(pkg);
    console.log();
  }
}

async function cmdBrowse(category) {
  banner();
  const endpoint = category
    ? `/api/packages/search?category=${encodeURIComponent(category)}`
    : '/api/packages/search?limit=25';
  console.log(`  ${color(c.dim, category ? `Browsing category: ${category}` : 'Browsing all packages')}...\n`);

  const data = await api(endpoint);
  const packages = data.packages || data.results || data;

  if (!Array.isArray(packages) || packages.length === 0) {
    console.log(`  ${color(c.yellow, '⚠')} No packages found`);
    if (!category) return;
    // show categories
    try {
      const cats = await api('/api/packages/categories');
      console.log(`\n  ${color(c.bold, 'Available categories:')}`);
      for (const ct of (cats.categories || cats)) {
        console.log(`    ${color(c.cyan, '•')} ${ct.name || ct.slug || ct}`);
      }
    } catch {}
    return;
  }

  console.log(`  ${color(c.green, `✓ ${packages.length} package(s)`)}\n`);
  for (const pkg of packages) {
    pkgLine(pkg);
    console.log();
  }
}

async function cmdInfo(slug) {
  if (!slug) {
    console.error(color(c.red, '  ✗ Usage: equip info <slug>'));
    process.exit(1);
  }
  banner();

  const pkg = await api(`/api/packages/${encodeURIComponent(slug)}`);
  if (pkg.error) {
    console.error(`  ${color(c.red, '✗')} Package not found: ${slug}`);
    process.exit(1);
  }

  const w = 56;
  const hr = color(c.dim, box.h.repeat(w));

  console.log(`  ${color(c.bold + c.white, pkg.name)} ${color(c.dim, `v${pkg.version || '?'}`)}`);
  console.log(`  ${categoryBadge(pkg.category)} ${color(c.dim, `by ${pkg.author || 'unknown'}`)}`);
  console.log(`  ${hr}`);
  console.log(`  ${pkg.description || ''}`);
  console.log();

  const field = (label, val) => {
    if (!val) return;
    console.log(`  ${color(c.cyan, label.padEnd(14))} ${val}`);
  };

  field('Downloads', formatDownloads(pkg.downloads));
  field('License', pkg.license);
  field('Platform', tryParse(pkg.platform)?.join(', ') || pkg.platform);
  field('Compat', tryParse(pkg.compatibility)?.join(', ') || pkg.compatibility);
  field('Source', pkg.source_url);
  field('Homepage', pkg.homepage);

  if (pkg.install) {
    console.log();
    console.log(`  ${color(c.bold + c.green, 'Install:')}`);
    console.log(`  ${color(c.dim, '$')} ${pkg.install}`);
  }

  if (pkg.tags) {
    const tags = tryParse(pkg.tags) || [];
    if (tags.length) {
      console.log();
      console.log(`  ${color(c.dim, tags.map(t => `#${t}`).join('  '))}`);
    }
  }

  if (pkg.llm_summary) {
    console.log();
    console.log(`  ${color(c.bold, 'LLM Summary:')}`);
    console.log(`  ${color(c.dim, pkg.llm_summary)}`);
  }
  console.log();
}

async function cmdInstall(slug) {
  if (!slug) {
    console.error(color(c.red, '  ✗ Usage: equip install <slug>'));
    process.exit(1);
  }
  banner();
  console.log(`  ${color(c.dim, 'Fetching package info...')}\n`);

  const pkg = await api(`/api/packages/${encodeURIComponent(slug)}`);
  if (pkg.error) {
    console.error(`  ${color(c.red, '✗')} Package not found: ${slug}`);
    process.exit(1);
  }

  if (!pkg.install) {
    console.error(`  ${color(c.red, '✗')} No install command defined for ${slug}`);
    process.exit(1);
  }

  console.log(`  ${color(c.bold, pkg.name)} ${color(c.dim, `v${pkg.version || '?'}`)}`);
  console.log(`  ${pkg.description || ''}\n`);
  console.log(`  ${color(c.bold + c.yellow, 'Will execute:')}`);
  console.log(`  ${color(c.white, '$ ' + pkg.install)}\n`);

  const ok = await confirm('Proceed with installation?');
  if (!ok) {
    console.log(`\n  ${color(c.yellow, '⚠')} Installation cancelled.`);
    return;
  }

  console.log();
  console.log(`  ${color(c.cyan, '⚙')} Running install command...\n`);

  try {
    execSync(pkg.install, { stdio: 'inherit', shell: true });
    console.log(`\n  ${color(c.green, '✓')} ${pkg.name} installed successfully!`);
  } catch (err) {
    console.error(`\n  ${color(c.red, '✗')} Installation failed (exit code ${err.status})`);
    process.exit(1);
  }
}

async function cmdLoadout(slug) {
  if (!slug) {
    console.error(color(c.red, '  ✗ Usage: equip loadout <slug>'));
    process.exit(1);
  }
  banner();
  console.log(`  ${color(c.dim, 'Fetching loadout...')}\n`);

  const loadout = await api(`/api/webmcp/loadouts/${encodeURIComponent(slug)}`);
  if (loadout.error) {
    console.error(`  ${color(c.red, '✗')} Loadout not found: ${slug}`);
    process.exit(1);
  }

  console.log(`  ${color(c.bold, `${loadout.emoji || '📦'} ${loadout.name}`)}`);
  console.log(`  ${loadout.description || ''}\n`);

  if (loadout.coreTools?.length) {
    console.log(`  ${color(c.bold + c.cyan, 'Core Tools:')}`);
    for (const tool of loadout.coreTools) {
      console.log(`    ${color(c.green, '•')} ${color(c.white, tool.name)} ${color(c.dim, '— ' + tool.description)}`);
    }
    console.log();
  }

  if (loadout.workflows?.length) {
    console.log(`  ${color(c.bold + c.magenta, 'Workflows:')}`);
    for (const wf of loadout.workflows) {
      console.log(`    ${color(c.yellow, '⚡')} ${color(c.white, wf.name)} ${color(c.dim, `(${wf.trigger})`)} ${color(c.dim, '— ' + wf.description)}`);
    }
    console.log();
  }

  // Create loadout directory
  const dir = path.join(process.cwd(), `loadout-${slug}`);
  console.log(`  ${color(c.bold + c.yellow, 'Will create:')}`);
  console.log(`    ${color(c.dim, dir + '/')}`);
  console.log(`    ${color(c.dim, '├── SOUL.md')}`);
  console.log(`    ${color(c.dim, '└── install.sh')}`);
  console.log();

  const ok = await confirm('Create loadout directory?');
  if (!ok) {
    console.log(`\n  ${color(c.yellow, '⚠')} Cancelled.`);
    return;
  }

  fs.mkdirSync(dir, { recursive: true });

  // Write SOUL.md
  if (loadout.sampleSoul) {
    fs.writeFileSync(path.join(dir, 'SOUL.md'), loadout.sampleSoul);
  }

  // Write install.sh
  const installLines = ['#!/usr/bin/env bash', `# Install script for ${loadout.name} loadout`, 'set -e', ''];
  if (loadout.coreTools?.length) {
    installLines.push('echo "Installing core tools..."');
    installLines.push(`echo "Note: Use 'equip install <slug>' for each tool package"`);
    for (const tool of loadout.coreTools) {
      installLines.push(`echo "  → ${tool.name}"`);
    }
  }
  installLines.push('', 'echo "✓ Loadout ready!"');
  const installSh = path.join(dir, 'install.sh');
  fs.writeFileSync(installSh, installLines.join('\n') + '\n');
  fs.chmodSync(installSh, '755');

  console.log(`\n  ${color(c.green, '✓')} Loadout created at ${color(c.bold, dir)}`);
  console.log(`  ${color(c.dim, 'Run')} cd loadout-${slug} ${color(c.dim, 'to get started')}`);
  console.log();
}

function cmdHelp() {
  banner();
  console.log(`  ${color(c.bold, 'USAGE')}`);
  console.log(`    ${color(c.cyan, 'equip')} ${color(c.white, '<command>')} [options]\n`);
  console.log(`  ${color(c.bold, 'COMMANDS')}`);
  console.log(`    ${color(c.white, 'search <query>')}     Search for packages`);
  console.log(`    ${color(c.white, 'install <slug>')}     Install a package`);
  console.log(`    ${color(c.white, 'info <slug>')}        Show package details`);
  console.log(`    ${color(c.white, 'browse [category]')} Browse packages`);
  console.log(`    ${color(c.white, 'loadout <slug>')}     Install an agent loadout`);
  console.log(`    ${color(c.white, 'help')}               Show this help\n`);
  console.log(`  ${color(c.bold, 'OPTIONS')}`);
  console.log(`    ${color(c.dim, '--registry <url>')}   Override registry URL`);
  console.log(`    ${color(c.dim, '--yes, -y')}          Skip confirmation prompts`);
  console.log(`    ${color(c.dim, '--version')}          Show version\n`);
  console.log(`  ${color(c.bold, 'ENVIRONMENT')}`);
  console.log(`    ${color(c.dim, 'EQUIP_REGISTRY')}     Override registry URL`);
  console.log(`    ${color(c.dim, 'NO_COLOR')}           Disable colors\n`);
}

// ── Helpers ─────────────────────────────────────────────────────────────
function tryParse(val) {
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return null; }
}

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
  // Strip flags to find command + args
  const raw = process.argv.slice(2);
  const args = [];
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === '--registry') { i++; continue; }
    if (raw[i].startsWith('--') || raw[i].startsWith('-')) continue;
    args.push(raw[i]);
  }
  const flags = raw;

  if (flags.includes('--version')) {
    console.log(VERSION);
    return;
  }

  const cmd = args[0];
  const arg = args[1];

  try {
    switch (cmd) {
      case 'search': case 's':   await cmdSearch(arg); break;
      case 'install': case 'i':  await cmdInstall(arg); break;
      case 'info':               await cmdInfo(arg); break;
      case 'browse': case 'b':   await cmdBrowse(arg); break;
      case 'loadout': case 'l':  await cmdLoadout(arg); break;
      case 'help': case undefined: cmdHelp(); break;
      default:
        console.error(`  ${color(c.red, '✗')} Unknown command: ${cmd}`);
        console.error(`  ${color(c.dim, 'Run')} equip help ${color(c.dim, 'for usage')}`);
        process.exit(1);
    }
  } catch (err) {
    console.error(`\n  ${color(c.red, '✗')} ${err.message}`);
    if (process.env.DEBUG) console.error(err.stack);
    process.exit(1);
  }
}

main();
