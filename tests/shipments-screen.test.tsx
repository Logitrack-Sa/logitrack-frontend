import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import ShipmentsPage from "@/app/shipments/page";
import { shipmentService } from "@/services/shipment-service";
const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    ready: true,
    user: { roles: ["ADMIN"] },
    hasRole: (role: string) => role === "ADMIN",
  }),
}));
it("pagina en el servidor, reinicia página al filtrar y navega al tracking encontrado", async () => {
  const list = vi
    .spyOn(shipmentService, "list")
    .mockImplementation(async (page) => ({
      content: [],
      page: page ?? 0,
      size: 10,
      totalElements: 30,
      totalPages: 3,
    }));
  vi.spyOn(shipmentService, "tracking").mockResolvedValue({
    id: "shipment-1",
  } as never);
  const user = userEvent.setup();
  render(<ShipmentsPage />);
  await user.click(await screen.findByRole("button", { name: "Siguiente" }));
  await waitFor(() =>
    expect(list).toHaveBeenLastCalledWith(
      1,
      undefined,
      expect.any(AbortSignal),
    ),
  );
  await user.selectOptions(
    screen.getByLabelText("Estado del envío"),
    "EN_RUTA",
  );
  await waitFor(() =>
    expect(list).toHaveBeenLastCalledWith(
      0,
      "EN_RUTA",
      expect.any(AbortSignal),
    ),
  );
  await user.type(screen.getByLabelText("Código de seguimiento"), "LT-123");
  await user.click(screen.getByRole("button", { name: "Buscar" }));
  await waitFor(() =>
    expect(push).toHaveBeenCalledWith("/shipments/shipment-1"),
  );
});
