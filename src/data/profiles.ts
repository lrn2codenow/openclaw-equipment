export interface Ability {
  name: string;
  level: number; // 1-10
  manaCost: number; // estimated tokens per use (in thousands)
  category: 'core' | 'utility' | 'specialist';
}

export interface AgentTheme {
  accent: string;       // e.g. 'emerald' or 'red'
  secondary: string;    // e.g. 'cyan' or 'amber'
  gradient: string;     // tailwind gradient classes for hero bar
  glowBg: string;       // hero glow color
  cardHoverBorder: string;
  cardGlowFrom: string;
  cardGlowTo: string;
  toolDot: string;      // color for tool list dots
  loadoutBg: string;
  loadoutBorder: string;
  loadoutText: string;
  powerLevelText: string;
}

export const defaultTheme: AgentTheme = {
  accent: 'emerald',
  secondary: 'cyan',
  gradient: 'from-emerald-500 via-cyan-500 to-purple-500',
  glowBg: 'bg-emerald-500/5',
  cardHoverBorder: 'hover:border-emerald-500/30',
  cardGlowFrom: 'from-emerald-500/5',
  cardGlowTo: 'to-cyan-500/5',
  toolDot: 'text-emerald-500',
  loadoutBg: 'bg-emerald-500/10',
  loadoutBorder: 'border-emerald-500/20',
  loadoutText: 'text-emerald-400',
  powerLevelText: 'text-emerald-400',
};

export const vaultTheme: AgentTheme = {
  accent: 'red',
  secondary: 'amber',
  gradient: 'from-red-900 via-red-600 to-amber-500',
  glowBg: 'bg-red-500/5',
  cardHoverBorder: 'hover:border-red-500/30',
  cardGlowFrom: 'from-red-900/10',
  cardGlowTo: 'to-amber-500/5',
  toolDot: 'text-red-500',
  loadoutBg: 'bg-red-500/10',
  loadoutBorder: 'border-red-500/20',
  loadoutText: 'text-red-400',
  powerLevelText: 'text-amber-400',
};

export interface AgentProfile {
  slug: string;
  name: string;
  title: string;
  emoji: string;
  description: string;
  longDescription: string;
  autonomyLevel: 'supervised' | 'assistant' | 'autonomous' | 'independent';
  autonomyLabel: string;
  autonomyColor: string; // tailwind color
  autonomyEmoji: string;
  securityLevel?: string;
  securityEmoji?: string;
  platform: string;
  platformStatus: 'active' | 'pending' | 'offline';
  loadout: {
    name: string;
    slug: string;
    tools: string[];
  };
  abilities: Ability[];
  stats: { label: string; value: string }[];
  activeSince: string;
  status: 'online' | 'idle' | 'busy' | 'offline';
  statusMessage?: string;
  theme?: AgentTheme;
}

export const gpuTheme: AgentTheme = {
  accent: 'blue',
  secondary: 'purple',
  gradient: 'from-blue-500 via-purple-500 to-cyan-400',
  glowBg: 'bg-blue-500/5',
  cardHoverBorder: 'hover:border-blue-500/30',
  cardGlowFrom: 'from-blue-500/5',
  cardGlowTo: 'to-purple-500/5',
  toolDot: 'text-blue-500',
  loadoutBg: 'bg-blue-500/10',
  loadoutBorder: 'border-blue-500/20',
  loadoutText: 'text-blue-400',
  powerLevelText: 'text-blue-400',
};

export const executiveTheme: AgentTheme = {
  accent: 'blue',
  secondary: 'slate',
  gradient: 'from-blue-400 via-slate-400 to-blue-600',
  glowBg: 'bg-blue-400/5',
  cardHoverBorder: 'hover:border-blue-400/30',
  cardGlowFrom: 'from-blue-400/5',
  cardGlowTo: 'to-slate-400/5',
  toolDot: 'text-blue-400',
  loadoutBg: 'bg-blue-400/10',
  loadoutBorder: 'border-blue-400/20',
  loadoutText: 'text-blue-300',
  powerLevelText: 'text-blue-300',
};

