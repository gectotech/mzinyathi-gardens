import { NextRequest } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { requirePermission, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { getDb, schema } from '@/lib/db';

const createSchema = z.object({
  studentId: z.string().uuid(),
  subject: z.string().min(2),
  scorePercent: z.number().int().min(0).max(100),
  term: z.string().default('Term 2'),
  academicYear: z.number().int().optional(),
  classPosition: z.number().int().positive().optional(),
  classSize: z.number().int().positive().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('school_students', true);
    const body = await request.json();
    const data = createSchema.parse(body);

    const db = getDb();
    const [student] = await db
      .select()
      .from(schema.students)
      .where(eq(schema.students.id, data.studentId))
      .limit(1);

    if (!student) return jsonError('Student not found', 404);

    const [existing] = await db
      .select()
      .from(schema.portalResultEntries)
      .where(
        and(
          eq(schema.portalResultEntries.studentId, data.studentId),
          eq(schema.portalResultEntries.subject, data.subject),
          eq(schema.portalResultEntries.term, data.term)
        )
      )
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(schema.portalResultEntries)
        .set({
          scorePercent: data.scorePercent,
          classPosition: data.classPosition,
          classSize: data.classSize,
        })
        .where(eq(schema.portalResultEntries.id, existing.id))
        .returning();
      return jsonOk({ result: updated, updated: true });
    }

    const [result] = await db
      .insert(schema.portalResultEntries)
      .values({
        studentId: data.studentId,
        subject: data.subject,
        term: data.term,
        academicYear: data.academicYear ?? 2026,
        scorePercent: data.scorePercent,
        classPosition: data.classPosition,
        classSize: data.classSize,
      })
      .returning();

    await logAudit(user.id, 'create', 'portal_result', result.id, { subject: data.subject });
    return jsonOk({ result, updated: false });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Invalid request', 400);
    return handleAuthError(error);
  }
}
