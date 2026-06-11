import { NextRequest } from 'next/server';
import { getDb, schema } from '@/lib/db';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { schoolAdmissionSchema, parseJson } from '@/lib/validators';
import { generateSchoolTrackingId } from '@/lib/school-admission';

export async function POST(request: NextRequest) {
  try {
    const data = await parseJson(request, schoolAdmissionSchema);
    const db = getDb();

    let trackingId = generateSchoolTrackingId();
    let application;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        [application] = await db
          .insert(schema.schoolApplications)
          .values({
            trackingId,
            source: data.source || 'admissions_page',
            firstName: data.firstName,
            surname: data.surname,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            nationality: data.nationality,
            birthCertNumber: data.birthCertNumber,
            gradeApplying: data.gradeApplying,
            learnerPreviousSchool: data.learnerPreviousSchool || null,
            parentName: data.parentName,
            parentRelationship: data.parentRelationship,
            parentNationalId: data.parentNationalId || null,
            parentPhone: data.parentPhone,
            parentAltPhone: data.parentAltPhone || null,
            parentEmail: data.parentEmail || null,
            parentOccupation: data.parentOccupation || null,
            homeAddress: data.homeAddress,
            city: data.city,
            province: data.province,
            suburb: data.suburb,
            postalAddress: data.postalAddress || null,
            emergencyName: data.emergencyName,
            emergencyRelationship: data.emergencyRelationship,
            emergencyPhone: data.emergencyPhone,
            emergencyAltPhone: data.emergencyAltPhone || null,
            medicalConditions: data.medicalConditions || null,
            allergies: data.allergies || null,
            disabilities: data.disabilities || null,
            medications: data.medications || null,
            doctorInfo: data.doctorInfo || null,
            currentSchool: data.currentSchool || null,
            lastGradeCompleted: data.lastGradeCompleted,
            languagesSpoken: data.languagesSpoken || null,
            talentsInterests: data.talentsInterests || null,
            documents: data.documents || {},
            requiresTransport: data.requiresTransport || null,
            pickupArea: data.pickupArea || null,
            informationConfirmed: data.informationConfirmed,
            parentSignature: data.parentSignature,
          })
          .returning();
        break;
      } catch (error) {
        const message = error instanceof Error ? error.message : '';
        if (message.includes('unique') || message.includes('duplicate')) {
          trackingId = generateSchoolTrackingId();
          continue;
        }
        throw error;
      }
    }

    if (!application) {
      return jsonError('Could not create application. Please try again.', 500);
    }

    return jsonOk(
      {
        success: true,
        trackingId: application.trackingId,
        id: application.id,
      },
      201
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return jsonError('Invalid application data', 400);
    }
    return handleAuthError(error);
  }
}
