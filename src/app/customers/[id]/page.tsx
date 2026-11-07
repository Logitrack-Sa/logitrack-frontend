"use client";
import { useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { customerService } from "@/services/customer-service";
import { useRemote } from "@/hooks/useRemote";
import { Access, date, ErrorState, PageHeader } from "@/components/ui";
function Customer({ id }: { id: string }) {
  const load = useCallback(
    (signal: AbortSignal) => customerService.get(id, signal),
    [id],
  );
  const { data, error, loading, reload } = useRemote(load);
  return (
    <>
      <Link href="/customers">← Clientes</Link>
      <PageHeader
        title={data?.name ?? "Detalle del cliente"}
        description="Información de contacto y registro."
      />
      {error ? (
        <ErrorState retry={reload} />
      ) : loading ? (
        <p role="status">Cargando cliente…</p>
      ) : (
        data && (
          <dl className="card detail-grid">
            <div>
              <dt>Nombre</dt>
              <dd>{data.name}</dd>
            </div>
            <div>
              <dt>Correo</dt>
              <dd>{data.email}</dd>
            </div>
            <div>
              <dt>Teléfono</dt>
              <dd>{data.phone || "—"}</dd>
            </div>
            <div>
              <dt>Fecha de alta</dt>
              <dd>{date(data.createdAt)}</dd>
            </div>
            <div>
              <dt>Identificador</dt>
              <dd className="mono">{data.id}</dd>
            </div>
          </dl>
        )
      )}
    </>
  );
}
export default function Page() {
  const { id } = useParams<{ id: string }>();
  return (
    <Access roles={["ADMIN"]}>
      <Customer id={id} />
    </Access>
  );
}
