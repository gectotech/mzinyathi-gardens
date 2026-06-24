import { NextRequest } from 'next/server';
import { z } from 'zod';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { authenticatePortal } from '@/lib/portal-service';
import { createPortalSession } from '@/lib/portal-session';

const loginSchema = z.object({
  role: z.enum(['student', 'teacher', 'parent']),
  identifier: z.string().min(2),
  password: z.string().min(4),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    const result = await authenticatePortal(data.role, data.identifier, data.password);
    if (!result) {
      return jsonError('Invalid credentials. Check your details or use demo credentials.', 401);
    }

    await createPortalSession({ ...result.user, accountId: result.accountId });
    return jsonOk({ user: result.user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonError('Invalid login request', 400);
    }
    return handleAuthError(error);
  }
}
