import { NextRequest } from 'next/server';
import { asc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requirePermission, logAudit } from '@/lib/auth';
import { hasPermission } from '@/lib/roles';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';

export async function GET() {
  try {
    await requirePermission('properties');
    const db = getDb();
    const allPhases = await db.select().from(schema.phases).orderBy(asc(schema.phases.sortOrder));
    const allHouses = await db.select().from(schema.houses);
    return jsonOk({ phases: allPhases, houses: allHouses });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('properties');
    if (!hasPermission(user.role, 'write')) return jsonError('Read-only access', 403);

    const body = await request.json();
    const db = getDb();

    if (body.type === 'phase') {
      const [phase] = await db.insert(schema.phases).values(body.data).returning();
      await logAudit(user.id, 'create', 'phase', phase.id);
      return jsonOk({ phase }, 201);
    }

    if (body.type === 'house') {
      const [house] = await db.insert(schema.houses).values(body.data).returning();
      await logAudit(user.id, 'create', 'house', house.id);
      return jsonOk({ house }, 201);
    }

    return jsonError('Invalid type');
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requirePermission('properties');
    if (!hasPermission(user.role, 'write')) return jsonError('Read-only access', 403);

    const body = await request.json();
    const db = getDb();

    if (body.type === 'phase') {
      const { id, ...rest } = body.data || {};
      const [phase] = await db
        .update(schema.phases)
        .set({ ...rest, updatedAt: new Date() })
        .where(eq(schema.phases.id, body.id))
        .returning();
      await logAudit(user.id, 'update', 'phase', body.id);
      return jsonOk({ phase });
    }

    if (body.type === 'house') {
      const { id: _id, phaseId: _phaseId, ...rest } = body.data || {};
      const [house] = await db
        .update(schema.houses)
        .set({ ...rest, updatedAt: new Date() })
        .where(eq(schema.houses.id, body.id))
        .returning();
      await logAudit(user.id, 'update', 'house', body.id);
      return jsonOk({ house });
    }

    return jsonError('Invalid type');
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requirePermission('properties');
    if (!hasPermission(user.role, 'write')) return jsonError('Read-only access', 403);

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    if (!type || !id) return jsonError('Missing type or id');

    const db = getDb();
    if (type === 'phase') {
      await db.delete(schema.houses).where(eq(schema.houses.phaseId, id));
      await db.delete(schema.phases).where(eq(schema.phases.id, id));
    } else {
      await db.delete(schema.houses).where(eq(schema.houses.id, id));
    }

    await logAudit(user.id, 'delete', type, id);
    return jsonOk({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
