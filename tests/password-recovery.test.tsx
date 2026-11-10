import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { PasswordRecoveryForm } from "@/components/auth/PasswordRecoveryForm";
import { authService } from "@/services/auth-service";
import { clearSession } from "@/lib/session";

vi.mock("@/lib/session", () => ({ clearSession: vi.fn() }));
afterEach(() => {
  vi.restoreAllMocks();
  window.history.replaceState(null, "", "/");
});

it("solicita por correo y muestra una respuesta sin revelar cuentas", async () => {
  const request = vi
    .spyOn(authService, "forgotPassword")
    .mockResolvedValue({ message: "Solicitud recibida" });
  render(<PasswordRecoveryForm />);
  const user = userEvent.setup();
  await user.type(
    screen.getByLabelText("Correo electrónico"),
    "persona@example.test",
  );
  await user.click(screen.getByRole("button", { name: "Enviar enlace" }));
  expect(request).toHaveBeenCalledWith("persona@example.test");
  expect(await screen.findByRole("status")).toHaveTextContent(
    "Si la cuenta está activa",
  );
});

it("impide enviar contraseñas diferentes y consume el enlace sin iniciar sesión automáticamente", async () => {
  const token = "a".repeat(43);
  window.history.replaceState(null, "", "/reset-password#token=" + token);
  const reset = vi.spyOn(authService, "resetPassword").mockResolvedValue();
  render(<PasswordRecoveryForm reset />);
  const user = userEvent.setup();
  await user.type(
    await screen.findByLabelText("Nueva contraseña"),
    "new-password-123",
  );
  await user.type(
    screen.getByLabelText("Repetir contraseña"),
    "other-password",
  );
  await user.click(screen.getByRole("button", { name: "Guardar contraseña" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("no coinciden");
  expect(reset).not.toHaveBeenCalled();
  await user.clear(screen.getByLabelText("Repetir contraseña"));
  await user.type(
    screen.getByLabelText("Repetir contraseña"),
    "new-password-123",
  );
  await user.click(screen.getByRole("button", { name: "Guardar contraseña" }));
  await waitFor(() =>
    expect(reset).toHaveBeenCalledWith(token, "new-password-123"),
  );
  expect(await screen.findByRole("status")).toHaveTextContent(
    "Contraseña actualizada",
  );
  expect(clearSession).toHaveBeenCalled();
  expect(window.location.hash).toBe("");
});

it("rechaza enlaces incompletos sin llamar al backend", async () => {
  const reset = vi.spyOn(authService, "resetPassword");
  render(<PasswordRecoveryForm reset />);
  expect(await screen.findByRole("alert")).toHaveTextContent("incompleto");
  expect(
    screen.queryByRole("button", { name: "Guardar contraseña" }),
  ).not.toBeInTheDocument();
  expect(reset).not.toHaveBeenCalled();
});

it("ofrece solicitar otro enlace cuando el anterior venció", async () => {
  window.history.replaceState(
    null,
    "",
    "/reset-password#token=" + "a".repeat(43),
  );
  vi.spyOn(authService, "resetPassword").mockRejectedValue({
    response: { status: 400 },
  });
  render(<PasswordRecoveryForm reset />);
  const user = userEvent.setup();
  await user.type(
    await screen.findByLabelText("Nueva contraseña"),
    "new-password-123",
  );
  await user.type(
    screen.getByLabelText("Repetir contraseña"),
    "new-password-123",
  );
  await user.click(screen.getByRole("button", { name: "Guardar contraseña" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "venció o ya fue utilizado",
  );
  expect(
    screen.getByRole("link", { name: "Solicitar otro enlace" }),
  ).toHaveAttribute("href", "/forgot-password");
});
