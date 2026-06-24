import { eq } from 'drizzle-orm';
import { jsonOk, handleAuthError } from '@/lib/api-utils';
import { getDb, schema } from '@/lib/db';
import { accountToPortalUser } from '@/lib/portal-service';
import { getPortalSession, destroyPortalSession } from '@/lib/portal-session';

export async function GET() {
  try {
    const session = await getPortalSession();
    if (!session) return jsonOk({ user: null });

    const db = getDb();
    const [account] = await db
      .select()
      .from(schema.portalAccounts)
      .where(eq(schema.portalAccounts.id, session.accountId))
      .limit(1);

    if (account) {
      const user = await accountToPortalUser(account);
      return jsonOk({ user });
    }

    const { accountId: _accountId, ...user } = session;
    return jsonOk({ user });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE() {
  try {
    await destroyPortalSession();
    return jsonOk({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
