import { NextRequest } from 'next/server';
import { and, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { requirePermission, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { getDb, schema } from '@/lib/db';

export async function GET() {
  try {
    await requirePermission('school_students');
    const db = getDb();

    const classes = await db
      .select({
        id: schema.portalClasses.id,
        name: schema.portalClasses.name,
        grade: schema.portalClasses.grade,
        subject: schema.portalClasses.subject,
        scheduleNote: schema.portalClasses.scheduleNote,
        academicYear: schema.portalClasses.academicYear,
        teacherFirst: schema.portalAccounts.firstName,
        teacherLast: schema.portalAccounts.lastName,
        teacherEmail: schema.portalAccounts.email,
      })
      .from(schema.portalClasses)
      .innerJoin(
        schema.portalAccounts,
        eq(schema.portalClasses.teacherAccountId, schema.portalAccounts.id)
      )
      .orderBy(desc(schema.portalClasses.createdAt));

    const withCounts = await Promise.all(
      classes.map(async (cls) => {
        const [row] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(schema.portalClassEnrollments)
          .where(eq(schema.portalClassEnrollments.classId, cls.id));
        return {
          ...cls,
          teacherName: `${cls.teacherFirst} ${cls.teacherLast}`,
          learnerCount: row?.count ?? 0,
        };
      })
    );

    const teachers = await db
      .select({
        id: schema.portalAccounts.id,
        name: sql<string>`${schema.portalAccounts.firstName} || ' ' || ${schema.portalAccounts.lastName}`,
        email: schema.portalAccounts.email,
      })
      .from(schema.portalAccounts)
      .where(eq(schema.portalAccounts.role, 'teacher'));

    return jsonOk({ classes: withCounts, teachers });
  } catch (error) {
    return handleAuthError(error);
  }
}

const createClassSchema = z.object({
  teacherAccountId: z.string().uuid(),
  name: z.string().min(2),
  grade: z.string().min(2),
  subject: z.string().min(2),
  scheduleNote: z.string().optional(),
});

const enrollSchema = z.object({
  action: z.literal('enroll'),
  classId: z.string().uuid(),
  studentId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('school_students', true);
    const body = await request.json();

    if (body.action === 'enroll') {
      const data = enrollSchema.parse(body);
      const db = getDb();
      const [existing] = await db
        .select()
        .from(schema.portalClassEnrollments)
        .where(
          and(
            eq(schema.portalClassEnrollments.classId, data.classId),
            eq(schema.portalClassEnrollments.studentId, data.studentId)
          )
        )
        .limit(1);
      if (existing) return jsonOk({ enrolled: true, existing: true });

      await db.insert(schema.portalClassEnrollments).values({
        classId: data.classId,
        studentId: data.studentId,
      });
      await logAudit(user.id, 'create', 'class_enrollment', data.classId, data);
      return jsonOk({ enrolled: true });
    }

    const data = createClassSchema.parse(body);
    const db = getDb();
    const [created] = await db
      .insert(schema.portalClasses)
      .values({
        teacherAccountId: data.teacherAccountId,
        name: data.name,
        grade: data.grade,
        subject: data.subject,
        scheduleNote: data.scheduleNote,
      })
      .returning();

    await logAudit(user.id, 'create', 'portal_class', created.id, { name: created.name });
    return jsonOk({ class: created });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Invalid request', 400);
    return handleAuthError(error);
  }
}
