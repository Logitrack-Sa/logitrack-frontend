// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import { hasRequiredRole, normalizeRole } from '@/lib/auth-utils';

export interface LogiTrackJwtPayload {
  sub: string;
  email?: string;
  roles: string[];
  email_verified?: boolean;
  customerId?: string | null;
  courierId?: string | null;
  exp: number;
  iat?: number;
}

const AUTH_TOKEN_COOKIE = 'auth_token';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/verify-email');

  if (!token && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    try {
      const decoded = jwtDecode<LogiTrackJwtPayload>(token);
      const isExpired =
        typeof decoded.exp !== 'number' || decoded.exp * 1000 < Date.now();

      if (isExpired) {
        const expiredLoginUrl = new URL('/login', request.url);
        expiredLoginUrl.searchParams.set('error', 'session_expired');
        expiredLoginUrl.searchParams.set('redirect', pathname);
        const response = NextResponse.redirect(expiredLoginUrl);
        response.cookies.delete(AUTH_TOKEN_COOKIE);
        return response;
      }

      const normalizedRoles = (decoded.roles || []).map(normalizeRole);

      // Control de acceso RBAC por ruta utilizando hasRequiredRole y normalizeRole
      if (
        pathname.startsWith('/admin') &&
        !hasRequiredRole(normalizedRoles, 'ADMIN')
      ) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      if (
        pathname.startsWith('/couriers') &&
        !hasRequiredRole(normalizedRoles, 'ADMIN') &&
        !hasRequiredRole(normalizedRoles, 'REPARTIDOR')
      ) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    } catch {
      const invalidLoginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(invalidLoginUrl);
      response.cookies.delete(AUTH_TOKEN_COOKIE);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/shipments/:path*',
    '/couriers/:path*',
    '/admin/:path*',
    '/chat/:path*',
  ],
};
