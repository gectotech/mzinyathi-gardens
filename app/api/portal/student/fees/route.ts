import { eq } from 'drizzle-orm';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { getDb, schema } from '@/lib/db';
import { getFeesForStudent, summarizeFees } from '@/lib/portal-fees';
import { getPortalSession } from '@/lib/portal-session';

export async function GET() {
  try {
    const session = await getPortalSession();
    if (!session || session.role !== 'student') {
      return jsonError('Unauthorized', 401);
    }

    const db = getDb();
    const [account] = await db
      .select()
      .from(schema.portalAccounts)
      .where(eq(schema.portalAccounts.id, session.accountId))
      .limit(1);

    if (!account?.studentId) {
      return jsonError('Student record not linked', 404);
    }

    const items = await getFeesForStudent(account.studentId);
    const summary = summarizeFees(items);

    return jsonOk({ items, summary });
  } catch (error) {
    return handleAuthError(error);
  }
}
