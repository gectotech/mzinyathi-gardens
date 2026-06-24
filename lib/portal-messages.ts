import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import type { PortalRole } from '@/lib/portal-auth';

export type PortalMessageItem = {
  id: string;
  subject: string;
  body: string;
  senderName: string;
  senderAccountId: string | null;
  senderRole: PortalRole;
  isRead: boolean;
  createdAt: string;
  studentId?: string;
  studentName?: string;
};

export type MessageRecipient = {
  accountId: string;
  name: string;
  role: PortalRole;
  detail?: string;
};

export async function listMessagesForAccount(accountId: string, unreadOnly = false) {
  const db = getDb();
  const conditions = [eq(schema.portalMessages.recipientAccountId, accountId)];
  if (unreadOnly) conditions.push(eq(schema.portalMessages.isRead, false));

  const rows = await db
    .select({
      message: schema.portalMessages,
      studentFirst: schema.students.firstName,
      studentSurname: schema.students.surname,
    })
    .from(schema.portalMessages)
    .leftJoin(schema.students, eq(schema.portalMessages.studentId, schema.students.id))
    .where(and(...conditions))
    .orderBy(desc(schema.portalMessages.createdAt));

  return rows.map(({ message, studentFirst, studentSurname }) => ({
    id: message.id,
    subject: message.subject,
    body: message.body,
    senderName: message.senderName,
    senderAccountId: message.senderAccountId,
    senderRole: message.senderRole as PortalRole,
    isRead: message.isRead,
    createdAt: message.createdAt.toISOString(),
    studentId: message.studentId ?? undefined,
    studentName:
      studentFirst && studentSurname ? `${studentFirst} ${studentSurname}` : undefined,
  }));
}

