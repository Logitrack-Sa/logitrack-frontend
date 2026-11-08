import { afterEach, expect, it, vi } from "vitest";
afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});
it("mantiene las rutas y cookies dentro del prefijo de la aplicación", async () => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/logitrack");
  vi.resetModules();
  const { withBasePath, withoutBasePath, cookiePath, resolveApiUrl } =
    await import("@/lib/deployment");
  expect(cookiePath).toBe("/logitrack");
  expect(withBasePath("/login")).toBe("/logitrack/login");
  expect(withoutBasePath("/logitrack/shipments?status=EN_RUTA")).toBe(
    "/shipments?status=EN_RUTA",
  );
  expect(withoutBasePath("/logitrack-other")).toBe("/logitrack-other");
  expect(
    resolveApiUrl("/api/v1/chat/stream", "/logitrack", "https://example.test")
      .href,
  ).toBe("https://example.test/logitrack/api/v1/chat/stream");
  const { safeRedirect } = await import("@/lib/session");
  expect(safeRedirect("/logitrack/shipments")).toBe("/shipments");
});
it("conserva el comportamiento local sin prefijo", async () => {
  vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
  vi.resetModules();
  const { cookiePath, withBasePath, resolveApiUrl } = await import(
    "@/lib/deployment"
  );
  expect(cookiePath).toBe("/");
  expect(withBasePath("/login")).toBe("/login");
  expect(
    resolveApiUrl(
      "/api/v1/chat/stream",
      "http://localhost:8086",
      "http://localhost:3000",
    ).href,
  ).toBe("http://localhost:8086/api/v1/chat/stream");
});
