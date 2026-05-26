import { NextRequest } from 'next/server';
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  message: z.string().min(10),
  propertyInterest: z.string().optional(),
});

export const applicationSchema = z.object({
  jobTitle: z.string().min(2),
  interestMessage: z.string().optional(),
  fullName: z.string().min(2),
  nationalId: z.string().min(2),
  dob: z.string().min(4),
  phone: z.string().min(6),
  email: z.string().email(),
  address: z.string().min(4),
  education: z.string().min(2),
  institution: z.string().min(2),
  fieldOfStudy: z.string().min(2),
  previousEmployer: z.string().optional(),
  skills: z.string().min(2),
  experience: z.string().min(2),
  resumeUrl: z.string().url().optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function parseJson<T>(request: NextRequest, schema: z.ZodSchema<T>) {
  const body = await request.json();
  return schema.parse(body);
}
