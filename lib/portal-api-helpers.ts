import { eq } from 'drizzle-orm';
import { jsonError } from '@/lib/api-utils';
import { getDb, schema } from '@/lib/db';
import type { PortalRole } from '@/lib/portal-auth';
import { getPortalSession } from '@/lib/portal-session';

export async function requirePortalRole(roles: PortalRole | PortalRole[]) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  const session = await getPortalSession();
  if (!session || !allowed.includes(session.role)) {
    return { error: jsonError('Unauthorized', 401) as Response, session: null, account: null };
  }

  const db = getDb();
  const [account] = await db
    .select()
    .from(schema.portalAccounts)
    .where(eq(schema.portalAccounts.id, session.accountId))
    .limit(1);

  if (!account) {
    return { error: jsonError('Portal account not found', 404) as Response, session: null, account: null };
  }

  return { error: null, session, account };
}

export async function getStudentForAccount(account: typeof schema.portalAccounts.$inferSelect) {
  if (!account.studentId) return null;
  const db = getDb();
  const [student] = await db
    .select()
    .from(schema.students)
    .where(eq(schema.students.id, account.studentId))
    .limit(1);
  return student ?? null;
}
