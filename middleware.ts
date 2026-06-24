import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { canAccessAdminRoute } from '@/lib/roles';
import type { PortalRole } from '@/lib/portal-auth';

const COOKIE_NAME = 'mg_session';
const PORTAL_COOKIE_NAME = 'mgps_portal';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function getTokenPayload(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const secret = getJwtSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

async function getPortalPayload(request: NextRequest) {
  const token = request.cookies.get(PORTAL_COOKIE_NAME)?.value;
  if (!token) return null;
  const secret = getJwtSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const portalMatch = pathname.match(/^\/school\/portal\/(student|teacher|parent)(\/|$)/);
  if (portalMatch) {
    const expectedRole = portalMatch[1] as PortalRole;
    const payload = await getPortalPayload(request);
    if (!payload || payload.role !== expectedRole) {
      const login = new URL('/school/portal/login', request.url);
      login.searchParams.set('role', expectedRole);
      return NextResponse.redirect(login);
    }
  }

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const payload = await getTokenPayload(request);
    if (!payload) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const role = String(payload.role || '');
    if (!canAccessAdminRoute(role, pathname)) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/school/portal/student/:path*', '/school/portal/teacher/:path*', '/school/portal/parent/:path*'],
};
