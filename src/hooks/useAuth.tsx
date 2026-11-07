'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { clearSession, decodeSession, getToken, type Session } from '@/lib/session';
import type { RoleName } from '@/types/domain';

const AuthContext = createContext<{ user: Session | null; ready: boolean }>({ user: null, ready: false });
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ user: Session | null; ready: boolean }>({ user: null, ready: false });
  useEffect(() => {
    const refresh = () => {
      const token = getToken();
      const user = token ? decodeSession(token) : null;
      setState({ user, ready: true });
    };
    refresh();
    const timer = window.setInterval(refresh, 10000);
    window.addEventListener('focus', refresh);
    window.addEventListener('logitrack:session', refresh);
    return () => { clearInterval(timer); window.removeEventListener('focus', refresh);
      window.removeEventListener('logitrack:session', refresh); };
  }, []);
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const state = useContext(AuthContext);
  return { ...state, hasRole: (role: RoleName) => state.user?.roles.includes(role) ?? false, logout: clearSession };
}
