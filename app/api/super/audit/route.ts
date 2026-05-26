import { desc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { jsonOk, handleAuthError } from '@/lib/api-utils';

export async function GET() {
  try {
    await requireAuth(['super_admin']);
    const db = getDb();
    const logs = await db
      .select({
        id: schema.auditLogs.id,
        action: schema.auditLogs.action,
        entity: schema.auditLogs.entity,
        entityId: schema.auditLogs.entityId,
        details: schema.auditLogs.details,
        createdAt: schema.auditLogs.createdAt,
        userName: schema.users.name,
        userEmail: schema.users.email,
      })
      .from(schema.auditLogs)
      .leftJoin(schema.users, eq(schema.auditLogs.userId, schema.users.id))
      .orderBy(desc(schema.auditLogs.createdAt))
      .limit(100);

    return jsonOk({ logs });
  } catch (error) {
    return handleAuthError(error);
  }
}
