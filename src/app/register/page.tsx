"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  AtSign,
  Check,
  CircleCheck,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { authService } from "@/services/auth-service";
import { handleApiError } from "@/types/api-error";
import type { UserResponse } from "@/types/domain";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { AuthInput } from "@/components/auth/AuthInput";
export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [registered, setRegistered] = useState<UserResponse>();
  const [resending, setResending] = useState(false);
  const update =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm({ ...form, [field]: e.target.value });
      setErrors((current) => ({ ...current, [field]: "" }));
    };
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Ingresá tu nombre completo.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Ingresá un correo electrónico válido.";
    if (form.password.length < 8) next.password = "Usá al menos 8 caracteres.";
    if (form.password !== form.confirmPassword || !form.confirmPassword)
      next.confirmPassword = "Las contraseñas deben coincidir.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      const user = await authService.register({
        name: form.name.trim(),
        email: form.email.trim(),
        username: form.username.trim() || undefined,
        password: form.password,
      });
      setRegistered(user);
      setForm({ ...form, password: "", confirmPassword: "" });
      toast.success("Cuenta creada. Revisá tu correo para activarla.");
    } catch (error) {
      handleApiError(error, setErrors);
    } finally {
      setBusy(false);
    }
  }
  async function resend() {
    if (!registered) return;
    setResending(true);
    try {
      await authService.resendVerification(registered.email);
      toast.success(
        "Si la cuenta requiere verificación, recibirás un nuevo enlace.",
      );
    } catch (error) {
      handleApiError(error);
    } finally {
      setResending(false);
    }
  }
  return (
    <AuthSplitLayout
      variant="register"
      badgeText="TU CUENTA, TU PRÓXIMO DESTINO"
      title="Empecemos el recorrido."
      subtitle="Creá tu cuenta y organizá tus envíos a tu manera."
    >
      {registered ? (
        <div className="auth-success" role="status">
          <span className="auth-success-icon">
            <CircleCheck size={29} />
          </span>
          <h2>Revisá tu correo</h2>
          <p>
            Solicitamos el envío de un enlace a{" "}
            <strong>{registered.email}</strong>. Abrilo para activar tu cuenta y
            empezar a crear envíos.
          </p>
          <p className="auth-field-hint">
            Si no lo encontrás, revisá la carpeta de spam o solicitá otro
            enlace.
          </p>
          <Link href="/login" className="auth-submit">
            Ir a iniciar sesión
            <ArrowRight size={17} />
          </Link>
          <button
            type="button"
            className="auth-resend"
            disabled={resending}
            onClick={resend}
          >
            {resending
              ? "Solicitando enlace…"
              : "Reenviar enlace de verificación"}
          </button>
        </div>
      ) : (
        <form className="auth-register-form" onSubmit={submit} noValidate>
          <AuthInput
            id="register-name"
            label="Nombre completo"
            icon={UserRound}
            autoComplete="name"
            placeholder="María González"
            value={form.name}
            onChange={update("name")}
            required
            maxLength={200}
            error={errors.name}
          />
          <AuthInput
            id="register-email"
            label="Correo electrónico"
            icon={Mail}
            type="email"
            autoComplete="email"
            placeholder="nombre@ejemplo.com"
            value={form.email}
            onChange={update("email")}
            required
            maxLength={254}
            error={errors.email}
          />
          <AuthInput
            id="register-username"
            label="Nombre de usuario"
            icon={AtSign}
            autoComplete="username"
            placeholder="Elegí cómo querés ingresar"
            value={form.username}
            onChange={update("username")}
            maxLength={100}
            error={errors.username}
          />
          <AuthInput
            id="register-password"
            label="Contraseña"
            icon={LockKeyhole}
            passwordField
            autoComplete="new-password"
            placeholder="Al menos 8 caracteres"
            value={form.password}
            onChange={update("password")}
            required
            maxLength={100}
            error={errors.password}
          />
          <AuthInput
            id="register-confirm"
            label="Repetir contraseña"
            icon={LockKeyhole}
            passwordField
            autoComplete="new-password"
            placeholder="Volvé a escribir tu contraseña"
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            required
            maxLength={100}
            error={errors.confirmPassword}
          />
          {form.password.length >= 8 &&
            form.confirmPassword === form.password && (
              <p className="auth-password-match">
                <Check size={13} />
                Las contraseñas coinciden
              </p>
            )}
          <button type="submit" className="auth-submit" disabled={busy}>
            {busy ? "Creando tu cuenta…" : "Crear mi cuenta"}
            <ArrowRight size={17} />
          </button>
          <p className="auth-register-note">
            <Check size={13} />
            Verificá tu correo y empezá. Sin trámites adicionales.
          </p>
        </form>
      )}
      <p className="auth-switch">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login">
          Iniciá sesión
          <ArrowRight size={14} />
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
