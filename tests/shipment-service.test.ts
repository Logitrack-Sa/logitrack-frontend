import { afterEach, expect, it, vi } from "vitest";
import { apiClient } from "@/lib/api-client";
import { shipmentService } from "@/services/shipment-service";
afterEach(() => vi.restoreAllMocks());
it("envía filtro y página al backend, sin filtrar datos después de paginarlos", async () => {
  const get = vi
    .spyOn(apiClient, "get")
    .mockResolvedValue({ data: { content: [] } });
  await shipmentService.list(2, "EN_RUTA");
  expect(get).toHaveBeenCalledWith(
    "/api/v1/shipments",
    expect.objectContaining({
      params: { page: 2, size: 10, status: "EN_RUTA" },
    }),
  );
});
it("escapa el tracking al construir una URL", async () => {
  const get = vi.spyOn(apiClient, "get").mockResolvedValue({ data: {} });
  await shipmentService.tracking("LT/a?b");
  expect(get).toHaveBeenCalledWith("/api/v1/shipments/tracking/LT%2Fa%3Fb");
});
