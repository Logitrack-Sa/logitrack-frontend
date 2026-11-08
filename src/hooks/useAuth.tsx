"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/auth-service";
import { withBasePath } from "@/lib/deployment";
import {
  clearSession,
  decodeSession,
  getToken,
  type Session,
} from "@/lib/session";
import type { RoleName } from "@/types/domain";

const AuthContext = createContext<{
  user: Session | null;
  ready: boolean;
  refreshProfile: () => void;
}>({
  user: null,
  ready: false,
  refreshProfile: () => {},
});
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<{ user: Session | null; ready: boolean }>({
    user: null,
    ready: false,
  });
  useEffect(() => {
    let lastToken: string | undefined;
    let profileRequest: AbortController | undefined;
    const refresh = () => {
      const token = getToken();
      const user = token ? decodeSession(token) : null;
      if (token === lastToken && user) return;
      lastToken = token;
      profileRequest?.abort();
      setState({ user, ready: true });
      if (user && token) {
        const request = new AbortController();
        profileRequest = request;
        void authService
          .getMe(request.signal)
          .then((profile) => {
            if (
              request.signal.aborted ||
              token !== getToken() ||
              profile.id !== user.sub
            )
              return;
            // Roles, verificación y vínculos se alinean con el JWT utilizado por el backend.
            setState({
              user: {
                ...user,
                email: profile.email,
                username: profile.username,
                name: profile.name,
              },
              ready: true,
            });
          })
          .catch(() => {
            /* Un fallo del perfil no reemplaza los claims del token. */
          });
      }
    };
    refresh();
    const timer = window.setInterval(refresh, 10000);
    window.addEventListener("focus", refresh);
    window.addEventListener("logitrack:session", refresh);
    return () => {
      profileRequest?.abort();
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("logitrack:session", refresh);
    };
  }, [revision]);
  return (
    <AuthContext.Provider
      value={{
        ...state,
        refreshProfile: () => setRevision((value) => value + 1),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const state = useContext(AuthContext);
  return {
    ...state,
    isAuthenticated: !!state.user,
    isLoading: !state.ready,
    hasRole: (role: RoleName) => state.user?.roles.includes(role) ?? false,
    logout: () => {
      clearSession();
      window.location.assign(withBasePath("/login"));
    },
  };
}
