import { expect, it, vi } from "vitest";
import { courierService } from "@/services/courier-service";
import { apiClient } from "@/lib/api-client";
it("adapta el PageImpl que devuelve Courier sin perder los metadatos", async () => {
  vi.spyOn(apiClient, "get").mockResolvedValue({ data: {
    content: [{ id: "courier", status: "AVAILABLE" }],
    number: 2, size: 10, totalElements: 21, totalPages: 3,
  } });
  const result = await courierService.list(2);
  expect(result.page).toBe(2);
  expect(result.totalElements).toBe(21);
  expect(result.content[0].id).toBe("courier");
});
it("conserva DNI y no inventa estados al enviar un alta", async () => {
  const post = vi
    .spyOn(apiClient, "post")
    .mockResolvedValue({ data: { id: "c" } });
  await courierService.create({
    name: "Ana",
    dni: "12345678",
    vehicleType: "MOTO",
  });
  expect(post).toHaveBeenCalledWith("/api/v1/couriers", {
    name: "Ana",
    dni: "12345678",
    vehicleType: "MOTO",
  });
});
