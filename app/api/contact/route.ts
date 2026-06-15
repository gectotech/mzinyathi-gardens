import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getDb, schema } from '@/lib/db';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { contactSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse({
      name: body.name?.trim(),
      email: body.email?.trim(),
      phone: body.phone?.trim(),
      message: body.message?.trim(),
      propertyInterest: body.propertyInterest?.trim() || undefined,
      preferredContact: body.preferredContact,
    });

    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message || 'Invalid form data';
      return jsonError(message, 400);
    }

    const db = getDb();
    const [submission] = await db
      .insert(schema.contactSubmissions)
      .values({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        message: parsed.data.message,
        propertyInterest: parsed.data.propertyInterest ?? null,
        preferredContact: parsed.data.preferredContact,
        status: 'new',
      })
      .returning();

    return jsonOk(
      {
        success: true,
        id: submission.id,
        message: 'Your message was sent to our team.',
      },
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError(error.issues[0]?.message || 'Invalid form data', 400);
    }
    if (error instanceof Error) {
      if (error.message.includes('DATABASE_URL')) {
        return jsonError('Contact service is not configured. Please call us directly.', 503);
      }
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        return jsonError('Database not ready. Admin must run setup first.', 503);
      }
    }
    console.error('Contact form error:', error);
    return jsonError('Failed to send message. Please try again or call us.', 500);
  }
}