"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { authService } from "@/services/auth-service";
import { clearSession } from "@/lib/session";

export function PasswordRecoveryForm({ reset = false }: { reset?: boolean }) {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(!reset);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reset) return;
    const readToken = () => {
      const value = new URLSearchParams(window.location.hash.slice(1)).get(
        "token",
      );
      setToken(value && /^[A-Za-z0-9_-]{43}$/.test(value) ? value : null);
      setDone(false);
      setError("");
      // El fragmento no viaja al servidor ni se incluye en Referer.
      setReady(true);
    };
    readToken();
    window.addEventListener("hashchange", readToken);
    return () => window.removeEventListener("hashchange", readToken);
  }, [reset]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") || "");
    setError("");
    if (reset && password !== data.get("confirmation")) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (reset && new TextEncoder().encode(password).length > 72) {
      setError("La contraseña no debe superar 72 bytes.");
      return;
    }
    setPending(true);
    try {
      if (reset) {
        await authService.resetPassword(token!, password);
        clearSession();
        window.history.replaceState(null, "", window.location.pathname);
      } else {
        await authService.forgotPassword(
          String(data.get("email") || "").trim(),
        );
      }
      setDone(true);
    } catch (failure) {
      const response = (failure as AxiosError<{ detail?: string }>).response;
      setError(
        response?.status === 429
          ? "Demasiadas solicitudes. Esperá un minuto e intentá otra vez."
          : reset && response?.status === 400
            ? "El enlace no es válido, venció o ya fue utilizado. Solicitá uno nuevo."
            : "No pudimos completar la solicitud. Intentá nuevamente.",
      );
    } finally {
      setPending(false);
    }
  }

  if (!ready) return <p className="mt-6 text-sm">Cargando formulario…</p>;

  return (
    <div className="mt-6 space-y-5">
      {done ? (
        <p
          role="status"
          className="rounded-xl bg-green-50 p-4 text-sm text-green-900"
        >
          {reset
            ? "Contraseña actualizada. Ya podés iniciar sesión con la nueva contraseña."
            : "Si la cuenta está activa, recibirás un enlace por correo. Revisá también la carpeta de spam. El enlace dura 15 minutos."}
        </p>
      ) : reset && !token ? (
        <p
          role="alert"
          className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900"
        >
          El enlace está incompleto o no es válido. Solicitá uno nuevo.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          {reset ? (
            <>
              <div>
                <label
                  htmlFor="recovery-password"
                  className="block text-sm font-medium text-slate-700"
                >
                  Nueva contraseña
                </label>
                <input
                  id="recovery-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={72}
                  aria-describedby="recovery-password-hint"
                  className="mt-1.5 block w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
                <p
                  id="recovery-password-hint"
                  className="mt-1.5 text-xs text-slate-500"
                >
                  Entre 8 y 72 caracteres.
                </p>
              </div>
              <div>
                <label
                  htmlFor="recovery-confirmation"
                  className="block text-sm font-medium text-slate-700"
                >
                  Repetir contraseña
                </label>
                <input
                  id="recovery-confirmation"
                  name="confirmation"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={72}
                  className="mt-1.5 block w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
                />
              </div>
            </>
          ) : (
            <div>
              <label
                htmlFor="recovery-email"
                className="block text-sm font-medium text-slate-700"
              >
                Correo electrónico
              </label>
              <input
                id="recovery-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                className="mt-1.5 block w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-100"
              />
            </div>
          )}
          {error && (
            <p role="alert" className="text-sm text-rose-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
          >
            {pending
              ? "Procesando…"
              : reset
                ? "Guardar contraseña"
                : "Enviar enlace"}
          </button>
        </form>
      )}
      {reset && !done && (
        <Link
          href="/forgot-password"
          className="block text-sm font-semibold text-green-600 hover:underline"
        >
          Solicitar otro enlace
        </Link>
      )}
      <Link
        href="/login"
        className="block text-sm font-semibold text-green-600 hover:underline"
      >
        Volver a iniciar sesión
      </Link>
    </div>
  );
}
