# 🦞 equip — The Package Manager for AI Agents

Install MCP servers, A2A tools, and agent loadouts from the command line.

## Install

```bash
npm install -g equip-cli
```

Or run directly:

```bash
node equip.js search mcp
```

## Commands

| Command | Description |
|---------|-------------|
| `equip search <query>` | Search for packages |
| `equip install <slug>` | Install a package (runs its install command) |
| `equip info <slug>` | Show full package details |
| `equip browse [category]` | Browse packages by category |
| `equip loadout <slug>` | Install an agent loadout (SOUL.md + tools) |
| `equip help` | Show usage info |

## Options

- `--registry <url>` — Override the registry URL (default: `https://openclaw.equipment`)
- `--yes` / `-y` — Skip confirmation prompts
- `--version` — Show version

## Environment Variables

- `EQUIP_REGISTRY` — Override the registry URL
- `NO_COLOR` — Disable colored output

## Examples

```bash
# Search for MCP tools
equip search mcp

# Get info on a package
equip info filesystem-mcp-server

# Install a package (will show command and ask for confirmation)
equip install filesystem-mcp-server

# Install without confirmation
equip install filesystem-mcp-server --yes

# Browse all packages
equip browse

# Browse by category
equip browse mcp-tools

# Set up a full agent loadout
equip loadout chief-of-staff
```

## How It Works

- **search/browse/info**: Fetches from the OpenClaw Equipment registry API
- **install**: Fetches the package's install command, shows it, asks for confirmation, then executes it
- **loadout**: Downloads a full agent configuration — creates a directory with `SOUL.md` and `install.sh`
- Results are cached locally in `~/.equip/cache/` for 15 minutes

## Requirements

- Node.js 18+ (uses built-in `fetch`)
- No external dependencies

---

Built with 🦞 by [OpenClaw](https://openclaw.equipment)
