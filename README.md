# 🦞 OpenClaw Equipment

**The package registry for AI agents.** Find, install, and configure tools for any agent role — from the command line or via API.

🌐 **Live:** [openclaw.equipment](https://openclaw.equipment)  
📦 **184 packages** | 🎒 **6 loadouts** | 🤖 **6 agent profiles**  
📄 **Agent discovery:** [openclaw.equipment/llms.txt](https://openclaw.equipment/llms.txt)

---

## What Is This?

Equipment is a registry of tools, MCP servers, and curated bundles ("loadouts") that AI agents can discover and install. Think **npm for agents**.

- **Packages** — Real, installable tools with `npx`, `npm`, `pip`, `brew`, or `git` commands
- **Loadouts** — Curated tool bundles for agent roles (Chief of Staff, Smart Home, Sysadmin, etc.) with SOUL.md, workflows, and install scripts
- **Profiles** — Example agent configurations showing how tools come together
- **API** — CORS-open REST API that any agent can call directly
- **llms.txt** — Standard discovery file so agents can find and use the registry

## Quick Start

### For Agents (API)

```bash
# Search for packages
curl "https://openclaw.equipment/api/packages/search?q=calendar"

# Get install instructions for a package
curl "https://openclaw.equipment/api/v1/install/google-calendar-mcp-server"

# Get a complete loadout bundle (SOUL.md + tools + install script)
curl "https://openclaw.equipment/api/v1/loadouts/chief-of-staff"

# Browse the full registry
curl "https://openclaw.equipment/api/v1/registry"
```

### For Humans (CLI)

```bash
# Clone and use the CLI
git clone https://github.com/lrn2codenow/openclaw-equipment.git
cd openclaw-equipment

# Search packages
node cli/equip.js search mcp

# Get package details
node cli/equip.js info brave-search-mcp-server

# Install a loadout (creates directory with SOUL.md + install script)
node cli/equip.js loadout chief-of-staff
```

### For Developers

```bash
git clone https://github.com/lrn2codenow/openclaw-equipment.git
cd openclaw-equipment
npm install
npm run dev     # Start on http://localhost:3800
```

## API Reference

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check + stats |
| `GET /api/packages/search?q=` | Search packages (CORS open) |
| `GET /api/packages/{slug}` | Package details |
| `GET /api/v1/registry` | Full package index |
| `GET /api/v1/install/{slug}` | Install instructions + MCP config |
| `GET /api/v1/loadouts/{slug}` | Complete loadout bundle |
| `GET /api/webmcp/search?query=` | WebMCP-compatible search |
| `GET /api/webmcp/loadouts` | List all loadouts |
| `GET /api/stats` | Registry statistics |
| `POST /api/package` | Submit a new package |
| `GET /llms.txt` | Agent discovery document |

All API endpoints return JSON with CORS headers. No auth required for reads.

## Architecture

- **Next.js 16** (TypeScript, App Router, Turbopack)
- **Static JSON data layer** (works on Vercel serverless — no runtime DB needed)
- **SQLite** (better-sqlite3) for local development
- **Tailwind CSS** — Dark theme (slate/zinc + emerald/cyan)

## Contributing

We want the community to make this real. Here's how you can help:

### 🟢 Easy Wins
- **Add packages** — Know a great MCP server or agent tool? Add it via `/publish` on the site or submit a PR with the package data
- **Fix package data** — Wrong install command? Broken source URL? PRs welcome
- **Test the CLI** — Try `equip` commands and report issues

### 🟡 Medium Effort
- **Build new loadouts** — Design a loadout for your use case (DevOps, Marketing, Research, etc.)
- **Write agent profiles** — Show how you've configured an agent with Equipment tools
- **Improve search** — The search is basic text matching — fuzzy search, tag weighting, etc.

### 🔴 Big Impact
- **OpenClaw core integration** — Build `openclaw equip` as a native command
- **CLI npm package** — Help us publish `@openclaw/equip` to npm
- **Package validation** — Automated testing that install commands actually work
- **Credit economy** — Wire up the contribution/credit system for package authors
- **P2P distribution** — WebTorrent-based package distribution

### How to Add a Package

1. Via the web: Go to [openclaw.equipment/publish](https://openclaw.equipment/publish)
2. Via PR: Add entry to `public/data/packages.json`:

```json
{
  "slug": "my-tool",
  "name": "My Tool",
  "description": "What it does",
  "category": "mcp-tools",
  "version": "1.0.0",
  "install": "npx -y my-tool",
  "source_url": "https://github.com/...",
  "tags": "[\"tag1\",\"tag2\"]",
  "platform": "[\"any\"]",
  "license": "MIT",
  "author": "Your Name"
}
```

### How to Create a Loadout

Add to `src/data/loadouts.ts` — a loadout includes:
- Name, description, category
- Core tools (required) + optional tools
- Workflows with triggers
- Sample SOUL.md for the agent role

## Loadouts

| Loadout | Description |
|---------|-------------|
| 👽 Chief of Staff | Orchestrator — calendar, email, tasks, sub-agents |
| 🏠 Smart Home | Device control, automation, MQTT, sensors |
| 👩‍💼 Executive Assistant | Calendar, meetings, email, daily briefings |
| 💰 CFO / Finance | Budgets, invoices, portfolio, vault |
| 🖥️ Sysadmin | SSH, Docker, monitoring, security |
| 🎨 Content Creator | Blog, SEO, social media, video |

## Community

- **OpenClaw Discord:** [discord.com/invite/clawd](https://discord.com/invite/clawd)
- **GitHub Issues:** [Report bugs or request features](https://github.com/lrn2codenow/openclaw-equipment/issues)

## License

MIT

---

*Built with 🦞 by the OpenClaw community. Every tool an agent needs, one claw away.*
