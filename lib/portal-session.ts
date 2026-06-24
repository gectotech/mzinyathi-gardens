import type { PortalUser, PortalRole } from '@/lib/portal-auth';

const COOKIE_NAME = 'mgps_portal';
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(secret);
}

export type PortalSession = PortalUser & { accountId: string };

export async function createPortalSession(user: PortalSession) {
  const { SignJWT } = await import('jose');
  const token = await new SignJWT({
    accountId: user.accountId,
    id: user.id,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    identifier: user.identifier,
    grade: user.grade,
    department: user.department,
    children: user.children,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getJwtSecret());

  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  return token;
}

export async function destroyPortalSession() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getPortalSession(): Promise<PortalSession | null> {
  const { cookies } = await import('next/headers');
  const { jwtVerify } = await import('jose');
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      accountId: payload.accountId as string,
      id: (payload.id as string) || (payload.accountId as string),
      role: payload.role as PortalRole,
      firstName: payload.firstName as string,
      lastName: payload.lastName as string,
      email: payload.email as string,
      identifier: payload.identifier as string,
      grade: payload.grade as string | undefined,
      department: payload.department as string | undefined,
      children: payload.children as PortalUser['children'],
    };
  } catch {
    return null;
  }
}

export { COOKIE_NAME as PORTAL_COOKIE_NAME };
