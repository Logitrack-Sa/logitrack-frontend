import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { safeRedirect } from "@/lib/session";
const jwt = (claims: object) =>
  `${btoa("{}")}.${btoa(JSON.stringify(claims))}.test-signature`;
function request(path: string, roles?: string[], extra = {}) {
  const token = roles
    ? jwt({
        sub: "user",
        exp: Math.floor(Date.now() / 1000) + 60,
        roles,
        ...extra,
      })
    : "";
  return new NextRequest(`http://localhost:3000${path}`, {
    headers: token ? { cookie: `auth_token=${token}` } : {},
  });
}
describe("Navegación de la interfaz, adicional a la autorización del backend", () => {
  it("redirige al login conservando la consulta", () => {
    const response = proxy(request("/shipments?status=EN_RUTA"));
    expect(
      new URL(response.headers.get("location")!).searchParams.get("redirect"),
    ).toBe("/shipments?status=EN_RUTA");
  });
  it.each(["/customers", "/couriers", "/admin"])(
    "rechaza CLIENTE en %s",
    (path) => {
      expect(
        proxy(request(path, ["ROLE_CLIENTE"])).headers.get("location"),
      ).toBe("http://localhost:3000/unauthorized");
    },
  );
  it("permite al ADMIN y elimina una cookie vencida", () => {
    expect(
      proxy(request("/customers", ["ROLE_ADMIN"])).headers.get(
        "x-middleware-next",
      ),
    ).toBe("1");
    const expired = proxy(request("/shipments", ["ADMIN"], { exp: 1 }));
    expect(expired.cookies.get("auth_token")?.value).toBe("");
  });
  it.each([{ exp: "not-a-number" }, { roles: [99] }, { sub: null }])(
    "no acepta claims malformados %j",
    (extra) => {
      expect(
        proxy(request("/shipments", ["ADMIN"], extra)).headers.get("location"),
      ).toContain("/login");
    },
  );
});
it.each(["//example.org", "https://example.org", "/\\example.org", "/login"])(
  "evita una redirección insegura: %s",
  (value) => {
    expect(safeRedirect(value)).toBe("/dashboard");
  },
);
it("conserva rutas locales con parámetros", () =>
  expect(safeRedirect("/shipments?status=PENDIENTE")).toBe(
    "/shipments?status=PENDIENTE",
  ));

it("reserva el CRUD de repartidores a ADMIN como el Gateway", () => {
  expect(
    proxy(request("/couriers", ["REPARTIDOR"])).headers.get("location"),
  ).toContain("/unauthorized");
});
