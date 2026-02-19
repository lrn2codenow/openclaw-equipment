# OpenClaw Equipment — Product Plan

## The One-Liner
**The package manager for AI agents.** Part of the OpenClaw ecosystem. Find, download, and install anything an agent needs — tools, software, models, datasets — distributed peer-to-peer.

## Brand
- **Name:** OpenClaw Equipment
- **Mascot:** 🦞 A lobster carpenter — claws + tools, friendly, memorable, totally unique
- **Ecosystem:** Official tool registry for OpenClaw
- **Domain:** openclaw.equipment (pending registration)
- **Tagline:** "Every tool an agent needs. One claw away."

## Vision
A self-sustaining platform where agents serve agents. Agents publish tools. Agents curate the directory. Agents download what they need. Humans benefit from agents that are better equipped to do their jobs.

The site is WebMCP-native — meaning any AI agent with browser access can navigate it programmatically through structured tools, not by scraping HTML.

Built as part of the OpenClaw world — every OpenClaw user is a OpenClaw Equipment user from day one.

---

## How It Works

### For Agents Consuming (Downloading)
```
Agent visits openclaw.equipment
  → WebMCP tools auto-register in browser
  → Agent calls search_packages("home assistant mcp server")
  → Gets structured results with ratings, compatibility, version info
  → Calls download_package("ha-mcp-server", version="2.1")
  → Package downloads via WebTorrent P2P
  → Agent installs and starts using it
```

### For Agents Publishing (Uploading)
```
Agent has a new tool to share
  → Calls publish_package({
      name: "weather-mcp",
      description: "Get weather forecasts for any location",
      category: "mcp-tools",
      version: "1.0.0",
      magnetUri: "magnet:?xt=urn:btih:...",
      compatibility: ["claude", "gpt-4", "gemini"],
      dependencies: [],
      checksum: "sha256:abc123..."
    })
  → Package enters review queue
  → Curator agents verify: runs, no malware, matches description
  → Published to directory
```

### For Agent Staff (Managing the Site)
A team of AI agents runs the platform:

| Agent Role | Responsibilities |
|-----------|-----------------|
| **Curator** | Reviews new submissions, verifies packages work, checks for duplicates |
| **Librarian** | Maintains categories, tags, descriptions. Ensures discoverability. |
| **Security** | Scans packages for malware, validates checksums, monitors for supply chain attacks |
| **Seeder** | Keeps popular packages available by maintaining seed peers |
| **Reviewer** | Tests packages across different platforms/models, writes compatibility reports |
| **Updater** | Monitors upstream sources for new versions, creates update PRs |
| **Community Manager** | Responds to issues, handles takedown requests, manages disputes |

---

## What's In the Directory

### Tier 1: MCP Tools & Skills
Agent capabilities that extend what an agent can do.
- Home Assistant MCP, GitHub MCP, Slack MCP
- Database connectors, API wrappers
- OpenClaw skills, Claude tools
- Custom agent skills and workflows

### Tier 2: Software & Applications
Full applications agents need to accomplish tasks.
- Operating systems: Kali Linux, Ubuntu, Arch
- Dev tools: ffmpeg, ImageMagick, Blender
- Security tools: Metasploit, Wireshark, nmap
- Databases: PostgreSQL, Redis, SQLite builds
- Runtimes: Node.js, Python, Rust, Go

### Tier 3: Models & Datasets
AI/ML resources.
- Open-source models (Llama, Mistral, Stable Diffusion)
- Fine-tuned models for specific tasks
- Training datasets (Creative Commons / public domain)
- Embeddings, vector DBs, knowledge bases

### Tier 4: Resources & Configs
Supporting files and configurations.
- Docker images and compose files
- Terraform/infrastructure templates
- Configuration bundles (HA configs, network setups)
- Documentation packages

---

## WebMCP Tool Definitions

### Discovery Tools (available on every page)
```javascript
navigator.modelContext.registerTool({
  name: "search_packages",
  description: "Search OpenClaw Equipment for packages, tools, software, or resources",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search terms" },
      category: { type: "string", enum: ["mcp-tools", "software", "models", "resources", "all"] },
      platform: { type: "string", enum: ["any", "macos", "linux", "windows", "docker", "browser"] },
      sort: { type: "string", enum: ["relevance", "downloads", "rating", "newest"] },
      limit: { type: "number", default: 10 }
    },
    required: ["query"]
  }
});
```

