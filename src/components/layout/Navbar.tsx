// src/components/layout/Navbar.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth-service";
import { handleApiError } from "@/types/api-error";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, hasRole, logout } = useAuth();
  const [isResending, setIsResending] = useState(false);

  const handleResendVerification = async () => {
    if (!user?.email) {
      toast.error(
        "No se pudo obtener tu dirección de correo electrónico. Inicia sesión nuevamente.",
      );
      return;
    }

    setIsResending(true);
    try {
      const res = await authService.resendVerification(user.email);
      toast.success(
        res.message ||
          "Enlace de verificación reenviado. Revisa tu bandeja de entrada.",
      );
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/90 text-white backdrop-blur-md">
      {/* Banner de advertencia cuando email_verified == false */}
      {isAuthenticated && user && user.email_verified === false && (
        <div className="border-b border-amber-500/30 bg-amber-500/15 px-6 lg:px-10 py-2.5 text-amber-200 backdrop-blur-sm">
          <div className="flex w-full flex-col items-center justify-between gap-2 sm:flex-row">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <svg
                className="h-4 w-4 shrink-0 text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              <span>
                <strong className="text-amber-300">
                  Cuenta pendiente de confirmación:
                </strong>{" "}
                Tu correo electrónico aún no ha sido verificado. Confirma tu
                cuenta para habilitar todas las operaciones de envío.
              </span>
            </div>

            <button
              type="button"
              onClick={handleResendVerification}
              disabled={isResending}
              className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-sm transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isResending
                ? "Reenviando enlace..."
                : "Reenviar enlace de verificación"}
            </button>
          </div>
        </div>
      )}

      {/* Barra de navegación principal de borde a borde */}
      <div className="flex h-16 w-full items-center justify-between px-6 lg:px-10">
        {/* Marca + Enlaces de Navegación Condicionales por Rol */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition group-hover:bg-blue-500">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">
                LogiTrack
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-widest text-blue-400">
                Logistics Cloud
              </span>
            </div>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1.5">
              {/* Envíos: accesible para CLIENTE, REPARTIDOR y ADMIN */}
              <Link
                href="/shipments"
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  pathname.startsWith("/shipments")
                    ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                Envíos
              </Link>

              {/* Repartidores: accesible solo para ADMIN y REPARTIDOR (oculto para CLIENTE) */}
              {(hasRole("ADMIN") || hasRole("REPARTIDOR")) && (
                <Link
                  href="/couriers"
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                    pathname.startsWith("/couriers")
                      ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Repartidores
                </Link>
              )}

              {/* Administración: accesible exclusivamente para ADMIN */}
              {hasRole("ADMIN") && (
                <Link
                  href="/customers"
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                    pathname.startsWith("/customers")
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Clientes
                </Link>
              )}

              {/* Asistente IA (LogiBot): accesible para usuarios autenticados */}
              <Link
                href="/chat"
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                  pathname.startsWith("/chat")
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                LogiBot IA
              </Link>
            </nav>
          )}
        </div>

        {/* Estado de Sesión, Roles y Botones de Acción */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <span className="text-xs text-slate-400">
              Verificando sesión...
            </span>
          ) : isAuthenticated && user ? (
            <>
              {/* Botón exclusivo para ADMIN */}
              {hasRole("ADMIN") && (
                <Link
                  href="/shipments"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-purple-400/30 bg-purple-500/15 px-3 py-1.5 text-xs font-semibold text-purple-300 transition hover:bg-purple-500/25"
                >
                  Gestionar envíos
                </Link>
              )}

              {/* Información de Usuario y Badges de Rol */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-semibold text-white">
                  {user.name || user.username || user.email || "Usuario Activo"}
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        role === "ADMIN"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                          : role === "REPARTIDOR"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                            : "bg-blue-500/20 text-blue-300 border border-blue-400/30"
                      }`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-rose-500/40 hover:bg-rose-500/20 hover:text-rose-200"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
