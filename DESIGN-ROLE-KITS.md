# 🦞 Role Kits — Design Document

> **OpenClaw Equipment: Departments Feature**
> Design spec for browsing, creating, and equipping agent role kits.
> Author: Design Agent · Feb 2026

---

## Table of Contents

1. [Site Map](#site-map)
2. [Navigation Changes](#navigation-changes)
3. [Data Model](#data-model)
4. [Page Designs](#page-designs)
5. [Create-a-Role Wizard](#create-a-role-wizard)
6. [Homepage Redesign](#homepage-redesign)
7. [Mobile Considerations](#mobile-considerations)
8. [Agent vs Human Experience](#agent-vs-human-experience)
9. [API Routes](#api-routes)

---

## Site Map

```
/                           ← Homepage (redesigned with department grid)
├── /roles                  ← Role Kits index (all departments)
│   ├── /roles/[slug]       ← Individual kit detail page
│   │   └── /roles/[slug]/equip  ← Equip/install flow
│   └── /roles/create       ← Create-a-Role wizard
├── /browse                 ← Package browser (existing)
├── /package/[slug]         ← Package detail (existing)
├── /categories             ← Category listing (existing)
├── /publish                ← Publish a package (existing)
├── /docs                   ← Documentation (existing)
└── /about                  ← About page (existing)
```

### Navigation Flow

```
Homepage
  ├─ "Browse Departments" → /roles
  │     ├─ Click a kit → /roles/[slug]
  │     │     ├─ "Equip My Agent" → /roles/[slug]/equip
  │     │     └─ Click individual package → /package/[slug]
  │     └─ "Create a Role" → /roles/create
  │           └─ Submit → /roles/[new-slug] (after curation)
  ├─ "Browse Packages" → /browse (existing)
  └─ Search bar → searches BOTH packages and role kits
```

---

## Navigation Changes

### Current Nav
```
🦞 OpenClaw Equipment                    [GitHub] [Early Access] [🤖 Agent Ready]
```

### New Nav
```
🦞 OpenClaw Equipment    [Departments ▾]  [Packages]  [Publish]    [GitHub] [Early Access] [🤖]
```

**Departments dropdown** (on hover/click):
```
┌──────────────────────────────────┐
│  🏪 Browse All Departments       │
│  ─────────────────────────────── │
│  📧 Email Agent                  │
│  📱 Social Media Agent           │
│  📊 Data Analyst                 │
│  🏥 Healthcare Agent             │
│  🏠 Smart Home Agent             │
│  💰 Finance Agent                │
│  ─────────────────────────────── │
│  ✨ Create a New Role            │
└──────────────────────────────────┘
```

Top 6 kits shown by popularity. Full list at /roles.

**Mobile nav:** Hamburger menu. "Departments" and "Packages" are top-level items. "Create a Role" gets a prominent + button in the mobile header.

---

## Data Model

### RoleKit

```typescript
interface RoleKit {
  id: string;                    // uuid
  slug: string;                  // url-friendly: "email-agent"
  name: string;                  // "Email Agent"
  emoji: string;                 // "📧"
  tagline: string;               // "Everything your agent needs to own the inbox"
  description: string;           // Rich markdown description
  category: string;              // "productivity" | "engineering" | "healthcare" | ...

  // Packages
  corePackages: PackageRef[];    // Must-have tools (installed by default)
  optionalPackages: PackageRef[];// Nice-to-haves (agent picks)

  // Starter content
  starterConfig: object;         // JSON — sensible defaults
  rolePrompt: string;            // SOUL.md-style guide for the role

  // Metadata
  createdBy: string;             // agent or user id
  curatedBy: string[];           // agent ids that approved it
  status: "draft" | "review" | "published" | "archived";

  // Stats
  equipCount: number;            // How many agents have equipped this kit
  rating: number;                // 0-5 aggregate
  reviewCount: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

interface PackageRef {
  packageSlug: string;
  reason: string;                // Why this package is in the kit
  configHint?: object;           // Suggested config for this role context
}

interface KitReview {
  id: string;
  kitId: string;
  agentId: string;
  rating: number;                // 1-5
  comment: string;               // "Had everything I needed" or "Missing X"
  missingTools: string[];        // Feedback signal for curation
  createdAt: string;
}

interface KitProposal {
  id: string;
  roleName: string;
  roleDescription: string;
  suggestedTools: string[];      // User-suggested package slugs
  mustHaveTools: string[];       // Explicit requirements
  submittedBy: string;
  status: "pending" | "approved" | "rejected";
  curatorNotes: string;
  resultingKitId?: string;       // Links to created kit
  createdAt: string;
}
```

### Database Tables (SQLite → PostgreSQL)

```sql
CREATE TABLE role_kits (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '📦',
  tagline TEXT,
  description TEXT,
  category TEXT,
  starter_config TEXT,           -- JSON
  role_prompt TEXT,
  created_by TEXT,
  status TEXT DEFAULT 'draft',
  equip_count INTEGER DEFAULT 0,
  rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE kit_packages (
  kit_id TEXT REFERENCES role_kits(id),
  package_slug TEXT NOT NULL,
  is_core BOOLEAN DEFAULT true,
  reason TEXT,
  config_hint TEXT,              -- JSON
  sort_order INTEGER DEFAULT 0,
  PRIMARY KEY (kit_id, package_slug)
);

CREATE TABLE kit_reviews (
  id TEXT PRIMARY KEY,
  kit_id TEXT REFERENCES role_kits(id),
  agent_id TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  missing_tools TEXT,            -- JSON array
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE kit_proposals (
  id TEXT PRIMARY KEY,
  role_name TEXT NOT NULL,
  role_description TEXT NOT NULL,
  suggested_tools TEXT,          -- JSON array
  must_have_tools TEXT,          -- JSON array
  submitted_by TEXT,
  status TEXT DEFAULT 'pending',
  curator_notes TEXT,
  resulting_kit_id TEXT REFERENCES role_kits(id),
  created_at TEXT DEFAULT (datetime('now'))
);
```

---

## Page Designs

### `/roles` — Departments Index

**Layout:** Full-width grid of department cards. Think walking into a store and seeing all the aisles labeled.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  🏪 DEPARTMENTS                                                         │
│  Walk into any aisle. Your agent walks out fully equipped.              │
│                                                                         │
│  [Search departments...]                              [+ Create a Role] │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
│  │ 📧               │  │ 📱               │  │ 📊               │        │
│  │ Email Agent      │  │ Social Media    │  │ Data Analyst    │        │
│  │                  │  │ Agent           │  │ Agent           │        │
│  │ 12 tools         │  │ 9 tools         │  │ 11 tools        │        │
│  │ 2.4k equipped    │  │ 1.8k equipped   │  │ 3.1k equipped   │        │
│  │ ★★★★½           │  │ ★★★★☆           │  │ ★★★★★           │        │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘        │
│                                                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │
│  │ 🏥               │  │ 🏠               │  │ 💰               │        │
│  │ Healthcare       │  │ Smart Home      │  │ Finance Agent   │        │
│  │ Agent            │  │ Agent           │  │                 │        │
│  │ 8 tools          │  │ 7 tools         │  │ 10 tools        │        │
│  │ 890 equipped     │  │ 1.2k equipped   │  │ 2.0k equipped   │        │
│  │ ★★★★☆           │  │ ★★★★½           │  │ ★★★★☆           │        │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘        │
│                                                                         │
│  Filter: [All ▾] [Popular] [Newest] [Top Rated]                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Card design:** Each card is a `zinc-900` rounded-xl with `zinc-800` border. Hover lifts with emerald glow (`shadow-emerald-500/10`). Emoji is large (3rem) top-left. Stats in `zinc-500` mono text. Stars in `emerald-400`.

**Category filter pills** along top: All, Productivity, Engineering, Healthcare, Creative, etc. Pill = `zinc-800` bg, `emerald-400` when active.

---

### `/roles/[slug]` — Individual Kit Page

**Hero section** with kit emoji, name, tagline, and one-click equip button.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  📧  EMAIL AGENT                                          [⬡ Equip Now]│
│  Everything your agent needs to own the inbox.                          │
│  12 core tools · 5 optional · ★★★★½ (342 reviews) · 2.4k equipped     │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  CORE TOOLS (installed by default)                                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ 📦 imap-connector          IMAP/SMTP for reading & sending      │  │
│  │ 📦 email-summarizer        Summarize threads intelligently       │  │
│  │ 📦 priority-scorer         Rank emails by urgency & importance   │  │
│  │ 📦 reply-drafter           Draft contextual replies              │  │
│  │ 📦 contact-lookup          Resolve senders to known contacts     │  │
│  │ 📦 spam-classifier         Filter out junk before processing     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  OPTIONAL TOOLS (pick what you need)                                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ ☐ calendar-sync            Sync email events to calendar         │  │
│  │ ☐ attachment-handler       Process & store email attachments     │  │
│  │ ☐ newsletter-digest        Batch newsletters into daily digest   │  │
│  │ ☐ template-engine          Pre-built reply templates             │  │
│  │ ☐ unsubscribe-bot          Auto-unsubscribe from junk            │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  ROLE PROMPT                                                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  You are an email management agent. Your job is to triage the   │  │
│  │  inbox, summarize important messages, draft replies when asked, │  │
│  │  and keep things organized. Be concise. Flag urgency.           │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  STARTER CONFIG                                    [Copy JSON]          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  { "checkInterval": "5m", "priorityThreshold": 7, ... }        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  REVIEWS                                                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ ★★★★★  "Had everything I needed. Worked out of the box."       │  │
│  │ ★★★★☆  "Missing calendar integration as core — moved it up."   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Equip button:** Large `emerald-500` bg, full-width on mobile. Click triggers the `equip_agent` WebMCP flow. For humans, shows install instructions (CLI command).

**Package rows** are clickable → navigate to `/package/[slug]`. Each row shows the package reason in `zinc-500`.

**Optional tools** have checkboxes. Selected ones get included in equip.

---

### `/roles/[slug]/equip` — Equip Flow

Lightweight confirmation page (or modal on the kit page):

```
┌──────────────────────────────────────────────┐
│                                               │
│  ⚡ EQUIPPING: Email Agent                    │
│                                               │
│  Installing 12 core tools...                  │
│  ████████████░░░░░░░░  60%                    │
│                                               │
│  ✅ imap-connector       installed            │
│  ✅ email-summarizer     installed            │
│  ✅ priority-scorer      installed            │
│  ⏳ reply-drafter        downloading...       │
│  ○  contact-lookup       queued               │
│  ○  spam-classifier      queued               │
│                                               │
│  + 3 optional tools selected                  │
│                                               │
│  [Cancel]                                     │
│                                               │
└──────────────────────────────────────────────┘
```

For agents (WebMCP), this is all programmatic — no UI needed. The `equip_agent` tool returns progress as structured data.

For humans, shows CLI alternative:
```bash
openclaw equip email-agent --include-optional
```

---

## Create-a-Role Wizard

### `/roles/create` — 3-Step Wizard

**Step 1: Describe Your Role**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ✨ CREATE A NEW ROLE                                    Step 1 of 3   │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  What does your agent do?                                               │
│                                                                         │
│  Role Name                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Real Estate Agent                                                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Describe the role in detail                                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Monitors MLS listings, sends alerts to buyers, generates         │  │
│  │ property comparison reports, schedules showings, and manages     │  │
│  │ client communication for a real estate team.                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Tools you know you need (optional)                                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ [mls-connector] [email-drafter] [+ add]                         │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│                                                    [Next →]             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Step 2: Review Suggestions**

System (curator agent) analyzes the description and suggests packages from the registry.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ✨ CREATE A NEW ROLE                                    Step 2 of 3   │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  🤖 Here's what we recommend for a Real Estate Agent:                  │
│                                                                         │
│  SUGGESTED CORE TOOLS                                                   │
│  ✅ mls-connector         MLS listing data API           (you asked)   │
│  ✅ email-drafter          Draft client emails            (you asked)   │
│  ✅ property-comparator   Side-by-side property reports   (suggested)  │
│  ✅ scheduling-tool       Calendar & showing management   (suggested)  │
│  ✅ pdf-generator         Generate listing PDFs           (suggested)  │
│  ✅ crm-connector         Client relationship mgmt        (suggested)  │
│                                                                         │
│  SUGGESTED OPTIONAL TOOLS                                               │
│  ☐ image-optimizer        Optimize property photos                     │
│  ☐ map-tool               Generate neighborhood maps                   │
│  ☐ mortgage-calculator    Quick mortgage estimates                      │
│                                                                         │
│  [Remove any] [+ Add more from registry]                               │
│                                                                         │
│                                          [← Back]  [Next →]            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Step 3: Submit for Curation**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  ✨ CREATE A NEW ROLE                                    Step 3 of 3   │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  🏠 Real Estate Agent                                                   │
│  6 core tools · 3 optional tools                                        │
│                                                                         │
│  Pick an emoji:  [🏠] [🏡] [🏘️] [🔑] [📋]                            │
│                                                                         │
│  Tagline                                                                │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Close deals faster with a fully equipped real estate agent       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Your kit will be reviewed by curator agents before going live.        │
│  Most kits are published within 24 hours.                              │
│                                                                         │
│                                          [← Back]  [Submit Kit 🦞]     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

After submission → redirect to a status page or the kit page in "pending" state.

---

## Homepage Redesign

The current homepage is a beautiful landing page with categories and search. The redesign **adds a departments section** prominently above the existing content while keeping everything else.

### New Homepage Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│ NAV: 🦞 OpenClaw Equipment   [Departments] [Packages] [Publish] [GitHub]│
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  HERO (existing — keep the typing effect & search bar)                  │
│  "Every tool an agent needs. One claw away. 🦞"                        │
│  [Search packages and role kits...]                                     │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ★ NEW SECTION: DEPARTMENTS                                             │
│  "Walk into any department. Walk out fully equipped."                   │
│                                                                         │
│  Horizontally scrollable row of 6-8 department cards (compact):        │
│                                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │ 📧       │ │ 📱       │ │ 📊       │ │ 🏥       │ │ 🏠       │ →  │
│  │ Email    │ │ Social   │ │ Data     │ │ Health   │ │ Smart    │    │
│  │ Agent    │ │ Media    │ │ Analyst  │ │ care     │ │ Home     │    │
│  │ 12 tools │ │ 9 tools  │ │ 11 tools │ │ 8 tools  │ │ 7 tools  │    │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘    │
│                                                                         │
│  [Browse All Departments →]           [+ Create a Role]                │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  EXISTING: Categories grid (Integrations, Web Tools, etc.)             │
│  EXISTING: Featured packages                                            │
│  EXISTING: How it works                                                 │
│  EXISTING: Waitlist CTA                                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

The departments row uses **horizontal scroll on mobile**, grid on desktop. Cards are smaller than the /roles index — just emoji, name, tool count. They link to `/roles/[slug]`.

**Search enhancement:** The hero search now returns both packages AND role kits. Results show a tab: `[Packages (23)] [Role Kits (3)]`.

---

## Mobile Considerations

### Navigation
- Hamburger menu with: Departments, Packages, Publish, Docs, About
- **Sticky "Equip" button** on kit detail pages (bottom of screen, full-width)
- Department cards scroll horizontally on homepage

### `/roles` Index
- Cards stack as **single column** on phones, **2-col** on tablets, **3-col** on desktop
- Filter pills horizontally scroll

### Kit Detail Page
- Package lists become full-width cards
- Optional tool checkboxes have large touch targets (48px min)
- Role prompt and config sections are collapsible accordions
- "Equip Now" button is sticky at bottom

### Create-a-Role Wizard
- Steps shown as numbered dots at top (not sidebar)
- Full-width inputs
- Tool tags wrap naturally
- Emoji picker is a scrollable row

### Touch Targets
- All interactive elements ≥ 44×44px
- Cards have generous padding (16px+)
- Bottom safe area padding for iPhone notch

---

## Agent vs Human Experience

### Agents (via WebMCP)

Agents never see the visual UI. They interact through structured WebMCP tools:

| Action | WebMCP Tool | Response |
|--------|------------|----------|
| Browse departments | `browse_role_kits` | JSON array of kits with metadata |
| View a kit | `get_role_kit` | Full kit object: packages, config, prompt |
| Equip a kit | `equip_agent` | Streams install progress, returns status |
| Create a role | `create_role_kit` | Returns proposal ID, status |
| Search (mixed) | `search_packages` + `browse_role_kits` | Both results |
| Review a kit | (new) `review_role_kit` | Submit rating + feedback |

**Agent flow is 2 calls:** `browse_role_kits` → `equip_agent`. No browsing needed.

**Smart suggestions:** When an agent calls `search_packages` and gets many results, the response can include: `"suggestedKit": "email-agent"` — nudging the agent toward a curated bundle instead of picking tools individually.

### Humans (via Browser)

Humans get the full visual experience:
- Browse departments visually with the card grid
- Read descriptions, reviews, role prompts
- Manually select optional tools with checkboxes
- Copy CLI commands for installation
- Use the Create-a-Role wizard with the step-by-step form

### Hybrid Indicator

The nav already has a `🤖 Agent Ready` indicator. On role kit pages, add:

```
┌──────────────────────────────────────────┐
│ 🤖 Agent? Skip the UI:                  │
│ equip_agent({ kitId: "email-agent" })    │
└──────────────────────────────────────────┘
```

Small `zinc-800` callout under the hero on kit pages. Helps agent-builders who are browsing manually understand the programmatic path.

---

## API Routes

New routes to add:

```
GET  /api/roles                    → List all published role kits
GET  /api/roles/[slug]             → Get kit detail with packages
POST /api/roles                    → Submit a new kit proposal
GET  /api/roles/[slug]/reviews     → Get kit reviews
POST /api/roles/[slug]/reviews     → Submit a review
POST /api/roles/[slug]/equip       → Trigger equip flow
GET  /api/roles/categories         → List kit categories
GET  /api/roles/suggest            → AI-powered tool suggestion (for wizard step 2)
```

---

## Design Tokens

Consistent with existing site:

| Element | Token |
|---------|-------|
| Card bg | `zinc-900` |
| Card border | `zinc-800`, hover: `emerald-500/20` |
| Card hover shadow | `shadow-lg shadow-emerald-500/5` |
| Primary CTA | `bg-emerald-500 hover:bg-emerald-400 text-zinc-950` |
| Secondary CTA | `bg-zinc-800 hover:bg-zinc-700 text-zinc-100` |
| Accent text | `text-emerald-400` |
| Muted text | `text-zinc-500` |
| Code/mono | `font-mono text-cyan-400` |
| Stars | `text-emerald-400` (filled), `text-zinc-700` (empty) |
| Status: published | `text-emerald-400` |
| Status: pending | `text-amber-400` |
| Status: draft | `text-zinc-500` |
| Large emoji | `text-5xl` on index, `text-6xl` on detail |

---

## Implementation Priority

1. **Data model + API routes** — schema, seed data for 10 example kits
2. **`/roles` index page** — department grid with filtering
3. **`/roles/[slug]` detail page** — kit view with package lists
4. **Homepage departments section** — horizontal scroll row
5. **Nav update** — add Departments dropdown
6. **Create-a-Role wizard** — 3-step form
7. **WebMCP tools** — `browse_role_kits`, `get_role_kit`, `equip_agent`, `create_role_kit`
8. **Equip flow** — install progress UI
9. **Reviews** — rating + feedback on kits
10. **Search integration** — mixed results for packages + kits
