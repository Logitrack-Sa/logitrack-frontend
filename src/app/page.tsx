"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { user, isAuthenticated, isLoading, hasRole } = useAuth();

  return (
    <main className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white flex flex-col justify-between">
      {/* Luces difuminadas decorativas en toda la pantalla */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 h-[30rem] w-[30rem] rounded-full bg-blue-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-indigo-500/20 blur-3xl"
      />

      <div className="relative z-10 my-auto w-full px-6 py-12 lg:px-10">
        {/* Hero Superior a pantalla completa */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 border-b border-white/10 pb-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Ecosistema Distribuido LogiTrack • Acceso por API Gateway
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Centro de Control y Operaciones Logísticas
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Plataforma integrada de seguimiento de envíos, administración de
              clientes, disponibilidad de repartidores en tiempo real y
              asistencia inteligente gobernada por control de acceso basado en
              roles (RBAC).
            </p>
          </div>

          {!isLoading && !isAuthenticated && (
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500"
              >
                Iniciar Sesión
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
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                Crear Cuenta de Cliente
              </Link>
            </div>
          )}

          {isAuthenticated && user && (
            <div className="rounded-2xl border border-white/15 bg-white/5 px-5 py-4 backdrop-blur-md shrink-0">
              <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Operador Autenticado
              </span>
              <span className="mt-0.5 block text-base font-bold text-white">
                {user.name || user.username || user.email}
              </span>
              <div className="mt-2 flex items-center gap-1.5">
                {user.roles.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center rounded-md border border-blue-400/30 bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-300"
                  >
                    ROL: {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sección Central: Módulos Operativos con Renderizado Condicional RBAC */}
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <p className="mt-3 text-sm text-slate-300">
              Cargando permisos de sesión...
            </p>
          </div>
        ) : isAuthenticated && user ? (
          <div className="mt-10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-300">
                Módulos Habilitados para tu Perfil ({user.roles.join(", ")})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 1. Envíos: Visible para TODOS los roles autenticados */}
              <Link
                href="/shipments"
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:border-blue-400/50 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
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
                        d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                      />
                    </svg>
                  </div>
                  <span className="rounded-full border border-blue-400/30 bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-blue-300">
                    Todos los Roles
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white group-hover:text-blue-300 transition">
                  Gestión y Tracking de Envíos
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Consultá el listado paginado de paquetes, buscá en tiempo real
                  por código de seguimiento y registrá nuevos envíos.
                </p>
              </Link>

              {/* 2. Repartidores: Visible ÚNICAMENTE para ADMIN o REPARTIDOR (oculto para CLIENTE) */}
              {(hasRole("ADMIN") || hasRole("REPARTIDOR")) && (
                <Link
                  href="/couriers"
                  className="group rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-6 backdrop-blur-md transition hover:border-emerald-400/60 hover:bg-emerald-500/15"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
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
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
                      ADMIN / REPARTIDOR
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white group-hover:text-emerald-300 transition">
                    Flota y Disponibilidad de Repartidores
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Consultá la flota, sus vehículos y su disponibilidad.
                  </p>
                </Link>
              )}

              {/* 3. Administración: Visible EXCLUSIVAMENTE para ADMIN */}
              {hasRole("ADMIN") && (
                <Link
                  href="/customers"
                  className="group rounded-2xl border border-purple-400/25 bg-purple-500/10 p-6 backdrop-blur-md transition hover:border-purple-400/60 hover:bg-purple-500/15"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
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
                    <span className="rounded-full border border-purple-400/30 bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-purple-300">
                      Solo ADMIN
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white group-hover:text-purple-300 transition">
                    Clientes y datos de contacto
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    Registrá clientes y consultá su información para organizar
                    envíos.
                  </p>
                </Link>
              )}

              {/* 4. Asistente IA LogiBot */}
              <Link
                href="/chat"
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:border-indigo-400/50 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
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
                        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                      />
                    </svg>
                  </div>
                  <span className="rounded-full border border-indigo-400/30 bg-indigo-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-indigo-300">
                    Spring AI SSE
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white group-hover:text-indigo-300 transition">
                  Asistente Inteligente LogiBot
                </h3>
                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  Consultá en lenguaje natural el estado de cualquier envío o
                  repartidores disponibles en tiempo real.
                </p>
              </Link>
            </div>
          </div>
        ) : (
          /* Tarjetas informativas cuando NO hay sesión iniciada */
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
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
              <h3 className="mt-4 text-base font-bold text-white">
                Seguridad Perimetral JWT RS256
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Autenticación centralizada con clave asimétrica RSA de 2048 bits
                y verificación obligatoria por correo electrónico.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
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
              <h3 className="mt-4 text-base font-bold text-white">
                Guardias de Navegación RBAC
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                El Middleware de Next.js valida la sesión y normaliza los roles
                (ADMIN, CLIENTE, REPARTIDOR) antes de renderizar cada ruta.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
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
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-base font-bold text-white">
                Caché Redis & Eventos RabbitMQ
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Lecturas aceleradas mediante patrón Cache-Aside y actualización
                reactiva de disponibilidad de flota en tiempo real.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer oscuro unificado */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/40 px-6 lg:px-10 py-4 backdrop-blur-sm">
        <div className="flex w-full flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>© 2026 LogiTrack S.A. — Plataforma de Gestión Logística</span>
          <span>Sprint 4 • Next.js App Router & Spring Cloud Gateway</span>
        </div>
      </footer>
    </main>
  );
}
