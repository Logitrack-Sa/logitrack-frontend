"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import { customerService } from "@/services/customer-service";
import { useRemote } from "@/hooks/useRemote";
import { Access, ErrorState, PageHeader, Pagination } from "@/components/ui";
import { CustomerForm } from "@/components/customers/CustomerForm";

function Customers() {
  const [page, setPage] = useState(0);
  const [creating, setCreating] = useState(false);
  const load = useCallback(
    (signal: AbortSignal) => customerService.list(page, signal),
    [page],
  );
  const { data, loading, error, reload } = useRemote(load);
  return (
    <>
      <PageHeader
        title="Clientes"
        description="Las personas que confían en tus entregas."
      >
        <button className="button" onClick={() => setCreating(true)}>
          + Nuevo cliente
        </button>
      </PageHeader>
      {creating && (
        <CustomerForm
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            setPage(0);
            reload();
          }}
        />
      )}
      {error ? (
        <ErrorState retry={reload} />
      ) : (
        <section className="card">
          <div className="section-heading">
            <h2>Directorio de clientes</h2>
            <span className="muted">
              {data?.totalElements ?? "—"} registrados
            </span>
          </div>
          {loading ? (
            <p role="status">Cargando clientes…</p>
          ) : (
            <>
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Correo electrónico</th>
                      <th>Teléfono</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {data?.content.map((customer) => (
                      <tr key={customer.id}>
                        <td className="strong">{customer.name}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone || "—"}</td>
                        <td>
                          <Link href={`/customers/${customer.id}`}>
                            Ver detalle →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!data?.content.length && (
                <p className="empty">
                  Todavía no hay clientes. Registrá el primero para comenzar.
                </p>
              )}
              {data && <Pagination page={data} onChange={setPage} />}
            </>
          )}
        </section>
      )}
    </>
  );
}
export default function Page() {
  return (
    <Access roles={["ADMIN"]}>
      <Customers />
    </Access>
  );
}
