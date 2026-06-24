import { and, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { DEMO_ACCOUNTS } from '@/lib/portal-auth';

const ACADEMIC_YEAR = 2026;
const CURRENT_TERM = 'Term 2';

export async function seedPortalAcademics() {
  const db = getDb();
  const results: string[] = [];

  const accounts = await db.select().from(schema.portalAccounts);
  const teacher = accounts.find((a) => a.email === DEMO_ACCOUNTS.teacher.user.email);
  const [student] = await db
    .select()
    .from(schema.students)
    .where(eq(schema.students.studentNumber, DEMO_ACCOUNTS.student.identifier.toUpperCase()))
    .limit(1);

  if (!teacher || !student) {
    return { academics: ['skipped: demo teacher or student missing'] };
  }

  async function upsertClass(name: string, grade: string, subject: string, scheduleNote: string) {
    const [existing] = await db
      .select()
      .from(schema.portalClasses)
      .where(
        and(
          eq(schema.portalClasses.teacherAccountId, teacher!.id),
          eq(schema.portalClasses.name, name)
        )
      )
      .limit(1);
    if (existing) return existing;

    const [created] = await db
      .insert(schema.portalClasses)
      .values({
        teacherAccountId: teacher!.id,
        name,
        grade,
        subject,
        scheduleNote,
        academicYear: ACADEMIC_YEAR,
      })
      .returning();
    results.push(`class ${name}: created`);
    return created;
  }

  const class4aMath = await upsertClass('Grade 4A — Mathematics', 'Grade 4', 'Mathematics', 'Mon–Fri mornings');
  const class5b = await upsertClass('Grade 5B — Mathematics', 'Grade 5', 'Mathematics', 'Mon, Wed, Fri');
  const class6a = await upsertClass('Grade 6A — Mathematics', 'Grade 6', 'Mathematics', 'Tue & Thu');
  const class4aRemedial = await upsertClass('Grade 4A — Remedial', 'Grade 4', 'Mathematics', 'Friday afternoon');
  const class4aDaily = await upsertClass('Grade 4A — Daily Programme', 'Grade 4', 'General', 'Mon–Fri');

  for (const cls of [class4aMath, class4aDaily, class4aRemedial]) {
    const [existing] = await db
      .select()
      .from(schema.portalClassEnrollments)
      .where(
        and(
          eq(schema.portalClassEnrollments.classId, cls.id),
          eq(schema.portalClassEnrollments.studentId, student.id)
        )
      )
      .limit(1);
    if (!existing) {
      await db.insert(schema.portalClassEnrollments).values({
        classId: cls.id,
        studentId: student.id,
      });
    }
  }

  const dailySlots = [
    { dow: 1, start: '08:00', end: '09:15', subject: 'Mathematics', room: 'Room 4B' },
    { dow: 1, start: '09:30', end: '10:45', subject: 'English', room: 'Room 4B' },
    { dow: 1, start: '11:00', end: '12:15', subject: 'Science', room: 'Lab 1' },
    { dow: 1, start: '13:30', end: '14:45', subject: 'Shona', room: 'Room 4B' },
    { dow: 2, start: '08:00', end: '09:15', subject: 'Mathematics', room: 'Room 4B' },
    { dow: 2, start: '09:30', end: '10:45', subject: 'English', room: 'Room 4B' },
    { dow: 2, start: '11:00', end: '12:15', subject: 'Science', room: 'Lab 1' },
    { dow: 2, start: '13:30', end: '14:45', subject: 'Shona', room: 'Room 4B' },
    { dow: 3, start: '08:00', end: '09:15', subject: 'Mathematics', room: 'Room 4B' },
    { dow: 3, start: '09:30', end: '10:45', subject: 'English', room: 'Room 4B' },
    { dow: 4, start: '08:00', end: '09:15', subject: 'Mathematics', room: 'Room 4B' },
    { dow: 5, start: '08:00', end: '09:15', subject: 'Mathematics', room: 'Room 4B' },
    { dow: 5, start: '14:00', end: '15:00', subject: 'Remedial Maths', room: 'Room 4B' },
  ];

  for (const slot of dailySlots) {
    const [existing] = await db
      .select()
      .from(schema.portalTimetableSlots)
      .where(
        and(
          eq(schema.portalTimetableSlots.classId, class4aDaily.id),
          eq(schema.portalTimetableSlots.dayOfWeek, slot.dow),
          eq(schema.portalTimetableSlots.startTime, slot.start)
        )
      )
      .limit(1);
    if (existing) continue;
    await db.insert(schema.portalTimetableSlots).values({
      classId: class4aDaily.id,
      dayOfWeek: slot.dow,
      startTime: slot.start,
      endTime: slot.end,
      subject: slot.subject,
      room: slot.room,
      slotType: 'lesson',
    });
  }

  const examSlots = [
    { date: '2026-06-14', start: '08:00', end: '10:00', subject: 'Mathematics', paper: 'Paper 1', room: 'Hall A' },
    { date: '2026-06-15', start: '08:00', end: '10:00', subject: 'English', paper: 'Paper 1', room: 'Hall A' },
    { date: '2026-06-16', start: '08:00', end: '10:00', subject: 'Science', paper: 'Paper 1', room: 'Lab 1' },
    { date: '2026-06-17', start: '08:00', end: '10:00', subject: 'Shona', paper: 'Paper 1', room: 'Hall B' },
  ];

  for (const exam of examSlots) {
    const [existing] = await db
      .select()
      .from(schema.portalTimetableSlots)
      .where(
        and(
          eq(schema.portalTimetableSlots.classId, class4aDaily.id),
          eq(schema.portalTimetableSlots.subject, exam.subject),
          eq(schema.portalTimetableSlots.slotType, 'exam')
        )
      )
      .limit(1);
    if (existing) continue;
    await db.insert(schema.portalTimetableSlots).values({
      classId: class4aDaily.id,
      dayOfWeek: new Date(exam.date).getDay(),
      startTime: exam.start,
      endTime: exam.end,
      subject: exam.subject,
      room: exam.room,
      slotType: 'exam',
      examDate: new Date(exam.date),
      examPaper: exam.paper,
    });
  }

  const teacherClassSlots = [
    { cls: class4aMath, dow: 1, start: '08:00', end: '09:15', subject: 'Fractions & decimals', room: 'Room 4B' },
    { cls: class4aMath, dow: 2, start: '08:00', end: '09:15', subject: 'Fractions & decimals', room: 'Room 4B' },
    { cls: class5b, dow: 1, start: '09:30', end: '10:45', subject: 'Word problems', room: 'Room 5B' },
    { cls: class6a, dow: 2, start: '11:15', end: '12:30', subject: 'Revision session', room: 'Room 6A' },
    { cls: class4aRemedial, dow: 5, start: '14:00', end: '15:00', subject: 'Remedial support', room: 'Room 4B' },
  ];

  for (const slot of teacherClassSlots) {
    const [existing] = await db
      .select()
      .from(schema.portalTimetableSlots)
      .where(
        and(
          eq(schema.portalTimetableSlots.classId, slot.cls.id),
          eq(schema.portalTimetableSlots.dayOfWeek, slot.dow),
          eq(schema.portalTimetableSlots.startTime, slot.start)
        )
      )
      .limit(1);
    if (existing) continue;
    await db.insert(schema.portalTimetableSlots).values({
      classId: slot.cls.id,
      dayOfWeek: slot.dow,
      startTime: slot.start,
      endTime: slot.end,
      subject: slot.subject,
      room: slot.room,
      slotType: 'lesson',
    });
  }

  const assignments = [
    { title: 'Fractions worksheet', due: '2026-05-28', status: 'pending' as const },
    { title: 'Comprehension essay', due: '2026-05-30', status: 'draft' as const },
    { title: 'Plant diagram', due: '2026-05-20', status: 'graded' as const, score: 18 },
  ];

  for (const a of assignments) {
    const [existing] = await db
      .select()
      .from(schema.portalAssignments)
      .where(
        and(eq(schema.portalAssignments.classId, class4aMath.id), eq(schema.portalAssignments.title, a.title))
      )
      .limit(1);

    let assignmentId = existing?.id;
    if (!existing) {
      const [created] = await db
        .insert(schema.portalAssignments)
        .values({
          classId: class4aMath.id,
          title: a.title,
          description: a.title,
          dueDate: new Date(a.due),
          maxScore: 20,
        })
        .returning();
      assignmentId = created.id;
      results.push(`assignment ${a.title}: created`);
    }

    const [sub] = await db
      .select()
      .from(schema.portalAssignmentSubmissions)
      .where(
        and(
          eq(schema.portalAssignmentSubmissions.assignmentId, assignmentId!),
          eq(schema.portalAssignmentSubmissions.studentId, student.id)
        )
      )
      .limit(1);
    if (!sub) {
      await db.insert(schema.portalAssignmentSubmissions).values({
        assignmentId: assignmentId!,
        studentId: student.id,
        status: a.status,
        score: a.score,
        submittedAt: a.status !== 'pending' ? new Date() : null,
      });
    }
  }

  const resultsData = [
    { subject: 'Mathematics', score: 82, position: 8, size: 30 },
    { subject: 'English', score: 76, position: 12, size: 30 },
    { subject: 'Science', score: 80, position: 9, size: 30 },
    { subject: 'Shona', score: 74, position: 14, size: 30 },
  ];

  for (const r of resultsData) {
    const [existing] = await db
      .select()
      .from(schema.portalResultEntries)
      .where(
        and(
          eq(schema.portalResultEntries.studentId, student.id),
          eq(schema.portalResultEntries.subject, r.subject),
          eq(schema.portalResultEntries.term, CURRENT_TERM)
        )
      )
      .limit(1);
    if (existing) continue;
    await db.insert(schema.portalResultEntries).values({
      studentId: student.id,
      subject: r.subject,
      term: CURRENT_TERM,
      academicYear: ACADEMIC_YEAR,
      scorePercent: r.score,
      classPosition: r.position,
      classSize: r.size,
    });
  }

  // Term 1 for delta comparison
  for (const r of resultsData) {
    const [existing] = await db
      .select()
      .from(schema.portalResultEntries)
      .where(
        and(
          eq(schema.portalResultEntries.studentId, student.id),
          eq(schema.portalResultEntries.subject, r.subject),
          eq(schema.portalResultEntries.term, 'Term 1')
        )
      )
      .limit(1);
    if (existing) continue;
    await db.insert(schema.portalResultEntries).values({
      studentId: student.id,
      subject: r.subject,
      term: 'Term 1',
      academicYear: ACADEMIC_YEAR,
      scorePercent: r.score - 4,
      classPosition: r.position + 1,
      classSize: r.size,
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (const cls of [class4aMath, class5b, class6a]) {
    const [existing] = await db
      .select()
      .from(schema.portalAttendance)
      .where(
        and(
          eq(schema.portalAttendance.classId, cls.id),
          eq(schema.portalAttendance.studentId, student.id),
          eq(schema.portalAttendance.attendanceDate, today)
        )
      )
      .limit(1);
    if (existing) continue;
    await db.insert(schema.portalAttendance).values({
      classId: cls.id,
      studentId: student.id,
      attendanceDate: today,
      status: cls.id === class5b.id ? 'absent' : 'present',
    });
  }

  // Past week attendance for weekly average
  for (let i = 1; i <= 5; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    for (const cls of [class4aMath]) {
      const [existing] = await db
        .select()
        .from(schema.portalAttendance)
        .where(
          and(
            eq(schema.portalAttendance.classId, cls.id),
            eq(schema.portalAttendance.studentId, student.id),
            eq(schema.portalAttendance.attendanceDate, d)
          )
        )
        .limit(1);
      if (existing) continue;
      await db.insert(schema.portalAttendance).values({
        classId: cls.id,
        studentId: student.id,
        attendanceDate: d,
        status: i === 2 ? 'late' : 'present',
      });
    }
  }

  const resources = [
    { title: 'ZIMSEC Grade 4 scheme of work', type: 'PDF', desc: 'Term 2 mathematics' },
    { title: 'Mid-term assessment rubric', type: 'Document', desc: 'Grades 4–6' },
    { title: 'Past paper pack 2024', type: 'ZIP', desc: 'Revision materials' },
  ];

  for (const res of resources) {
    const [existing] = await db
      .select()
      .from(schema.portalResources)
      .where(
        and(eq(schema.portalResources.teacherAccountId, teacher.id), eq(schema.portalResources.title, res.title))
      )
      .limit(1);
    if (existing) continue;
    await db.insert(schema.portalResources).values({
      teacherAccountId: teacher.id,
      classId: class4aMath.id,
      title: res.title,
      description: res.desc,
      resourceType: res.type,
    });
  }

  const milestones = [
    { label: 'Term 2 Started', status: 'completed' as const, order: 1 },
    { label: 'Mid-term Assessments', status: 'completed' as const, order: 2 },
    { label: 'End of Term Exams', status: 'in_progress' as const, order: 3 },
    { label: 'Report Cards', status: 'pending' as const, order: 4 },
  ];

  for (const m of milestones) {
    const [existing] = await db
      .select()
      .from(schema.portalTermMilestones)
      .where(
        and(
          eq(schema.portalTermMilestones.grade, 'Grade 4'),
          eq(schema.portalTermMilestones.label, m.label)
        )
      )
      .limit(1);
    if (existing) continue;
    await db.insert(schema.portalTermMilestones).values({
      grade: 'Grade 4',
      term: CURRENT_TERM,
      academicYear: ACADEMIC_YEAR,
      label: m.label,
      status: m.status,
      sortOrder: m.order,
    });
  }

  const parentMilestones = [
    { label: 'Attendance', status: 'completed' as const, order: 1 },
    { label: 'Mid-term Results Published', status: 'completed' as const, order: 2 },
    { label: 'Parent-Teacher Meeting', status: 'in_progress' as const, order: 3 },
    { label: 'End of Term Report', status: 'pending' as const, order: 4 },
  ];

  for (const m of parentMilestones) {
    const [existing] = await db
      .select()
      .from(schema.portalTermMilestones)
      .where(
        and(eq(schema.portalTermMilestones.grade, 'Grade 4-parent'), eq(schema.portalTermMilestones.label, m.label))
      )
      .limit(1);
    if (existing) continue;
    await db.insert(schema.portalTermMilestones).values({
      grade: 'Grade 4-parent',
      term: CURRENT_TERM,
      academicYear: ACADEMIC_YEAR,
      label: m.label,
      status: m.status,
      sortOrder: m.order,
    });
  }

  return { academics: results.length ? results : ['academic data verified'] };
}
