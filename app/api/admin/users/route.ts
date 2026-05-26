import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requireAuth, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';

export async function GET() {
  try {
    await requireAuth(['super_admin']);
    const db = getDb();
    const users = await db
      .select({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        role: schema.users.role,
        isActive: schema.users.isActive,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users);
    return jsonOk({ users });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth(['super_admin']);
    const body = await request.json();
    if (!body.id) return jsonError('Missing id');

    const db = getDb();
    const [updated] = await db
      .update(schema.users)
      .set({
        name: body.name,
        role: body.role,
        isActive: body.isActive,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, body.id))
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        role: schema.users.role,
        isActive: schema.users.isActive,
      });

    await logAudit(user.id, 'update', 'user', body.id);
    return jsonOk({ user: updated });
  } catch (error) {
    return handleAuthError(error);
  }
}
