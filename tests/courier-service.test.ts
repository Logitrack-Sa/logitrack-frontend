import { expect, it, vi } from "vitest";
import { courierService } from "@/services/courier-service";
import { apiClient } from "@/lib/api-client";
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
