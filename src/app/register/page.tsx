// src/app/register/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { authService } from "@/services/auth-service";
import { handleApiError } from "@/types/api-error";
import { UserResponse } from "@/types/domain";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<UserResponse | null>(
    null,
  );
  const [isResending, setIsResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});

    const localErrors: Record<string, string> = {};
    if (!email.trim()) {
      localErrors.email = "El correo electrónico es obligatorio.";
    }
    if (!password || password.length < 8) {
      localErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }
    if (Object.keys(localErrors).length > 0) {
      setFormErrors(localErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.register({
        email: email.trim(),
        password,
        username: username.trim() || undefined,
        name: name.trim() || undefined,
      });

      setRegisteredUser(response);
      toast.success(
        "Registro completado. Revisa tu bandeja de entrada para activar tu cuenta.",
      );
    } catch (error) {
      handleApiError(error, setFormErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    const targetEmail = registeredUser?.email || email.trim();
    if (!targetEmail) return;

    setIsResending(true);
    try {
      const res = await authService.resendVerification(targetEmail);
      toast.success(
        res.message ||
          "Se ha enviado un nuevo enlace de activación a tu correo.",
      );
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthSplitLayout
      badgeText="Alta de Clientes"
      title="Crear Cuenta en LogiTrack"
      subtitle="Registrate para cotizar, despachar y hacer seguimiento de tus envíos en vivo."
    >
      {registeredUser ? (
        <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-5 text-sm text-emerald-950">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </div>
              <p className="font-semibold text-base text-emerald-900">
                ¡Tu cuenta fue registrada con éxito!
              </p>
            </div>
            <p className="mt-3 text-emerald-800 leading-relaxed">
              Enviamos un correo electrónico con tu enlace único de activación a{" "}
              <span className="font-semibold underline">
                {registeredUser.email}
              </span>
              . Por favor revisá tu bandeja de entrada (o carpeta de spam) y
              hacé clic en el enlace para habilitar tu cuenta.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleResendEmail}
              disabled={isResending}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isResending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-600 border-t-transparent" />
                  Reenviando correo...
                </>
              ) : (
                "Reenviar enlace de verificación"
              )}
            </button>

            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Ir a Iniciar Sesión
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Nombre completo
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="María González"
                  className={`block w-full rounded-xl border pl-9 pr-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
                    formErrors.name
                      ? "border-rose-500 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-200"
                      : "border-slate-300 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-blue-100"
                  }`}
                />
              </div>
              {formErrors.name && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {formErrors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-700"
              >
                Usuario
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <span className="text-xs font-bold">@</span>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="mariagonzalez"
                  className={`block w-full rounded-xl border pl-8 pr-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
                    formErrors.username
                      ? "border-rose-500 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-200"
                      : "border-slate-300 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-blue-100"
                  }`}
                />
              </div>
              {formErrors.username && (
                <p className="mt-1 text-xs font-medium text-rose-600">
                  {formErrors.username}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Correo electrónico <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente.nuevo@gmail.com"
                className={`block w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
                  formErrors.email
                    ? "border-rose-500 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-200"
                    : "border-slate-300 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-blue-100"
                }`}
              />
            </div>
            {formErrors.email && (
              <p className="mt-1 text-xs font-medium text-rose-600">
                {formErrors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              Contraseña <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres (ej. Password123!)"
                className={`block w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
                  formErrors.password
                    ? "border-rose-500 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-200"
                    : "border-slate-300 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-blue-100"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {formErrors.password && (
              <p className="mt-1 text-xs font-medium text-rose-600">
                {formErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Registrando cuenta...
              </>
            ) : (
              <>
                Crear cuenta ahora
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </>
            )}
          </button>
        </form>
      )}

      <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
        ¿Ya tenés una cuenta registrada?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Iniciá sesión acá
        </Link>
      </div>
    </AuthSplitLayout>
  );
}
