import { NextRequest } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requireAuth, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';

export async function GET() {
  try {
    await requireAuth(['admin', 'super_admin']);
    const db = getDb();
    const contacts = await db
      .select()
      .from(schema.contactSubmissions)
      .orderBy(desc(schema.contactSubmissions.createdAt));
    return jsonOk({ contacts });
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
      .update(schema.contactSubmissions)
      .set({ status })
      .where(eq(schema.contactSubmissions.id, id))
      .returning();

    await logAudit(user.id, 'update', 'contact', id, { status });
    return jsonOk({ contact: updated });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth(['admin', 'super_admin']);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return jsonError('Missing id');

    const db = getDb();
    await db.delete(schema.contactSubmissions).where(eq(schema.contactSubmissions.id, id));
    await logAudit(user.id, 'delete', 'contact', id);
    return jsonOk({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
