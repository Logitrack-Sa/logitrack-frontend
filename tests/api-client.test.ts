import Cookies from "js-cookie";
import { afterEach, expect, it } from "vitest";
import { apiClient } from "@/lib/api-client";
afterEach(() => Cookies.remove("auth_token"));
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
