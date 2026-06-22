import { hasPermission, rolesForPermission, USER_ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, type Permission, type UserRole } from './roles';
export { USER_ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, hasPermission, rolesForPermission };
export type { UserRole, Permission };

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

const COOKIE_NAME = 'mg_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser) {
  const { SignJWT } = await import('jose');
  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
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

export async function destroySession() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const { cookies } = await import('next/headers');
  const { jwtVerify } = await import('jose');
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as UserRole,
    };
  } catch {
    return null;
  }
}

export async function requireAuth(roles?: UserRole[]) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  if (roles && !roles.includes(user.role)) {
    throw new Error('Forbidden');
  }
  return user;
}

export async function requirePermission(permission: Permission, write = false) {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  if (!hasPermission(user.role, permission)) {
    throw new Error('Forbidden');
  }
  if (write && !hasPermission(user.role, 'write')) {
    throw new Error('Forbidden');
  }
  return user;
}

export async function loginUser(email: string, password: string) {
  const { eq } = await import('drizzle-orm');
  const { getDb, schema } = await import('./db');
  const db = getDb();
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email.toLowerCase().trim()))
    .limit(1);

  if (!user || !user.isActive) {
    return null;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return null;
  }

  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
  };

  await createSession(sessionUser);
  return sessionUser;
}

export async function logAudit(
  userId: string | null,
  action: string,
  entity: string,
  entityId?: string,
  details?: Record<string, unknown>
) {
  try {
    const { getDb, schema } = await import('./db');
    const db = getDb();
    await db.insert(schema.auditLogs).values({
      userId: userId ?? undefined,
      action,
      entity,
      entityId,
      details,
    });
  } catch {
    // Audit logging should not break primary flows
  }
}
