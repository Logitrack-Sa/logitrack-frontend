// src/app/login/page.tsx
"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { authService } from "@/services/auth-service";
import { decodeSession, safeRedirect, setToken } from "@/lib/session";
import { navigateAfterLogin } from "@/lib/navigation";
import { handleApiError } from "@/types/api-error";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectPath = safeRedirect(searchParams.get("redirect"));
  const sessionExpired = searchParams.get("error") === "session_expired";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      setFormErrors({
        identifier: "Ingresa tu correo electrónico o nombre de usuario.",
      });
      return;
    }
    if (!password) {
      setFormErrors({ password: "Ingresa tu contraseña." });
      return;
    }

    setIsSubmitting(true);

    try {
      const isEmail = trimmedIdentifier.includes("@");
      const payload = isEmail
        ? { email: trimmedIdentifier, password }
        : { username: trimmedIdentifier, password };

      const response = await authService.login(payload);

      if (
        !decodeSession(response.accessToken) ||
        !Number.isFinite(response.expiresIn) ||
        response.expiresIn <= 0
      )
        throw new Error("El servidor no devolvió una sesión válida.");
      setToken(response.accessToken, response.expiresIn);

      toast.success("Inicio de sesión exitoso. Bienvenido a LogiTrack.");
      navigateAfterLogin(redirectPath);
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response
        ?.status;
      if (status === 401)
        toast.error("Correo, usuario o contraseña incorrectos.");
      else {
        handleApiError(error, setFormErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const identifierError =
    formErrors.identifier || formErrors.email || formErrors.username;

  return (
    <>
      {sessionExpired && (
        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-800">
          <svg
            className="h-4 w-4 shrink-0 text-amber-600 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <span>
            Tu sesión ha expirado. Por favor vuelve a iniciar sesión para
            continuar.
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        <div>
          <label
            htmlFor="identifier"
            className="block text-sm font-medium text-slate-700"
          >
            Correo electrónico o usuario
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
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Tu correo o nombre de usuario"
              className={`block w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
                identifierError
                  ? "border-rose-500 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-200"
                  : "border-slate-300 bg-slate-50/50 focus:bg-white focus:border-green-600 focus:ring-green-100"
              }`}
            />
          </div>
          {identifierError && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">
              {identifierError}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Contraseña
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`block w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 ${
                formErrors.password
                  ? "border-rose-500 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-200"
                  : "border-slate-300 bg-slate-50/50 focus:bg-white focus:border-green-600 focus:ring-green-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
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
            <p className="mt-1.5 text-xs font-medium text-rose-600">
              {formErrors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-green-600/20 transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Iniciando sesión...
            </>
          ) : (
            <>
              Ingresar a la plataforma
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

      <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-600">
        ¿Todavía no tenés una cuenta?{" "}
        <Link
          href="/register"
          className="font-semibold text-green-600 hover:text-green-700 hover:underline"
        >
          Registrate gratis acá
        </Link>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthSplitLayout
      badgeText="Mi cuenta"
      title="Bienvenido de nuevo"
      subtitle="Ingresá a tu cuenta para gestionar y consultar tus envíos."
    >
      <Suspense
        fallback={
          <div className="mt-6 py-8 text-center text-sm text-slate-500">
            Cargando formulario de acceso...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