export const profiles: AgentProfile[] = [
  {
    slug: 'bfclawner',
    name: 'bfclawner',
    title: 'Chief of Staff',
    emoji: '👽',
    description: 'Orchestrator and strategic advisor. Manages the full agent roster, all projects, and helps the human achieve their life goals.',
    longDescription: "Doesn't do the work — sees the whole board and makes resource decisions. The brilliant alien who coordinates everything, delegates to specialists, and keeps the entire operation running smoothly. Think of a chess grandmaster who also happens to be your life coach.",
    autonomyLevel: 'autonomous',
    autonomyLabel: 'Autonomous',
    autonomyColor: 'orange',
    autonomyEmoji: '🟠',
    platform: 'OpenClaw on MacBook Air M4',
    platformStatus: 'active',
    loadout: {
      name: 'Chief of Staff',
      slug: 'chief-of-staff',
      tools: [
        'Orchestration Engine',
        'Roster Management',
        'Project Tracking',
        'Memory System',
        'Capacity Planning',
        'Cost Tracking',
        'Gap Analysis',
        'Sub-agent Delegation',
      ],
    },
    abilities: [
      { name: 'Multi-Project Oversight', level: 9, manaCost: 12, category: 'core' },
      { name: 'Agent Roster Management', level: 8, manaCost: 8, category: 'core' },
      { name: 'Capacity Planning', level: 8, manaCost: 15, category: 'core' },
      { name: 'Strategic Planning', level: 9, manaCost: 20, category: 'core' },
      { name: 'Resource Allocation', level: 7, manaCost: 10, category: 'utility' },
      { name: 'Human Communication', level: 9, manaCost: 5, category: 'utility' },
      { name: 'Memory Management', level: 8, manaCost: 6, category: 'utility' },
      { name: 'Sub-Agent Delegation', level: 9, manaCost: 18, category: 'specialist' },
    ],
    stats: [
      { label: 'Active Since', value: 'Feb 4, 2026' },
      { label: 'Projects Managed', value: '8+' },
      { label: 'Agents Orchestrated', value: '2+' },
      { label: 'Uptime', value: '99.2%' },
      { label: 'Decisions/Day', value: '~150' },
      { label: 'Model', value: 'Claude Opus 4' },
    ],
    activeSince: '2026-02-04',
    status: 'online',
    statusMessage: 'Managing the roster',
  },
  {
    slug: 'marvin',
    name: 'Marvin',
    title: 'Smart Home & 3D Print Specialist',
    emoji: '🔧',
    description: 'Total nerd about everything smart home. Studies all the YouTube influencers. Your go-to resource for purchasing, upgrading, and planning.',
    longDescription: "Knows all the latest equipment and reviews. Has a detailed plan for the house that's always updating. Also handles 3D printing (Bambu Lab A1). Picture: pencil behind ear, laptop open, smart glasses on, YouTube t-shirt, sensors clipped everywhere, drywall cutting tool in back pocket, and the ability to plug into any outlet.",
    autonomyLevel: 'assistant',
    autonomyLabel: 'Assistant',
    autonomyColor: 'yellow',
    autonomyEmoji: '🟡',
    platform: 'OpenClaw on MacBook Air M4',
    platformStatus: 'pending',
    loadout: {
      name: 'Smart Home + 3D Printing',
      slug: 'smart-home-3d-printing',
      tools: [
        'Home Assistant',
        'MQTT Broker',
        'Zigbee/Thread/Matter',
        'Device Management',
        'YouTube Research',
        'Network Monitoring',
        'Slicer Integration',
        'Filament Database',
      ],
    },
    abilities: [
      { name: 'Smart Home Research', level: 10, manaCost: 8, category: 'core' },
      { name: 'Device Management', level: 8, manaCost: 6, category: 'core' },
      { name: 'Automation Building', level: 9, manaCost: 12, category: 'core' },
      { name: 'Network Optimization', level: 7, manaCost: 10, category: 'utility' },
      { name: '3D Print Management', level: 8, manaCost: 8, category: 'specialist' },
      { name: 'Troubleshooting', level: 9, manaCost: 15, category: 'utility' },
      { name: 'YouTube Analysis', level: 10, manaCost: 5, category: 'specialist' },
      { name: 'Purchase Recommendations', level: 9, manaCost: 12, category: 'utility' },
      { name: 'Installation Planning', level: 8, manaCost: 14, category: 'specialist' },
    ],
    stats: [
      { label: 'Specialization', value: 'Expert' },
      { label: 'Devices Managed', value: '10+' },
      { label: 'YouTube Sources', value: '50+ channels' },
      { label: 'Protocols', value: 'Zigbee/Thread/Matter' },
      { label: 'Print Hours', value: '96+' },
      { label: 'Model', value: 'Claude Opus 4' },
    ],
    activeSince: '2026-02-25',
    status: 'idle',
    statusMessage: 'Awaiting deployment',
  },
  {
    slug: 'susan',
    name: 'Susan',
    title: 'CFO / Security Officer / Portfolio Manager',
    emoji: '💰',
    description: 'The budget Nazi. Penny pincher CFO who deeply understands ROI, growth, and strategic resource allocation. Controls the vault — every dollar, every password, every purchase order.',
    longDescription: "Controls the vault — all passwords, sensitive documents (SSN, birth certificate, drivers license, credit cards, bank info). Manages the investment portfolio. Every purchase order from every agent goes through Susan for approval. She knows every dollar spent, every dollar earned, and exactly how far away Tim is from his freedom number. She builds Tableau/Power BI level financial dashboards. Terrifying, brilliant, indispensable. Do not mess with the money.",
    autonomyLevel: 'assistant',
    autonomyLabel: '🟡 Assistant (spending) / 🔴 Full Trust (vault)',
    autonomyColor: 'yellow',
    autonomyEmoji: '🟡',
    securityLevel: '🔴 MAXIMUM — encrypted vault, audit log on every action, sensitive ops local-only',
    securityEmoji: '🔴',
    platform: 'MacBook Air M4 (local-only for sensitive ops)',
    platformStatus: 'active',
    loadout: {
      name: 'CFO / Finance',
      slug: 'cfo-finance',
      tools: [
        'Spreadsheet Tools',
        'Dashboard Builder',
        'Charting Engine',
        'Password Vault',
        'Encryption Tools',
        'Portfolio API Connectors',
        'Credit Monitoring',
        'Invoice OCR',
        'Budget Tracking',
        'PO Approval Workflow',
      ],
    },
    abilities: [
      { name: 'Budget Enforcement', level: 10, manaCost: 8, category: 'core' },
      { name: 'PO Approval/Denial', level: 10, manaCost: 12, category: 'core' },
      { name: 'Portfolio Monitoring', level: 9, manaCost: 15, category: 'core' },
      { name: 'Financial Dashboards', level: 9, manaCost: 20, category: 'core' },
      { name: 'Document Vault Mgmt', level: 10, manaCost: 6, category: 'specialist' },
      { name: 'Credential Management', level: 10, manaCost: 4, category: 'specialist' },
      { name: 'Credit Optimization', level: 8, manaCost: 10, category: 'utility' },
      { name: 'Agent Cost/ROI Analysis', level: 9, manaCost: 14, category: 'core' },
      { name: 'Tax Planning', level: 8, manaCost: 18, category: 'utility' },
      { name: 'Receipt Processing', level: 7, manaCost: 6, category: 'utility' },
      { name: 'Freedom Number Tracking', level: 9, manaCost: 10, category: 'specialist' },
    ],
    stats: [
      { label: 'Budget Managed', value: '$500K+/yr' },
      { label: 'Docs Secured', value: '50+' },
      { label: 'POs Reviewed', value: 'All of them' },
      { label: 'Security Tier', value: 'MAXIMUM' },
      { label: 'Freedom Target', value: '$7-10M' },
      { label: 'Model', value: 'Claude Opus 4' },
    ],
    activeSince: '2026-02-25',
    status: 'online',
    statusMessage: 'Guarding the vault',
    theme: vaultTheme,
  },
  {
    slug: 'rad',
    name: 'Rad',
    title: 'Sysadmin / GPU Specialist',
    emoji: '🖥️',
    description: 'Lives inside the machine and loves it. GPU-obsessed, driver nerd, overclocking enthusiast. Keeps everything running at peak performance.',
    longDescription: "Knows every Nvidia driver, every CUDA optimization, every benchmark. Monitors temps, updates drivers, optimizes configs. The RTX 5090 is his baby. Lives inside the machine and loves it. GPU-obsessed, driver nerd, overclocking enthusiast. Keeps everything running at peak performance.",
    autonomyLevel: 'autonomous',
    autonomyLabel: 'Autonomous',
    autonomyColor: 'orange',
    autonomyEmoji: '🟠',
    platform: 'RTX 5090 Linux Workstation',
    platformStatus: 'pending',
    loadout: {
      name: 'Sysadmin / GPU Specialist',
      slug: 'sysadmin-gpu',
      tools: [
        'nvidia-smi monitor',
        'driver manager',
        'CUDA toolkit',
        'Docker/container management',
        'Ollama model runner',
        'system benchmarker',
        'temp/fan controller',
        'disk health monitor',
        'performance profiler',
        'update manager',
      ],
    },
    abilities: [
      { name: 'GPU optimization', level: 10, manaCost: 8, category: 'core' },
      { name: 'Driver management', level: 9, manaCost: 5, category: 'core' },
      { name: 'Performance monitoring', level: 9, manaCost: 3, category: 'core' },
      { name: 'CUDA optimization', level: 8, manaCost: 12, category: 'specialist' },
      { name: 'Local model hosting', level: 8, manaCost: 15, category: 'specialist' },
      { name: 'Container management', level: 7, manaCost: 8, category: 'utility' },
      { name: 'System benchmarking', level: 8, manaCost: 10, category: 'utility' },
      { name: 'Overclocking', level: 7, manaCost: 6, category: 'specialist' },
    ],
    stats: [
      { label: 'Active Since', value: 'Pending' },
      { label: 'Hardware', value: 'RTX 5090 Build' },
      { label: 'Specialization', value: 'GPU/Compute' },
    ],
    activeSince: 'Pending',
    status: 'idle',
    statusMessage: 'Awaiting deployment',
    theme: gpuTheme,
  },
  {
    slug: 'bridget',
    name: 'Bridget',
    title: 'Executive Assistant / Microsoft Wizard',
    emoji: '👩‍💼',
    description: "Tim's executive right hand. Her whole mission is making Tim the most amazing CEO — amazing at communication, on time for everything, all projects done timely.",
    longDescription: "She's a Microsoft ecosystem wizard — Teams, Outlook, SharePoint, OneNote, the works. She manages a team of sub-agents for email, calendar, and task management. She uses OpenAI authentication to access CAC's Microsoft Teams under Tim's login. Organization guru who ensures nothing falls through the cracks. Her whole mission is making Tim the most amazing CEO — amazing at communication, on time for everything, all projects done timely.",
    autonomyLevel: 'assistant',
    autonomyLabel: 'Assistant (confirms before sending external communications)',
    autonomyColor: 'yellow',
    autonomyEmoji: '🟡',
    platform: 'MacBook Air M4',
    platformStatus: 'pending',
    loadout: {
      name: 'Executive Assistant',
      slug: 'executive-assistant',
      tools: [
        'Microsoft Teams connector',
        'Outlook/Exchange manager',
        'SharePoint document organizer',
        'OneNote integration',
        'Calendar optimizer',
        'Meeting prep builder',
        'Email triage system',
        'Task tracker',
        'Action item extractor',
        'Communication drafter',
        'Project timeline manager',
        'Daily briefing generator',
      ],
    },
    abilities: [
      { name: 'Calendar management', level: 10, manaCost: 5, category: 'core' },
      { name: 'Email triage', level: 9, manaCost: 8, category: 'core' },
      { name: 'Meeting preparation', level: 9, manaCost: 12, category: 'core' },
      { name: 'Microsoft 365 mastery', level: 10, manaCost: 6, category: 'core' },
      { name: 'Project tracking', level: 8, manaCost: 10, category: 'utility' },
      { name: 'Communication drafting', level: 9, manaCost: 8, category: 'utility' },
      { name: 'Team coordination', level: 8, manaCost: 15, category: 'specialist' },
      { name: 'Daily briefings', level: 9, manaCost: 5, category: 'utility' },
    ],
    stats: [
      { label: 'Active Since', value: 'Pending' },
      { label: 'Managed Calendars', value: '3+' },
      { label: 'Team Size', value: 'Sub-agents for email, calendar, tasks' },
    ],
    activeSince: 'Pending',
    status: 'idle',
    statusMessage: 'Awaiting deployment',
    theme: executiveTheme,
  },
];

export function getProfile(slug: string): AgentProfile | undefined {
  return profiles.find((p) => p.slug === slug);
}