export async function getMessageRecipients(
  account: typeof schema.portalAccounts.$inferSelect
): Promise<MessageRecipient[]> {
  const db = getDb();
  const recipients = new Map<string, MessageRecipient>();

  const add = (id: string, name: string, role: PortalRole, detail?: string) => {
    if (id === account.id) return;
    recipients.set(id, { accountId: id, name, role, detail });
  };

  if (account.role === 'teacher') {
    const classes = await db
      .select({ id: schema.portalClasses.id })
      .from(schema.portalClasses)
      .where(eq(schema.portalClasses.teacherAccountId, account.id));

    const classIds = classes.map((c) => c.id);
    if (!classIds.length) return [];

    const enrollments = await db
      .select({ studentId: schema.portalClassEnrollments.studentId })
      .from(schema.portalClassEnrollments)
      .where(inArray(schema.portalClassEnrollments.classId, classIds));

    const studentIds = [...new Set(enrollments.map((e) => e.studentId))];
    if (!studentIds.length) return [];

    const students = await db
      .select()
      .from(schema.students)
      .where(inArray(schema.students.id, studentIds));

    for (const stu of students) {
      const [stuAccount] = await db
        .select()
        .from(schema.portalAccounts)
        .where(eq(schema.portalAccounts.studentId, stu.id))
        .limit(1);
      if (stuAccount) {
        add(stuAccount.id, `${stu.firstName} ${stu.surname}`, 'student', stu.studentNumber);
      }
      if (stu.parentEmail) {
        const [parent] = await db
          .select()
          .from(schema.portalAccounts)
          .where(
            and(
              eq(schema.portalAccounts.role, 'parent'),
              sql`lower(${schema.portalAccounts.email}) = ${stu.parentEmail.trim().toLowerCase()}`
            )
          )
          .limit(1);
        if (parent) {
          add(parent.id, `${parent.firstName} ${parent.lastName}`, 'parent', `Parent of ${stu.firstName}`);
        }
      }
    }
  }

  if (account.role === 'parent' && account.email) {
    const students = await db
      .select()
      .from(schema.students)
      .where(sql`lower(${schema.students.parentEmail}) = ${account.email.trim().toLowerCase()}`);

    const studentIds = students.map((s) => s.id);
    if (!studentIds.length) return [];

    const enrollments = await db
      .select({ classId: schema.portalClassEnrollments.classId })
      .from(schema.portalClassEnrollments)
      .where(inArray(schema.portalClassEnrollments.studentId, studentIds));

    const classIds = [...new Set(enrollments.map((e) => e.classId))];
    if (!classIds.length) return [];

    const teachers = await db
      .select({
        id: schema.portalAccounts.id,
        firstName: schema.portalAccounts.firstName,
        lastName: schema.portalAccounts.lastName,
        className: schema.portalClasses.name,
      })
      .from(schema.portalClasses)
      .innerJoin(
        schema.portalAccounts,
        eq(schema.portalClasses.teacherAccountId, schema.portalAccounts.id)
      )
      .where(inArray(schema.portalClasses.id, classIds));

    for (const t of teachers) {
      add(t.id, `${t.firstName} ${t.lastName}`, 'teacher', t.className);
    }
  }

  if (account.role === 'student' && account.studentId) {
    const enrollments = await db
      .select({ classId: schema.portalClassEnrollments.classId })
      .from(schema.portalClassEnrollments)
      .where(eq(schema.portalClassEnrollments.studentId, account.studentId));

    const classIds = enrollments.map((e) => e.classId);
    if (!classIds.length) return [];

    const teachers = await db
      .select({
        id: schema.portalAccounts.id,
        firstName: schema.portalAccounts.firstName,
        lastName: schema.portalAccounts.lastName,
        subject: schema.portalClasses.subject,
      })
      .from(schema.portalClasses)
      .innerJoin(
        schema.portalAccounts,
        eq(schema.portalClasses.teacherAccountId, schema.portalAccounts.id)
      )
      .where(inArray(schema.portalClasses.id, classIds));

    for (const t of teachers) {
      add(t.id, `${t.firstName} ${t.lastName}`, 'teacher', t.subject);
    }
  }

  return [...recipients.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export async function countUnreadMessages(accountId: string) {
  const db = getDb();
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.portalMessages)
    .where(
      and(
        eq(schema.portalMessages.recipientAccountId, accountId),
        eq(schema.portalMessages.isRead, false)
      )
    );
  return row?.count ?? 0;
}

export async function markMessageRead(messageId: string, accountId: string) {
  const db = getDb();
  const [updated] = await db
    .update(schema.portalMessages)
    .set({ isRead: true })
    .where(
      and(
        eq(schema.portalMessages.id, messageId),
        eq(schema.portalMessages.recipientAccountId, accountId)
      )
    )
    .returning();
  return updated ?? null;
}

export async function seedDemoMessages() {
  const db = getDb();
  const results: string[] = [];

  const accounts = await db.select().from(schema.portalAccounts);
  const byEmail = Object.fromEntries(accounts.map((a) => [a.email.toLowerCase(), a]));
  const studentAccount = byEmail['tariro.moyo@student.mzinyathi.local'] || accounts.find((a) => a.role === 'student');
  const teacherAccount = byEmail['teacher@mzinyathigardens.co.zw'];
  const parentAccount = byEmail['parent@mzinyathigardens.co.zw'];

  if (!studentAccount || !teacherAccount || !parentAccount) {
    return { messages: ['skipped: demo accounts missing'] };
  }

  const [student] = await db
    .select()
    .from(schema.students)
    .where(eq(schema.students.id, studentAccount.studentId!))
    .limit(1);

  const demos = [
    {
      key: 'teacher-student-revision',
      recipientAccountId: studentAccount.id,
      senderAccountId: teacherAccount.id,
      senderName: `${teacherAccount.firstName} ${teacherAccount.lastName}`,
      senderRole: 'teacher' as const,
      subject: 'Revision materials for mid-year exams',
      body: 'Please download the fractions worksheet from the resources folder and complete exercises 1–12 before Friday.',
      studentId: student?.id,
    },
    {
      key: 'office-student-sports',
      recipientAccountId: studentAccount.id,
      senderAccountId: null,
      senderName: 'School Office',
      senderRole: 'teacher' as const,
      subject: 'Sports day reminder — 2 June',
      body: 'Learners should wear house colours and bring a water bottle. Parents are welcome from 09:00.',
      studentId: student?.id,
      isRead: true,
    },
    {
      key: 'teacher-parent-meeting',
      recipientAccountId: parentAccount.id,
      senderAccountId: teacherAccount.id,
      senderName: `${teacherAccount.firstName} ${teacherAccount.lastName}`,
      senderRole: 'teacher' as const,
      subject: 'Grade 4 parent meeting — 28 May',
      body: 'You are invited to discuss mid-term progress. Please confirm attendance via reply or the school office.',
      studentId: student?.id,
    },
    {
      key: 'office-parent-fees',
      recipientAccountId: parentAccount.id,
      senderAccountId: null,
      senderName: 'School Office',
      senderRole: 'teacher' as const,
      subject: 'Term 2 fee statement available',
      body: 'Your consolidated fee statement is now visible in the parent portal under Fees & Payments.',
      studentId: student?.id,
    },
    {
      key: 'parent-teacher-reply',
      recipientAccountId: teacherAccount.id,
      senderAccountId: parentAccount.id,
      senderName: `${parentAccount.firstName} ${parentAccount.lastName}`,
      senderRole: 'parent' as const,
      subject: 'Re: Grade 4 parent meeting',
      body: 'Thank you — I will attend the meeting on 28 May at 14:00.',
      studentId: student?.id,
      isRead: false,
    },
  ];

  for (const demo of demos) {
    const [existing] = await db
      .select({ id: schema.portalMessages.id })
      .from(schema.portalMessages)
      .where(
        and(
          eq(schema.portalMessages.recipientAccountId, demo.recipientAccountId),
          eq(schema.portalMessages.subject, demo.subject)
        )
      )
      .limit(1);

    if (existing) {
      results.push(`${demo.subject}: skipped`);
      continue;
    }

    await db.insert(schema.portalMessages).values({
      recipientAccountId: demo.recipientAccountId,
      senderAccountId: demo.senderAccountId,
      senderName: demo.senderName,
      senderRole: demo.senderRole,
      subject: demo.subject,
      body: demo.body,
      studentId: demo.studentId,
      isRead: demo.isRead ?? false,
    });
    results.push(`${demo.subject}: created`);
  }

  return { messages: results };
}

export async function sendPortalMessage(input: {
  senderAccountId: string;
  senderName: string;
  senderRole: 'student' | 'teacher' | 'parent';
  recipientAccountId: string;
  subject: string;
  body: string;
  studentId?: string;
}) {
  const db = getDb();
  const [message] = await db
    .insert(schema.portalMessages)
    .values({
      recipientAccountId: input.recipientAccountId,
      senderAccountId: input.senderAccountId,
      senderName: input.senderName,
      senderRole: input.senderRole,
      subject: input.subject,
      body: input.body,
      studentId: input.studentId,
    })
    .returning();
  return message;
}
