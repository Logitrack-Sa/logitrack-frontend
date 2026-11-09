import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import { ShipmentPayment } from "@/components/shipments/ShipmentPayment";
import {
  paymentService,
  isMercadoPagoCheckout,
} from "@/services/payment-service";
import type { ShipmentResponse } from "@/types/domain";
const m = vi.hoisted(() => ({ role: "CLIENTE" }));
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    hasRole: (role: string) => role === m.role,
    user: { email_verified: true },
  }),
}));
const shipment = {
  id: "shipment-1",
  status: "PENDIENTE",
  fee: 2300,
} as ShipmentResponse;
const payment = {
  id: null,
  shipmentId: "shipment-1",
  status: "NOT_STARTED",
  amount: 2300,
  currency: "ARS",
  checkoutState: null,
  checkoutUrl: null,
  enabled: true,
  sandbox: true,
  updatedAt: null,
} as const;
beforeEach(() => {
  vi.restoreAllMocks();
  m.role = "CLIENTE";
});
it("no consulta ni permite cobrar si la integración está deshabilitada", async () => {
  const get = vi.spyOn(paymentService, "get");
  render(<ShipmentPayment shipment={shipment} enabled={false} />);
  expect(
    screen.getByRole("button", { name: "Pagar con Mercado Pago" }),
  ).toBeDisabled();
  expect(
    screen.getByText(/El pago online todavía no está disponible/),
  ).toBeInTheDocument();
  await waitFor(() => expect(get).not.toHaveBeenCalled());
});
it("solicita el checkout por identificador sin enviar un precio desde el navegador", async () => {
  vi.spyOn(paymentService, "get").mockResolvedValue(payment);
  const checkout = vi
    .spyOn(paymentService, "checkout")
    .mockRejectedValue(new Error("network"));
  render(<ShipmentPayment shipment={shipment} enabled />);
  await screen.findByText("Sin pago online");
  await userEvent
    .setup()
    .click(screen.getByRole("button", { name: "Pagar con Mercado Pago" }));
  await waitFor(() => expect(checkout).toHaveBeenCalledWith("shipment-1"));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Actualizá el estado",
  );
});
it("muestra la aprobación confirmada por el backend y evita otro pago", async () => {
  vi.spyOn(paymentService, "get").mockResolvedValue({
    ...payment,
    status: "APPROVED",
  });
  render(<ShipmentPayment shipment={shipment} enabled />);
  expect(await screen.findByText("Pago aprobado")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Pagar con Mercado Pago" }),
  ).toBeDisabled();
});
it("bloquea otro pago mientras el proveedor está confirmando el anterior", async () => {
  vi.spyOn(paymentService, "get").mockResolvedValue({
    ...payment,
    status: "PENDING",
    checkoutState: "AWAITING_CONFIRMATION",
  });
  render(<ShipmentPayment shipment={shipment} enabled />);
  await screen.findByText("Pendiente de confirmación");
  expect(
    screen.getByRole("button", { name: "Pagar con Mercado Pago" }),
  ).toBeDisabled();
});
it("oculta la gestión de pagos al repartidor", async () => {
  m.role = "REPARTIDOR";
  const get = vi.spyOn(paymentService, "get");
  render(<ShipmentPayment shipment={shipment} enabled />);
  await waitFor(() => expect(get).not.toHaveBeenCalled());
  expect(
    screen.queryByRole("region", { name: "Pago del envío" }),
  ).not.toBeInTheDocument();
});
it("solo admite redirecciones HTTPS a Mercado Pago", () => {
  expect(
    isMercadoPagoCheckout(
      "https://sandbox.mercadopago.com/checkout?pref_id=123",
    ),
  ).toBe(true);
  expect(isMercadoPagoCheckout("https://mercadopago.com.evil.test/pay")).toBe(
    false,
  );
  expect(isMercadoPagoCheckout("javascript:alert(1)")).toBe(false);
  expect(isMercadoPagoCheckout("https://user:pass@mercadopago.com/pay")).toBe(
    false,
  );
});
