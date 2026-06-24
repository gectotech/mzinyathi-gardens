import { and, asc, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';

const ACADEMIC_YEAR = 2026;
const CURRENT_TERM = 'Term 2';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function formatTodayLabel(date = new Date()) {
  return `${DAY_NAMES[date.getDay()]} · ${date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`;
}

export function formatShortDate(date: Date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function submissionStatusLabel(status: string, score?: number | null, maxScore?: number) {
  if (status === 'graded' && score != null && maxScore) return `Marked: ${score}/${maxScore}`;
  if (status === 'submitted') return 'Submitted';
  if (status === 'draft') return 'Draft saved';
  return 'Not submitted';
}

export async function getStudentClassIds(studentId: string) {
  const db = getDb();
  const rows = await db
    .select({ classId: schema.portalClassEnrollments.classId })
    .from(schema.portalClassEnrollments)
    .where(eq(schema.portalClassEnrollments.studentId, studentId));
  return rows.map((r) => r.classId);
}

export async function getStudentAssignments(studentId: string) {
  const db = getDb();
  const classIds = await getStudentClassIds(studentId);
  if (!classIds.length) return [];

  const rows = await db
    .select({
      assignment: schema.portalAssignments,
      submission: schema.portalAssignmentSubmissions,
      className: schema.portalClasses.name,
      subject: schema.portalClasses.subject,
    })
    .from(schema.portalAssignments)
    .innerJoin(schema.portalClasses, eq(schema.portalAssignments.classId, schema.portalClasses.id))
    .leftJoin(
      schema.portalAssignmentSubmissions,
      and(
        eq(schema.portalAssignmentSubmissions.assignmentId, schema.portalAssignments.id),
        eq(schema.portalAssignmentSubmissions.studentId, studentId)
      )
    )
    .where(inArray(schema.portalAssignments.classId, classIds))
    .orderBy(asc(schema.portalAssignments.dueDate));

  return rows.map(({ assignment, submission, subject }) => ({
    id: assignment.id,
    label: `${subject} — ${assignment.title}`,
    value: `Due ${formatShortDate(assignment.dueDate)}`,
    meta: submissionStatusLabel(
      submission?.status || 'pending',
      submission?.score,
      assignment.maxScore
    ),
    dueDate: assignment.dueDate.toISOString(),
    status: submission?.status || 'pending',
  }));
}

export async function getStudentResults(studentId: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.portalResultEntries)
    .where(
      and(
        eq(schema.portalResultEntries.studentId, studentId),
        eq(schema.portalResultEntries.term, CURRENT_TERM),
        eq(schema.portalResultEntries.academicYear, ACADEMIC_YEAR)
      )
    )
    .orderBy(asc(schema.portalResultEntries.subject));

  const items = rows.map((r) => ({
    label: r.subject,
    value: `${r.scorePercent}%`,
    meta: r.classPosition && r.classSize ? `Position ${r.classPosition}/${r.classSize}` : CURRENT_TERM,
  }));

  const avg =
    rows.length > 0
      ? Math.round(rows.reduce((s, r) => s + r.scorePercent, 0) / rows.length)
      : null;
  const position = rows[0]?.classPosition;
  const classSize = rows[0]?.classSize;

  if (avg != null) {
    items.push({
      label: 'Overall average',
      value: `${avg}%`,
      meta: position && classSize ? `Class position ${position}/${classSize}` : 'Term average',
    });
  }

  return { items, termAverage: avg };
}

export async function getStudentTimetable(studentId: string) {
  const db = getDb();
  const classIds = await getStudentClassIds(studentId);
  if (!classIds.length) return { lessons: [], exams: [] };

  const slots = await db
    .select({
      slot: schema.portalTimetableSlots,
      className: schema.portalClasses.name,
    })
    .from(schema.portalTimetableSlots)
    .innerJoin(schema.portalClasses, eq(schema.portalTimetableSlots.classId, schema.portalClasses.id))
    .where(inArray(schema.portalTimetableSlots.classId, classIds))
    .orderBy(asc(schema.portalTimetableSlots.examDate), asc(schema.portalTimetableSlots.dayOfWeek));

  const lessons = slots
    .filter((s) => s.slot.slotType === 'lesson')
    .map(({ slot }) => ({
      label: `${DAY_NAMES[slot.dayOfWeek]} ${slot.startTime}–${slot.endTime}`,
      value: slot.subject,
      meta: slot.room,
    }));

  const exams = slots
    .filter((s) => s.slot.slotType === 'exam' && s.slot.examDate)
    .map(({ slot }) => ({
      label: formatShortDate(slot.examDate!),
      value: `${slot.subject}${slot.examPaper ? ` — ${slot.examPaper}` : ''}`,
      meta: `${slot.startTime}–${slot.endTime} · ${slot.room}`,
    }));

  return { lessons, exams };
}

export async function getStudentTodayTimetable(studentId: string, date = new Date()) {
  const db = getDb();
  const classIds = await getStudentClassIds(studentId);
  if (!classIds.length) return [];

  const dayOfWeek = date.getDay();
  const rows = await db
    .select()
    .from(schema.portalTimetableSlots)
    .where(
      and(
        inArray(schema.portalTimetableSlots.classId, classIds),
        eq(schema.portalTimetableSlots.dayOfWeek, dayOfWeek),
        eq(schema.portalTimetableSlots.slotType, 'lesson')
      )
    )
    .orderBy(asc(schema.portalTimetableSlots.startTime));

  return rows.map((slot) => ({
    time: slot.startTime,
    subject: slot.subject,
    room: slot.room,
  }));
}

export async function getStudentNextExam(studentId: string) {
  const db = getDb();
  const classIds = await getStudentClassIds(studentId);
  if (!classIds.length) return null;

  const now = new Date();
  const [row] = await db
    .select()
    .from(schema.portalTimetableSlots)
    .where(
      and(
        inArray(schema.portalTimetableSlots.classId, classIds),
        eq(schema.portalTimetableSlots.slotType, 'exam'),
        gte(schema.portalTimetableSlots.examDate, now)
      )
    )
    .orderBy(asc(schema.portalTimetableSlots.examDate))
    .limit(1);

  if (!row?.examDate) return null;
  return {
    date: formatShortDate(row.examDate),
    label: `${row.subject}${row.examPaper ? ` ${row.examPaper}` : ''}`,
  };
}

export async function countStudentAssignmentsDue(studentId: string) {
  const assignments = await getStudentAssignments(studentId);
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(weekEnd.getDate() + 7);

  return assignments.filter((a) => {
    const due = new Date(a.dueDate);
    const open = a.status === 'pending' || a.status === 'draft';
    return open && due >= now && due <= weekEnd;
  }).length;
}

export async function getTermMilestones(grade: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.portalTermMilestones)
    .where(
      and(
        eq(schema.portalTermMilestones.grade, grade),
        eq(schema.portalTermMilestones.term, CURRENT_TERM),
        eq(schema.portalTermMilestones.academicYear, ACADEMIC_YEAR)
      )
    )
    .orderBy(asc(schema.portalTermMilestones.sortOrder));

  return rows.map((r) => ({
    step: r.label,
    status: r.status as 'completed' | 'in_progress' | 'pending',
  }));
}

