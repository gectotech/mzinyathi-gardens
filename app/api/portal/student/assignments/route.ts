import { NextRequest } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { requirePortalRole, getStudentForAccount } from '@/lib/portal-api-helpers';
import { getDb, schema } from '@/lib/db';

const patchSchema = z.object({
  assignmentId: z.string().uuid(),
  status: z.enum(['draft', 'submitted']),
});

export async function PATCH(request: NextRequest) {
  try {
    const { error, account } = await requirePortalRole('student');
    if (error) return error;

    const student = await getStudentForAccount(account!);
    if (!student) return jsonError('Student not found', 404);

    const body = await request.json();
    const data = patchSchema.parse(body);

    const db = getDb();
    const [submission] = await db
      .select()
      .from(schema.portalAssignmentSubmissions)
      .where(
        and(
          eq(schema.portalAssignmentSubmissions.assignmentId, data.assignmentId),
          eq(schema.portalAssignmentSubmissions.studentId, student.id)
        )
      )
      .limit(1);

    if (submission?.status === 'graded') {
      return jsonError('This assignment has already been graded', 400);
    }

    if (!submission) {
      const [created] = await db
        .insert(schema.portalAssignmentSubmissions)
        .values({
          assignmentId: data.assignmentId,
          studentId: student.id,
          status: data.status,
          submittedAt: data.status === 'submitted' ? new Date() : null,
        })
        .returning();
      return jsonOk({ submission: created });
    }

    const [updated] = await db
      .update(schema.portalAssignmentSubmissions)
      .set({
        status: data.status,
        submittedAt: data.status === 'submitted' ? new Date() : submission.submittedAt,
        updatedAt: new Date(),
      })
      .where(eq(schema.portalAssignmentSubmissions.id, submission.id))
      .returning();

    return jsonOk({ submission: updated });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Invalid request', 400);
    return handleAuthError(error);
  }
}
