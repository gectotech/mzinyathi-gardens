import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { applicationSchema, parseJson } from '@/lib/validators';

export async function GET() {
  try {
    const db = getDb();
    const activeJobs = await db
      .select()
      .from(schema.jobs)
      .where(eq(schema.jobs.isActive, true));
    return jsonOk({ jobs: activeJobs });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await parseJson(request, applicationSchema);
    const db = getDb();

    const [job] = await db
      .select()
      .from(schema.jobs)
      .where(eq(schema.jobs.title, data.jobTitle))
      .limit(1);

    if (!job) {
      return jsonError('Selected job not found', 404);
    }

    const trackingId = `MG-${Date.now()}`;
    const [application] = await db
      .insert(schema.jobApplications)
      .values({
        trackingId,
        jobId: job.id,
        fullName: data.fullName,
        nationalId: data.nationalId,
        dob: data.dob,
        phone: data.phone,
        email: data.email,
        address: data.address,
        education: data.education,
        institution: data.institution,
        fieldOfStudy: data.fieldOfStudy,
        previousEmployer: data.previousEmployer,
        skills: data.skills,
        experience: data.experience,
        interestMessage: data.interestMessage,
        resumeUrl: data.resumeUrl || null,
      })
      .returning();

    return jsonOk({ success: true, trackingId: application.trackingId, id: application.id }, 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return jsonError('Invalid application data', 400);
    }
    return handleAuthError(error);
  }
}
