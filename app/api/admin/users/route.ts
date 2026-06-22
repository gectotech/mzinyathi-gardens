import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requirePermission, logAudit, hashPassword } from '@/lib/auth';
import { USER_ROLES, type UserRole } from '@/lib/roles';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';

export async function GET() {
  try {
    await requirePermission('users');
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

export async function POST(request: NextRequest) {
  try {
    const actor = await requirePermission('users', true);
    const body = await request.json();

    if (!body.email || !body.password || !body.name) {
      return jsonError('Name, email, and password are required');
    }

    const role = (body.role || 'admin') as UserRole;
    if (!USER_ROLES.includes(role)) {
      return jsonError('Invalid role');
    }

    const db = getDb();
    const [created] = await db
      .insert(schema.users)
      .values({
        email: body.email.toLowerCase().trim(),
        passwordHash: await hashPassword(body.password),
        name: body.name.trim(),
        role,
      })
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        role: schema.users.role,
        isActive: schema.users.isActive,
      });

    await logAudit(actor.id, 'create', 'user', created.id, { role });
    return jsonOk({ user: created }, 201);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const actor = await requirePermission('users', true);
    const body = await request.json();
    if (!body.id) return jsonError('Missing id');

    const role = body.role as UserRole | undefined;
    if (role && !USER_ROLES.includes(role)) {
      return jsonError('Invalid role');
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if (body.name !== undefined) updates.name = body.name;
    if (role !== undefined) updates.role = role;
    if (body.isActive !== undefined) updates.isActive = body.isActive;
    if (body.password) {
      updates.passwordHash = await hashPassword(body.password);
    }

    const db = getDb();
    const [updated] = await db
      .update(schema.users)
      .set(updates)
      .where(eq(schema.users.id, body.id))
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        name: schema.users.name,
        role: schema.users.role,
        isActive: schema.users.isActive,
      });

    await logAudit(actor.id, 'update', 'user', body.id);
    return jsonOk({ user: updated });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const actor = await requirePermission('users', true);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return jsonError('Missing id');
    if (id === actor.id) return jsonError('Cannot delete your own account');

    const db = getDb();
    await db.delete(schema.users).where(eq(schema.users.id, id));
    await logAudit(actor.id, 'delete', 'user', id);
    return jsonOk({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
