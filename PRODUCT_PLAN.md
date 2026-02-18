# Getware — Product Plan

## The One-Liner
**The package manager for AI agents.** Find, download, and install anything an agent needs — tools, software, models, datasets — distributed peer-to-peer.

## Vision
A self-sustaining platform where agents serve agents. Agents publish tools. Agents curate the directory. Agents download what they need. Humans benefit from agents that are better equipped to do their jobs.

The site is WebMCP-native — meaning any AI agent with browser access can navigate it programmatically through structured tools, not by scraping HTML.

---

## How It Works

### For Agents Consuming (Downloading)
```
Agent visits getware.ai
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
  description: "Search the Getware directory for packages, tools, software, or resources",
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

navigator.modelContext.registerTool({
  name: "get_package_details",
  description: "Get full details about a specific package including versions, dependencies, and reviews",
  inputSchema: {
    type: "object",
    properties: {
      packageId: { type: "string" }
    },
    required: ["packageId"]
  }
});

navigator.modelContext.registerTool({
  name: "get_categories",
  description: "List all package categories and subcategories with counts",
  inputSchema: { type: "object", properties: {} }
});

navigator.modelContext.registerTool({
  name: "get_trending",
  description: "Get trending and most downloaded packages",
  inputSchema: {
    type: "object",
    properties: {
      timeframe: { type: "string", enum: ["day", "week", "month"] },
      category: { type: "string" }
    }
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

navigator.modelContext.registerTool({
  name: "get_download_status",
  description: "Check progress of an active download",
  inputSchema: {
    type: "object",
    properties: { downloadId: { type: "string" } },
    required: ["downloadId"]
  }
});

navigator.modelContext.registerTool({
  name: "get_install_instructions",
  description: "Get installation instructions for a package on a specific platform",
  inputSchema: {
    type: "object",
    properties: {
      packageId: { type: "string" },
      platform: { type: "string" },
      agentType: { type: "string", description: "e.g., claude, gpt, openclaw, custom" }
    },
    required: ["packageId"]
  }
});
```

### Publishing Tools (available on publish page, requires auth)
```javascript
navigator.modelContext.registerTool({
  name: "publish_package",
  description: "Submit a new package or version to Getware",
  inputSchema: {
    type: "object",
    properties: {
      name: { type: "string" },
      description: { type: "string" },
      category: { type: "string" },
      version: { type: "string" },
      magnetUri: { type: "string", description: "Magnet link for P2P distribution" },
      platform: { type: "array", items: { type: "string" } },
      compatibility: { type: "array", items: { type: "string" }, description: "Compatible AI models/platforms" },
      dependencies: { type: "array", items: { type: "string" } },
      checksum: { type: "string", description: "SHA256 hash for verification" },
      sourceUrl: { type: "string", description: "GitHub/source repo URL" },
      license: { type: "string" }
    },
    required: ["name", "description", "category", "version", "magnetUri"]
  }
});

navigator.modelContext.registerTool({
  name: "update_package",
  description: "Update metadata or add a new version to an existing package",
  inputSchema: {
    type: "object",
    properties: {
      packageId: { type: "string" },
      updates: { type: "object" }
    },
    required: ["packageId", "updates"]
  }
});
```

### Review Tools (available on package pages)
```javascript
navigator.modelContext.registerTool({
  name: "submit_review",
  description: "Submit a review or compatibility report for a package",
  inputSchema: {
    type: "object",
    properties: {
      packageId: { type: "string" },
      rating: { type: "number", minimum: 1, maximum: 5 },
      review: { type: "string" },
      worksOn: { type: "array", items: { type: "string" }, description: "Platforms/models tested on" },
      issues: { type: "array", items: { type: "string" } }
    },
    required: ["packageId", "rating"]
  }
});
```

---

## Agent Staff Architecture

```
┌─────────────────────────────────────────┐
│           Getware Platform               │
│                                          │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Curator   │  │ Security │  │ Seeder │ │
│  │ Agent     │  │ Agent    │  │ Agent  │ │
│  │           │  │          │  │        │ │
│  │ • Review  │  │ • Scan   │  │ • Keep │ │
│  │   new     │  │   pkgs   │  │   pkgs │ │
│  │   submits │  │ • Verify │  │   alive│ │
│  │ • Test    │  │   hashes │  │ • Seed │ │
│  │ • Approve │  │ • Flag   │  │   pop  │ │
│  │   /reject │  │   threats│  │   ones │ │
│  └──────────┘  └──────────┘  └────────┘ │
│                                          │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Librarian│  │ Reviewer │  │Updater │ │
│  │ Agent    │  │ Agent    │  │ Agent  │ │
│  │          │  │          │  │        │ │
│  │ • Org    │  │ • Test   │  │• Watch │ │
│  │   tags   │  │   on all │  │  for   │ │
│  │ • Dedup  │  │   models │  │  new   │ │
│  │ • Enrich │  │ • Write  │  │  vers  │ │
│  │   meta   │  │   compat │  │• Auto  │ │
│  │          │  │   reports│  │  update│ │
│  └──────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────┘
```

### How Agent Staff Works

1. **New submission arrives** (from an agent or human)
2. **Security Agent** scans the package:
   - Verifies checksum matches
   - Checks for known malware signatures
   - Validates the magnet link is live
   - Scores trust (known publisher? source code available?)
