# Planned GitHub Issues

Create these issues on GitHub to drive community engagement.
Tim: Create these at github.com/lrn2codenow/openclaw-equipment/issues/new

---

## Issue 1: 🎒 [Feature] New Loadout: DevOps Engineer
**Labels:** enhancement, good first issue, loadout
**Body:**
We need a DevOps Engineer loadout with tools for CI/CD, infrastructure management, and monitoring.

Suggested core tools:
- Docker management
- Kubernetes/kubectl
- Terraform/IaC
- CI/CD pipeline management (GitHub Actions, Jenkins)
- Cloud provider CLIs (AWS, GCP, Azure)
- Log aggregation and monitoring

If you've set up an agent for DevOps work, share your configuration!

---

## Issue 2: 🎒 [Feature] New Loadout: Data Scientist
**Labels:** enhancement, good first issue, loadout
**Body:**
We need a Data Scientist loadout for agents that help with data analysis, visualization, and ML workflows.

Suggested tools: Jupyter, pandas, matplotlib, scikit-learn, DuckDB, etc.

---

## Issue 3: 🔍 [Feature] Fuzzy Search
**Labels:** enhancement, help wanted
**Body:**
Current search is exact text matching. We need fuzzy/typo-tolerant search so agents can find packages even with imprecise queries.

Options:
- Fuse.js (client-side)
- Custom Levenshtein distance
- TF-IDF scoring

---

## Issue 4: ✅ [Feature] Package Validation CI
**Labels:** enhancement, help wanted
**Body:**
We need automated testing that install commands actually work. When a new package is added via PR, CI should:
1. Try running the install command in a sandbox
2. Verify the source_url is accessible
3. Check for duplicate slugs

---

## Issue 5: 📦 [Feature] `openclaw equip` Native Command
**Labels:** enhancement, help wanted, core-integration
**Body:**
The biggest unlock: integrate Equipment into OpenClaw core so agents can run `openclaw equip <package>` natively.

This would make Equipment the default package manager for every OpenClaw agent.

---

## Issue 6: 🌐 [Feature] Package Detail Pages Need Real Data
**Labels:** enhancement, good first issue
**Body:**
Package detail pages currently show placeholder data for downloads, ratings, and reviews. We need:
- Real download counters (track API hits)
- Agent reviews (let agents rate packages after using them)
- Version history

---

## Issue 7: 📋 [Help Wanted] Add Missing MCP Servers
**Labels:** help wanted, good first issue, packages
**Body:**
We have 500+ packages but there are many MCP servers we're missing. 

Check the official MCP registry at https://registry.modelcontextprotocol.io/ and compare against our registry at https://openclaw.equipment/api/v1/registry

Add missing ones via PR to `public/data/packages.json` — see CONTRIBUTING.md for format.
