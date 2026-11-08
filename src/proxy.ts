// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeSession } from "@/lib/session";
import { cookiePath, withBasePath } from "@/lib/deployment";

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

const AUTH_TOKEN_COOKIE = "auth_token";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/verify-email");

  if (!token && !isPublicRoute) {
    const loginUrl = new URL(withBasePath("/login"), request.url);
    loginUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    try {
      const decoded = decodeSession(token);
      const isExpired = !decoded;

      if (isExpired) {
        const expiredLoginUrl = new URL(withBasePath("/login"), request.url);
        expiredLoginUrl.searchParams.set("error", "session_expired");
        expiredLoginUrl.searchParams.set(
          "redirect",
          pathname + request.nextUrl.search,
        );
        const response = NextResponse.redirect(expiredLoginUrl);
        response.cookies.set(AUTH_TOKEN_COOKIE, "", {
          path: cookiePath,
          maxAge: 0,
        });
        return response;
      }

      const normalizedRoles = decoded!.roles;

      // Control de acceso RBAC por ruta utilizando hasRequiredRole y normalizeRole
      if (
        (pathname.startsWith("/admin") || pathname.startsWith("/customers")) &&
        !normalizedRoles.includes("ADMIN")
      ) {
        return NextResponse.redirect(
          new URL(withBasePath("/unauthorized"), request.url),
        );
      }

      if (
        pathname.startsWith("/couriers") &&
        !normalizedRoles.includes("ADMIN") &&
        !normalizedRoles.includes("REPARTIDOR")
      ) {
        return NextResponse.redirect(
          new URL(withBasePath("/unauthorized"), request.url),
        );
      }
    } catch {
      const invalidLoginUrl = new URL(withBasePath("/login"), request.url);
      const response = NextResponse.redirect(invalidLoginUrl);
      response.cookies.set(AUTH_TOKEN_COOKIE, "", {
        path: cookiePath,
        maxAge: 0,
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/customers/:path*",
    "/shipments/:path*",
    "/couriers/:path*",
    "/admin/:path*",
    "/chat/:path*",
  ],
};
