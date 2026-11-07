'use client';
import { useCallback, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { courierService, courierStatuses } from '@/services/courier-service';
import type { CourierApiStatus, CourierResponse } from '@/types/domain';
import { useAuth } from '@/hooks/useAuth';
import { useRemote } from '@/hooks/useRemote';
import { handleApiError } from '@/types/api-error';
import { Access, Badge, date, ErrorState, PageHeader, Select } from '@/components/ui';
function StatusForm({ courier, refresh }: { courier: CourierResponse; refresh: () => void }) {
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true);
    const status = String(new FormData(event.currentTarget).get('status')) as CourierApiStatus;
    try { await courierService.changeStatus(courier.id, status); toast.success('Disponibilidad actualizada'); refresh(); }
    catch (error) { handleApiError(error); } finally { setBusy(false); }
  }
  return <form className="card form narrow" onSubmit={submit}><h2>Actualizar disponibilidad</h2><Select label="Nuevo estado" name="status" defaultValue={courier.status}>{courierStatuses.map(status => <option key={status} value={status}>{status}</option>)}</Select><button className="button" disabled={busy}>{busy ? 'Actualizando…' : 'Guardar disponibilidad'}</button></form>;
}
function Courier({ id }: { id: string }) {
  const { hasRole } = useAuth();
  const load = useCallback((signal: AbortSignal) => courierService.get(id, signal), [id]);
  const { data, error, loading, reload } = useRemote(load);
  return <><Link href="/couriers">← Repartidores</Link><PageHeader title={data?.name ?? 'Detalle del repartidor'} description="Datos del equipo de distribución." />{error ? <ErrorState retry={reload} /> : loading ? <p role="status">Cargando repartidor…</p> : data && <><dl className="card detail-grid"><div><dt>Nombre</dt><dd>{data.name}</dd></div><div><dt>DNI</dt><dd>{data.dni}</dd></div><div><dt>Vehículo</dt><dd>{data.vehicleType}</dd></div><div><dt>Disponibilidad</dt><dd><Badge status={data.status} /></dd></div><div><dt>Fecha de alta</dt><dd>{date(data.createdAt)}</dd></div><div><dt>Identificador</dt><dd className="mono">{data.id}</dd></div></dl>{hasRole('ADMIN') && <StatusForm key={`${data.id}-${data.status}`} courier={data} refresh={reload} />}</>}</>;
}
export default function Page() { const { id } = useParams<{ id: string }>(); return <Access roles={['ADMIN', 'REPARTIDOR']}><Courier id={id} /></Access>; }