export async function getStudentDashboard(studentId: string, grade: string) {
  const [results, assignmentsDue, nextExam, todayTimetable, termProgress] = await Promise.all([
    getStudentResults(studentId),
    countStudentAssignmentsDue(studentId),
    getStudentNextExam(studentId),
    getStudentTodayTimetable(studentId),
    getTermMilestones(grade),
  ]);

  const db = getDb();
  const prevTerm = await db
    .select()
    .from(schema.portalResultEntries)
    .where(
      and(
        eq(schema.portalResultEntries.studentId, studentId),
        eq(schema.portalResultEntries.term, 'Term 1'),
        eq(schema.portalResultEntries.academicYear, ACADEMIC_YEAR)
      )
    );
  const prevAvg =
    prevTerm.length > 0
      ? Math.round(prevTerm.reduce((s, r) => s + r.scorePercent, 0) / prevTerm.length)
      : null;
  const delta =
    results.termAverage != null && prevAvg != null
      ? results.termAverage - prevAvg
      : null;

  return {
    termAverage: results.termAverage != null ? `${results.termAverage}%` : '—',
    termAverageSubtext:
      delta != null
        ? `${delta >= 0 ? '↑' : '↓'} ${Math.abs(delta)}% from last term`
        : 'Current term average',
    assignmentsDue: String(assignmentsDue),
    assignmentsDueSubtext: assignmentsDue === 1 ? 'Due this week' : 'Due this week',
    nextExam: nextExam?.date || '—',
    nextExamSubtext: nextExam?.label || 'No upcoming exams',
    todayLabel: formatTodayLabel(),
    todayTimetable,
    termProgress,
  };
}

