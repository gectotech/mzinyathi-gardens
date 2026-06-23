import { NextRequest } from 'next/server';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requirePermission, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { allocateStudentNumber } from '@/lib/student-id';
import { nextGrade, GRADE_BUCKETS } from '@/lib/school-grades';

export async function GET(request: NextRequest) {
  try {
    await requirePermission('school_students');
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');

    const db = getDb();
    const conditions = [];
    if (grade === 'Graduated') {
      conditions.push(eq(schema.students.status, 'graduated'));
    } else if (grade) {
      conditions.push(eq(schema.students.grade, grade));
      conditions.push(eq(schema.students.status, 'active'));
    }

    const students = await db
      .select()
      .from(schema.students)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(schema.students.createdAt));

    return jsonOk({ students, grades: GRADE_BUCKETS });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('school_students', true);
    const body = await request.json();
    const { firstName, surname, gender, grade, parentEmail, parentPhone, applicationId } = body;

    if (!firstName || !surname || !gender || !grade) {
      return jsonError('firstName, surname, gender, and grade are required');
    }

    const db = getDb();
    const studentNumber = await allocateStudentNumber(db);

    const [student] = await db
      .insert(schema.students)
      .values({
        studentNumber,
        firstName,
        surname,
        gender,
        grade,
        parentEmail: parentEmail || null,
        parentPhone: parentPhone || null,
        applicationId: applicationId || null,
        status: 'active',
      })
      .returning();

    await logAudit(user.id, 'create', 'student', student.id, { studentNumber });
    return jsonOk({ student }, 201);
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requirePermission('school_students', true);
    const { action, ids, grade } = await request.json();

    if (!ids?.length) return jsonError('No students selected');

    const db = getDb();
    const year = new Date().getFullYear();

    if (action === 'promote') {
      const selected = await db
        .select()
        .from(schema.students)
        .where(inArray(schema.students.id, ids));

      let promoted = 0;
      let graduated = 0;

      for (const student of selected) {
        const target = nextGrade(student.grade);
        if (!target) continue;

        if (target === 'graduated') {
          await db
            .update(schema.students)
            .set({
              status: 'graduated',
              graduatedYear: year,
              updatedAt: new Date(),
            })
            .where(eq(schema.students.id, student.id));
          graduated += 1;
        } else {
          await db
            .update(schema.students)
            .set({ grade: target, updatedAt: new Date() })
            .where(eq(schema.students.id, student.id));
          promoted += 1;
        }
      }

      await logAudit(user.id, 'update', 'student', 'bulk_promote', { ids, promoted, graduated });
      return jsonOk({ promoted, graduated });
    }

    if (action === 'promote_grade' && grade) {
      const inGrade = await db
        .select()
        .from(schema.students)
        .where(and(eq(schema.students.grade, grade), eq(schema.students.status, 'active')));

      let promoted = 0;
      let graduated = 0;
      const target = nextGrade(grade);

      if (!target) return jsonError('Cannot promote this grade');

      for (const student of inGrade) {
        if (target === 'graduated') {
          await db
            .update(schema.students)
            .set({ status: 'graduated', graduatedYear: year, updatedAt: new Date() })
            .where(eq(schema.students.id, student.id));
          graduated += 1;
        } else {
          await db
            .update(schema.students)
            .set({ grade: target, updatedAt: new Date() })
            .where(eq(schema.students.id, student.id));
          promoted += 1;
        }
      }

      await logAudit(user.id, 'update', 'student', 'promote_grade', { grade, promoted, graduated });
      return jsonOk({ promoted, graduated });
    }

    return jsonError('Unknown action');
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requirePermission('school_students', true);
    const { ids } = await request.json();
    if (!ids?.length) return jsonError('No students selected');

    const db = getDb();
    const deleted = await db
      .delete(schema.students)
      .where(inArray(schema.students.id, ids))
      .returning({ id: schema.students.id });

    await logAudit(user.id, 'delete', 'student', 'bulk', { count: deleted.length });
    return jsonOk({ deleted: deleted.length });
  } catch (error) {
    return handleAuthError(error);
  }
}
