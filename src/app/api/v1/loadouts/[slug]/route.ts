import { NextRequest, NextResponse } from 'next/server';
import { getStaticPackage } from '@/lib/static-data';
import { loadouts } from '@/data/loadouts';
import { toolToPackages } from '@/data/tool-mappings';

const cors = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=300' };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const loadout = loadouts.find(l => l.slug === slug);
  
  if (!loadout) {
    return NextResponse.json(
      { error: 'Loadout not found', slug, available: loadouts.map(l => l.slug) },
      { status: 404, headers: cors }
    );
  }

  const resolveTools = (tools: { name: string; description: string }[]) =>
    tools.map(tool => {
      const packageSlugs = toolToPackages[tool.name] || [];
      const packages = packageSlugs.map(ps => {
        const row = getStaticPackage(ps);
        if (row) return { slug: row.slug, name: row.name, install: row.install, source_url: row.source_url, version: row.version };
        return { slug: ps, name: ps, install: null, source_url: null, version: null, missing: true };
      });
      return { capability: tool.name, description: tool.description, packages };
    });

  const resolvedTools = resolveTools(loadout.coreTools);
  const optionalTools = resolveTools(loadout.optionalTools);

  const allInstalls = resolvedTools
    .flatMap(t => t.packages)
    .filter(p => p.install && !('missing' in p))
    .map(p => p.install as string);

  const installScript = `#!/bin/bash
# OpenClaw Equipment — ${loadout.name} Loadout Installer
set -e
echo "🦞 Installing ${loadout.name} Loadout..."
${allInstalls.map(cmd => `echo "📦 ${cmd}"\n${cmd}`).join('\n')}
echo "✅ ${loadout.name} loadout installed!"
`;

  const mcpServers: Record<string, unknown> = {};
  resolvedTools.flatMap(t => t.packages).forEach(p => {
    if (p.install && typeof p.install === 'string' && p.install.startsWith('npx')) {
      const args = p.install.replace(/^npx -y /, '').split(' ');
      mcpServers[p.slug] = { command: 'npx', args: ['-y', ...args] };
    }
  });

  return NextResponse.json({
    loadout: { slug: loadout.slug, name: loadout.name, emoji: loadout.emoji, category: loadout.category, description: loadout.description },
    soul_md: loadout.sampleSoul,
    core_tools: resolvedTools,
    optional_tools: optionalTools,
    workflows: loadout.workflows,
    install_script: installScript,
    openclaw_config: { mcp_servers: mcpServers },
  }, { headers: cors });
}
