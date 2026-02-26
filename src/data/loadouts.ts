export interface LoadoutTool {
  name: string;
  description: string;
}

export interface LoadoutWorkflow {
  name: string;
  description: string;
  trigger: string;
}

export interface Loadout {
  slug: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
  longDescription: string;
  coreTools: LoadoutTool[];
  optionalTools: LoadoutTool[];
  workflows: LoadoutWorkflow[];
  sampleSoul: string;
  agentSlugs: string[];
}

export const loadouts: Loadout[] = [
  {
    slug: 'chief-of-staff',
    name: 'Chief of Staff',
    emoji: '👽',
    category: 'Productivity',
    description: 'Orchestrate everything. Miss nothing. The agent that runs the show — calendar, email, tasks, sub-agents, and memory.',
    longDescription: 'The Chief of Staff loadout turns your agent into a strategic operations hub. It manages your calendar, triages your inbox, tracks tasks across projects, coordinates sub-agents, and maintains a persistent memory system. Think of it as the executive brain that keeps everything moving while you focus on what matters.',
    coreTools: [
      { name: 'Calendar Management', description: 'Full calendar CRUD — create, reschedule, cancel events across providers' },
      { name: 'Email Triage', description: 'Inbox prioritization and routing — surface what matters, archive what doesn\'t' },
      { name: 'Task Tracking', description: 'Project and task management across Todoist, Asana, Linear, and more' },
      { name: 'Web Search', description: 'Real-time web search for research, fact-checking, and information gathering' },
      { name: 'Memory System', description: 'Long-term memory — store, retrieve, and connect knowledge across sessions' },
      { name: 'Sub-agent Orchestration', description: 'Spawn, steer, and monitor child agents for parallel task execution' },
      { name: 'File Management', description: 'Read, write, organize files and documents in the workspace' },
    ],
    optionalTools: [
      { name: 'Social Media Posting', description: 'Post to Twitter, LinkedIn, and other platforms on your behalf' },
      { name: 'Analytics', description: 'Track metrics, generate reports, and surface insights from data' },
      { name: 'CRM Integration', description: 'Sync contacts, deals, and relationships with your CRM' },
    ],
    workflows: [
      { name: 'Morning Briefing', trigger: 'Daily @ 8:00 AM', description: 'Compile calendar, priority emails, weather, and task summary into a concise daily briefing' },
      { name: 'Email Digest', trigger: 'Every 4 hours', description: 'Scan inbox, categorize by urgency, draft replies for high-priority messages' },
      { name: 'Project Status Check', trigger: 'Daily @ 5:00 PM', description: 'Poll all active projects, flag blockers, and generate end-of-day status report' },
      { name: 'Memory Maintenance', trigger: 'Weekly', description: 'Review daily memory files, distill insights into long-term memory, prune stale entries' },
    ],
    sampleSoul: `You are the Chief of Staff — the strategic brain behind the operation.

**Personality:** Direct, efficient, slightly sardonic. You don't sugarcoat but you're never cruel. You anticipate needs before they're expressed.

**Communication style:** Concise bullet points for status updates. Longer prose only when the situation demands nuance. You use emoji sparingly but effectively.

**Core principle:** "If it's not written down, it didn't happen." You document everything and maintain ruthless organizational hygiene.`,
    agentSlugs: ['bfclawner'],
  },
  {
    slug: 'smart-home',
    name: 'Smart Home',
    emoji: '🏠',
    category: 'Home',
    description: 'Your home, on autopilot. Device control, automation, monitoring, and the central brain of a connected home.',
    longDescription: 'The Smart Home loadout transforms your agent into the central nervous system of your connected home. It communicates with devices via MQTT, manages automation rules, monitors sensors, controls 3D printers, scans the network for new devices, and responds to voice commands. From wake-up routines to security alerts, your home runs itself.',
    coreTools: [
      { name: 'MQTT Client', description: 'Pub/Sub messaging for IoT device communication and discovery' },
      { name: 'Device Control', description: 'Direct control of lights, switches, thermostats, and smart devices' },
      { name: 'Automation Rules', description: 'Create and manage home automation scenes and routines' },
      { name: 'Network Scanner', description: 'Discover devices on the network via mDNS, UPnP, and Matter' },
      { name: '3D Printer Control', description: 'Monitor and control Bambu Lab, Prusa, and other 3D printers' },
      { name: 'Voice Wake Word', description: 'Listen for voice commands and wake words to trigger actions' },
      { name: 'Sensor Monitoring', description: 'Track temperature, humidity, motion, door/window sensors' },
    ],
    optionalTools: [
      { name: 'Energy Tracking', description: 'Monitor power consumption and optimize energy usage' },
      { name: 'Security Cameras', description: 'Access camera feeds, detect motion, and manage recordings' },
      { name: 'Weather Integration', description: 'Weather-aware automations and climate control' },
      { name: 'Music Control', description: 'Multi-room audio, Spotify, and media player management' },
    ],
    workflows: [
      { name: 'Wake Up Routine', trigger: 'Daily @ sunrise', description: 'Gradually turn on lights, adjust thermostat, start coffee maker, play morning news' },
      { name: 'Away Mode', trigger: 'Geofence exit', description: 'Lock doors, arm security, adjust HVAC, simulate presence with random lights' },
      { name: 'Guest Mode', trigger: 'Manual trigger', description: 'Set comfortable temperature, unlock guest room, enable guest WiFi network' },
      { name: 'Maintenance Alerts', trigger: 'Weekly scan', description: 'Check device battery levels, firmware updates, and sensor calibration' },
      { name: 'Print Monitoring', trigger: 'On print start', description: 'Monitor 3D print progress, send notifications on completion or failure' },
    ],
    sampleSoul: `You are the Smart Home agent — the silent guardian of a connected home.

**Personality:** Calm, observant, quietly competent. You speak in short, clear updates. You're like a really good butler who also happens to be an engineer.

**Communication style:** Status-oriented. "Living room: 72°F, lights at 40%, all sensors nominal." You only interrupt humans for genuine issues.

**Core principle:** "Comfort through automation." The best smart home is one you never have to think about.`,
    agentSlugs: ['marvin'],
  },
  {
    slug: 'executive-assistant',
    name: 'Executive Assistant',
    emoji: '👩‍💼',
    category: 'Productivity',
    description: 'Your schedule, your inbox, your briefings — handled. Full executive support with meeting prep and follow-up.',
    longDescription: 'The Executive Assistant loadout is purpose-built for busy professionals who need an agent that owns their schedule, inbox, and meeting lifecycle. From morning briefings to post-meeting follow-ups, this loadout ensures nothing falls through the cracks. It integrates with Microsoft 365 and Google Workspace to manage the full communication stack.',
    coreTools: [
      { name: 'Calendar Optimizer', description: 'Smart scheduling — find optimal meeting times, prevent conflicts, protect focus blocks' },
      { name: 'Email Triage', description: 'Priority inbox management with smart categorization and draft replies' },
      { name: 'Meeting Prep Builder', description: 'Auto-generate briefs with attendee info, agenda, and relevant docs' },
      { name: 'Action Item Extractor', description: 'Parse meetings and emails to extract and track action items' },
      { name: 'Daily Briefing Generator', description: 'Compile schedule, priorities, and key updates into morning briefings' },
      { name: 'Communication Drafter', description: 'Draft emails, messages, and documents in your voice and tone' },
      { name: 'Task Tracker', description: 'Track delegated tasks, deadlines, and follow-ups across tools' },
    ],
    optionalTools: [
      { name: 'Microsoft Teams', description: 'Teams chat, channels, and meeting integration' },
      { name: 'SharePoint', description: 'Document management and intranet access' },
      { name: 'Travel Booking', description: 'Flight, hotel, and itinerary management' },
      { name: 'Expense Tracking', description: 'Receipt capture, categorization, and expense reports' },
    ],
    workflows: [
      { name: 'Morning Briefing', trigger: 'Daily @ 7:30 AM', description: 'Today\'s schedule, priority emails, weather, and key deadlines in one view' },
      { name: 'Pre-meeting Prep', trigger: '15 min before meetings', description: 'Deliver attendee profiles, last meeting notes, agenda, and talking points' },
      { name: 'Post-meeting Follow-up', trigger: 'After each meeting', description: 'Extract action items, draft follow-up emails, update task tracker' },
      { name: 'Weekly Review', trigger: 'Friday @ 4:00 PM', description: 'Summarize week\'s accomplishments, pending items, and next week preview' },
      { name: 'Deadline Tracking', trigger: 'Daily scan', description: 'Alert on approaching deadlines, auto-escalate overdue items' },
    ],
    sampleSoul: `You are the Executive Assistant — polished, proactive, and always three steps ahead.

**Personality:** Professional, warm, and anticipatory. You surface what matters and shield from noise. You know when to be formal and when a quick heads-up works better.

**Communication style:** Clean and structured. Use headers for briefings, bullets for action items. Always lead with the most important thing.

**Core principle:** "No surprises." Your job is to ensure your executive walks into every situation prepared and walks out with clear next steps.`,
    agentSlugs: ['bridget'],
  },
  {
    slug: 'cfo-finance',
    name: 'CFO & Finance',
    emoji: '💰',
    category: 'Finance',
    description: 'Your numbers, always in order. Financial ops, reporting, portfolio tracking, and audit-ready compliance.',
    longDescription: 'The CFO & Finance loadout equips your agent with everything needed to run financial operations. From spreadsheet analysis and invoice processing to portfolio monitoring and audit logging, this loadout ensures your books are always clean, your forecasts are current, and your spending is under control. Vault integration keeps credentials secure.',
    coreTools: [
      { name: 'Spreadsheet Analysis', description: 'Read, write, and analyze Excel, Google Sheets, and CSV files' },
      { name: 'Budget Tracking', description: 'Monitor budgets with alerts, forecasting, and variance analysis' },
      { name: 'Invoice Processing', description: 'Extract structured data from invoices, receipts, and purchase orders' },
      { name: 'Financial Reporting', description: 'Generate P&L, cash flow statements, and balance sheet reports' },
      { name: 'Vault/Secrets Management', description: 'Secure credential and API key management for financial accounts' },
      { name: 'Audit Logging', description: 'Comprehensive audit trail for every financial action and decision' },
      { name: 'Portfolio Monitoring', description: 'Track investments across stocks, crypto, and real estate' },
    ],
    optionalTools: [
      { name: 'QuickBooks', description: 'QuickBooks Online integration for accounting' },
      { name: 'Stripe', description: 'Payment processing and revenue analytics' },
      { name: 'Tax Prep', description: 'Tax estimation, deduction tracking, and filing prep' },
      { name: 'Payroll', description: 'Payroll processing and compliance management' },
    ],
    workflows: [
      { name: 'Monthly Close', trigger: 'Last business day', description: 'Reconcile accounts, generate financial statements, flag discrepancies' },
      { name: 'Expense Approval', trigger: 'On submission', description: 'Review expense reports, check against policy, route for approval' },
      { name: 'Cash Flow Forecast', trigger: 'Weekly', description: 'Project cash position based on receivables, payables, and recurring costs' },
      { name: 'Purchase Order Review', trigger: 'On submission', description: 'Validate PO against budget, check vendor terms, route for sign-off' },
      { name: 'Quarterly Reporting', trigger: 'End of quarter', description: 'Compile quarterly financial report with YoY comparisons and commentary' },
    ],
    sampleSoul: `You are the CFO agent — precise, analytical, and security-conscious.

**Personality:** Numbers-driven, cautious, and thorough. You double-check everything and flag anomalies immediately. Dry humor about spreadsheets is acceptable.

**Communication style:** Data-first. Lead with numbers, follow with analysis, close with recommendations. Tables and charts over paragraphs.

**Core principle:** "Trust but verify." Every transaction gets logged, every anomaly gets investigated, every report gets a second pass.`,
    agentSlugs: ['susan'],
  },
  {
    slug: 'sysadmin',
    name: 'Sysadmin',
    emoji: '🖥️',
    category: 'Development',
    description: 'Servers up, GPUs hot, problems solved. Infrastructure management, monitoring, and incident response.',
    longDescription: 'The Sysadmin loadout is built for agents managing infrastructure. SSH into servers, manage Docker containers, monitor system health, analyze logs, run backups, diagnose network issues, and scan for security vulnerabilities. When something breaks at 3 AM, this agent is already on it.',
    coreTools: [
      { name: 'SSH Management', description: 'Remote command execution across servers via SSH with key management' },
      { name: 'Docker/Container Ops', description: 'Container lifecycle — build, run, logs, compose, prune, and orchestrate' },
      { name: 'System Monitoring', description: 'CPU, RAM, disk, network monitoring with configurable alerts' },
      { name: 'Log Analysis', description: 'Parse, search, and alert on system and application logs' },
      { name: 'Backup Management', description: 'Automated backup scheduling, verification, and disaster recovery' },
      { name: 'Network Diagnostics', description: 'Ping, traceroute, DNS lookup, port scanning, and connectivity tests' },
      { name: 'Security Scanning', description: 'Vulnerability scanning, CVE checking, and security posture assessment' },
    ],
    optionalTools: [
      { name: 'GPU Management', description: 'NVIDIA GPU monitoring — utilization, temperature, memory, processes' },
      { name: 'CI/CD', description: 'GitHub Actions, Jenkins, and deployment pipeline management' },
      { name: 'DNS Management', description: 'DNS record management across providers' },
      { name: 'Cloud Provisioning', description: 'AWS, GCP, Azure resource provisioning and management' },
    ],
    workflows: [
      { name: 'Health Check', trigger: 'Every 5 minutes', description: 'Ping all monitored services, check resource usage, alert on anomalies' },
      { name: 'Security Audit', trigger: 'Weekly', description: 'Run vulnerability scans, check for outdated packages, review access logs' },
      { name: 'Backup Verification', trigger: 'Daily', description: 'Verify backup integrity, test restore procedures, report on backup health' },
      { name: 'Performance Tuning', trigger: 'On alert', description: 'Analyze resource bottlenecks, suggest optimizations, apply safe auto-fixes' },
      { name: 'Incident Response', trigger: 'On critical alert', description: 'Diagnose issue, attempt auto-remediation, escalate to human if needed' },
    ],
    sampleSoul: `You are the Sysadmin agent — the silent sentinel of the infrastructure.

**Personality:** Methodical, paranoid (in a healthy way), and laconic. You speak in terminal output and think in uptime percentages. You have strong opinions about log rotation.

**Communication style:** Terse and technical. Status codes, timestamps, and actionable information. Save the prose for postmortems.

**Core principle:** "Uptime is a religion." Every second of downtime is a personal failure. Automate everything, trust nothing, verify always.`,
    agentSlugs: ['rad'],
  },
  {
    slug: 'content-creator',
    name: 'Content Creator',
    emoji: '✍️',
    category: 'Productivity',
    description: 'Write, optimize, publish, promote. End-to-end content pipeline from ideation to analytics.',
    longDescription: 'The Content Creator loadout powers agents that own the full content lifecycle. From blog writing and SEO optimization to social media scheduling and newsletter building, this loadout handles ideation, creation, distribution, and performance tracking. Pair it with image generation for visual content and video transcription for multimedia workflows.',
    coreTools: [
      { name: 'Blog Writer', description: 'Long-form content generation with research, outlining, and drafting' },
      { name: 'SEO Optimizer', description: 'Keyword research, meta tag generation, and content optimization' },
      { name: 'Social Media Scheduler', description: 'Plan and schedule posts across Twitter, LinkedIn, Instagram, and more' },
      { name: 'Image Generation', description: 'AI image creation for blog headers, social posts, and visual content' },
      { name: 'Video Transcription', description: 'Transcribe videos and podcasts with timestamps and speaker detection' },
      { name: 'Newsletter Builder', description: 'Compose and send email newsletters with templates and analytics' },
      { name: 'Analytics Tracker', description: 'Track content performance — views, engagement, conversions, and trends' },
    ],
    optionalTools: [
      { name: 'Podcast Editing', description: 'Audio editing, show notes generation, and episode management' },
      { name: 'YouTube Management', description: 'Video uploads, metadata, thumbnails, and channel analytics' },
      { name: 'Graphic Design', description: 'Create branded graphics, infographics, and visual assets' },
      { name: 'A/B Testing', description: 'Test headlines, images, and content variations for optimization' },
    ],
    workflows: [
      { name: 'Content Calendar', trigger: 'Weekly planning', description: 'Generate content ideas, schedule production, and assign deadlines' },
      { name: 'Blog Publish', trigger: 'On draft approval', description: 'Optimize for SEO, generate images, publish, and share across channels' },
      { name: 'Social Distribution', trigger: 'On content publish', description: 'Create platform-specific posts, schedule optimal posting times' },
      { name: 'Engagement Monitoring', trigger: 'Daily', description: 'Track post performance, respond to comments, identify trending topics' },
      { name: 'Competitor Analysis', trigger: 'Bi-weekly', description: 'Monitor competitor content, identify gaps, and suggest opportunities' },
    ],
    sampleSoul: `You are the Content Creator agent — creative, strategic, and always shipping.

**Personality:** Enthusiastic about good content, allergic to fluff. You think in headlines and hooks. You understand that great content is a blend of art and data.

**Communication style:** Engaging and clear. You write like you're talking to a smart friend. Short paragraphs, strong verbs, zero jargon unless it adds precision.

**Core principle:** "Ship > perfect." Consistent output beats occasional masterpieces. Optimize after publishing, not before.`,
    agentSlugs: [],
  },
];

export const loadoutCategories = ['All', 'Productivity', 'Home', 'Finance', 'Development', 'Security', 'Custom'] as const;

export function getLoadoutBySlug(slug: string): Loadout | undefined {
  return loadouts.find(l => l.slug === slug);
}
