"use client";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useRemote } from "@/hooks/useRemote";
import { customerService } from "@/services/customer-service";
import { courierService } from "@/services/courier-service";
import type { AccountRole } from "@/services/user-service";
export function IdentityPicker({
  role,
  currentId,
}: {
  role: AccountRole;
  currentId?: string | null;
}) {
  const [page, setPage] = useState(0);
  const [value, setValue] = useState(currentId || "");
  const load = useCallback(
    async (signal: AbortSignal) => {
      const data =
        role === "CLIENTE"
          ? await customerService.list(page, signal)
          : await courierService.list(page, undefined, signal);
      return {
        ...data,
        content: data.content.map((item) => ({
          id: item.id,
          name: item.name,
          hint: "email" in item ? item.email : item.dni,
        })),
      };
    },
    [role, page],
  );
  const { data, loading, error, reload } = useRemote(load);
  const path = role === "CLIENTE" ? "/customers" : "/couriers";
  return (
    <div className="identity-picker">
      <label>
        {role === "CLIENTE" ? "Cliente a vincular" : "Repartidor a vincular"}
        <select
          name="identity"
          required
          value={value}
          disabled={loading || !!error}
          onChange={(e) => setValue(e.target.value)}
        >
          <option value="">
            {loading ? "Cargando fichas…" : "Seleccioná una ficha"}
          </option>
          {value && !data?.content.some((i) => i.id === value) && (
            <option value={value}>Ficha seleccionada anteriormente</option>
          )}
          {data?.content.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name} · {i.hint}
            </option>
          ))}
        </select>
      </label>
      {error ? (
        <p role="alert">
          No pudimos cargar las fichas.{" "}
          <button className="text-button" type="button" onClick={reload}>
            Reintentar
          </button>
        </p>
      ) : (
        data && (
          <div className="actions">
            <button
              className="text-button"
              type="button"
              disabled={page === 0 || loading}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </button>
            <span>
              Página {data.totalPages ? page + 1 : 0} de {data.totalPages}
            </span>
            <button
              className="text-button"
              type="button"
              disabled={page + 1 >= data.totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </button>
          </div>
        )
      )}
      <p>
        <Link href={value ? path + "/" + value : path}>
          {value ? "Ver ficha seleccionada →" : "Crear o consultar fichas →"}
        </Link>
      </p>
    </div>
  );
}
