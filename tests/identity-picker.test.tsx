import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import { IdentityPicker } from "@/components/accounts/IdentityPicker";
const m = vi.hoisted(() => ({ list: vi.fn(), couriers: vi.fn() }));
vi.mock("@/services/customer-service", () => ({
  customerService: { list: m.list },
}));
vi.mock("@/services/courier-service", () => ({
  courierService: { list: m.couriers },
}));
it("pagina fichas sin enviar el formulario ni cargar repartidores", async () => {
  m.list.mockImplementation(async (page: number) => ({
    content: [
      {
        id: "cliente-" + page,
        name: "Persona " + page,
        email: "persona@example.test",
      },
    ],
    page,
    size: 1,
    totalElements: 2,
    totalPages: 2,
  }));
  const submit = vi.fn();
  const u = userEvent.setup();
  render(
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <IdentityPicker role="CLIENTE" />
    </form>,
  );
  await screen.findByRole("option", { name: /Persona 0/ });
  await u.click(screen.getByRole("button", { name: "Siguiente" }));
  await screen.findByRole("option", { name: /Persona 1/ });
  await u.selectOptions(
    screen.getByLabelText("Cliente a vincular"),
    "cliente-1",
  );
  expect(
    new FormData(
      screen.getByLabelText("Cliente a vincular").closest("form")!,
    ).get("identity"),
  ).toBe("cliente-1");
  expect(submit).not.toHaveBeenCalled();
  expect(m.couriers).not.toHaveBeenCalled();
});
