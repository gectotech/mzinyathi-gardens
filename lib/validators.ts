import { NextRequest } from 'next/server';
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  message: z.string().min(10),
  propertyInterest: z.string().optional(),
  preferredContact: z.enum(['call', 'email', 'whatsapp']),
});

export const applicationSchema = z
  .object({
    jobId: z.string().uuid().optional(),
    jobTitle: z.string().min(2).optional(),
    interestMessage: z.string().optional(),
    fullName: z.string().min(2),
    nationalId: z.string().min(2),
    dob: z.string().min(4),
    phone: z.string().min(6),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().min(4),
    education: z.string().min(2),
    institution: z.string().min(2),
    fieldOfStudy: z.string().min(2),
    previousEmployer: z.string().optional(),
    skills: z.string().min(2),
    experience: z.string().min(2),
    resumeUrl: z.string().url().optional().or(z.literal('')),
  })
  .refine((data) => data.jobId || data.jobTitle, {
    message: 'A job position is required',
    path: ['jobTitle'],
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const schoolDocumentsSchema = z
  .object({
    studentPhoto: z.string().url().optional(),
    birthCertificate: z.string().url().optional(),
    previousReport: z.string().url().optional(),
    passportPhoto: z.string().url().optional(),
    parentId: z.string().url().optional(),
    proofOfResidence: z.string().url().optional(),
    transferLetter: z.string().url().optional(),
    recentResults: z.string().url().optional(),
  })
  .optional()
  .default({});

export const schoolAdmissionSchema = z.object({
  source: z.enum(['admissions_page', 'contact_page']).optional(),
  firstName: z.string().min(2),
  surname: z.string().min(2),
  dateOfBirth: z.string().min(4),
  gender: z.string().min(1),
  nationality: z.string().min(2),
  birthCertNumber: z.string().min(2),
  gradeApplying: z.string().min(2),
  applicantType: z.enum(['transfer', 'fresh']).optional(),
  learnerPreviousSchool: z.string().optional(),
  parentName: z.string().min(2),
  parentRelationship: z.string().min(2),
  parentNationalId: z.string().optional(),
  parentPhone: z.string().min(6),
  parentAltPhone: z.string().optional(),
  parentEmail: z.string().email().optional().or(z.literal('')),
  parentOccupation: z.string().optional(),
  homeAddress: z.string().min(4),
  city: z.string().min(2),
  province: z.string().min(2),
  suburb: z.string().min(2),
  postalAddress: z.string().optional(),
  emergencyName: z.string().min(2),
  emergencyRelationship: z.string().min(2),
  emergencyPhone: z.string().min(6),
  emergencyAltPhone: z.string().optional(),
  medicalConditions: z.string().optional(),
  allergies: z.string().optional(),
  disabilities: z.string().optional(),
  medications: z.string().optional(),
  doctorInfo: z.string().optional(),
  currentSchool: z.string().optional(),
  lastGradeCompleted: z.string().min(1),
  languagesSpoken: z.string().optional(),
  talentsInterests: z.string().optional(),
  documents: schoolDocumentsSchema,
  requiresTransport: z.string().optional(),
  pickupArea: z.string().optional(),
  informationConfirmed: z.literal(true),
  parentSignature: z.string().min(2),
});

export async function parseJson<T>(request: NextRequest, schema: z.ZodSchema<T>) {
  const body = await request.json();
  return schema.parse(body);
}
