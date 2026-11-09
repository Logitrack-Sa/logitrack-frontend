import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it, vi } from "vitest";
import RegisterPage from "@/app/register/page";
import { authService } from "@/services/auth-service";
vi.mock("@/services/auth-service", () => ({
  authService: { register: vi.fn(), resendVerification: vi.fn() },
}));
vi.mock("react-hot-toast", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));
beforeEach(() => vi.clearAllMocks());
it("no registra una cuenta si las contraseñas no coinciden", async () => {
  render(<RegisterPage />);
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Nombre completo"), "Ana Perez");
  await user.type(
    screen.getByLabelText("Correo electrónico"),
    "ana@example.test",
  );
  await user.type(screen.getByLabelText("Contraseña"), "ClaveSegura123");
  await user.type(screen.getByLabelText("Repetir contraseña"), "OtraClave123");
  await user.click(screen.getByRole("button", { name: "Crear mi cuenta" }));
  expect(
    screen.getByText("Las contraseñas deben coincidir."),
  ).toBeInTheDocument();
  expect(authService.register).not.toHaveBeenCalled();
});
it("envía los datos de registro sin añadir la confirmación al contrato del backend", async () => {
  vi.mocked(authService.register).mockResolvedValue({
    id: "fixture",
    email: "ana@example.test",
  } as never);
  render(<RegisterPage />);
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Nombre completo"), "Ana Perez");
  await user.type(
    screen.getByLabelText("Correo electrónico"),
    "ana@example.test",
  );
  await user.type(screen.getByLabelText(/Nombre de usuario/), "ana");
  await user.type(screen.getByLabelText("Contraseña"), "ClaveSegura123");
  await user.type(
    screen.getByLabelText("Repetir contraseña"),
    "ClaveSegura123",
  );
  await user.click(screen.getByRole("button", { name: "Crear mi cuenta" }));
  await waitFor(() =>
    expect(authService.register).toHaveBeenCalledWith({
      name: "Ana Perez",
      email: "ana@example.test",
      username: "ana",
      password: "ClaveSegura123",
    }),
  );
  expect(await screen.findByText("Revisá tu correo")).toBeInTheDocument();
});
