import { NextRequest } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { requirePermission, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { getDb, schema } from '@/lib/db';

const createSchema = z.object({
  classId: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().optional(),
  dueDate: z.string(),
  maxScore: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('school_students', true);
    const body = await request.json();
    const data = createSchema.parse(body);

    const db = getDb();
    const [cls] = await db
      .select()
      .from(schema.portalClasses)
      .where(eq(schema.portalClasses.id, data.classId))
      .limit(1);

    if (!cls) return jsonError('Class not found', 404);

    const [assignment] = await db
      .insert(schema.portalAssignments)
      .values({
        classId: data.classId,
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        maxScore: data.maxScore ?? 20,
      })
      .returning();

    const enrollments = await db
      .select({ studentId: schema.portalClassEnrollments.studentId })
      .from(schema.portalClassEnrollments)
      .where(eq(schema.portalClassEnrollments.classId, data.classId));

    for (const { studentId } of enrollments) {
      const [existing] = await db
        .select()
        .from(schema.portalAssignmentSubmissions)
        .where(
          and(
            eq(schema.portalAssignmentSubmissions.assignmentId, assignment.id),
            eq(schema.portalAssignmentSubmissions.studentId, studentId)
          )
        )
        .limit(1);
      if (!existing) {
        await db.insert(schema.portalAssignmentSubmissions).values({
          assignmentId: assignment.id,
          studentId,
          status: 'pending',
        });
      }
    }

    await logAudit(user.id, 'create', 'portal_assignment', assignment.id, { title: data.title });
    return jsonOk({ assignment });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Invalid request', 400);
    return handleAuthError(error);
  }
}
