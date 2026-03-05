/**
 * Maps human-readable loadout tool names to actual package slugs in the registry.
 * This is the bridge that makes loadouts installable.
 */
export const toolToPackages: Record<string, string[]> = {
  // Chief of Staff
  'Calendar Management': ['google-calendar-mcp-server'],
  'Email Triage': ['gmail-mcp-server', 'resend-mcp-server'],
  'Task Tracking': ['linear-mcp-server', 'todoist-mcp-server', 'notion-mcp-server'],
  'Web Search': ['brave-search-mcp-server', 'tavily'],
  'Memory System': ['memory-mcp-server', 'obsidian-mcp-server'],
  'Sub-agent Orchestration': [], // Built into OpenClaw core
  'File Management': ['filesystem-mcp-server'],

  // Smart Home
  'MQTT Client': ['mqtt-mcp-server'],
  'Device Control': ['home-assistant-mcp-server'],
  'Automation Rules': ['home-assistant-mcp-server'],
  'Network Scanner': ['nmap-tool'],
  '3D Printer Control': ['bambu-connect'],
  'Voice Wake Word': ['whisper-mcp-server'],
  'Sensor Monitoring': ['home-assistant-mcp-server'],

  // Executive Assistant
  'Calendar Optimizer': ['google-calendar-mcp-server'],
  'Meeting Prep Builder': ['brave-search-mcp-server', 'notion-mcp-server'],
  'Action Item Extractor': ['memory-mcp-server'],
  'Daily Briefing Generator': ['brave-search-mcp-server', 'memory-mcp-server'],
  'Communication Drafter': ['gmail-mcp-server', 'slack-mcp-server'],
  'Task Tracker': ['linear-mcp-server', 'todoist-mcp-server'],

  // CFO / Finance
  'Spreadsheet Analysis': ['google-sheets-mcp-server'],
  'Budget Tracking': ['google-sheets-mcp-server'],
  'Invoice Processing': ['stripe-mcp-server'],
  'Financial Reporting': ['google-sheets-mcp-server'],
  'Vault/Secrets Management': ['onepassword-mcp-server'],
  'Audit Logging': ['filesystem-mcp-server', 'git-mcp-server'],
  'Portfolio Monitoring': ['brave-search-mcp-server', 'fetch-mcp-server'],

  // Sysadmin
  'SSH Management': ['ssh-mcp-server'],
  'Docker/Container Ops': ['docker-mcp-server'],
  'System Monitoring': ['prometheus-mcp-server'],
  'Log Analysis': ['elasticsearch-mcp-server'],
  'Backup Management': ['aws-mcp-server', 'filesystem-mcp-server'],
  'Network Diagnostics': ['nmap-tool'],
  'Security Scanning': ['snyk-mcp-server'],

  // Content Creator
  'Blog Writer': ['notion-mcp-server', 'filesystem-mcp-server'],
  'SEO Optimizer': ['brave-search-mcp-server', 'fetch-mcp-server'],
  'Social Media Scheduler': ['buffer-mcp-server'],
  'Image Generation': ['replicate-mcp-server', 'dall-e-mcp-server'],
  'Video Transcription': ['youtube-transcript-mcp-server', 'whisper-mcp-server'],
  'Newsletter Builder': ['resend-mcp-server', 'beehiiv-mcp-server'],
  'Analytics Tracker': ['google-analytics-mcp-server'],
};

/**
 * Given a loadout tool name, return matching package slugs from the registry.
 * Falls back to fuzzy matching if no exact mapping exists.
 */
export function getPackagesForTool(toolName: string): string[] {
  return toolToPackages[toolName] || [];
}
