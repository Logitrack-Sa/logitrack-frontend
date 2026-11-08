// src/hooks/useAuth.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-hot-toast';
import { AUTH_TOKEN_COOKIE } from '@/lib/api-client';
import {
  NormalizedRole,
  hasRequiredRole,
  normalizeRole,
} from '@/lib/auth-utils';
import { authService } from '@/services/auth-service';
import type { LogiTrackJwtPayload } from '@/middleware';

export interface AuthUser {
  sub: string;
  email: string;
  username?: string;
  name?: string;
  roles: NormalizedRole[];
  email_verified: boolean;
  customerId?: string | null;
  courierId?: string | null;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: NormalizedRole) => boolean;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadSession = useCallback(async () => {
    const token = Cookies.get(AUTH_TOKEN_COOKIE);
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<LogiTrackJwtPayload>(token);
      if (typeof decoded.exp === 'number' && decoded.exp * 1000 < Date.now()) {
        Cookies.remove(AUTH_TOKEN_COOKIE, { path: '/' });
        setUser(null);
        setIsLoading(false);
        return;
      }

      const normalizedRoles = (decoded.roles || []).map(normalizeRole);

      const initialUser: AuthUser = {
        sub: decoded.sub,
        email: decoded.email || '',
        roles: normalizedRoles,
        email_verified: decoded.email_verified ?? true,
        customerId: decoded.customerId ?? null,
        courierId: decoded.courierId ?? null,
      };

      setUser(initialUser);

      // Enriquecer con GET /api/v1/auth/me (cacheado en Redis user_profiles)
      try {
        const profile = await authService.getMe();
        setUser({
          sub: profile.id || decoded.sub,
          email: profile.email || decoded.email || '',
          username: profile.username,
          name: profile.name,
          roles: (profile.roles || decoded.roles || []).map(normalizeRole),
          email_verified:
            profile.emailVerified ?? decoded.email_verified ?? true,
          customerId: profile.customerId ?? decoded.customerId ?? null,
          courierId: profile.courierId ?? decoded.courierId ?? null,
        });
      } catch {
        // Si /auth/me falla temporalmente, mantenemos los claims decodificados del JWT
      }
    } catch {
      Cookies.remove(AUTH_TOKEN_COOKIE, { path: '/' });
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const hasRole = useCallback(
    (requiredRole: NormalizedRole): boolean => {
      if (!user) return false;
      return hasRequiredRole(user.roles, requiredRole);
    },
    [user]
  );

  const logout = useCallback(() => {
    Cookies.remove(AUTH_TOKEN_COOKIE, { path: '/' });
    setUser(null);
    toast.success('Sesión cerrada correctamente.');
    router.push('/login');
    router.refresh();
  }, [router]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    hasRole,
    logout,
    refreshProfile: loadSession,
  };
}
