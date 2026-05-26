import { NextRequest } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requireAuth, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';

export async function GET() {
  try {
    await requireAuth(['admin', 'super_admin']);
    const db = getDb();
    const applications = await db
      .select({
        id: schema.jobApplications.id,
        trackingId: schema.jobApplications.trackingId,
        fullName: schema.jobApplications.fullName,
        email: schema.jobApplications.email,
        phone: schema.jobApplications.phone,
        status: schema.jobApplications.status,
        createdAt: schema.jobApplications.createdAt,
        nationalId: schema.jobApplications.nationalId,
        dob: schema.jobApplications.dob,
        address: schema.jobApplications.address,
        education: schema.jobApplications.education,
        institution: schema.jobApplications.institution,
        fieldOfStudy: schema.jobApplications.fieldOfStudy,
        previousEmployer: schema.jobApplications.previousEmployer,
        skills: schema.jobApplications.skills,
        experience: schema.jobApplications.experience,
        interestMessage: schema.jobApplications.interestMessage,
        resumeUrl: schema.jobApplications.resumeUrl,
        jobTitle: schema.jobs.title,
        department: schema.jobs.department,
      })
      .from(schema.jobApplications)
      .leftJoin(schema.jobs, eq(schema.jobApplications.jobId, schema.jobs.id))
      .orderBy(desc(schema.jobApplications.createdAt));

    return jsonOk({ applications });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth(['admin', 'super_admin']);
    const { id, status } = await request.json();
    if (!id || !status) return jsonError('Missing id or status');

    const db = getDb();
    const [updated] = await db
      .update(schema.jobApplications)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.jobApplications.id, id))
      .returning();

    await logAudit(user.id, 'update', 'application', id, { status });
    return jsonOk({ application: updated });
  } catch (error) {
    return handleAuthError(error);
  }
}
