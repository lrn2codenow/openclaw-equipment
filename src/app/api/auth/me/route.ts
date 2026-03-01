import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getOrgSessionByToken, getAgentsByOrg } from '@/lib/auth-db';

export async function GET(req: NextRequest) {
  // Try new org session
  const orgToken = req.cookies.get('oc-session')?.value;
  if (orgToken) {
    const org = getOrgSessionByToken(orgToken);
    if (org) {
      const agents = getAgentsByOrg(org.id);
      return NextResponse.json({
        user: { id: org.id, name: org.name, email: org.email, org_name: org.name },
        org: { id: org.id, name: org.name, email: org.email, org_key: org.org_key, created_at: org.created_at },
        agents,
      });
    }
  }

  // Fall back to legacy
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}
