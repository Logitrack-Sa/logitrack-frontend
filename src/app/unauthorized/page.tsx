// src/app/unauthorized/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  return (
    <AuthSplitLayout
      badgeText="Código HTTP 403 — Control RBAC"
      title="Acceso Restringido por Rol"
      subtitle="Tu sesión es válida, pero tu perfil actual no dispone de los privilegios necesarios para ingresar a este módulo."
    >
      <div className="mt-6 space-y-5">
        <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-5 text-sm text-rose-950">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
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
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-base text-rose-900">
                Permisos insuficientes
              </p>
              <p className="text-xs text-rose-700 mt-0.5">
                Protección perimetral de rutas (Next.js Edge Middleware)
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-rose-800 leading-relaxed">
            La sección solicitada está reservada para operadores con rol{" "}
            <span className="font-semibold">ADMIN</span> o{" "}
            <span className="font-semibold">REPARTIDOR</span>. Si necesitás
            acceso, contactá al administrador del sistema.
          </p>
        </div>

        {user && (
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-700 space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
              <span className="font-medium text-slate-500">
                Identidad autenticada:
              </span>
              <span className="font-semibold text-slate-900">
                {user.email || user.username || user.sub}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-500">
                Roles en tu token JWT:
              </span>
              <div className="flex items-center gap-1.5">
                {user.roles.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center rounded-md bg-green-100 px-2 py-0.5 text-[11px] font-bold uppercase text-green-800"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-green-600/20 transition hover:bg-green-700"
          >
            Volver al Panel Principal
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
          </Link>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Cerrar sesión y cambiar de cuenta
          </button>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
