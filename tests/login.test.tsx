import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it, vi } from "vitest";
import LoginPage from "@/app/login/page";
import { authService } from "@/services/auth-service";
import { setToken } from "@/lib/session";
const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams("redirect=%2Fshipments"),
}));
vi.mock("react-hot-toast", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));
vi.mock("@/lib/session", async (original) => ({
  ...(await original<typeof import("@/lib/session")>()),
  setToken: vi.fn(),
}));
it("reutiliza el login de Pablo, admite usuario y respeta expiresIn", async () => {
  const accessToken = `${btoa("{}")}.${btoa(JSON.stringify({ sub: "user", roles: ["ADMIN"], exp: Date.now() / 1000 + 3600 }))}.test`;
  const login = vi
    .spyOn(authService, "login")
    .mockResolvedValue({ accessToken, tokenType: "Bearer", expiresIn: 3600 });
  const user = userEvent.setup();
  render(<LoginPage />);
  await user.type(
    screen.getByLabelText("Correo electrónico o usuario"),
    "local-admin",
  );
  await user.type(screen.getByLabelText("Contraseña"), "test-only-password");
  await user.click(
    screen.getByRole("button", { name: "Ingresar a la plataforma" }),
  );
  await waitFor(() => expect(push).toHaveBeenCalledWith("/shipments"));
  expect(login).toHaveBeenCalledWith({
    username: "local-admin",
    password: "test-only-password",
  });
  expect(setToken).toHaveBeenCalledWith(accessToken, 3600);
});
