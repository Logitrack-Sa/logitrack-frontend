import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import Page from "@/app/seguimiento/page";
const m = vi.hoisted(() => ({
  publicTracking: vi.fn(),
  code: "LT-A1B2C3D4E5",
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams("codigo=" + m.code),
}));
vi.mock("@/services/shipment-service", () => ({
  shipmentService: { publicTracking: m.publicTracking },
}));
beforeEach(() => {
  vi.clearAllMocks();
  m.code = "LT-A1B2C3D4E5";
});
it("muestra el estado y los movimientos sin sesión ni redirección al detalle privado", async () => {
  m.publicTracking.mockResolvedValue({
    trackingCode: m.code,
    status: "EN_RUTA",
    createdAt: "2026-11-09T12:00:00Z",
    movements: [{ status: "PENDIENTE", changedAt: "2026-11-09T12:00:00Z" }],
  });
  render(<Page />);
  expect(
    await screen.findByRole("article", { name: "Resultado del seguimiento" }),
  ).toBeInTheDocument();
  expect(m.publicTracking).toHaveBeenCalledWith(
    m.code,
    expect.any(AbortSignal),
  );
  expect(
    screen.queryByRole("link", { name: /Iniciar sesión/ }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByText(
      "Por privacidad, esta consulta no muestra datos personales ni direcciones.",
    ),
  ).toBeInTheDocument();
});
it("muestra un error útil para un código inexistente", async () => {
  m.publicTracking.mockRejectedValue(new Error("sin conexión"));
  render(<Page />);
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("Volvé a intentar"),
  );
});
it("valida el código antes de consultar el backend", async () => {
  m.code = "invalido";
  render(<Page />);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Revisá el código",
  );
  expect(m.publicTracking).not.toHaveBeenCalled();
});
