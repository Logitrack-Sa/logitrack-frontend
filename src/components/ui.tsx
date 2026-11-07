"use client";
import Link from "next/link";
import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import type { PageResponse, RoleName } from "@/types/domain";
import { useAuth } from "@/hooks/useAuth";

export function Access({
  roles,
  children,
}: {
  roles?: RoleName[];
  children: React.ReactNode;
}) {
  const { ready, user, hasRole } = useAuth();
  if (!ready) return <p role="status">Comprobando sesión…</p>;
  if (!user)
    return (
      <section className="card">
        <h2>Iniciá sesión para continuar</h2>
        <p>Ingresá con tu cuenta de LogiTrack.</p>
        <Link className="button" href="/login">
          Iniciar sesión
        </Link>
      </section>
    );
  if (roles && !roles.some(hasRole))
    return <Notice>No tenés permisos para acceder a esta sección.</Notice>;
  return <>{children}</>;
}
export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <span className="eyebrow">CENTRO DE OPERACIONES</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </header>
  );
}
export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="notice" role="status">
      {children}
    </div>
  );
}
export function ErrorState({ retry }: { retry: () => void }) {
  return (
    <div className="notice error" role="alert">
      No pudimos cargar los datos. Comprobá la conexión y tus permisos.{" "}
      <button className="button secondary" onClick={retry}>
        Reintentar
      </button>
    </div>
  );
}
export function Field({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const id = props.id ?? props.name;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        {...props}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <small id={`${id}-error`} role="alert">
          {error}
        </small>
      )}
    </div>
  );
}
export function Select({
  label,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select {...props}>{children}</select>
    </label>
  );
}
export function Pagination({
  page,
  onChange,
}: {
  page: Omit<PageResponse<unknown>, "content">;
  onChange: (page: number) => void;
}) {
  return (
    <footer className="pagination">
      <span>
        {page.totalElements} registros · Página{" "}
        {page.totalPages ? page.page + 1 : 0} de {page.totalPages}
      </span>
      <div className="actions">
        <button
          className="button secondary"
          disabled={page.page === 0}
          onClick={() => onChange(page.page - 1)}
        >
          Anterior
        </button>
        <button
          className="button secondary"
          disabled={page.page + 1 >= page.totalPages}
          onClick={() => onChange(page.page + 1)}
        >
          Siguiente
        </button>
      </div>
    </footer>
  );
}
const labels: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_RUTA: "En ruta",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
  AVAILABLE: "Disponible",
  BUSY: "Ocupado",
  INACTIVE: "Inactivo",
  ACTIVO: "Activo",
  INACTIVO: "Inactivo",
};
export function Badge({ status }: { status: string }) {
  return (
    <span className={`badge badge-${status.toLowerCase()}`}>
      {labels[status] ?? status}
    </span>
  );
}
export const date = (value?: string) =>
  value
    ? new Intl.DateTimeFormat("es-AR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "—";
export const amount = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
