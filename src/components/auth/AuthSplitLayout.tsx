// src/components/auth/AuthSplitLayout.tsx
import React from "react";
import Link from "next/link";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  badgeText?: string;
}

export function AuthSplitLayout({
  children,
  title,
  subtitle,
  badgeText = "Portal de Acceso Seguro",
}: AuthSplitLayoutProps) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white flex flex-col justify-between">
      {/* Luces difuminadas decorativas en toda la pantalla */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-blue-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-indigo-500/20 blur-3xl"
      />

      <div className="relative z-10 my-auto w-full px-6 py-10 lg:px-12 xl:px-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Columna Izquierda (7 columnas en desktop): Hero Corporativo LogiTrack */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Plataforma Logística de Nueva Generación • Acceso por API Gateway
          </div>

          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-white leading-tight">
            Control integral de envíos, flotas y trazabilidad en tiempo real.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Conectamos clientes, operadores y repartidores sobre una
            arquitectura de microservicios distribuida con seguridad
            criptográfica RS256, caché acelerada en Redis y asistencia
            inteligente.
          </p>

          {/* Tarjetas de beneficios / features sobre el fondo oscuro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-2xl">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
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
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">
                Seguridad JWT RS256 & RBAC
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Identidad verificada por correo electrónico y guardias de acceso
                por rol en el servidor.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
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
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">
                Tracking Instantáneo
              </h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Monitoreo de estados de paquetes y disponibilidad de mensajeros
                sincronizados por eventos.
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha (5 columnas en desktop): Tarjeta del Formulario */}
        <div className="lg:col-span-5 w-full">
          <div className="rounded-2xl border border-white/15 bg-white p-8 sm:p-10 text-slate-900 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                {badgeText}
              </span>
              <Link
                href="/"
                className="text-xs font-medium text-slate-500 hover:text-blue-600 transition"
              >
                ← Volver al inicio
              </Link>
            </div>

            <h1 className="mt-3.5 text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">{subtitle}</p>

            {children}
          </div>
        </div>
      </div>

      {/* Pie de página unificado en toda la pantalla */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/40 px-6 lg:px-10 py-4 backdrop-blur-sm">
        <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>© 2026 LogiTrack S.A. — Plataforma de Gestión Logística</span>
          <span>
            Conexión protegida vía API Gateway (localhost:8080) • RFC 7807 & JWT
          </span>
        </div>
      </footer>
    </div>
  );
}
