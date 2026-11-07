"use client";
import { useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { shipmentService } from "@/services/shipment-service";
import { useRemote } from "@/hooks/useRemote";
import { Access, ErrorState, PageHeader } from "@/components/ui";
import { ShipmentDetail } from "@/components/shipments/ShipmentDetail";
import { ShipmentActions } from "@/components/shipments/ShipmentActions";
function Shipment({ id }: { id: string }) {
  const load = useCallback(
    (signal: AbortSignal) => shipmentService.get(id, signal),
    [id],
  );
  const { data, error, loading, reload } = useRemote(load);
  return (
    <>
      <Link href="/shipments">← Envíos</Link>
      <PageHeader
        title={data?.trackingCode ?? "Detalle del envío"}
        description="El recorrido y la información de tu paquete."
      />
      {error ? (
        <ErrorState retry={reload} />
      ) : loading ? (
        <p role="status">Cargando envío…</p>
      ) : (
        data && (
          <>
            <ShipmentDetail shipment={data} />
            <ShipmentActions shipment={data} refresh={reload} />
          </>
        )
      )}
    </>
  );
}
export default function Page() {
  const { id } = useParams<{ id: string }>();
  return (
    <Access>
      <Shipment id={id} />
    </Access>
  );
}
