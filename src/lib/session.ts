import Cookies from "js-cookie";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import type { RoleName } from "@/types/domain";
import { cookiePath, withoutBasePath } from "./deployment";

export interface Session extends JwtPayload {
  sub: string;
  roles: RoleName[];
  email_verified?: boolean;
  customerId?: string;
  courierId?: string;
  email?: string;
  username?: string;
  name?: string;
}

/** Decodificar solo determina la presentación. Gateway y servicios validan firma y permisos. */
export function decodeSession(token: string, now = Date.now()): Session | null {
  try {
    const claims = jwtDecode<JwtPayload & { roles?: unknown }>(token);
    if (
      typeof claims.sub !== "string" ||
      !claims.sub ||
      typeof claims.exp !== "number" ||
      !Number.isFinite(claims.exp) ||
      claims.exp * 1000 <= now ||
      !Array.isArray(claims.roles)
    )
      return null;
    const roles = claims.roles
      .filter((role): role is string => typeof role === "string")
      .map((role) => role.replace(/^ROLE_/i, "").toUpperCase())
      .filter((role): role is RoleName =>
        ["ADMIN", "CLIENTE", "REPARTIDOR"].includes(role),
      );
    return roles.length ? ({ ...claims, roles } as Session) : null;
  } catch {
    return null;
  }
}

export const getToken = () => Cookies.get("auth_token");
export function setToken(token: string, expiresIn: number) {
  Cookies.set("auth_token", token, {
    sameSite: "lax",
    path: cookiePath,
    secure: window.location.protocol === "https:",
    expires: expiresIn / 86400,
  });
  window.dispatchEvent(new Event("logitrack:session"));
}
export function clearSession() {
  Cookies.remove("auth_token", { path: cookiePath });
  window.dispatchEvent(new Event("logitrack:session"));
}

export function safeRedirect(value: string | null, fallback = "/dashboard") {
  if (value) value = withoutBasePath(value);
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\u0000-\u001f]/.test(value)
  )
    return fallback;
  const url = new URL(value, "https://logitrack.local");
  return url.origin === "https://logitrack.local" &&
    !url.pathname.startsWith("/login")
    ? `${url.pathname}${url.search}${url.hash}`
    : fallback;
}
