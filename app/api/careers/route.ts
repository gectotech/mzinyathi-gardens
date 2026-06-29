import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { applicationSchema, parseJson } from '@/lib/validators';
import { generateCareerTrackingId } from '@/lib/tracking';

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

    let job;
    if (data.jobId) {
      [job] = await db.select().from(schema.jobs).where(eq(schema.jobs.id, data.jobId)).limit(1);
    } else if (data.jobTitle) {
      [job] = await db
        .select()
        .from(schema.jobs)
        .where(eq(schema.jobs.title, data.jobTitle))
        .limit(1);
    }

    if (!job) {
      return jsonError('Selected job not found. Please choose a position from the list.', 404);
    }

    let trackingId = generateCareerTrackingId();
    let application;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        [application] = await db
          .insert(schema.jobApplications)
          .values({
            trackingId,
            jobId: job.id,
            fullName: data.fullName,
            nationalId: data.nationalId,
            dob: data.dob,
            gender: data.gender || null,                          // ← NEW
            phone: data.phone,
            email: data.email || `${trackingId.toLowerCase()}@applicant.mzinyathi.local`,
            address: data.address,
            education: data.education,
            institution: data.institution,
            fieldOfStudy: data.fieldOfStudy,
            previousEmployer: data.previousEmployer,
            skills: data.skills,
            experience: data.experience,
            interestMessage: data.interestMessage,
            resumeUrl: data.resumeUrl || null,
            documents: Array.isArray(data.documents) ? data.documents : [], // ← NEW
          })
          .returning();
        break;
      } catch (error) {
        const message = error instanceof Error ? error.message : '';
        if (message.includes('unique') || message.includes('duplicate')) {
          trackingId = generateCareerTrackingId();
          continue;
        }
        throw error;
      }
    }

    if (!application) {
      return jsonError('Could not save application. Please try again.', 500);
    }

    return jsonOk({ success: true, trackingId: application.trackingId, id: application.id }, 201);
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return jsonError('Invalid application data', 400);
    }
    return handleAuthError(error);
  }
}