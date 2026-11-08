import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import Cookies from "js-cookie";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth-service";
afterEach(() => Cookies.remove("auth_token", { path: "/" }));
function token(sub: string, extra = {}) {
  return `${btoa("{}")}.${btoa(JSON.stringify({ sub, exp: Math.floor(Date.now() / 1000) + 3600, roles: ["CLIENTE"], email_verified: false, ...extra }))}.test`;
}
it("comparte la sesión y enriquece el perfil sin alterar los permisos del JWT", async () => {
  Cookies.set("auth_token", token("client"));
  vi.spyOn(authService, "getMe").mockResolvedValue({
    id: "client",
    email: "client@example.test",
    roles: ["ADMIN"],
    emailVerified: true,
  } as never);
  const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
  await waitFor(() =>
    expect(result.current.user?.email).toBe("client@example.test"),
  );
  expect(result.current.hasRole("ADMIN")).toBe(false);
  expect(result.current.user?.email_verified).toBe(false);
});
it("no reintroduce un perfil anterior después de cerrar sesión", async () => {
  Cookies.set("auth_token", token("old"));
  let complete!: (profile: never) => void;
  vi.spyOn(authService, "getMe").mockReturnValue(
    new Promise((resolve) => {
      complete = resolve;
    }),
  );
  const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });
  await act(async () => {
    Cookies.remove("auth_token", { path: "/" });
    window.dispatchEvent(new Event("logitrack:session"));
  });
  await act(async () => {
    complete({ id: "old", email: "old@example.test" } as never);
  });
  expect(result.current.user).toBeNull();
});
