import { beforeEach, expect, it, vi } from "vitest";
import { userService } from "@/services/user-service";
const m = vi.hoisted(() => ({
  getCustomer: vi.fn(),
  getCourier: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}));
vi.mock("@/lib/api-client", () => ({
  apiClient: { post: m.post, put: m.put },
}));
vi.mock("@/services/customer-service", () => ({
  customerService: { get: m.getCustomer },
}));
vi.mock("@/services/courier-service", () => ({
  courierService: { get: m.getCourier },
}));
beforeEach(() => vi.resetAllMocks());
it("no crea una cuenta con una ficha de cliente inexistente", async () => {
  m.getCustomer.mockRejectedValue(new Error("404"));
  await expect(
    userService.create({
      name: "A",
      email: "a@example.test",
      password: "test-only",
      roles: ["CLIENTE"],
      customerId: "missing",
    }),
  ).rejects.toThrow();
  expect(m.post).not.toHaveBeenCalled();
});
it("comprueba Courier antes de guardar el vínculo en Security", async () => {
  m.getCourier.mockResolvedValue({ id: "courier" });
  m.put.mockResolvedValue({ data: { id: "user" } });
  await userService.link("user", "REPARTIDOR", "courier");
  expect(m.getCourier).toHaveBeenCalledWith("courier");
  expect(m.put).toHaveBeenCalledWith("/api/v1/users/user/courier-link", {
    courierId: "courier",
  });
  expect(m.getCourier.mock.invocationCallOrder[0]).toBeLessThan(
    m.put.mock.invocationCallOrder[0],
  );
});

it("no elimina un vínculo cuando el selector todavía no tiene una ficha", async () => {
  await expect(userService.link("user", "CLIENTE", "")).rejects.toThrow();
  expect(m.getCustomer).not.toHaveBeenCalled();
  expect(m.put).not.toHaveBeenCalled();
});
it("rechaza una ficha distinta de la solicitada", async () => {
  m.getCourier.mockResolvedValue({ id: "otro" });
  await expect(
    userService.link("user", "REPARTIDOR", "courier"),
  ).rejects.toThrow();
  expect(m.put).not.toHaveBeenCalled();
});
