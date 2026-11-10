"use client";
import { useCallback, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { courierService, availableStatus } from "@/services/courier-service";
import { shipmentService } from "@/services/shipment-service";
import { useRemote } from "@/hooks/useRemote";
import { handleApiError } from "@/types/api-error";
import { ErrorState, Pagination, Select } from "@/components/ui";
export function AssignCourierForm({
  shipmentId,
  onAssigned,
}: {
  shipmentId: string;
  onAssigned: () => void;
}) {
  const [page, setPage] = useState(0);
  const [busy, setBusy] = useState(false);
  const [courierId, setCourierId] = useState("");
  const load = useCallback(
    (signal: AbortSignal) => courierService.list(page, availableStatus, signal),
    [page],
  );
  const { data, error, loading, reload } = useRemote(load);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!courierId) return;
    setBusy(true);
    try {
      await shipmentService.assign(shipmentId, { courierId });
      toast.success("Repartidor asignado");
      onAssigned();
    } catch (reason) {
      handleApiError(reason);
      reload();
      setCourierId("");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="form" onSubmit={submit}>
      {error ? (
        <ErrorState retry={reload} />
      ) : (
        <>
          <Select
            label="Repartidor disponible"
            value={courierId}
            required
            disabled={loading || busy}
            onChange={(event) => setCourierId(event.target.value)}
          >
            <option value="">Seleccioná un repartidor</option>
            {data?.content.filter((courier) => courier.available !== false).map((courier) => (
              <option key={courier.id} value={courier.id}>
                {courier.name} · {courier.vehicleType}
              </option>
            ))}
          </Select>
          {loading && <p role="status">Consultando disponibilidad…</p>}
          {data && (
            <Pagination
              page={data}
              onChange={(next) => {
                setPage(next);
                setCourierId("");
              }}
            />
          )}
          {!loading && !data?.content.length && (
            <p>No hay repartidores disponibles en esta página.</p>
          )}
        </>
      )}
      <button className="button" disabled={busy || loading || !courierId}>
        {busy ? "Asignando…" : "Confirmar asignación"}
      </button>
    </form>
  );
}
