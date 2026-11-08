import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import Page from "@/app/seguimiento/page";
const m = vi.hoisted(() => ({
  user: null as { sub: string } | null,
  push: vi.fn(),
  tracking: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: m.push }),
  useSearchParams: () => new URLSearchParams("codigo=LT-PRUEBA"),
}));
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ ready: true, user: m.user }),
}));
vi.mock("@/services/shipment-service", () => ({
  shipmentService: { tracking: m.tracking },
}));
beforeEach(() => {
  vi.clearAllMocks();
  m.user = null;
});
it("no consulta envíos sin sesión y conserva el código al pedir login", () => {
  render(<Page />);
  expect(m.tracking).not.toHaveBeenCalled();
  expect(screen.getByRole("link", { name: /Iniciar sesión/ })).toHaveAttribute(
    "href",
    "/login?redirect=%2Fseguimiento%3Fcodigo%3DLT-PRUEBA",
  );
});
it("resuelve el seguimiento mediante el backend para el usuario autenticado", async () => {
  m.user = { sub: "cliente" };
  m.tracking.mockResolvedValue({ id: "envio-1" });
  render(<Page />);
  await waitFor(() =>
    expect(m.push).toHaveBeenCalledWith("/shipments/envio-1"),
  );
  expect(m.tracking).toHaveBeenCalledWith("LT-PRUEBA");
});
