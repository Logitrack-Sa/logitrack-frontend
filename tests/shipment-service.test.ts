import { afterEach, expect, it, vi } from "vitest";
import { apiClient } from "@/lib/api-client";
import { shipmentService } from "@/services/shipment-service";
import axios from "axios";
import Cookies from "js-cookie";
afterEach(() => vi.restoreAllMocks());
it("el seguimiento público no propaga un token anterior ni usa el cliente privado", async () => {
  Cookies.set("auth_token", "expired-test-token");
  const previous = axios.defaults.adapter;
  let authorization: unknown;
  let url: string | undefined;
  axios.defaults.adapter = async (config) => {
    authorization = config.headers.Authorization;
    url = config.url;
    return { data: {}, status: 200, statusText: "OK", headers: {}, config };
  };
  try {
    await shipmentService.publicTracking("LT-A1B2C3D4E5");
    expect(authorization).toBeUndefined();
    expect(url).toContain("/api/v1/shipments/public-tracking/LT-A1B2C3D4E5");
    expect(Cookies.get("auth_token")).toBe("expired-test-token");
  } finally {
    axios.defaults.adapter = previous;
    Cookies.remove("auth_token");
  }
});
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
