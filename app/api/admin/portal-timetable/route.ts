import { NextRequest } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { requirePermission, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { getDb, schema } from '@/lib/db';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export async function GET(request: NextRequest) {
  try {
    await requirePermission('school_students');
    const classId = request.nextUrl.searchParams.get('classId');
    const db = getDb();

    const rows = await db
      .select({
        slot: schema.portalTimetableSlots,
        className: schema.portalClasses.name,
      })
      .from(schema.portalTimetableSlots)
      .innerJoin(schema.portalClasses, eq(schema.portalTimetableSlots.classId, schema.portalClasses.id))
      .where(classId ? eq(schema.portalTimetableSlots.classId, classId) : undefined)
      .orderBy(desc(schema.portalTimetableSlots.createdAt))
      .limit(100);

    const slots = rows.map(({ slot, className }) => ({
      id: slot.id,
      classId: slot.classId,
      className,
      dayOfWeek: slot.dayOfWeek,
      dayName: DAY_NAMES[slot.dayOfWeek] || `Day ${slot.dayOfWeek}`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      subject: slot.subject,
      room: slot.room,
      slotType: slot.slotType,
      examDate: slot.examDate?.toISOString(),
      examPaper: slot.examPaper,
    }));

    return jsonOk({ slots });
  } catch (error) {
    return handleAuthError(error);
  }
}

const createSchema = z.object({
  classId: z.string().uuid(),
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().min(4),
  endTime: z.string().min(4),
  subject: z.string().min(2),
  room: z.string().min(1),
  slotType: z.enum(['lesson', 'exam']).optional(),
  examDate: z.string().optional(),
  examPaper: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('school_students', true);
    const body = await request.json();
    const data = createSchema.parse(body);

    const db = getDb();
    const [slot] = await db
      .insert(schema.portalTimetableSlots)
      .values({
        classId: data.classId,
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        subject: data.subject,
        room: data.room,
        slotType: data.slotType || 'lesson',
        examDate: data.examDate ? new Date(data.examDate) : null,
        examPaper: data.examPaper,
      })
      .returning();

    await logAudit(user.id, 'create', 'timetable_slot', slot.id, { subject: data.subject });
    return jsonOk({ slot });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Invalid request', 400);
    return handleAuthError(error);
  }
}

const attendanceSchema = z.object({
  classId: z.string().uuid(),
  studentId: z.string().uuid(),
  status: z.enum(['present', 'absent', 'late', 'excused']),
  attendanceDate: z.string().optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const user = await requirePermission('school_students', true);
    const body = await request.json();
    const data = attendanceSchema.parse(body);

    const date = data.attendanceDate ? new Date(data.attendanceDate) : new Date();
    date.setHours(0, 0, 0, 0);

    const db = getDb();
    const [existing] = await db
      .select()
      .from(schema.portalAttendance)
      .where(
        and(
          eq(schema.portalAttendance.classId, data.classId),
          eq(schema.portalAttendance.studentId, data.studentId),
          eq(schema.portalAttendance.attendanceDate, date)
        )
      )
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(schema.portalAttendance)
        .set({ status: data.status })
        .where(eq(schema.portalAttendance.id, existing.id))
        .returning();
      return jsonOk({ record: updated, updated: true });
    }

    const [record] = await db
      .insert(schema.portalAttendance)
      .values({
        classId: data.classId,
        studentId: data.studentId,
        attendanceDate: date,
        status: data.status,
      })
      .returning();

    await logAudit(user.id, 'create', 'attendance', record.id, data);
    return jsonOk({ record, updated: false });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Invalid request', 400);
    return handleAuthError(error);
  }
}
