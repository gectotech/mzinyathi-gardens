import { NextRequest } from 'next/server';
import { and, eq, or, sql } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import {
  isCareerTrackingId,
  isSchoolTrackingId,
  normalizeNationalId,
  normalizeTrackingId,
} from '@/lib/tracking';
import { z } from 'zod';

const trackSchema = z.object({
  trackingId: z.string().min(3),
  nationalId: z.string().min(5),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = trackSchema.parse(body);
    const trackingId = normalizeTrackingId(data.trackingId);
    const nationalId = normalizeNationalId(data.nationalId);
    const db = getDb();

    if (isSchoolTrackingId(trackingId)) {
      const [app] = await db
        .select()
        .from(schema.schoolApplications)
        .where(
          and(
            sql`upper(${schema.schoolApplications.trackingId}) = ${trackingId}`,
            or(
              sql`upper(replace(replace(${schema.schoolApplications.parentNationalId}, ' ', ''), '-', '')) = ${nationalId}`,
              sql`upper(replace(replace(${schema.schoolApplications.birthCertNumber}, ' ', ''), '-', '')) = ${nationalId}`
            )
          )
        )
        .limit(1);

      if (!app) {
        return jsonError('No admission application found for this tracking number and parent ID.', 404);
      }

      return jsonOk({
        found: true,
        type: 'school',
        trackingId: app.trackingId,
        status: app.status,
        applicantName: `${app.firstName} ${app.surname}`,
        grade: app.gradeApplying,
        submittedAt: app.createdAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
        interviewScheduledAt: app.interviewScheduledAt?.toISOString() || null,
        steps: buildSchoolSteps(app.status, app.interviewScheduledAt),
      });
    }

    if (isCareerTrackingId(trackingId)) {
      const [app] = await db
        .select({
          application: schema.jobApplications,
          jobTitle: schema.jobs.title,
        })
        .from(schema.jobApplications)
        .leftJoin(schema.jobs, eq(schema.jobApplications.jobId, schema.jobs.id))
        .where(
          and(
            sql`upper(${schema.jobApplications.trackingId}) = ${trackingId}`,
            sql`upper(replace(replace(${schema.jobApplications.nationalId}, ' ', ''), '-', '')) = ${nationalId}`
          )
        )
        .limit(1);

      if (!app) {
        return jsonError('No career application found for this tracking number and national ID.', 404);
      }

      return jsonOk({
        found: true,
        type: 'career',
        trackingId: app.application.trackingId,
        status: app.application.status,
        applicantName: app.application.fullName,
        grade: app.jobTitle || 'Position applied',
        submittedAt: app.application.createdAt.toISOString(),
        updatedAt: app.application.updatedAt.toISOString(),
        interviewScheduledAt: app.application.interviewScheduledAt?.toISOString() || null,
        steps: buildJobSteps(app.application.status, app.application.interviewScheduledAt),
      });
    }

    return jsonError('Invalid tracking number. School applications use MGP- and careers use CAREER-.', 400);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError('Please provide both tracking number and national ID.', 400);
    }
    return handleAuthError(error);
  }
}

function buildSchoolSteps(status: string, interviewAt: Date | null) {
  const steps = [
    { step: 'Application Submitted', status: 'completed' },
    { step: 'Documents Verified', status: status === 'submitted' ? 'pending' : 'completed' },
    { step: 'Under Committee Review', status: ['under_review', 'interview', 'accepted', 'waitlisted', 'rejected'].includes(status) ? 'completed' : 'pending' },
    {
      step: interviewAt ? `Interview scheduled: ${interviewAt.toLocaleString()}` : 'Interview',
      status: status === 'interview' ? 'in_progress' : interviewAt ? 'completed' : 'pending',
    },
    { step: 'Decision Made', status: ['accepted', 'waitlisted', 'rejected'].includes(status) ? 'completed' : 'pending' },
  ];
  return steps;
}

function buildJobSteps(status: string, interviewAt: Date | null) {
  return [
    { step: 'Application Submitted', status: 'completed' },
    { step: 'Documents Verified', status: status === 'submitted' ? 'pending' : 'completed' },
    { step: 'Under HR Review', status: ['under_review', 'shortlisted', 'interview', 'hired', 'rejected'].includes(status) ? 'completed' : 'pending' },
    {
      step: interviewAt ? `Interview scheduled: ${interviewAt.toLocaleString()}` : 'Interview Scheduled',
      status: status === 'interview' ? 'in_progress' : interviewAt ? 'completed' : 'pending',
    },
    { step: 'Decision Made', status: ['hired', 'rejected'].includes(status) ? 'completed' : 'pending' },
  ];
}
