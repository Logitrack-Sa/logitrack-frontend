"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { shipmentService } from "@/services/shipment-service";
import { useAuth } from "@/hooks/useAuth";
import type { ShipmentResponse, ShipmentStatus } from "@/types/domain";
const states: ShipmentStatus[] = [
  "PENDIENTE",
  "EN_RUTA",
  "ENTREGADO",
  "CANCELADO",
];
const labels = {
  PENDIENTE: "Pendientes",
  EN_RUTA: "En ruta",
  ENTREGADO: "Entregados",
  CANCELADO: "Cancelados",
};
export default function Dashboard() {
  const { user, ready, hasRole } = useAuth();
  const [rows, setRows] = useState<ShipmentResponse[]>([]);
  const [counts, setCounts] = useState<number[]>([]);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!ready || !user) return;
    const c = new AbortController();
    setBusy(true);
    setError(false);
    Promise.all([
      shipmentService.list(0, undefined, c.signal),
      ...states.map((s) => shipmentService.list(0, s, c.signal)),
    ])
      .then(([all, ...pages]) => {
        if (c.signal.aborted) return;
        setRows(all.content);
        setCounts(pages.map((p) => p.totalElements));
      })
      .catch(() => {
        if (!c.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!c.signal.aborted) setBusy(false);
      });
    return () => c.abort();
  }, [ready, user?.sub, revision]);
  const icons = [Clock3, Truck, CheckCircle2, Package];
  const total = counts.reduce((a, b) => a + b, 0);
  return (
    <>
      <div className="page-header">
        <div>
          <p className="eyebrow">TU OPERACIÓN, A SIMPLE VISTA</p>
          <h1>Todo en movimiento.</h1>
          <p>Bienvenido a tu centro de operaciones. Cada envío cuenta.</p>
        </div>
        <div className="actions">
          <button
            className="button secondary"
            disabled={busy}
            onClick={() => setRevision((v) => v + 1)}
          >
            <RefreshCw size={16} /> Actualizar
          </button>
          {(hasRole("ADMIN") || hasRole("CLIENTE")) && (
            <Link href="/shipments/new" className="button">
              + Nuevo envío
            </Link>
          )}
        </div>
      </div>
      {error ? (
        <p role="alert" className="card">
          No pudimos cargar el resumen. Podés reintentar con Actualizar.
        </p>
      ) : (
        <>
          <section className="metric-grid" aria-label="Resumen de envíos">
            {states.map((s, i) => {
              const Icon = icons[i];
              return (
                <Link
                  key={s}
                  href={"/shipments?status=" + s}
                  className="metric-card"
                >
                  <span className={"metric-icon tone-" + i}>
                    <Icon size={21} />
                  </span>
                  <p>{labels[s]}</p>
                  <strong>{busy ? "—" : (counts[i] ?? 0)}</strong>
                  <span className="metric-link">
                    Ver envíos <ArrowUpRight size={15} />
                  </span>
                </Link>
              );
            })}
          </section>
          <div className="dashboard-grid">
            <section className="card">
              <div className="section-heading">
                <div>
                  <h2>Últimos envíos</h2>
                  <p>La actividad más reciente de tu cuenta.</p>
                </div>
                <Link href="/shipments">Ver todos →</Link>
              </div>
              {busy ? (
                <p role="status">Cargando actividad…</p>
              ) : rows.length ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Seguimiento</th>
                        <th>Destino</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.slice(0, 6).map((s) => (
                        <tr key={s.id}>
                          <td>
                            <Link href={"/shipments/" + s.id}>
                              {s.trackingCode}
                            </Link>
                          </td>
                          <td>{s.destination.city}</td>
                          <td>
                            <span className="badge">{labels[s.status]}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>Todavía no hay envíos para mostrar.</p>
              )}
            </section>
            <section className="card distribution">
              <p className="eyebrow">DISTRIBUCIÓN</p>
              <h2>El pulso de tus entregas</h2>
              <p>{busy ? "Cargando…" : total + " envíos en total"}</p>
              {states.map((s, i) => (
                <div key={s} className="distribution-row">
                  <div>
                    <span>{labels[s]}</span>
                    <strong>{busy ? "—" : (counts[i] ?? 0)}</strong>
                  </div>
                  <div className="progress-track">
                    <div
                      style={{
                        width: total
                          ? ((counts[i] || 0) / total) * 100 + "%"
                          : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
              <p className="muted">
                Datos consultados a los servicios de LogiTrack.
              </p>
            </section>
          </div>
        </>
      )}
    </>
  );
}
