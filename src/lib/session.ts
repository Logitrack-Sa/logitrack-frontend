import Cookies from 'js-cookie';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import type { RoleName } from '@/types/domain';

export interface Session extends JwtPayload {
  sub: string;
  roles: RoleName[];
  email_verified?: boolean;
  customerId?: string;
  courierId?: string;
}

/** Decodificar solo determina la presentación. Gateway y servicios validan firma y permisos. */
export function decodeSession(token: string, now = Date.now()): Session | null {
  try {
    const claims = jwtDecode<JwtPayload & { roles?: unknown }>(token);
    if (!claims.sub || !claims.exp || claims.exp * 1000 <= now || !Array.isArray(claims.roles)) return null;
    const roles = claims.roles.filter((role): role is string => typeof role === 'string')
      .map(role => role.replace(/^ROLE_/i, '').toUpperCase())
      .filter((role): role is RoleName => ['ADMIN', 'CLIENTE', 'REPARTIDOR'].includes(role));
    return roles.length ? { ...claims, roles } as Session : null;
  } catch { return null; }
}

export const getToken = () => Cookies.get('auth_token');
export function setToken(token: string, expiresIn: number) {
  Cookies.set('auth_token', token, { sameSite: 'lax', path: '/',
    secure: window.location.protocol === 'https:', expires: expiresIn / 86400 });
  window.dispatchEvent(new Event('logitrack:session'));
}
export function clearSession() {
  Cookies.remove('auth_token', { path: '/' });
  window.dispatchEvent(new Event('logitrack:session'));
}
