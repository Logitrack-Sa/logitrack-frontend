"use client";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin, PackageOpen } from "lucide-react";
import type { ShipmentResponse } from "@/types/domain";
import { shipmentStates } from "./ShipmentDistribution";
export function RecentShipments({
  rows,
  busy,
  canCreate,
}: {
  rows: ShipmentResponse[];
  busy: boolean;
  canCreate: boolean;
}) {
  if (busy)
    return (
      <div className="ops-table-loading" role="status">
        <span className="ops-skeleton" />
        <span className="ops-skeleton" />
        <span className="ops-skeleton" />
        <p>Cargando envíos…</p>
      </div>
    );
  if (!rows.length)
    return (
      <div className="ops-empty">
        <span className="ops-empty-icon">
          <PackageOpen size={32} strokeWidth={1.3} />
        </span>
        <h3>Todavía no hay envíos por acá</h3>
        <p>
          {canCreate
            ? "Registrá tu primer paquete y seguí cada paso de su recorrido desde este lugar."
            : "Los envíos que tengas asignados aparecerán en este espacio."}
        </p>
        {canCreate && (
          <Link className="button secondary" href="/shipments/new">
            Crear un envío <ArrowUpRight size={15} />
          </Link>
        )}
      </div>
    );
  return (
    <div className="ops-table-wrap">
      <table className="ops-table">
        <thead>
          <tr>
            <th>Envío</th>
            <th>Recorrido</th>
            <th>Estado</th>
            <th>Tarifa</th>
            <th>
              <span className="sr-only">Detalle</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 6).map((row) => (
            <tr key={row.id}>
              <td>
                <Link
                  className="ops-tracking-link"
                  href={"/shipments/" + row.id}
                >
                  {row.trackingCode}
                </Link>
                <small>
                  {new Date(row.createdAt).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </small>
              </td>
              <td>
                <div className="ops-route">
                  <MapPin size={14} />
                  <span>{row.origin.city}</span>
                  <ArrowRight size={12} />
                  <strong>{row.destination.city}</strong>
                </div>
              </td>
              <td>
                <span
                  className={
                    "ops-status ops-status-" + row.status.toLowerCase()
                  }
                >
                  <i />
                  {shipmentStates.find((s) => s.status === row.status)
                    ?.singular || row.status}
                </span>
              </td>
              <td className="ops-money">
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  maximumFractionDigits: 0,
                }).format(row.fee)}
              </td>
              <td>
                <Link
                  className="ops-row-action"
                  aria-label={"Ver envío " + row.trackingCode}
                  href={"/shipments/" + row.id}
                >
                  <ArrowUpRight size={17} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