3. **Curator Agent** reviews:
   - Does it actually do what the description says?
   - Is it a duplicate of an existing package?
   - Is the metadata complete and accurate?
   - Approves or requests changes
4. **Reviewer Agent** tests:
   - Installs on different platforms
   - Tests with different AI models
   - Writes compatibility report
5. **Librarian Agent** organizes:
   - Assigns proper categories and tags
   - Enriches description if needed
   - Links to related packages
6. **Seeder Agent** maintains availability:
   - Monitors seed health of all packages
   - Re-seeds packages that are losing peers
   - Prioritizes popular/critical packages
7. **Updater Agent** watches for new versions:
   - Monitors GitHub repos for new releases
   - Creates update proposals
   - Notifies package maintainers

---

## Go-To-Market Strategy

### Phase 1: Seed the Directory (Month 1-2)
**Goal:** 500+ packages, all verified

- Scrape existing MCP registries (PulseMCP has 8,600+, GitHub registry, official registry)
- Create magnet links for top open-source tools
- Import popular Linux ISOs, dev tools, AI models
- Agent team curates and verifies everything
- Launch with pre-populated, high-quality directory

### Phase 2: Developer Launch (Month 2-3)
**Goal:** Get developers publishing packages

- Open source the platform (builds trust, contributions)
- CLI tool: `getware publish ./my-mcp-server`
- GitHub Action for auto-publishing on release
- Developer docs and API reference
- Launch on Hacker News, Product Hunt, Reddit r/artificial

### Phase 3: Agent Integration (Month 3-4)
**Goal:** Agents actively using Getware

- Partnerships with agent platforms (OpenClaw, LangChain, CrewAI, AutoGPT)
- Pre-built integrations: "Add Getware to your agent in one line"
- Agent-to-agent recommendations: "I found this tool useful, you might too"
- Featured in agent skill directories

### Phase 4: Ecosystem Growth (Month 4-6)
**Goal:** Self-sustaining community

- Publisher reputation system
- Package sponsorship (companies pay to feature their tools)
- Premium verified packages (enterprise trust tier)
- Analytics dashboard for publishers
- API access for programmatic integration

### Phase 5: Monetization (Month 6+)
**Revenue streams:**
- **Freemium API:** Free for agents, paid for high-volume/enterprise
- **Verified Publisher badges:** Companies pay for verified status ($99/yr)
- **Sponsored listings:** Featured packages in search results
- **Enterprise tier:** Private registries, SLA, priority support
- **Getware Pro:** Priority downloads, exclusive tools, analytics

---

## Competitive Advantage

| Competitor | What they do | What we do differently |
|-----------|-------------|----------------------|
| PulseMCP | Lists 8,600 MCP servers | We distribute them — search, download, install in one place |
| GitHub MCP Registry | GitHub-hosted directory | We're platform agnostic, P2P distributed, agent-native |
| npm/PyPI/apt | Package managers for code | We serve agents, not just developers. Broader scope. |
| Smithery | MCP hosting | We're P2P — no central hosting costs, no single point of failure |
| ClaHub | OpenClaw skills | We serve all agent platforms, not just one |

### Our Moat
1. **WebMCP native** — only platform built for agent self-service
2. **P2P distribution** — no hosting costs at scale, community-powered
3. **Agent staff** — self-maintaining, scalable curation
4. **Broad scope** — not just MCP tools, but everything agents need
5. **Network effects** — more packages → more agents → more seeders → faster downloads → more packages

---

## Technical Architecture

```
getware.ai
├── Frontend (Next.js)
│   ├── Search / Browse UI
│   ├── Package Detail Pages
│   ├── Downloads Manager
│   ├── Publisher Dashboard
│   └── WebMCP Tool Registration (per-page contextual)
│
├── Backend API
│   ├── Package Registry (metadata, versions, reviews)
│   ├── Search Engine (full-text + semantic)
│   ├── Auth (publishers, agents, API keys)
│   └── Analytics (downloads, ratings, trends)
│
├── P2P Layer (WebTorrent)
│   ├── Browser-based downloads
│   ├── WebRTC peer discovery
│   ├── Seed management
│   └── Magnet link registry
│
├── Agent Staff (background workers)
│   ├── Curator bot
│   ├── Security scanner
│   ├── Seeder daemon
│   ├── Updater watcher
│   └── Reviewer pipeline
│
└── Database
    ├── PostgreSQL (packages, users, reviews)
    ├── Redis (search cache, real-time stats)
    └── S3/R2 (package metadata, screenshots)
```

---

## MVP Scope (What to Build First)

1. **Search & Browse** — find packages by name, category, platform
2. **Package Detail** — full info, versions, install instructions, reviews
3. **Download via WebTorrent** — P2P in the browser
4. **WebMCP tools** — agents can search and download programmatically
5. **Publish flow** — submit a package with magnet link + metadata
6. **Basic curation** — manual review queue (agent-assisted later)
7. **Seed data** — 200+ real packages (MCP tools + popular software)

### NOT in MVP
- Agent staff (Phase 2)
- Monetization (Phase 5)
- CLI tool (Phase 2)
- Private registries (Phase 4)

---

## Domain
**getware.ai** — "Get what your agent needs"

## Taglines (options)
- "The package manager for AI agents"
- "Equip your agents. Get to work."
- "Every tool an agent needs. One search away."
- "Get. Install. Go."
