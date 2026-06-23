import { NextRequest } from 'next/server';
import { and, desc, eq, gte, inArray, lte } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requirePermission, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { csvDownloadResponse, parseDateRange, rowsToCsv } from '@/lib/csv-export';
import { buildSchoolApplicationsWorkbook, workbookToResponse } from '@/lib/excel-export';
import type { SchoolAdmissionDocuments } from '@/lib/db/schema';

const SCHOOL_STATUS_OPTIONS = ['submitted', 'under_review', 'interview', 'accepted', 'waitlisted', 'rejected'] as const;

function docLinks(documents: SchoolAdmissionDocuments | null) {
  if (!documents) return '';
  return Object.entries(documents)
    .filter(([, url]) => url)
    .map(([key, url]) => `${key}: ${url}`)
    .join(' | ');
}

export async function GET(request: NextRequest) {
  try {
    await requirePermission('school_applications');
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const { fromDate, toDate } = parseDateRange(searchParams);

    const db = getDb();
    const conditions = [];
    if (fromDate) conditions.push(gte(schema.schoolApplications.createdAt, fromDate));
    if (toDate) conditions.push(lte(schema.schoolApplications.createdAt, toDate));

    const applications = await db
      .select()
      .from(schema.schoolApplications)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(schema.schoolApplications.createdAt));

    if (format === 'xlsx') {
      const workbook = await buildSchoolApplicationsWorkbook(
        applications.map((app) => ({
          tracking_id: app.trackingId,
          status: app.status,
          submitted_at: app.createdAt.toISOString(),
          first_name: app.firstName,
          surname: app.surname,
          grade_applying: app.gradeApplying,
          parent_name: app.parentName,
          parent_phone: app.parentPhone,
          documents: app.documents,
        }))
      );
      return workbookToResponse(workbook, 'school-applications.xlsx');
    }

    if (format === 'csv') {
      const rows = applications.map((app) => ({
        tracking_id: app.trackingId,
        status: app.status,
        interview_scheduled_at: app.interviewScheduledAt?.toISOString() || '',
        source: app.source,
        submitted_at: app.createdAt.toISOString(),
        first_name: app.firstName,
        surname: app.surname,
        date_of_birth: app.dateOfBirth,
        gender: app.gender,
        nationality: app.nationality,
        birth_cert_number: app.birthCertNumber,
        grade_applying: app.gradeApplying,
        applicant_type: app.applicantType || '',
        parent_name: app.parentName,
        parent_phone: app.parentPhone,
        parent_email: app.parentEmail || '',
        parent_relationship: app.parentRelationship,
        home_address: app.homeAddress,
        city: app.city,
        province: app.province,
        suburb: app.suburb,
        emergency_name: app.emergencyName,
        emergency_phone: app.emergencyPhone,
        last_grade_completed: app.lastGradeCompleted,
        document_links: docLinks(app.documents),
        student_photo: app.documents?.studentPhoto || '',
        birth_certificate: app.documents?.birthCertificate || '',
        previous_report: app.documents?.previousReport || '',
        passport_photo: app.documents?.passportPhoto || '',
        parent_id: app.documents?.parentId || '',
        proof_of_residence: app.documents?.proofOfResidence || '',
        transfer_letter: app.documents?.transferLetter || '',
        recent_results: app.documents?.recentResults || '',
      }));
      return csvDownloadResponse('school-applications.csv', rowsToCsv(rows));
    }

    return jsonOk({ applications });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requirePermission('school_applications', true);
    const { id, status, interviewScheduledAt } = await request.json();
    if (!id || !status) return jsonError('Missing id or status');
    if (!SCHOOL_STATUS_OPTIONS.includes(status)) return jsonError('Invalid status');

    const db = getDb();
    const [updated] = await db
      .update(schema.schoolApplications)
      .set({
        status,
        interviewScheduledAt:
          status === 'interview' && interviewScheduledAt ? new Date(interviewScheduledAt) : null,
        updatedAt: new Date(),
      })
      .where(eq(schema.schoolApplications.id, id))
      .returning();

    await logAudit(user.id, 'update', 'school_application', id, { status, interviewScheduledAt });
    return jsonOk({ application: updated });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requirePermission('school_applications', true);
    const body = await request.json();
    const db = getDb();

    if (body.ids?.length) {
      const deleted = await db
        .delete(schema.schoolApplications)
        .where(inArray(schema.schoolApplications.id, body.ids))
        .returning({ id: schema.schoolApplications.id });
      await logAudit(user.id, 'delete', 'school_application', 'bulk', { ids: body.ids, count: deleted.length });
      return jsonOk({ deleted: deleted.length });
    }

    if (body.before) {
      const beforeDate = new Date(`${body.before}T23:59:59.999`);
      const deleted = await db
        .delete(schema.schoolApplications)
        .where(lte(schema.schoolApplications.createdAt, beforeDate))
        .returning({ id: schema.schoolApplications.id });
      await logAudit(user.id, 'delete', 'school_application', 'before_date', {
        before: body.before,
        count: deleted.length,
      });
      return jsonOk({ deleted: deleted.length });
    }

    if (body.from && body.to) {
      const fromDate = new Date(`${body.from}T00:00:00`);
      const toDate = new Date(`${body.to}T23:59:59.999`);
      const deleted = await db
        .delete(schema.schoolApplications)
        .where(
          and(
            gte(schema.schoolApplications.createdAt, fromDate),
            lte(schema.schoolApplications.createdAt, toDate)
          )
        )
        .returning({ id: schema.schoolApplications.id });
      await logAudit(user.id, 'delete', 'school_application', 'date_range', {
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