export async function getTeacherClasses(teacherAccountId: string) {
  const db = getDb();
  const classes = await db
    .select()
    .from(schema.portalClasses)
    .where(eq(schema.portalClasses.teacherAccountId, teacherAccountId))
    .orderBy(asc(schema.portalClasses.name));

  const items = [];
  for (const cls of classes) {
    const [count] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.portalClassEnrollments)
      .where(eq(schema.portalClassEnrollments.classId, cls.id));
    items.push({
      id: cls.id,
      label: cls.name,
      value: `${count?.count ?? 0} learners`,
      meta: cls.scheduleNote || cls.subject,
    });
  }
  return items;
}

export async function getTeacherTimetable(teacherAccountId: string) {
  const db = getDb();
  const classes = await db
    .select({ id: schema.portalClasses.id, name: schema.portalClasses.name })
    .from(schema.portalClasses)
    .where(eq(schema.portalClasses.teacherAccountId, teacherAccountId));

  const classIds = classes.map((c) => c.id);
  if (!classIds.length) return [];

  const slots = await db
    .select()
    .from(schema.portalTimetableSlots)
    .where(
      and(
        inArray(schema.portalTimetableSlots.classId, classIds),
        eq(schema.portalTimetableSlots.slotType, 'lesson')
      )
    );

  const byDay: Record<number, { classes: Set<string>; periods: number }> = {};
  for (const slot of slots) {
    if (!byDay[slot.dayOfWeek]) byDay[slot.dayOfWeek] = { classes: new Set(), periods: 0 };
    const cls = classes.find((c) => c.id === slot.classId);
    if (cls) byDay[slot.dayOfWeek].classes.add(cls.name);
    byDay[slot.dayOfWeek].periods += 1;
  }

  return [1, 2, 3, 4, 5].map((dow) => ({
    label: DAY_NAMES[dow],
    value: `${byDay[dow]?.periods ?? 0} periods`,
    meta: byDay[dow] ? [...byDay[dow].classes].join(', ') : 'No lessons scheduled',
  }));
}

export async function getTeacherAttendanceSummary(teacherAccountId: string) {
  const db = getDb();
  const classes = await db
    .select()
    .from(schema.portalClasses)
    .where(eq(schema.portalClasses.teacherAccountId, teacherAccountId));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const items = [];
  let totalPresent = 0;
  let totalRecords = 0;

  for (const cls of classes) {
    const todayRows = await db
      .select()
      .from(schema.portalAttendance)
      .where(
        and(
          eq(schema.portalAttendance.classId, cls.id),
          gte(schema.portalAttendance.attendanceDate, today),
          lte(schema.portalAttendance.attendanceDate, tomorrow)
        )
      );

    const [enrolled] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.portalClassEnrollments)
      .where(eq(schema.portalClassEnrollments.classId, cls.id));

    const present = todayRows.filter((r) => r.status === 'present' || r.status === 'late').length;
    const total = enrolled?.count ?? 0;
    const weekRows = await db
      .select()
      .from(schema.portalAttendance)
      .where(
        and(
          eq(schema.portalAttendance.classId, cls.id),
          gte(schema.portalAttendance.attendanceDate, weekAgo)
        )
      );

    totalPresent += weekRows.filter((r) => r.status === 'present' || r.status === 'late').length;
    totalRecords += weekRows.length;

    items.push({
      label: cls.name,
      value: total > 0 ? `${present}/${total} present` : 'No learners',
      meta: todayRows.length ? 'Recorded today' : 'Pending today',
    });
  }

  const weeklyAvg =
    totalRecords > 0 ? `${((totalPresent / totalRecords) * 100).toFixed(1)}%` : '—';

  return { items, weeklyAverage: weeklyAvg };
}

