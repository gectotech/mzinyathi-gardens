import { NextRequest } from 'next/server';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { requireAuth, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { csvDownloadResponse, parseDateRange, rowsToCsv } from '@/lib/csv-export';
import type { SchoolAdmissionDocuments } from '@/lib/db/schema';

function docLinks(documents: SchoolAdmissionDocuments | null) {
  if (!documents) return '';
  return Object.entries(documents)
    .filter(([, url]) => url)
    .map(([key, url]) => `${key}: ${url}`)
    .join(' | ');
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth(['admin', 'super_admin']);
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

    if (format === 'csv') {
      const rows = applications.map((app) => ({
        tracking_id: app.trackingId,
        status: app.status,
        source: app.source,
        submitted_at: app.createdAt.toISOString(),
        first_name: app.firstName,
        surname: app.surname,
        date_of_birth: app.dateOfBirth,
        gender: app.gender,
        nationality: app.nationality,
        birth_cert_number: app.birthCertNumber,
        grade_applying: app.gradeApplying,
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
    const user = await requireAuth(['admin', 'super_admin']);
    const { id, status } = await request.json();
    if (!id || !status) return jsonError('Missing id or status');

    const db = getDb();
    const [updated] = await db
      .update(schema.schoolApplications)
      .set({ status, updatedAt: new Date() })
      .where(eq(schema.schoolApplications.id, id))
      .returning();

    await logAudit(user.id, 'update', 'school_application', id, { status });
    return jsonOk({ application: updated });
  } catch (error) {
    return handleAuthError(error);
  }
}
