"use client";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { shipmentPermissions } from "@/lib/shipment-permissions";
import { shipmentService } from "@/services/shipment-service";
import type { ShipmentResponse } from "@/types/domain";
import { handleApiError } from "@/types/api-error";
import { Field } from "@/components/ui";
import { Modal } from "@/components/Modal";
import { AssignCourierForm } from "./AssignCourierForm";
export function ShipmentActions({
  shipment,
  refresh,
}: {
  shipment: ShipmentResponse;
  refresh: () => void;
}) {
  const { user } = useAuth();
  const permissions = shipmentPermissions(
    user,
    shipment,
    process.env.NEXT_PUBLIC_CUSTOMER_CANCELLATION_ENABLED !== "false",
  );
  const [action, setAction] = useState<
    "assign" | "transition" | "cancel" | null
  >(null);
  const [busy, setBusy] = useState(false);
  if (!permissions.assign && !permissions.cancel && !permissions.nextStatus)
    return null;
  const done = () => {
    setAction(null);
    refresh();
  };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const observation = String(
      new FormData(event.currentTarget).get("observation") ?? "",
    ).trim();
    try {
      if (action === "cancel" && permissions.cancel)
        await shipmentService.cancel(shipment.id);
      else if (action === "transition" && permissions.nextStatus)
        await shipmentService.transition(shipment.id, {
          status: permissions.nextStatus,
          observation,
        });
      else return;
      toast.success("Envío actualizado");
      done();
    } catch (error) {
      handleApiError(error);
      done();
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="card">
      <h2>Acciones del envío</h2>
      <div className="actions">
        {permissions.assign && (
          <button
            className="button secondary"
            onClick={() => setAction("assign")}
          >
            Asignar repartidor
          </button>
        )}
        {permissions.nextStatus && (
          <button className="button" onClick={() => setAction("transition")}>
            {permissions.nextStatus === "EN_RUTA"
              ? "Iniciar recorrido"
              : "Confirmar entrega"}
          </button>
        )}
        {permissions.cancel && (
          <button className="button danger" onClick={() => setAction("cancel")}>
            Cancelar envío
          </button>
        )}
      </div>
      {action === "assign" && (
        <Modal title="Asignar repartidor" onClose={() => setAction(null)}>
          <AssignCourierForm shipmentId={shipment.id} onAssigned={done} />
        </Modal>
      )}
      {(action === "transition" || action === "cancel") && (
        <Modal
          title={
            action === "cancel" ? "Confirmar cancelación" : "Actualizar estado"
          }
          onClose={() => {
            if (!busy) setAction(null);
          }}
        >
          <form className="form" onSubmit={submit}>
            <p>
              {action === "cancel"
                ? "El envío pasará a CANCELADO. Esta operación no se puede deshacer."
                : `El envío pasará a ${permissions.nextStatus}.`}
            </p>
            {action === "transition" && (
              <Field
                label="Observación (opcional)"
                name="observation"
                maxLength={500}
              />
            )}
            <button
              className={`button ${action === "cancel" ? "danger" : ""}`}
              disabled={busy}
            >
              {busy ? "Procesando…" : "Confirmar"}
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}
