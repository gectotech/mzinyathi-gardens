import { NextRequest } from 'next/server';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requirePermission, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { csvDownloadResponse, parseDateRange, rowsToCsv } from '@/lib/csv-export';

export async function GET(request: NextRequest) {
  try {
    await requirePermission('job_applications');
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const { fromDate, toDate } = parseDateRange(searchParams);

    const db = getDb();
    const conditions = [];
    if (fromDate) conditions.push(gte(schema.jobApplications.createdAt, fromDate));
    if (toDate) conditions.push(lte(schema.jobApplications.createdAt, toDate));

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
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(schema.jobApplications.createdAt));

    if (format === 'csv') {
      const rows = applications.map((app) => ({
        tracking_id: app.trackingId,
        status: app.status,
        submitted_at: app.createdAt.toISOString(),
        job_title: app.jobTitle || '',
        department: app.department || '',
        full_name: app.fullName,
        email: app.email,
        phone: app.phone,
        national_id: app.nationalId,
        date_of_birth: app.dob,
        address: app.address,
        education: app.education,
        institution: app.institution,
        field_of_study: app.fieldOfStudy,
        previous_employer: app.previousEmployer || '',
        skills: app.skills,
        experience: app.experience,
        interest_message: app.interestMessage || '',
        resume_url: app.resumeUrl || '',
      }));
      return csvDownloadResponse('job-applications.csv', rowsToCsv(rows));
    }

    return jsonOk({ applications });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requirePermission('job_applications', true);
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