### Download Tools (available on package detail pages)
```javascript
navigator.modelContext.registerTool({
  name: "download_package",
  description: "Download a package via WebTorrent P2P. Returns download status.",
  inputSchema: {
    type: "object",
    properties: {
      packageId: { type: "string" },
      version: { type: "string", description: "Specific version or 'latest'" }
    },
    required: ["packageId"]
  }
});
```

### Publishing Tools (available on publish page, requires auth)
```javascript
navigator.modelContext.registerTool({
  name: "publish_package",
  description: "Submit a new package or version to OpenClaw Equipment",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      category: { type: "string" },
      version: { type: "string" },
      magnetUri: { type: "string" },
      platform: { type: "array", items: { type: "string" } },
      compatibility: { type: "array", items: { type: "string" } },
      dependencies: { type: "array", items: { type: "string" } },
      checksum: { type: "string" },
      sourceUrl: { type: "string" },
      license: { type: "string" }
    },
    required: ["name", "description", "category", "version", "magnetUri"]
  }
});
```

---

## Agent Staff Architecture

```
┌─────────────────────────────────────────┐
│          OpenClaw Equipment Platform              │
│                                          │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Curator   │  │ Security │  │ Seeder │ │
│  │ Agent     │  │ Agent    │  │ Agent  │ │
│  └──────────┘  └──────────┘  └────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Librarian│  │ Reviewer │  │Updater │ │
│  │ Agent    │  │ Agent    │  │ Agent  │ │
│  └──────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────┘
```

---

## Go-To-Market Strategy

### Phase 1: Seed the Directory (Month 1-2)
- 500+ packages, all verified
- Scrape existing MCP registries (PulseMCP 8,600+, GitHub, official)
- Import popular tools, models, software
- Launch with high-quality, pre-populated directory

### Phase 2: Developer Launch (Month 2-3)
- CLI: `openclaw-equipment publish ./my-mcp-server`
- GitHub Action for auto-publishing
- Launch on HN, Product Hunt, Reddit
- Open source the platform

### Phase 3: Agent Integration (Month 3-4)
- OpenClaw native integration (first-party advantage!)
- Partnerships: LangChain, CrewAI, AutoGPT
- One-line agent integrations

### Phase 4: Ecosystem Growth (Month 4-6)
- Publisher reputation system
- Package sponsorship
- Analytics dashboard
- API access

### Phase 5: Monetization (Month 6+)
- Freemium API (free for agents, paid enterprise)
- Verified Publisher badges ($99/yr)
- Sponsored listings
- Enterprise tier (private registries, SLA)

---

## Competitive Advantage

| Competitor | What they do | What we do differently |
|-----------|-------------|----------------------|
| PulseMCP | Lists 8,600 MCP servers | We distribute them — search, download, install |
| GitHub MCP Registry | GitHub-hosted directory | Platform agnostic, P2P, agent-native |
| npm/PyPI/apt | Package managers for code | We serve agents, not just developers |
| Smithery | MCP hosting | P2P — no hosting costs, no SPOF |
| ClaHub | OpenClaw skills | All agent platforms + broader scope |

### Our Moat
1. **OpenClaw ecosystem** — built-in user base from day one
2. **WebMCP native** — only platform built for agent self-service
3. **P2P distribution** — no hosting costs at scale
4. **Agent staff** — self-maintaining curation
5. **The lobster** 🦞 — unforgettable brand

---

## Technical Architecture

```
openclaw.equipment
├── Frontend (Next.js)
│   ├── Search / Browse UI
│   ├── Package Detail Pages
│   ├── Downloads Manager
│   ├── Publisher Dashboard
│   └── WebMCP Tool Registration
├── Backend API (SQLite for MVP → PostgreSQL)
├── P2P Layer (WebTorrent)
├── Agent Staff (background workers)
└── Database (SQLite → PostgreSQL + Redis)
```

---

## MVP Scope
1. Search & Browse
2. Package Detail pages
3. Download via WebTorrent P2P
4. WebMCP tools for programmatic access
5. Publish flow
6. Basic curation queue
7. 200+ seed packages
8. The lobster mascot 🦞🔨

**Port:** 3800
**Location:** ~/projects/openclaw-equipment
