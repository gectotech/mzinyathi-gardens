import { NextRequest } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requirePermission, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';

export async function GET() {
  try {
    await requirePermission('jobs');
    const db = getDb();
    const jobs = await db.select().from(schema.jobs).orderBy(desc(schema.jobs.createdAt));
    return jsonOk({ jobs });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('jobs', true);
    const body = await request.json();
    const db = getDb();
    const [job] = await db
      .insert(schema.jobs)
      .values({
        title: body.title,
        department: body.department,
        location: body.location || 'Mzinyathi Gardens',
        tagline: body.tagline,
        jobType: body.jobType || 'Full-time',
        requirements: body.requirements || [],
        responsibilities: body.responsibilities || [],
        isActive: body.isActive ?? true,
      })
      .returning();

    await logAudit(user.id, 'create', 'job', job.id);
    return jsonOk({ job }, 201);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requirePermission('jobs', true);
    const body = await request.json();
    if (!body.id) return jsonError('Missing id');

    const db = getDb();
    const [job] = await db
      .update(schema.jobs)
      .set({
        title: body.title,
        department: body.department,
        location: body.location,
        tagline: body.tagline,
        jobType: body.jobType,
        requirements: body.requirements,
        responsibilities: body.responsibilities,
        isActive: body.isActive,
        updatedAt: new Date(),
      })
      .where(eq(schema.jobs.id, body.id))
      .returning();

    await logAudit(user.id, 'update', 'job', body.id);
    return jsonOk({ job });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requirePermission('jobs', true);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return jsonError('Missing id');

    const db = getDb();
    await db.delete(schema.jobs).where(eq(schema.jobs.id, id));
    await logAudit(user.id, 'delete', 'job', id);
    return jsonOk({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}