export async function getTeacherGradeProgress(teacherAccountId: string) {
  const db = getDb();
  const classes = await db
    .select()
    .from(schema.portalClasses)
    .where(eq(schema.portalClasses.teacherAccountId, teacherAccountId));

  const items = [];
  for (const cls of classes) {
    const enrollments = await db
      .select({ studentId: schema.portalClassEnrollments.studentId })
      .from(schema.portalClassEnrollments)
      .where(eq(schema.portalClassEnrollments.classId, cls.id));

    const studentIds = enrollments.map((e) => e.studentId);
    let entered = 0;
    if (studentIds.length) {
      const results = await db
        .select({ studentId: schema.portalResultEntries.studentId })
        .from(schema.portalResultEntries)
        .where(
          and(
            inArray(schema.portalResultEntries.studentId, studentIds),
            eq(schema.portalResultEntries.subject, cls.subject),
            eq(schema.portalResultEntries.term, CURRENT_TERM)
          )
        );
      entered = new Set(results.map((r) => r.studentId)).size;
    }

    const total = studentIds.length;
    const pct = total > 0 ? Math.round((entered / total) * 100) : 0;
    items.push({
      label: `${cls.name} — ${cls.subject}`,
      value: `${pct}% entered`,
      meta: `${entered}/${total} learners`,
    });
  }
  return items;
}

export async function getTeacherResources(teacherAccountId: string) {
  const db = getDb();
  const rows = await db
    .select({
      resource: schema.portalResources,
      className: schema.portalClasses.name,
    })
    .from(schema.portalResources)
    .leftJoin(schema.portalClasses, eq(schema.portalResources.classId, schema.portalClasses.id))
    .where(eq(schema.portalResources.teacherAccountId, teacherAccountId))
    .orderBy(desc(schema.portalResources.createdAt));

  return rows.map(({ resource, className }) => ({
    label: resource.title,
    value: resource.resourceType,
    meta: className ? `${className} · ${resource.description || ''}` : resource.description || '',
  }));
}

export async function getTeacherTodayClasses(teacherAccountId: string, date = new Date()) {
  const db = getDb();
  const dayOfWeek = date.getDay();
  const classes = await db
    .select()
    .from(schema.portalClasses)
    .where(eq(schema.portalClasses.teacherAccountId, teacherAccountId));

  const items = [];
  for (const cls of classes) {
    const [slot] = await db
      .select()
      .from(schema.portalTimetableSlots)
      .where(
        and(
          eq(schema.portalTimetableSlots.classId, cls.id),
          eq(schema.portalTimetableSlots.dayOfWeek, dayOfWeek),
          eq(schema.portalTimetableSlots.slotType, 'lesson')
        )
      )
      .orderBy(asc(schema.portalTimetableSlots.startTime))
      .limit(1);

    if (!slot) continue;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await db
      .select()
      .from(schema.portalAttendance)
      .where(
        and(
          eq(schema.portalAttendance.classId, cls.id),
          gte(schema.portalAttendance.attendanceDate, today),
          lte(schema.portalAttendance.attendanceDate, tomorrow)
        )
      );

    const [enrolled] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.portalClassEnrollments)
      .where(eq(schema.portalClassEnrollments.classId, cls.id));

    const present = attendance.filter((a) => a.status === 'present' || a.status === 'late').length;
    const total = enrolled?.count ?? 0;

    items.push({
      grade: cls.name,
      time: `${slot.startTime} – ${slot.endTime}`,
      topic: slot.subject,
      present: attendance.length ? `${present}/${total}` : '—',
    });
  }
  return items;
}

