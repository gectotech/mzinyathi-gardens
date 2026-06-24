import { sql, desc } from 'drizzle-orm';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { getDb, schema } from '@/lib/db';
import { getPortalSession } from '@/lib/portal-session';

const STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  under_review: 'Under review',
  interview: 'Interview scheduled',
  accepted: 'Accepted',
  waitlisted: 'Waitlisted',
  rejected: 'Rejected',
};

export async function GET() {
  try {
    const session = await getPortalSession();
    if (!session || session.role !== 'parent') {
      return jsonError('Unauthorized', 401);
    }

    const email = session.email.trim().toLowerCase();
    const db = getDb();
    const rows = await db
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
      .where(sql`lower(${schema.schoolApplications.parentEmail}) = ${email}`)
      .orderBy(desc(schema.schoolApplications.createdAt));

    const applications = rows.map((app) => ({
      id: app.id,
      trackingId: app.trackingId,
      learnerName: `${app.firstName} ${app.surname}`,
      grade: app.gradeApplying,
      status: app.status,
      statusLabel: STATUS_LABELS[app.status] || app.status,
      submittedAt: app.createdAt.toISOString(),
    }));

    return jsonOk({ applications });
  } catch (error) {
    return handleAuthError(error);
  }
}
