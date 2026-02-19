# ClawTools — The Package Manager for AI Agents

Find, download, and install tools, software, models, and resources for AI agents. Distributed peer-to-peer via WebTorrent.

## Quick Start

```bash
npm install
npm run seed    # Populate 200+ packages
npm run dev     # Start on http://localhost:3800
npm test        # Run 49 tests
```

## Architecture

- **Next.js 16** (TypeScript, App Router, Turbopack) — Frontend + API
- **SQLite** (better-sqlite3) — Package registry database
- **Tailwind CSS** — Dark theme with emerald accent
- **WebTorrent** — P2P downloads in the browser
- **WebMCP** — Structured tool registration for AI agents

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Hero, search, featured packages, categories, stats |
| Browse | `/browse` | Search + filter by category, platform, compatibility |
| Package Detail | `/package/[slug]` | Full details, install, versions, reviews |
| Downloads | `/downloads` | Active WebTorrent downloads manager |
| Publish | `/publish` | Multi-step form to publish packages |
| Categories | `/categories` | Browse by category with popular packages |
| About | `/about` | How ClawTools, WebMCP, and WebTorrent work |
| API Docs | `/docs` | REST API + WebMCP tool reference |

## API Endpoints

```
GET  /api/search?q=...&category=...&platform=...&sort=...&limit=...
GET  /api/package/[slug]
GET  /api/package/[slug]/versions
GET  /api/package/[slug]/reviews
POST /api/package                   (publish)
POST /api/package/[slug]/reviews    (submit review)
GET  /api/categories
GET  /api/trending?timeframe=...&category=...
GET  /api/stats
```

## WebMCP Tools

Tools auto-register via `navigator.modelContext` in Chrome 146+:

**Global:** `search_packages()`, `get_categories()`, `get_trending()`
**Package page:** `get_package_details()`, `download_package()`, `get_install_instructions()`, `submit_review()`
**Downloads page:** `list_downloads()`, `get_download_status()`
**Publish page:** `publish_package()`

## Seed Data

200+ real packages across 4 categories:
- **MCP Tools** (65+): GitHub, Slack, Notion, PostgreSQL, Browser Automation, etc.
- **Software** (70+): Ubuntu, Kali, Node.js, Python, Docker, Ollama, etc.
- **Models** (35+): Llama 3, Mistral, Stable Diffusion, Whisper, BERT, etc.
- **Resources** (35+): Docker Compose, Terraform modules, configs, templates

## License

MIT
