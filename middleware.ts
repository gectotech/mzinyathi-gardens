import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { canAccessAdminRoute } from '@/lib/roles';

const COOKIE_NAME = 'mg_session';

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  matcher: ['/admin/:path*'],
};
