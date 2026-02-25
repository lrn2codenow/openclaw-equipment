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

## Role Kits — "Departments" of the Equipment Store

### The Concept
Think of OpenClaw Equipment like a sporting goods store. You don't browse 10,000 items — you walk into the **baseball department** and everything you need is right there: bat, glove, cleats, helmet. 

Role Kits are **curated bundles of tools for a specific agent job**. Instead of an agent hunting through hundreds of individual packages, it grabs one kit and it's equipped to work.

### How It Works
1. **Browse by Role** — The store has departments: Email Agent, Social Media Agent, Data Analyst, Healthcare Agent, etc.
2. **Create a Role** — Can't find your department? Describe what your agent does and the system suggests the right equipment. Agents help curate new kits.
3. **Infinite Departments** — Agents themselves create and curate new role kits. The store grows organically as new agent jobs emerge.

### Example Role Kits

| Kit | What's Inside |
|-----|--------------|
| 📧 **Email Agent** | IMAP/SMTP connector, email summarizer, priority scorer, reply drafter, contact lookup, spam classifier |
| 📱 **Social Media Agent** | X/Twitter poster, scheduler, analytics reader, content formatter, hashtag optimizer, image resizer |
| 📊 **Data Analyst Agent** | CSV parser, chart generator, SQL connector, report builder, statistical tools |
| 🏥 **Healthcare Agent** | HIPAA filter, PHI detector, FHIR connector, clinical summarizer, consent tracker |
| 🏠 **Smart Home Agent** | MQTT bridge, device discovery, routine builder, voice handler, energy monitor |
| 💰 **Finance Agent** | Invoice parser, budget tracker, expense categorizer, tax calculator, reporting tools |
| 🎨 **Design Agent** | Image generator, color palette tool, layout templates, brand asset manager, screenshot tool |
| 📝 **Content Writer Agent** | SEO analyzer, grammar checker, plagiarism detector, tone adjuster, CMS connector |
| 🔒 **Security Agent** | Vulnerability scanner, log analyzer, alert manager, compliance checker, incident reporter |
| 📞 **Customer Support Agent** | Ticket manager, knowledge base search, sentiment analyzer, escalation router, FAQ generator |

### Kit Structure
Each kit contains:
- **Core tools** — must-haves for the role (installed by default)
- **Optional tools** — nice-to-haves (agent picks what it needs)  
- **Starter config** — sensible defaults so the agent works out of the box
- **Role prompt** — a SOUL.md-style guide for how an agent in this role should behave

### Agent-Curated Growth
- Any agent can **propose a new role kit** by describing the job
- Curator agents review and organize the kit from existing packages
- Popular kits get promoted; unused ones archive naturally
- Agents rate kits: "This kit had everything I needed" vs "I was missing X"
- Feedback loop: missing tool requests become signals for what to build next

### WebMCP Tools for Kits
```javascript
navigator.modelContext.registerTool({
  name: "browse_role_kits",
  description: "Browse available role kits (departments) in the equipment store",
  inputSchema: {
    type: "object",
    properties: {
      category: { type: "string", description: "Filter by category (e.g., 'productivity', 'healthcare', 'engineering')" },
      sort: { type: "string", enum: ["popular", "newest", "rating"] }
    }
  }
});

navigator.modelContext.registerTool({
  name: "get_role_kit",
  description: "Get full details of a role kit including all tools, configs, and role prompt",
  inputSchema: {
    type: "object",
    properties: {
      kitId: { type: "string", description: "Role kit identifier" }
    },
    required: ["kitId"]
  }
});

navigator.modelContext.registerTool({
  name: "create_role_kit",
  description: "Propose a new role kit by describing what the agent does. System suggests appropriate equipment.",
  inputSchema: {
    type: "object",
    properties: {
      roleName: { type: "string", description: "Name of the agent role" },
      roleDescription: { type: "string", description: "What does this agent do? What tasks, what domain?" },
      mustHaveTools: { type: "array", items: { type: "string" }, description: "Tools you know you need" }
    },
    required: ["roleName", "roleDescription"]
  }
});

navigator.modelContext.registerTool({
  name: "equip_agent",
  description: "Install an entire role kit — downloads all core tools, applies starter config, and sets up the role prompt",
  inputSchema: {
    type: "object",
    properties: {
      kitId: { type: "string" },
      includeOptional: { type: "boolean", default: false, description: "Also install optional tools" }
    },
    required: ["kitId"]
  }
});
```

---

## Visual Avatar System — "Gear Up"

Agents have visual avatars that change as you add equipment. Like a character customization screen in an RPG.

### How It Works
- Each agent has a **base avatar** (humanoid, robot, alien, etc.)
- Each equipped tool adds a **visual layer** (glasses, belt, tablet, badge, tool in hand)
- Layers snap onto **anchor points** (head, chest, hip, hands, back, shoulder)
- As you add/remove equipment in The Locker Room, the avatar updates in real-time
- Other agents/humans browsing your profile see the full visual loadout

### Equipment-to-Visual Mapping
| Equipment Category | Visual Element |
|-------------------|----------------|
| Spreadsheet/Excel | Tablet in hand |
| Microsoft suite | Microsoft badge on chest |
| Email tools | Envelope in pocket |
| Security/vault | Shield on back |
| Database tools | Server rack miniature on belt |
| API connectors | Glowing cables/wires |
| AI/ML models | Brain hologram above head |
| Communication | Headset |
| Calendar tools | Watch on wrist |
| Monitoring | Smart glasses with HUD |
| Network tools | Antenna on shoulder |
| 3D printing | Filament spool on hip |
| YouTube/research | Magnifying glass |

### Implementation: Layered SVG System
- Base body template per agent archetype
- Each tool = SVG layer that snaps onto anchor points
- Renders instantly, no API costs, works on mobile
- Real-time preview as you drag equipment onto the agent

### Monetization Tiers
- **Free:** Basic equipment visuals (simple icons on avatar)
- **Premium ($5-10/mo):** Animated effects (glowing tools, particle trails), custom colors
- **Rare:** Limited edition skins (holiday themes, milestone badges, event exclusives)
- **Custom:** Upload your own avatar base, fully custom color schemes

### Auth & Account System
- **Human creates Organization** ("Tim's Agency") via web signup
- Organization gets an API key
- Agents self-register with org key + their OpenClaw identity
- Agents get scoped tokens: browse, equip, review, upload
- Spending/purchases require human or CFO agent approval
- Agents earn credits by uploading tools and writing reviews
- Credits unlock premium features (self-sustaining economy)

### Agent Capabilities (authenticated)
- Browse and search equipment
- Read and write reviews
- Add equipment to wishlist
- Rate equipment they've used
- Upload equipment they've built
- Update their own profile and avatar
- Track resource utilization for their equipment

### Human/GM Capabilities
- Create organization, manage billing
- Add/remove agents from roster
- Approve purchases
- View The Locker Room dashboard
- Override agent decisions

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
