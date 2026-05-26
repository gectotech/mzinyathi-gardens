import { NextRequest } from 'next/server';
import { jsonOk, jsonError, handleAuthError } from '@/lib/api-utils';
import { loginUser, destroySession, getSessionUser, logAudit } from '@/lib/auth';
import { loginSchema, parseJson } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const data = await parseJson(request, loginSchema);
    const user = await loginUser(data.email, data.password);
    if (!user) {
      return jsonError('Invalid email or password', 401);
    }
    await logAudit(user.id, 'login', 'user', user.id);
    return jsonOk({ user });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function DELETE() {
  try {
    const user = await getSessionUser();
    if (user) {
      await logAudit(user.id, 'logout', 'user', user.id);
    }
    await destroySession();
    return jsonOk({ success: true });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function GET() {
  try {
    const user = await getSessionUser();
    return jsonOk({ user: user ?? null });
  } catch (error) {
    return handleAuthError(error);
  }
}
