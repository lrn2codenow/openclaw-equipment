import { NextRequest, NextResponse } from 'next/server';
import { getStaticPackage } from '@/lib/static-data';

const cors = { 'Access-Control-Allow-Origin': '*' };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const pkg = getStaticPackage(slug);
  
  if (!pkg) {
    return NextResponse.json({ error: 'Package not found', slug }, { status: 404, headers: cors });
  }

  const install = pkg.install || '';
  let method = 'manual';
  if (install.startsWith('npx ') || install.startsWith('npm ')) method = 'npm';
  else if (install.startsWith('pip ')) method = 'pip';
  else if (install.startsWith('brew ')) method = 'brew';
  else if (install.startsWith('git clone')) method = 'git';
  else if (install.startsWith('cargo ')) method = 'cargo';
  else if (install.startsWith('docker ')) method = 'docker';

  let mcpConfig = null;
  if (pkg.slug.endsWith('-mcp-server') || pkg.category === 'mcp-tools') {
    const args = install.replace(/^npx -y /, '').split(' ');
    mcpConfig = { [pkg.slug]: { command: 'npx', args: ['-y', ...args] } };
  }

  let platform: string[] = ['any'];
  try { platform = JSON.parse(pkg.platform || '["any"]'); } catch { /* */ }

  return NextResponse.json({
    slug: pkg.slug, name: pkg.name, version: pkg.version,
    install: { command: install, method, source_url: pkg.source_url },
    mcp_config: mcpConfig, platform,
  }, { headers: cors });
}
