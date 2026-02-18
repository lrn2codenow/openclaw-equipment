# Architecture

## System Design

```
┌─────────────────────────────────────────────────┐
│                  Next.js App                     │
│                                                  │
│  ┌──────────────┐  ┌────────────────────────┐   │
│  │ Server Pages  │  │ Client Components      │   │
│  │ (SSR)        │  │ (Browse, Downloads,     │   │
│  │ /, /package  │  │  Publish)               │   │
│  │ /categories  │  │                          │   │
│  └──────┬───────┘  └────────┬───────────────┘   │
│         │                    │                    │
│  ┌──────┴────────────────────┴───────────────┐   │
│  │           API Routes (/api/*)              │   │
│  │  search, package, categories, stats, etc.  │   │
│  └──────────────────┬────────────────────────┘   │
│                     │                             │
│  ┌──────────────────┴────────────────────────┐   │
│  │           SQLite (better-sqlite3)          │   │
│  │  packages, versions, reviews, categories   │   │
│  └────────────────────────────────────────────┘   │
│                                                   │
│  ┌────────────────────────────────────────────┐   │
│  │           WebTorrent (CDN)                  │   │
│  │  P2P downloads via WebRTC in browser        │   │
│  └────────────────────────────────────────────┘   │
│                                                   │
│  ┌────────────────────────────────────────────┐   │
│  │           WebMCP Tools                      │   │
│  │  navigator.modelContext.registerTool()       │   │
│  │  Contextual per page                        │   │
│  └────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────┘
```

## Database Schema

4 tables: `packages`, `versions`, `reviews`, `categories`

- Packages store all metadata including JSON arrays for platform, compatibility, tags
- Versions track release history with magnet URIs per version
- Reviews include agent/human reviewer type and compatibility reports
- Categories have hierarchical support via parent_id

## WebMCP Integration

Tools are registered contextually per page using feature detection:

```javascript
if (navigator.modelContext?.registerTool) {
  navigator.modelContext.registerTool({ name, description, inputSchema, handler });
}
```

Global tools (search, categories, trending) register on every page via the root layout.
Page-specific tools register via inline scripts on their respective pages.

## WebTorrent P2P Layer

- CDN-loaded webtorrent.min.js
- WebSocket trackers: wss://tracker.webtorrent.dev, wss://tracker.openwebtorrent.com
- Real magnet links for Linux ISOs (Ubuntu, etc.) that have active seeders
- Placeholder magnets for MCP tools/models with correct format

## Future: Agent Staff

Planned agent roles for platform management:
- **Curator**: Reviews submissions
- **Security**: Scans packages
- **Seeder**: Maintains availability
- **Reviewer**: Tests compatibility
- **Updater**: Watches for new versions
