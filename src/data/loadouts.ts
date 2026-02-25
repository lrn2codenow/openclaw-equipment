export interface LoadoutTool {
  name: string;
  description: string;
  category: string;
}

export interface Loadout {
  slug: string;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
  category: string;
  coreTools: LoadoutTool[];
  optionalTools: LoadoutTool[];
}

export const loadouts: Loadout[] = [
  {
    slug: 'smart-home',
    name: 'Smart Home',
    emoji: '🏠',
    tagline: 'Your home, on autopilot.',
    description: 'Equips an agent to be the central brain of a connected home — device communication, automation, energy monitoring, security, and network health.',
    category: 'engineering',
    coreTools: [
      { name: 'ha-mcp-server', description: 'Home Assistant MCP Bridge — read states, call services, trigger automations', category: 'integration' },
      { name: 'mqtt-bridge', description: 'MQTT Pub/Sub Client — connect to brokers, handle device discovery', category: 'integration' },
      { name: 'device-discovery', description: 'Network & Protocol Device Scanner — mDNS, UPnP, Matter', category: 'discovery' },
      { name: 'routine-builder', description: 'Automation & Scene Composer — create and manage HA automations', category: 'automation' },
      { name: 'network-monitor', description: 'UniFi & General Network Health — monitor clients, bandwidth, alerts', category: 'monitoring' },
      { name: 'device-status-checker', description: 'Health & Diagnostics — ping devices, check battery, firmware', category: 'monitoring' },
      { name: 'weather-service', description: 'Weather Data for Smart Climate — forecasts, alerts, conditions', category: 'data' },
    ],
    optionalTools: [
      { name: 'energy-monitor', description: 'Power Consumption Tracker', category: 'monitoring' },
      { name: 'camera-viewer', description: 'Security Camera Feed Access', category: 'security' },
      { name: 'voice-handler', description: 'Voice Command Processing', category: 'interface' },
      { name: 'zigbee-manager', description: 'Zigbee Network Management', category: 'integration' },
    ],
  },
  {
    slug: 'email',
    name: 'Email',
    emoji: '📧',
    tagline: 'Everything your agent needs to own the inbox.',
    description: 'Full-service email operations — fetching, triaging, summarizing, drafting replies, tracking follow-ups, managing subscriptions, and daily digests.',
    category: 'productivity',
    coreTools: [
      { name: 'imap-connector', description: 'IMAP/SMTP Email Transport — read and send via any provider', category: 'integration' },
      { name: 'gmail-api', description: 'Gmail-Specific API Client — labels, threads, push notifications', category: 'integration' },
      { name: 'email-summarizer', description: 'Thread & Message Summarizer — key points, action items, decisions', category: 'analysis' },
      { name: 'priority-scorer', description: 'Email Urgency & Importance Ranker — score 1-10 with learning', category: 'analysis' },
      { name: 'reply-drafter', description: 'Contextual Reply Generator — tone-aware drafts from context', category: 'generation' },
      { name: 'contact-resolver', description: 'Sender Identity & Relationship Lookup — build contact graph', category: 'data' },
      { name: 'spam-phishing-classifier', description: 'Junk & Threat Filter — SPF/DKIM analysis, phishing detection', category: 'security' },
    ],
    optionalTools: [
      { name: 'newsletter-separator', description: 'Newsletter vs Important Email Sorter', category: 'analysis' },
      { name: 'calendar-extractor', description: 'Event & Meeting Detection from Emails', category: 'integration' },
      { name: 'attachment-processor', description: 'Attachment Analysis & Organization', category: 'utility' },
      { name: 'digest-builder', description: 'Daily/Weekly Email Digest Generator', category: 'generation' },
    ],
  },
  {
    slug: 'cfo-finance',
    name: 'CFO / Finance',
    emoji: '💰',
    tagline: 'Your numbers, always in order.',
    description: 'Financial operations agent — spreadsheet analysis, vault management, portfolio tracking, PO approvals, budget monitoring, and financial reporting.',
    category: 'finance',
    coreTools: [
      { name: 'spreadsheet-engine', description: 'Read, write, and analyze spreadsheets (Excel, Google Sheets, CSV)', category: 'data' },
      { name: 'vault-manager', description: 'Secure credential and secret management for financial accounts', category: 'security' },
      { name: 'portfolio-tracker', description: 'Investment portfolio monitoring — stocks, crypto, real estate', category: 'tracking' },
      { name: 'po-approval', description: 'Purchase order review, approval workflow, and spend tracking', category: 'workflow' },
      { name: 'budget-tracker', description: 'Budget monitoring with alerts, forecasting, and variance analysis', category: 'tracking' },
      { name: 'invoice-parser', description: 'Extract structured data from invoices and receipts', category: 'analysis' },
      { name: 'financial-reporter', description: 'Generate P&L, cash flow, and balance sheet reports', category: 'generation' },
    ],
    optionalTools: [
      { name: 'tax-calculator', description: 'Tax estimation and deduction tracking', category: 'analysis' },
      { name: 'expense-categorizer', description: 'Auto-categorize transactions', category: 'analysis' },
      { name: 'bank-connector', description: 'Bank account API integration (Plaid)', category: 'integration' },
    ],
  },
  {
    slug: 'executive-assistant',
    name: 'Executive Assistant',
    emoji: '👩‍💼',
    tagline: 'Your schedule, your inbox, your briefings — handled.',
    description: 'Full executive support — Microsoft/Google suite, calendar management, email triage, meeting prep, daily briefings, and task coordination.',
    category: 'productivity',
    coreTools: [
      { name: 'calendar-manager', description: 'Calendar CRUD — create, reschedule, cancel events across providers', category: 'integration' },
      { name: 'email-triage', description: 'Inbox prioritization and routing — surface what matters', category: 'analysis' },
      { name: 'meeting-prep', description: 'Pre-meeting briefs — attendee info, agenda, related docs', category: 'generation' },
      { name: 'briefing-builder', description: 'Daily/weekly briefings — schedule, priorities, action items', category: 'generation' },
      { name: 'ms-office-suite', description: 'Microsoft 365 integration — Word, Excel, PowerPoint, Teams', category: 'integration' },
      { name: 'google-workspace', description: 'Google Workspace integration — Docs, Sheets, Slides, Meet', category: 'integration' },
      { name: 'task-manager', description: 'Task tracking and delegation across Todoist, Asana, etc.', category: 'workflow' },
    ],
    optionalTools: [
      { name: 'travel-planner', description: 'Flight, hotel, and itinerary management', category: 'planning' },
      { name: 'contact-book', description: 'Contact management and relationship tracking', category: 'data' },
      { name: 'note-taker', description: 'Meeting transcription and note generation', category: 'generation' },
    ],
  },
  {
    slug: 'sysadmin-gpu',
    name: 'Sysadmin / GPU',
    emoji: '🖥️',
    tagline: 'Servers up, GPUs hot, problems solved.',
    description: 'System administration and GPU infrastructure — NVIDIA tools, Docker management, monitoring, benchmarking, driver management, and incident response.',
    category: 'engineering',
    coreTools: [
      { name: 'nvidia-smi-bridge', description: 'NVIDIA GPU monitoring — utilization, temp, memory, processes', category: 'monitoring' },
      { name: 'docker-manager', description: 'Docker container lifecycle — build, run, logs, compose, prune', category: 'infrastructure' },
      { name: 'system-monitor', description: 'CPU, RAM, disk, network monitoring with alerts', category: 'monitoring' },
      { name: 'benchmark-runner', description: 'GPU and system benchmarks — inference speed, throughput tests', category: 'testing' },
      { name: 'driver-manager', description: 'NVIDIA driver and CUDA toolkit management', category: 'infrastructure' },
      { name: 'log-analyzer', description: 'System and application log parsing and alerting', category: 'analysis' },
      { name: 'ssh-executor', description: 'Remote command execution across servers via SSH', category: 'infrastructure' },
    ],
    optionalTools: [
      { name: 'k8s-manager', description: 'Kubernetes cluster management', category: 'infrastructure' },
      { name: 'backup-manager', description: 'Automated backup and recovery', category: 'infrastructure' },
      { name: 'firewall-manager', description: 'Firewall rules and network security', category: 'security' },
    ],
  },
  {
    slug: 'chief-of-staff',
    name: 'Chief of Staff',
    emoji: '📋',
    tagline: 'Orchestrate everything. Miss nothing.',
    description: 'Agent orchestration and operations — roster management, project tracking, memory systems, cross-agent coordination, and strategic oversight.',
    category: 'operations',
    coreTools: [
      { name: 'roster-manager', description: 'Agent roster CRUD — deploy, configure, monitor all agents', category: 'orchestration' },
      { name: 'project-tracker', description: 'Project and milestone tracking across all agent activities', category: 'tracking' },
      { name: 'memory-system', description: 'Long-term memory — store, retrieve, and connect knowledge', category: 'knowledge' },
      { name: 'agent-messenger', description: 'Cross-agent communication — delegate tasks, collect results', category: 'orchestration' },
      { name: 'priority-engine', description: 'Dynamic priority management — what matters most right now', category: 'analysis' },
      { name: 'status-reporter', description: 'Generate status reports across all agent operations', category: 'generation' },
      { name: 'escalation-router', description: 'Route issues to the right agent or human', category: 'workflow' },
    ],
    optionalTools: [
      { name: 'audit-logger', description: 'Comprehensive audit trail for all agent actions', category: 'compliance' },
      { name: 'resource-allocator', description: 'Token and compute budget management', category: 'operations' },
      { name: 'workflow-builder', description: 'Multi-agent workflow design and execution', category: 'orchestration' },
    ],
  },
];

export function getLoadoutBySlug(slug: string): Loadout | undefined {
  return loadouts.find(l => l.slug === slug);
}
