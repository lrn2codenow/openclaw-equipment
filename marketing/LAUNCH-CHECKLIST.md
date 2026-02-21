# OpenClaw Equipment — Launch Checklist

---

## Pre-Launch Checklist

### Product (Must-Have)

- [ ] Site live and stable on openclaw.equipment (Vercel)
- [ ] 200+ packages indexed and searchable
- [ ] WebMCP endpoint working — test with a real agent
- [ ] Package install flow works end-to-end (search → install → use)
- [ ] Package publish flow documented and tested
- [ ] Error pages and 404 are branded (not default Next.js)
- [ ] Mobile-responsive (devs will click from Twitter on phones)
- [ ] Page load < 3 seconds on 4G
- [ ] Analytics installed (Vercel Analytics, Plausible, or PostHog)
- [ ] Basic SEO: title tags, meta descriptions, OG images for all pages
- [ ] OG image: branded card with mascot + tagline (for social sharing)
- [ ] Favicon: simplified claw icon
- [ ] README on GitHub is polished: badges, screenshots, quick start, contributing guide

### Brand Assets

- [ ] Mascot illustration: at least 2 poses (neutral + excited)
- [ ] Simplified claw icon (for favicon, social avatars)
- [ ] Wordmark PNG/SVG (light + dark versions)
- [ ] OG image template (1200x630px)
- [ ] Social media banners (Twitter 1500x500, LinkedIn, Discord)
- [ ] Color palette finalized (see BRAND-BOOK.md)
- [ ] Brand assets folder in repo or shared drive

### Social Accounts

- [ ] Twitter/X: @OpenClawEquip — bio, avatar, banner, pinned post ready
- [ ] Bluesky: account created, profile complete
- [ ] Discord: server created, channels set up, roles configured
- [ ] LinkedIn: company page created
- [ ] YouTube: channel created with banner
- [ ] Dev.to: account created
- [ ] Product Hunt: maker profile ready, ship page live

### Content (Pre-Written)

- [ ] HN Show HN post — drafted, reviewed, finalized
- [ ] Twitter launch thread (7 tweets) — drafted with images/GIFs
- [ ] Reddit posts for 3-4 subreddits — tailored to each community
- [ ] Product Hunt listing — tagline, description, images, first comment, video
- [ ] Dev.to launch article: "Why AI Agents Need a Package Manager"
- [ ] Blog post: "Introducing OpenClaw Equipment"
- [ ] Demo GIF or 60-second video showing the install flow

### Technical

- [ ] Uptime monitoring set up (UptimeRobot, Betterstack, etc.)
- [ ] Error tracking enabled (Sentry or similar)
- [ ] CDN/caching configured for static assets
- [ ] Rate limiting on API endpoints
- [ ] Basic abuse prevention (spam packages, etc.)
- [ ] Backup/recovery plan for the registry data
- [ ] P2P seeding: at least 3 seed nodes online

### Team Readiness

