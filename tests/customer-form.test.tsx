import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { customerService } from "@/services/customer-service";
vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));
describe("Alta de clientes", () => {
  it("muestra el error del backend sin cerrar ni perder el formulario", async () => {
    vi.spyOn(customerService, "create").mockRejectedValue({
      response: {
        data: {
          details: [{ field: "email", message: "Correo ya registrado" }],
        },
      },
    });
    const created = vi.fn();
    const user = userEvent.setup();
    render(<CustomerForm onCreated={created} onClose={vi.fn()} />);
    await user.type(screen.getByLabelText("Nombre completo"), "Ana");
    await user.type(
      screen.getByLabelText("Correo electrónico"),
      "ana@example.test",
    );
    await user.click(screen.getByRole("button", { name: "Guardar cliente" }));
    expect(await screen.findByText("Correo ya registrado")).toBeVisible();
    expect(screen.getByLabelText("Correo electrónico")).toHaveValue(
      "ana@example.test",
    );
    expect(created).not.toHaveBeenCalled();
  });
});
