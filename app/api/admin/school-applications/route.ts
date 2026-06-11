import { NextRequest } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requireAuth, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';

export async function GET() {
  try {
    await requireAuth(['admin', 'super_admin']);
    const db = getDb();
    const applications = await db
      .select()
      .from(schema.schoolApplications)
      .orderBy(desc(schema.schoolApplications.createdAt));

    return jsonOk({ applications });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth(['admin', 'super_admin']);
    const { id, status } = await request.json();
    if (!id || !status) return jsonError('Missing id or status');

    const db = getDb();
    const [updated] = await db
      .update(schema.schoolApplications)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.schoolApplications.id, id))
      .returning();

    await logAudit(user.id, 'update', 'school_application', id, { status });
    return jsonOk({ application: updated });
  } catch (error) {
    return handleAuthError(error);
  }
}