- [ ] All team members know launch day plan
- [ ] HN comment duty roster (who's on when for 12 hours)
- [ ] Discord moderation plan
- [ ] Escalation path for critical bugs during launch
- [ ] Celebratory lobster emoji ready 🦞

---

## Launch Day Playbook

### Launch Day: Tuesday (Optimal for HN + Dev Engagement)

**T-12h (Previous Evening)**
- [ ] Final smoke test: full flow on production
- [ ] Pre-schedule tweets (except launch thread — post manually)
- [ ] Verify all social accounts are ready
- [ ] Get a good night's sleep

**8:30 AM ET — Final Prep**
- [ ] Check site is up, analytics working
- [ ] Open HN, Reddit, Twitter, Discord in browser tabs
- [ ] Team standup: "We're going live in 30 minutes"

**9:00 AM ET — GO LIVE**
- [ ] Post Show HN on Hacker News
- [ ] Immediately post Twitter launch thread (manual, not scheduled)
- [ ] Post to Reddit: r/artificial first, then r/LocalLLaMA, r/MCP (space by 30 min)
- [ ] Post on Bluesky
- [ ] Post on LinkedIn
- [ ] Announce in Discord #announcements
- [ ] Email alpha testers: "We're live! Please share if you like it"

**9:00 AM – 12:00 PM ET — Active Monitoring**
- [ ] Respond to every HN comment within 15 minutes
- [ ] Monitor Reddit comments
- [ ] Watch for bug reports (Twitter, Discord, GitHub Issues)
- [ ] Retweet/share positive mentions
- [ ] Monitor site performance and error rates

**12:00 PM – 3:00 PM ET — Midday Push**
- [ ] Share any early traction metrics (if positive): "X visitors in first 3 hours!"
- [ ] Post a follow-up tweet with a specific feature highlight
- [ ] Check HN ranking — engage with new comments

**3:00 PM – 6:00 PM ET — Afternoon Wave**
- [ ] West coast developers are online — fresh engagement
- [ ] Continue HN and Reddit monitoring
- [ ] Address any critical bugs surfaced during the day

**6:00 PM – 9:00 PM ET — Evening Wrap**
- [ ] Post "Day 1 recap" tweet with key stats
- [ ] Thank early adopters and commenters
- [ ] Plan for Product Hunt launch (Thursday)

**9:00 PM ET — Wind Down**
- [ ] Final check on site stability
- [ ] Set up alerts for overnight issues
- [ ] Celebrate 🦞🎉

---

## Post-Launch Follow-Up

### First 48 Hours

- [ ] Respond to ALL HN comments (even late ones)
- [ ] Fix any critical bugs reported on launch day
- [ ] **Thursday:** Launch on Product Hunt
  - [ ] Post at 12:01 AM PT (Product Hunt resets)
  - [ ] Activate community to upvote (not vote-ring — genuine asks)
  - [ ] Engage with every PH comment
- [ ] Send thank-you DMs to people who shared/RT'd
- [ ] Collect and organize all feedback into GitHub Issues
- [ ] Post "48-hour recap" on Twitter

### First Week

- [ ] Publish "Introducing OpenClaw Equipment" blog post (if not done on launch day)
- [ ] Start "Package of the Week" series (Week 3 in calendar, but start if momentum is there)
- [ ] Address top 3 feature requests or bug reports
- [ ] Reach out to anyone who said "this is cool" — invite to Discord
- [ ] Send pitch emails to newsletters (TLDR AI, Ben's Bites, etc.)
- [ ] Review analytics: where did traffic come from? What converted?
- [ ] Internal retro: what worked, what didn't, what to do differently

### First Month

- [ ] Hit Phase 1 KPIs (see GO-TO-MARKET.md): 200 stars, 1000 visitors, 50 installs
- [ ] Publish 4+ "Package of the Week" posts
- [ ] Release first YouTube tutorial
- [ ] First Equip-a-thon (if community is large enough)
- [ ] Begin platform partnership outreach (LangChain, CrewAI)
- [ ] Collect 5+ testimonials/quotes from users
- [ ] Review and update this checklist for future launches

---

## PR / Media Outreach List

### AI Newsletters (Pitch 1 Week Before Launch)

| Newsletter | Contact Method | Audience | Pitch Angle |
|------------|---------------|----------|-------------|
| **TLDR AI** | tldr.tech/ai (submit form) | 500K+ | "First package manager for AI agents" |
| **Ben's Bites** | ben@bensbites.com | 100K+ | P2P + WebMCP innovation |
| **The Neuron** | Submit form | 300K+ | Agent autonomy angle |
| **AI Breakfast** | Submit form | 50K+ | Dev tool launch |
| **Superhuman AI** | Submit form | 700K+ | Broad AI audience |

### Dev-Focused Publications

| Publication | Contact Method | Pitch Angle |
|-------------|---------------|-------------|
| **Changelog** | news@changelog.com | Open source package manager |
| **Console.dev** | Submit tool | New dev tool |
| **Hacker Newsletter** | (curated from HN) | Get on HN front page first |
| **DevOps Weekly** | Submit | Infrastructure angle |
| **The New Stack** | Pitch form | WebMCP technical story |

### Tech Blogs (Post-Launch, With Traction)

| Publication | Pitch Angle |
|-------------|-------------|
| **TechCrunch** | "First agent-native package manager raises..." (only if fundraising) |
| **The Verge** | AI agents equipping themselves |
| **Ars Technica** | Technical deep dive on WebMCP + P2P |
| **InfoWorld** | Developer tooling evolution |

### Podcasts (Pitch 4-6 Weeks Before Desired Air Date)

| Podcast | Host | Audience | Pitch Angle |
|---------|------|----------|-------------|
| **Latent Space** | swyx + Alessio | AI engineers | Agent tooling infra |
| **Changelog / Ship It** | Jerod + Adam | Open source devs | OSS package manager story |
| **Practical AI** | Daniel + Chris | AI practitioners | Practical MCP tooling |
| **Software Engineering Daily** | Various | SWE audience | Architecture deep dive |
| **AI Engineering Podcast** | Various | AI engineers | WebMCP + agent-first design |
| **Lex Fridman** | Lex | Broad tech | (stretch goal — only with significant traction) |

---

*Checklist version 1.0 — February 2026. Check off items as completed.*
