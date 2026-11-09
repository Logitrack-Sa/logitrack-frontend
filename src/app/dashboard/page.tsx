"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCheck,
  Clock3,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Truck,
  CalendarDays,
  ShieldCheck,
} from "lucide-react";
import { shipmentService } from "@/services/shipment-service";
import { useAuth } from "@/hooks/useAuth";
import type { ShipmentResponse, ShipmentStatus } from "@/types/domain";
import {
  ShipmentDistribution,
  shipmentStates,
} from "@/components/dashboard/ShipmentDistribution";
import { RecentShipments } from "@/components/dashboard/RecentShipments";
import { withBasePath } from "@/lib/deployment";
export default function Dashboard() {
  const { user, ready, hasRole } = useAuth();
  const [pages, setPages] = useState<ShipmentResponse[][]>([]);
  const [counts, setCounts] = useState<number[]>([]);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(true);
  const [revision, setRevision] = useState(0);
  const [filter, setFilter] = useState(0);
  const [updatedAt, setUpdatedAt] = useState<Date>();
  useEffect(() => {
    if (!ready || !user) return;
    const c = new AbortController();
    setBusy(true);
    setError(false);
    Promise.all([
      shipmentService.list(0, undefined, c.signal),
      ...shipmentStates.map((s) =>
        shipmentService.list(0, s.status as ShipmentStatus, c.signal),
      ),
    ])
      .then(([all, ...states]) => {
        if (c.signal.aborted) return;
        setPages([all.content, ...states.map((p) => p.content)]);
        setCounts(states.map((p) => p.totalElements));
        setUpdatedAt(new Date());
      })
      .catch(() => {
        if (!c.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!c.signal.aborted) setBusy(false);
      });
    return () => c.abort();
  }, [ready, user?.sub, revision]);
  const total = counts.reduce((a, b) => a + b, 0);
  const canCreate = hasRole("ADMIN") || hasRole("CLIENTE");
  const metrics = [
    {
      label: "Total de envíos",
      value: total,
      icon: Package,
      href: "/shipments",
      tone: "neutral",
      caption: "Toda tu actividad",
    },
    {
      label: "Pendientes",
      value: counts[0],
      icon: Clock3,
      href: "/shipments?status=PENDIENTE",
      tone: "amber",
      caption: "Por comenzar su recorrido",
    },
    {
      label: "En ruta",
      value: counts[1],
      icon: Truck,
      href: "/shipments?status=EN_RUTA",
      tone: "blue",
      caption: "Camino a su destino",
    },
    {
      label: "Entregados",
      value: counts[2],
      icon: CheckCheck,
      href: "/shipments?status=ENTREGADO",
      tone: "green",
      caption: "Recorridos completados",
    },
  ];
  const greeting = user?.name?.split(" ")[0] || user?.username;
  return (
    <div className="ops-dashboard">
      <div className="ops-page-heading">
        <div>
          <p className="ops-kicker">TU CENTRO DE OPERACIONES</p>
          <h1>
            Resumen general<span>.</span>
          </h1>
          <p>
            {greeting ? `Hola, ${greeting}. ` : "Bienvenido. "}Esto es lo que
            pasa con tus envíos.
          </p>
        </div>
        <div className="ops-heading-actions">
          <button
            className="ops-refresh"
            disabled={busy}
            aria-label="Actualizar resumen"
            onClick={() => setRevision((v) => v + 1)}
          >
            <RefreshCw size={17} className={busy ? "ops-spinning" : ""} />
          </button>
          {canCreate && (
            <Link href="/shipments/new" className="button">
              <Plus size={17} />
              Nuevo envío
            </Link>
          )}
        </div>
      </div>
      <div className="ops-overview-meta">
        <span>
          <CalendarDays size={15} />
          {new Date().toLocaleDateString("es-AR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </span>
        <span>
          {updatedAt && !busy
            ? `Actualizado a las ${updatedAt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`
            : "Consultando actividad"}
        </span>
      </div>
      {error ? (
        <section className="ops-panel ops-error" role="alert">
          <Package size={24} />
          <h2>No pudimos cargar el resumen</h2>
          <p>Revisá tu conexión y volvé a intentarlo.</p>
          <button
            className="button secondary"
            onClick={() => setRevision((v) => v + 1)}
          >
            Reintentar
          </button>
        </section>
      ) : (
        <>
          <section className="ops-metrics" aria-label="Resumen de envíos">
            {metrics.map(
              ({ label, value, icon: Icon, href, tone, caption }) => (
                <Link
                  href={href}
                  key={label}
                  className={"ops-metric ops-tone-" + tone}
                >
                  <div>
                    <span>{label}</span>
                    <span className="ops-metric-icon">
                      <Icon size={19} strokeWidth={1.7} />
                    </span>
                  </div>
                  <strong>{busy ? "—" : value || 0}</strong>
                  <footer>
                    <span>{caption}</span>
                    <ArrowUpRight size={15} />
                  </footer>
                </Link>
              ),
            )}
          </section>
          <div className="ops-dashboard-columns">
            <div className="ops-dashboard-primary">
              <section className="ops-welcome-card">
                <div>
                  <span className="ops-welcome-label">
                    <Package size={14} />
                    DE ORIGEN A DESTINO
                  </span>
                  <h2>
                    {canCreate
                      ? "Tu próxima entrega empieza acá."
                      : "Cada entrega, un paso más cerca."}
                  </h2>
                  <p>
                    {canCreate
                      ? "Cargá los datos del paquete. Nosotros te ayudamos a seguir su recorrido."
                      : "Consultá tus envíos asignados y acompañá cada etapa del recorrido."}
                  </p>
                  <Link href={canCreate ? "/shipments/new" : "/shipments"}>
                    {canCreate ? "Preparar un envío" : "Ver mis envíos"}
                    <ArrowRight size={16} />
                  </Link>
                </div>
                <img
                  src={withBasePath("/images/dispatch.jpg")}
                  alt="Paquetes organizados en un centro de distribución"
                />
              </section>
              <section className="ops-panel ops-recent">
                <div className="ops-section-title">
                  <div>
                    <h2>Últimos envíos</h2>
                    <p>Los movimientos de tu operación, en un lugar.</p>
                  </div>
                  <Link href="/shipments" className="ops-text-link">
                    Ver todos <ArrowUpRight size={15} />
                  </Link>
                </div>
                <div className="ops-tabs" aria-label="Filtrar últimos envíos">
                  {["Todos", "Pendientes", "En ruta", "Entregados"].map(
                    (label, i) => (
                      <button
                        key={label}
                        aria-pressed={filter === i}
                        onClick={() => setFilter(i)}
                      >
                        {label}
                        <span>
                          {busy ? "—" : i === 0 ? total : counts[i - 1] || 0}
                        </span>
                      </button>
                    ),
                  )}
                </div>
                <RecentShipments
                  rows={pages[filter] || []}
                  busy={busy}
                  canCreate={canCreate}
                />
              </section>
            </div>
            <div className="ops-dashboard-secondary">
              <ShipmentDistribution counts={counts} busy={busy} />
              <section className="ops-tracking-card">
                <span className="ops-tracking-icon">
                  <MapPin size={23} strokeWidth={1.5} />
                </span>
                <h2>¿Dónde está tu paquete?</h2>
                <p>
                  Con un código alcanza para consultar su recorrido. Compartilo
                  con quien lo espera.
                </p>
                <Link href="/seguimiento">
                  Consultar seguimiento <ArrowUpRight size={16} />
                </Link>
              </section>
            </div>
          </div>
          <footer className="ops-dashboard-footer">
            <span>
              <ShieldCheck size={14} />
              Tu cuenta. Tus envíos. Todo conectado.
            </span>
            <Link href="/ayuda">
              ¿Necesitás ayuda?
              <ArrowUpRight size={13} />
            </Link>
          </footer>
        </>
      )}
    </div>
  );
}
