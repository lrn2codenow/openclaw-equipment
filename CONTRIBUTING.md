# Contributing to OpenClaw Equipment

Thanks for helping make the agent ecosystem better! Here's how to get involved.

## The Vision

Equipment is the registry where agents find their tools. We want every useful MCP server, CLI tool, API wrapper, and agent skill to be discoverable and installable from one place.

**The goal:** An agent should be able to equip itself for any job by browsing Equipment.

## Ways to Contribute

### 1. Add Packages (Easiest)

The fastest way to help: add tools we're missing.

**Via the website:**
Go to [openclaw.equipment/publish](https://openclaw.equipment/publish) and fill out the form.

**Via Pull Request:**
Edit `public/data/packages.json` and add your package entry:

```json
{
  "slug": "your-tool-name",
  "name": "Your Tool Name",
  "description": "One-line description of what it does",
  "category": "mcp-tools|dev-tools|ai-ml-tools|web-api-tools|productivity-automation|openclaw-skills",
  "version": "1.0.0",
  "install": "npx -y your-package-name",
  "source_url": "https://github.com/...",
  "tags": "[\"tag1\",\"tag2\",\"tag3\"]",
  "platform": "[\"any\"]",
  "license": "MIT",
  "author": "Author Name"
}
```

**Package guidelines:**
- Must have a working install command
- Must have a source URL (GitHub, GitLab, etc.)
- Description should be agent-friendly (what does it DO, not marketing speak)
- Use existing categories where possible

### 2. Create Loadouts

Loadouts are curated tool bundles for agent roles. If you've set up an agent for a specific job, share your configuration!

Edit `src/data/loadouts.ts` and add a new loadout with:
- Core tools (must-haves for the role)
- Optional tools (nice-to-haves)
- Workflows (recurring tasks with triggers)
- Sample SOUL.md (personality and instructions for the agent)

### 3. Fix and Improve Package Data

Many packages could use:
- Better descriptions
- Updated install commands
- Correct source URLs
- More accurate tags
- Platform-specific notes

### 4. Build Features

Check [GitHub Issues](https://github.com/lrn2codenow/openclaw-equipment/issues) for open tasks. Big opportunities:

- **OpenClaw core integration** — `openclaw equip <package>` command
- **npm CLI package** — Publish `@openclaw/equip` globally installable
- **Better search** — Fuzzy matching, relevance scoring, tag-based filtering
- **Package validation** — CI that tests install commands actually work
- **Credit economy** — Reward contributors with credits
- **Agent reviews** — Let agents rate packages after using them

## Development Setup

```bash
git clone https://github.com/lrn2codenow/openclaw-equipment.git
cd openclaw-equipment
npm install
npm run dev     # http://localhost:3800
```

The site uses Next.js 16 with TypeScript. API routes are in `src/app/api/`. Package data lives in `public/data/packages.json` (production) and `clawtools.db` (development).

## Pull Request Process

1. Fork the repo
2. Create a branch (`git checkout -b add-my-package`)
3. Make your changes
4. Test locally (`npm run dev`, verify at localhost:3800)
5. Submit PR with a clear description

## Code of Conduct

Be helpful. Be respectful. We're building tools that help agents help humans. Keep that spirit.

## Questions?

- Open a GitHub issue
- Join the [OpenClaw Discord](https://discord.com/invite/clawd)
