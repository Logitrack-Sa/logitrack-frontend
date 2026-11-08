import { render, screen } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import Dashboard from "@/app/dashboard/page";
const list = vi.hoisted(() => vi.fn());
vi.mock("@/services/shipment-service", () => ({ shipmentService: { list } }));
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    ready: true,
    user: { sub: "admin" },
    hasRole: (r: string) => r === "ADMIN",
  }),
}));
beforeEach(() => vi.resetAllMocks());
it("consulta estados al backend y enlaza los filtros del resumen", async () => {
  list.mockResolvedValue({ content: [], totalElements: 2 });
  render(<Dashboard />);
  expect(await screen.findByText("8 envíos en total")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Pendientes/ })).toHaveAttribute(
    "href",
    "/shipments?status=PENDIENTE",
  );
  expect(list).toHaveBeenCalledTimes(5);
});
it("no inventa estadísticas cuando falla el servicio", async () => {
  list.mockRejectedValue(new Error("offline"));
  render(<Dashboard />);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "No pudimos cargar",
  );
  expect(screen.queryByLabelText("Resumen de envíos")).not.toBeInTheDocument();
});