export async function getTeacherDashboard(teacherAccountId: string) {
  const db = getDb();
  const classes = await db
    .select()
    .from(schema.portalClasses)
    .where(eq(schema.portalClasses.teacherAccountId, teacherAccountId));

  let totalLearners = 0;
  for (const cls of classes) {
    const [count] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.portalClassEnrollments)
      .where(eq(schema.portalClassEnrollments.classId, cls.id));
    totalLearners += count?.count ?? 0;
  }

  const todayClasses = await getTeacherTodayClasses(teacherAccountId);
  const { weeklyAverage } = await getTeacherAttendanceSummary(teacherAccountId);

  const dayOfWeek = new Date().getDay();
  const classIds = classes.map((c) => c.id);
  let lessonsToday = 0;
  if (classIds.length) {
    const slots = await db
      .select()
      .from(schema.portalTimetableSlots)
      .where(
        and(
          inArray(schema.portalTimetableSlots.classId, classIds),
          eq(schema.portalTimetableSlots.dayOfWeek, dayOfWeek),
          eq(schema.portalTimetableSlots.slotType, 'lesson')
        )
      );
    lessonsToday = slots.length;
  }

  const nextSlot = todayClasses[0];
  const pendingTasks: string[] = [];
  const gradeProgress = await getTeacherGradeProgress(teacherAccountId);
  for (const g of gradeProgress) {
    if (g.value !== '100% entered') {
      pendingTasks.push(`Complete mid-term marks for ${g.label}`);
    }
  }
  const ungraded = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.portalAssignmentSubmissions)
    .innerJoin(schema.portalAssignments, eq(schema.portalAssignmentSubmissions.assignmentId, schema.portalAssignments.id))
    .innerJoin(schema.portalClasses, eq(schema.portalAssignments.classId, schema.portalClasses.id))
    .where(
      and(
        eq(schema.portalClasses.teacherAccountId, teacherAccountId),
        eq(schema.portalAssignmentSubmissions.status, 'submitted')
      )
    );
  if ((ungraded[0]?.count ?? 0) > 0) {
    pendingTasks.push(`Grade ${ungraded[0]?.count} submitted assignment(s)`);
  }
  if (todayClasses.some((c) => c.present === '—')) {
    pendingTasks.push('Record attendance for classes marked pending');
  }

  return {
    classCount: String(classes.length),
    classCountSubtext: `${totalLearners} learners total`,
    attendanceToday: weeklyAverage !== '—' ? weeklyAverage : '—',
    attendanceSubtext: todayClasses.find((c) => c.present === '—')
      ? 'Some classes pending today'
      : 'Weekly average',
    lessonsToday: String(lessonsToday),
    lessonsSubtext: nextSlot ? `Next: ${nextSlot.time} ${nextSlot.topic}` : 'No lessons today',
    todayClasses,
    pendingTasks: pendingTasks.length ? pendingTasks : ['All caught up — no pending tasks'],
  };
}

export async function getParentChildProgress(studentId: string, grade: string, childFirstName: string) {
  const db = getDb();
  let rows = await db
    .select()
    .from(schema.portalTermMilestones)
    .where(
      and(
        eq(schema.portalTermMilestones.grade, `${grade}-parent`),
        eq(schema.portalTermMilestones.term, CURRENT_TERM),
        eq(schema.portalTermMilestones.academicYear, ACADEMIC_YEAR)
      )
    )
    .orderBy(asc(schema.portalTermMilestones.sortOrder));

  if (!rows.length) {
    rows = await db
      .select()
      .from(schema.portalTermMilestones)
      .where(
        and(
          eq(schema.portalTermMilestones.grade, grade),
          eq(schema.portalTermMilestones.term, CURRENT_TERM),
          eq(schema.portalTermMilestones.academicYear, ACADEMIC_YEAR)
        )
      )
      .orderBy(asc(schema.portalTermMilestones.sortOrder));
  }

  return {
    title: `${childFirstName} — Term Progress`,
    steps: rows.map((r) => ({
      step: r.label,
      status: r.status as 'completed' | 'in_progress' | 'pending',
    })),
  };
}

export { ACADEMIC_YEAR, CURRENT_TERM };
