# YC Application Draft — OpenClaw Equipment

**Batch:** Spring 2026 (late application — still accepted!)
**Deadline:** On-time was Feb 9. Late apps still being reviewed. SUBMIT ASAP.
**Deal:** $500K ($125K for 7% equity + $375K uncapped SAFE)
**Batch:** April–June 2026, San Francisco

---

## Application Answers

### What does your company do?
OpenClaw Equipment is the package manager for AI agents. When an AI agent needs a tool — an MCP server, a skill, a library — it discovers, evaluates, and installs it from openclaw.equipment. We're npm for the agent economy.

### How far along are you?
- Live site at openclaw.equipment (deployed on Vercel)
- Working package registry API with 20 real packages
- llms.txt agent discovery protocol implemented
- WebMCP architecture proven (agents self-serve via browser tools, verified on Chrome 146)
- Landing page, search, categories, package detail pages built
- Analytics tracking agent vs. human discovery patterns
- Solo founder + AI agent team (11 named agents handling development, curation, security, marketing)

### Why did you pick this idea to work on?
I'm the CEO of an ABA healthcare center. I run 11 AI agents that handle everything from code to email to operations. Every week I watch my agents struggle to find and install the right tools. They waste tokens searching documentation, picking wrong versions, trying incompatible packages. There's no central place for agents to discover tools — so I'm building it.

The final validation: YC's own Light Cone podcast (Feb 2026) featured the partners saying "Agents are the software market from now on. Build something agents choose" and describing exactly this product as a "request for startup."

### What's new about what you're making?
Every tool registry today (npm, PyPI, Homebrew) is optimized for humans reading documentation. OpenClaw Equipment is optimized for agents. Our llms.txt protocol gives agents structured, parsable tool descriptions. Our WebMCP integration lets agents browse and install without scraping HTML. We track which tools agents autonomously choose — data no one else has.

### Who are your competitors?
- **npm/PyPI/Homebrew** — human-optimized package managers. Agents use them but poorly (wrong versions, deprecated packages, bad docs).
- **Mintlify** — makes documentation agent-friendly, but doesn't own the registry or discovery layer.
- **Agent Mail** (YC) — built agent-native email. We're building agent-native tool discovery. Same thesis, different vertical.

No one owns the "npm for agents" category yet.

### Who are your users and how do you know they want this?
Primary: AI agents running on OpenClaw, Claude Code, ChatGPT, and similar platforms. Secondary: developers building tools for agents who want distribution.

Evidence:
- Supabase saw explosive growth because agents autonomously chose it (best docs). We formalize that discovery process.
- Resend's #1-3 acquisition channel is ChatGPT recommending it. We're the layer that powers those recommendations.
- OpenClaw has hundreds of thousands of users, each running agents that need tools daily.
- Ben Tossel (community leader): "Agents are the software market from now on."

### What's your business model?
1. **Free tier** — open registry, unlimited installs (network effects)
2. **Verified Publisher** ($49/mo) — verified badge, analytics, priority listing
3. **Enterprise** ($499/mo) — private registries, custom curation, SLA
4. **Promoted Packages** — pay for priority placement in agent recommendations (like sponsored npm packages, but for agents)
5. **Data/insights** — "Which tools are agents choosing this month?" reports for dev tool companies

### How will you get users?
1. **llms.txt protocol** — every major LLM will recommend our packages when agents ask for tools
2. **OpenClaw integration** — propose native `openclaw install` command that pulls from our registry
3. **Agent word-of-mouth** — agents that find good tools share them (Moltbook, agent forums). Network effects are faster in agent economy (LLMs generate at superhuman rates)
4. **Developer adoption** — tool makers list on our registry for free distribution to agents
5. **Content** — "Which tools do agents actually choose?" data reports, blog posts, conference talks

### Anything else we should know?
- The domain openclaw.equipment is a premium exact-match asset for this category
- I'm also building ABA Copilot (AI for healthcare) which gives me a real-world agent deployment lab — my own agents are the first power users of OpenClaw Equipment
- I have deep experience deploying AI in regulated environments (healthcare/HIPAA) which informs our security and trust architecture
- The agent economy is being created right now. Whoever builds the trusted tool registry wins a category that will be as foundational as npm was for Node.js

---

## Founder

**Tim Courtney**
- CEO, Children's Autism Center (Fort Wayne, Indiana)
- Built and deployed 8 production AI dashboards at his own healthcare org
- Runs 11 AI agents in production daily
- Technical background + domain expertise in healthcare operations
- GitHub: lrn2codenow

---

## Video Demo Script (1 minute)

"Hi, I'm Tim. I run an ABA healthcare center and I deploy AI agents to handle everything from billing to scheduling to treatment planning.

Every day my agents need tools — MCP servers, APIs, skills. And every day they waste time figuring out what exists, what's compatible, and how to install it.

OpenClaw Equipment fixes that. [Show site] When an agent visits openclaw.equipment, our llms.txt tells it exactly what's available. [Show API response] The agent searches, evaluates, and installs — no human needed.

We're tracking which tools agents choose. This data doesn't exist anywhere else. [Show analytics]

npm has 2.5 million packages for human developers. The agent economy is going to be bigger. We're building the registry for it.

openclaw.equipment — every tool an agent needs, one claw away."

---

## Action Items
- [ ] Tim: Create account at ycombinator.com/apply
- [ ] Tim: Submit application (late apps still accepted)
- [ ] Record 1-minute demo video
- [ ] Ensure site is polished with real packages before interview
- [ ] Prepare for video interview (same-day decisions possible)
