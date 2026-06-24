import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requirePermission, logAudit } from '@/lib/auth';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { enrolApplication } from '@/lib/portal-service';

const enrolSchema = z.object({
  applicationId: z.string().uuid(),
  tempPassword: z.string().min(6).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission('school_applications', true);
    const body = await request.json();
    const data = enrolSchema.parse(body);

    const result = await enrolApplication(data.applicationId, data.tempPassword);

    await logAudit(user.id, 'create', 'student_enrolment', result.student.id, {
      studentNumber: result.studentNumber,
      applicationId: data.applicationId,
    });

    return jsonOk({
      studentNumber: result.studentNumber,
      tempPassword: result.created ? result.tempPassword : undefined,
      created: result.created,
    });
  } catch (error) {
    if (error instanceof z.ZodError) return jsonError('Invalid request', 400);
    if (error instanceof Error && error.message === 'Application not found') {
      return jsonError(error.message, 404);
    }
    return handleAuthError(error);
  }
}
