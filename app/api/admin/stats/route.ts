import { count, desc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { jsonOk, handleAuthError } from '@/lib/api-utils';

export async function GET() {
  try {
    await requireAuth(['admin', 'super_admin']);
    const db = getDb();

    const [contacts] = await db.select({ value: count() }).from(schema.contactSubmissions);
    const [applications] = await db.select({ value: count() }).from(schema.jobApplications);
    const [schoolApplications] = await db
      .select({ value: count() })
      .from(schema.schoolApplications);
    const [jobs] = await db.select({ value: count() }).from(schema.jobs);
    const [phases] = await db.select({ value: count() }).from(schema.phases);
    const [media] = await db.select({ value: count() }).from(schema.mediaFiles);

    const recentContacts = await db
      .select()
      .from(schema.contactSubmissions)
      .orderBy(desc(schema.contactSubmissions.createdAt))
      .limit(5);

    const recentApplications = await db
      .select({
        id: schema.jobApplications.id,
        trackingId: schema.jobApplications.trackingId,
        fullName: schema.jobApplications.fullName,
        email: schema.jobApplications.email,
        status: schema.jobApplications.status,
        createdAt: schema.jobApplications.createdAt,
        jobTitle: schema.jobs.title,
      })
      .from(schema.jobApplications)
      .leftJoin(schema.jobs, eq(schema.jobApplications.jobId, schema.jobs.id))
      .orderBy(desc(schema.jobApplications.createdAt))
      .limit(5);

    const recentSchoolApplications = await db
      .select({
        id: schema.schoolApplications.id,
        trackingId: schema.schoolApplications.trackingId,
        firstName: schema.schoolApplications.firstName,
        surname: schema.schoolApplications.surname,
        gradeApplying: schema.schoolApplications.gradeApplying,
        status: schema.schoolApplications.status,
        createdAt: schema.schoolApplications.createdAt,
      })
      .from(schema.schoolApplications)
      .orderBy(desc(schema.schoolApplications.createdAt))
      .limit(5);

    return jsonOk({
      stats: {
        contacts: contacts.value,
        applications: applications.value,
        schoolApplications: schoolApplications.value,
        jobs: jobs.value,
        phases: phases.value,
        media: media.value,
      },
      recentContacts,
      recentApplications,
      recentSchoolApplications,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}
