"use client";
import { useCallback, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useRemote } from "@/hooks/useRemote";
import { useAuth } from "@/hooks/useAuth";
import { shipmentService } from "@/services/shipment-service";
import { handleApiError } from "@/types/api-error";
import type { ShipmentStatus } from "@/types/domain";
import {
  Access,
  amount,
  Badge,
  date,
  ErrorState,
  PageHeader,
  Pagination,
  Select,
} from "@/components/ui";

function Shipments() {
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<ShipmentStatus | "">("");
  const [searching, setSearching] = useState(false);
  const { hasRole } = useAuth();
  const router = useRouter();
  const load = useCallback(
    (signal: AbortSignal) =>
      shipmentService.list(page, status || undefined, signal),
    [page, status],
  );
  const { data, loading, error, reload } = useRemote(load);
  async function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearching(true);
    const code = String(
      new FormData(event.currentTarget).get("tracking"),
    ).trim();
    try {
      const shipment = await shipmentService.tracking(code);
      router.push(`/shipments/${shipment.id}`);
    } catch (reason) {
      if (axios.isAxiosError(reason) && reason.response?.status === 404)
        toast.error("No encontramos un envío con ese código.");
      else handleApiError(reason);
    } finally {
      setSearching(false);
    }
  }
  return (
    <>
      <PageHeader
        title="Envíos"
        description="Seguí cada paquete, desde su origen hasta la entrega."
      >
        {(hasRole("ADMIN") || hasRole("CLIENTE")) && (
          <Link className="button" href="/shipments/new">
            + Nuevo envío
          </Link>
        )}
      </PageHeader>
      <section className="card">
        <div className="toolbar">
          <Select
            label="Estado del envío"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as ShipmentStatus | "");
              setPage(0);
            }}
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="EN_RUTA">En ruta</option>
            <option value="ENTREGADO">Entregado</option>
            <option value="CANCELADO">Cancelado</option>
          </Select>
          <form className="search" onSubmit={search}>
            <input
              name="tracking"
              aria-label="Código de seguimiento"
              placeholder="Buscar por código de seguimiento…"
              required
              maxLength={100}
            />
            <button className="button secondary" disabled={searching}>
              {searching ? "Buscando…" : "Buscar"}
            </button>
          </form>
        </div>
        {error ? (
          <ErrorState retry={reload} />
        ) : loading ? (
          <p role="status">Cargando envíos…</p>
        ) : (
          <>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Seguimiento</th>
                    <th>Recorrido</th>
                    <th>Tarifa</th>
                    <th>Estado</th>
                    <th>Fecha de alta</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.content.map((shipment) => (
                    <tr key={shipment.id}>
                      <td className="strong">
                        <Link href={`/shipments/${shipment.id}`}>
                          {shipment.trackingCode}
                        </Link>
                      </td>
                      <td>
                        {shipment.origin.city} → {shipment.destination.city}
                      </td>
                      <td>{amount(shipment.fee)}</td>
                      <td>
                        <Badge status={shipment.status} />
                      </td>
                      <td>{date(shipment.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!data?.content.length && (
              <p className="empty">No hay envíos para esta selección.</p>
            )}
            {data && <Pagination page={data} onChange={setPage} />}
          </>
        )}
      </section>
    </>
  );
}
export default function Page() {
  return (
    <Access>
      <Shipments />
    </Access>
  );
}
