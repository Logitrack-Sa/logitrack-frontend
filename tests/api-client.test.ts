import Cookies from "js-cookie";
import { afterEach, expect, it, vi } from "vitest";
import { AxiosError } from "axios";
import { apiClient } from "@/lib/api-client";
afterEach(() => Cookies.remove("auth_token"));
it("un perfil rechazado limpia la sesión sin sacar al visitante del seguimiento público", async () => {
  Cookies.set("auth_token", "revoked-test-token");
  const assign = vi.fn();
  vi.stubGlobal("window", {
    location: { pathname: "/seguimiento", assign },
    dispatchEvent: window.dispatchEvent.bind(window),
  });
  try {
    await expect(
      apiClient.get("/api/v1/auth/me", {
        adapter: async (config) => {
          throw new AxiosError(
            "Unauthorized",
            "ERR_BAD_REQUEST",
            config,
            {},
            {
              data: {},
              status: 401,
              statusText: "Unauthorized",
              headers: {},
              config,
            },
          );
        },
      }),
    ).rejects.toBeInstanceOf(AxiosError);
    expect(assign).not.toHaveBeenCalled();
    expect(Cookies.get("auth_token")).toBeUndefined();
  } finally {
    vi.unstubAllGlobals();
  }
});
it("adjunta la sesión a las peticiones al Gateway", async () => {
  Cookies.set("auth_token", "test-only-token");
  let authorization: unknown;
  await apiClient.get("/api/v1/customers", {
    adapter: async (config) => {
      authorization = config.headers.Authorization;
      return { data: {}, status: 200, statusText: "OK", headers: {}, config };
    },
  });
  expect(authorization).toBe("Bearer test-only-token");
});
it("no propaga una sesión anterior al iniciar sesión nuevamente", async () => {
  Cookies.set("auth_token", "old-test-token");
  let authorization: unknown;
  await apiClient.post(
    "/api/v1/auth/login",
    {},
    {
      adapter: async (config) => {
        authorization = config.headers.Authorization;
        return { data: {}, status: 200, statusText: "OK", headers: {}, config };
      },
    },
  );
  expect(authorization).toBeUndefined();
});
