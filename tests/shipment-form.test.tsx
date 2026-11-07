import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { ShipmentForm } from "@/components/shipments/ShipmentForm";
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { email_verified: false, customerId: "own-customer" },
    hasRole: (role: string) => role === "CLIENTE",
  }),
}));
it("impide crear envíos sin correo verificado y no permite elegir un cliente ajeno", () => {
  render(<ShipmentForm />);
  expect(screen.getByRole("button", { name: "Crear envío →" })).toBeDisabled();
  expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  expect(
    screen.getByText("Confirmá tu correo para crear envíos."),
  ).toBeVisible();
});
