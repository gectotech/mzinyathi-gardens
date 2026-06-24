import { and, eq, sql } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { allocateStudentNumber } from '@/lib/student-id';
import type { PortalUser, PortalRole } from '@/lib/portal-auth';
import { DEMO_ACCOUNTS } from '@/lib/portal-auth';

function normalizeId(id: string) {
  return id.trim().toUpperCase();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function loadParentChildren(parentEmail: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(schema.students)
    .where(sql`lower(${schema.students.parentEmail}) = ${normalizeEmail(parentEmail)}`);

  return rows.map((s) => ({
    studentId: s.id,
    name: `${s.firstName} ${s.surname}`,
    grade: s.grade,
    studentNumber: s.studentNumber,
  }));
}

export async function accountToPortalUser(
  account: typeof schema.portalAccounts.$inferSelect
): Promise<PortalUser> {
  const db = getDb();
  const base: PortalUser = {
    id: account.studentId || account.id,
    role: account.role as PortalRole,
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    identifier: account.identifier,
    department: account.profileData?.department,
    children: account.profileData?.children?.map((c) => ({
      name: c.name,
      grade: c.grade,
      studentNumber: c.studentNumber,
    })),
  };

  if (account.role === 'student' && account.studentId) {
    const [student] = await db
      .select()
      .from(schema.students)
      .where(eq(schema.students.id, account.studentId))
      .limit(1);
    if (student) base.grade = student.grade;
  }

  if (account.role === 'parent') {
    const children = await loadParentChildren(account.email);
    base.children = children.map((c) => ({
      name: c.name,
      grade: c.grade,
      studentNumber: c.studentNumber,
    }));
  }

  return base;
}

export async function authenticatePortal(
  role: PortalRole,
  identifier: string,
  password: string
): Promise<{ user: PortalUser; accountId: string } | null> {
  const db = getDb();
  const idNorm = normalizeId(identifier);
  const emailNorm = normalizeEmail(identifier);

  const accounts = await db
    .select()
    .from(schema.portalAccounts)
    .where(and(eq(schema.portalAccounts.role, role), eq(schema.portalAccounts.isActive, true)));

  const account = accounts.find(
    (a) =>
      normalizeId(a.identifier) === idNorm ||
      normalizeEmail(a.email) === emailNorm ||
      (role !== 'student' && normalizeEmail(a.identifier) === emailNorm)
  );

  if (account && (await verifyPassword(password, account.passwordHash))) {
    const user = await accountToPortalUser(account);
    return { user, accountId: account.id };
  }

  const demo = DEMO_ACCOUNTS[role];
  const demoMatch =
    role === 'student'
      ? idNorm === normalizeId(demo.identifier)
      : emailNorm === normalizeEmail(demo.identifier);

  if (demoMatch && password === demo.password) {
    return { user: demo.user, accountId: demo.user.id };
  }

  return null;
}

export async function enrolApplication(applicationId: string, tempPassword?: string) {
  const db = getDb();
  const [app] = await db
    .select()
    .from(schema.schoolApplications)
    .where(eq(schema.schoolApplications.id, applicationId))
    .limit(1);

  if (!app) throw new Error('Application not found');

  const [existingStudent] = await db
    .select()
    .from(schema.students)
    .where(eq(schema.students.applicationId, applicationId))
    .limit(1);

  if (existingStudent) {
    return { student: existingStudent, studentNumber: existingStudent.studentNumber, created: false };
  }

  const studentNumber = await allocateStudentNumber(db);
  const password = tempPassword || `Welcome${studentNumber.slice(-4)}`;
  const passwordHash = await hashPassword(password);

  const [student] = await db
    .insert(schema.students)
    .values({
      studentNumber,
      applicationId: app.id,
      firstName: app.firstName,
      surname: app.surname,
      gender: app.gender,
      grade: app.gradeApplying,
      parentEmail: app.parentEmail,
      parentPhone: app.parentPhone,
      status: 'active',
    })
    .returning();

  const studentEmail =
    app.parentEmail ||
    `${studentNumber.toLowerCase()}@student.mzinyathi.local`;

  await db.insert(schema.portalAccounts).values({
    role: 'student',
    email: studentEmail,
    identifier: studentNumber,
    passwordHash,
    firstName: app.firstName,
    lastName: app.surname,
    studentId: student.id,
    profileData: { studentId: student.id },
  });

  const gradeClasses = await db
    .select()
    .from(schema.portalClasses)
    .where(eq(schema.portalClasses.grade, app.gradeApplying));
  for (const cls of gradeClasses) {
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

  if (app.parentEmail) {
    const [existingParent] = await db
      .select()
      .from(schema.portalAccounts)
      .where(
        and(
          eq(schema.portalAccounts.role, 'parent'),
          sql`lower(${schema.portalAccounts.email}) = ${normalizeEmail(app.parentEmail)}`
        )
      )
      .limit(1);

    const childEntry = {
      studentId: student.id,
      name: `${app.firstName} ${app.surname}`,
      grade: app.gradeApplying,
      studentNumber,
    };

    if (existingParent) {
      const children = existingParent.profileData?.children || [];
      const updated = [...children.filter((c) => c.studentId !== student.id), childEntry];
      await db
        .update(schema.portalAccounts)
        .set({ profileData: { ...existingParent.profileData, children: updated }, updatedAt: new Date() })
        .where(eq(schema.portalAccounts.id, existingParent.id));
    } else {
      const parentParts = app.parentName.trim().split(/\s+/);
      const parentFirst = parentParts[0] || 'Parent';
      const parentLast = parentParts.slice(1).join(' ') || 'Guardian';
      const parentPasswordHash = await hashPassword(tempPassword || 'parent123');

      await db.insert(schema.portalAccounts).values({
        role: 'parent',
        email: app.parentEmail,
        identifier: `PAR-${studentNumber.slice(-6)}`,
        passwordHash: parentPasswordHash,
        firstName: parentFirst,
        lastName: parentLast,
        profileData: { children: [childEntry] },
      });
    }
  }

  await db
    .update(schema.schoolApplications)
    .set({ status: 'accepted', updatedAt: new Date() })
    .where(eq(schema.schoolApplications.id, applicationId));

  return { student, studentNumber, tempPassword: password, created: true };
}

export async function seedPortalDemoAccounts() {
  const db = getDb();
  const demos = [
    {
      role: 'student' as const,
      ...DEMO_ACCOUNTS.student,
      email: DEMO_ACCOUNTS.student.user.email,
      firstName: DEMO_ACCOUNTS.student.user.firstName,
      lastName: DEMO_ACCOUNTS.student.user.lastName,
      grade: 'Grade 4',
    },
    {
      role: 'teacher' as const,
      ...DEMO_ACCOUNTS.teacher,
      email: DEMO_ACCOUNTS.teacher.user.email,
      firstName: DEMO_ACCOUNTS.teacher.user.firstName,
      lastName: DEMO_ACCOUNTS.teacher.user.lastName,
    },
    {
      role: 'parent' as const,
      ...DEMO_ACCOUNTS.parent,
      email: DEMO_ACCOUNTS.parent.user.email,
      firstName: DEMO_ACCOUNTS.parent.user.firstName,
      lastName: DEMO_ACCOUNTS.parent.user.lastName,
    },
  ];

  const results = [];

  for (const demo of demos) {
    const [existing] = await db
      .select()
      .from(schema.portalAccounts)
      .where(eq(schema.portalAccounts.email, demo.email))
      .limit(1);

    const passwordHash = await hashPassword(demo.password);

    if (existing) {
      await db
        .update(schema.portalAccounts)
        .set({ passwordHash, updatedAt: new Date(), isActive: true })
        .where(eq(schema.portalAccounts.id, existing.id));
      results.push({ identifier: demo.identifier, action: 'updated' });
      continue;
    }

    let studentId: string | undefined;

    if (demo.role === 'student') {
      const [stu] = await db
        .select()
        .from(schema.students)
        .where(eq(schema.students.studentNumber, demo.identifier.toUpperCase()))
        .limit(1);

      if (stu) {
        studentId = stu.id;
      } else {
        const [created] = await db
          .insert(schema.students)
          .values({
            studentNumber: demo.identifier.toUpperCase(),
            firstName: demo.firstName,
            surname: demo.lastName,
            gender: 'Female',
            grade: demo.grade || 'Grade 4',
            parentEmail: DEMO_ACCOUNTS.parent.user.email,
            status: 'active',
          })
          .returning();
        studentId = created.id;
      }
    }

    await db.insert(schema.portalAccounts).values({
      role: demo.role,
      email: demo.email,
      identifier: demo.role === 'student' ? demo.identifier.toUpperCase() : demo.identifier,
      passwordHash,
      firstName: demo.firstName,
      lastName: demo.lastName,
      studentId,
      profileData:
        demo.role === 'teacher'
          ? { department: DEMO_ACCOUNTS.teacher.user.department }
          : demo.role === 'parent'
          ? {
              children: DEMO_ACCOUNTS.parent.user.children?.map((c, i) => ({
                studentId: `demo-child-${i}`,
                name: c.name,
                grade: c.grade,
                studentNumber: c.studentNumber,
              })),
            }
          : { studentId },
    });

    results.push({ identifier: demo.identifier, action: 'created' });
  }

  return results;
}
