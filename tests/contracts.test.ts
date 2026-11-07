import { describe, expect, it, vi } from "vitest";
import { normalizePage } from "@/lib/pagination";
import { decodeSession } from "@/lib/session";
import { handleApiError } from "@/types/api-error";
vi.mock("react-hot-toast", () => ({ default: { error: vi.fn() } }));

describe("Contratos entre frontend y servicios", () => {
  it("lee la página real de Spring Data sin depender de _embedded", () => {
    expect(
      normalizePage({
        content: [{ id: "1" }],
        page: { number: 2, size: 10, totalElements: 25, totalPages: 3 },
      }),
    ).toEqual({
      content: [{ id: "1" }],
      page: 2,
      size: 10,
      totalElements: 25,
      totalPages: 3,
    });
  });
  it("acepta una página HATEOAS vacía y una con elementos", () => {
    const page = { number: 0, size: 10, totalElements: 0, totalPages: 0 };
    expect(normalizePage({ page }).content).toEqual([]);
    expect(
      normalizePage({
        _embedded: { customerResponseList: [{ name: "Ana" }] },
        page,
      }).content,
    ).toEqual([{ name: "Ana" }]);
  });
  it("conserva el PageResponse de envíos", () => {
    const page = {
      content: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
    };
    expect(normalizePage(page)).toEqual(page);
  });
  it("rechaza un cuerpo sin metadatos de paginación", () => {
    expect(() => normalizePage({} as never)).toThrow("Paginación inválida");
  });
  it.each(["violations", "details"])(
    "asocia errores por campo desde %s",
    (key) => {
      const setErrors = vi.fn();
      handleApiError(
        {
          response: {
            data: { [key]: [{ field: "email", message: "Correo inválido" }] },
          },
        },
        setErrors,
      );
      expect(setErrors).toHaveBeenCalledWith({ email: "Correo inválido" });
    },
  );
});

describe("Presentación de sesión, sin sustituir validación del servidor", () => {
  const token = (claims: object) =>
    `${btoa("{}")}.${btoa(JSON.stringify(claims))}.signature`;
  it("normaliza roles y conserva vínculos del usuario", () => {
    expect(
      decodeSession(
        token({ sub: "u", exp: 200, roles: ["ROLE_CLIENTE"], customerId: "c" }),
        100000,
      ),
    ).toMatchObject({ roles: ["CLIENTE"], customerId: "c" });
  });
  it("rechaza token expirado, malformado y sin rol reconocido", () => {
    expect(
      decodeSession(token({ sub: "u", exp: 100, roles: ["ADMIN"] }), 100000),
    ).toBeNull();
    expect(decodeSession("broken")).toBeNull();
    expect(
      decodeSession(
        token({ sub: "u", exp: 200, roles: ["SUPERUSER"] }),
        100000,
      ),
    ).toBeNull();
  });
});
