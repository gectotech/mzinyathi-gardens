import { NextRequest } from 'next/server';
import { and, desc, eq, gte, inArray, lte } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requirePermission, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { csvDownloadResponse, parseDateRange, rowsToCsv } from '@/lib/csv-export';
import { buildJobApplicationsWorkbook, workbookToResponse } from '@/lib/excel-export';

const JOB_STATUS_OPTIONS = ['submitted', 'under_review', 'shortlisted', 'interview', 'rejected', 'hired'] as const;

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
        interviewScheduledAt: schema.jobApplications.interviewScheduledAt,
        createdAt: schema.jobApplications.createdAt,
        nationalId: schema.jobApplications.nationalId,
        dob: schema.jobApplications.dob,
        gender: schema.jobApplications.gender,
        address: schema.jobApplications.address,
        education: schema.jobApplications.education,
        institution: schema.jobApplications.institution,
        fieldOfStudy: schema.jobApplications.fieldOfStudy,
        previousEmployer: schema.jobApplications.previousEmployer,
        skills: schema.jobApplications.skills,
        experience: schema.jobApplications.experience,
        interestMessage: schema.jobApplications.interestMessage,
        resumeUrl: schema.jobApplications.resumeUrl,
        documents: schema.jobApplications.documents,
        jobTitle: schema.jobs.title,
        department: schema.jobs.department,
      })
      .from(schema.jobApplications)
      .leftJoin(schema.jobs, eq(schema.jobApplications.jobId, schema.jobs.id))
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(schema.jobApplications.createdAt));

    if (format === 'xlsx') {
      const workbook = await buildJobApplicationsWorkbook(
        applications.map((app) => ({
          tracking_id: app.trackingId,
          status: app.status,
          submitted_at: app.createdAt.toISOString(),
          job_title: app.jobTitle || '',
          full_name: app.fullName,
          email: app.email,
          phone: app.phone,
          resume_url: app.resumeUrl,
        }))
      );
      return workbookToResponse(workbook, 'job-applications.xlsx');
    }

    if (format === 'csv') {
      const rows = applications.map((app) => ({
        tracking_id: app.trackingId,
        status: app.status,
        interview_scheduled_at: app.interviewScheduledAt?.toISOString() || '',
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
    const { id, status, interviewScheduledAt } = await request.json();
    if (!id || !status) return jsonError('Missing id or status');
    if (!JOB_STATUS_OPTIONS.includes(status)) return jsonError('Invalid status');

    const db = getDb();
    const [updated] = await db
      .update(schema.jobApplications)
      .set({
        status,
        interviewScheduledAt:
          status === 'interview' && interviewScheduledAt ? new Date(interviewScheduledAt) : null,
        updatedAt: new Date(),
      })
      .where(eq(schema.jobApplications.id, id))
      .returning();

    await logAudit(user.id, 'update', 'application', id, { status, interviewScheduledAt });
    return jsonOk({ application: updated });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requirePermission('job_applications', true);
    const body = await request.json();
    const db = getDb();

    if (body.ids?.length) {
      const deleted = await db
        .delete(schema.jobApplications)
        .where(inArray(schema.jobApplications.id, body.ids))
        .returning({ id: schema.jobApplications.id });
      await logAudit(user.id, 'delete', 'application', 'bulk', { ids: body.ids, count: deleted.length });
      return jsonOk({ deleted: deleted.length });
    }

    if (body.before) {
      const beforeDate = new Date(`${body.before}T23:59:59.999`);
      const deleted = await db
        .delete(schema.jobApplications)
        .where(lte(schema.jobApplications.createdAt, beforeDate))
        .returning({ id: schema.jobApplications.id });
      await logAudit(user.id, 'delete', 'application', 'before_date', { before: body.before, count: deleted.length });
      return jsonOk({ deleted: deleted.length });
    }

    if (body.from && body.to) {
      const fromDate = new Date(`${body.from}T00:00:00`);
      const toDate = new Date(`${body.to}T23:59:59.999`);
      const deleted = await db
        .delete(schema.jobApplications)
        .where(
          and(
            gte(schema.jobApplications.createdAt, fromDate),
            lte(schema.jobApplications.createdAt, toDate)
          )
        )
        .returning({ id: schema.jobApplications.id });
      await logAudit(user.id, 'delete', 'application', 'date_range', {
        from: body.from,
        to: body.to,
        count: deleted.length,
      });
      return jsonOk({ deleted: deleted.length });
    }

    return jsonError('Provide ids, before date, or from/to date range');
  } catch (error) {
    return handleAuthError(error);
  }
}