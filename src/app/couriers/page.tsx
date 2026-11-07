'use client';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { courierService, courierStatuses } from '@/services/courier-service';
import { useRemote } from '@/hooks/useRemote';
import { useAuth } from '@/hooks/useAuth';
import type { CourierApiStatus } from '@/types/domain';
import { Access, Badge, ErrorState, PageHeader, Pagination, Select } from '@/components/ui';
import { CourierForm } from '@/components/couriers/CourierForm';
function Couriers() {
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<CourierApiStatus | ''>('');
  const [creating, setCreating] = useState(false);
  const { hasRole } = useAuth();
  const load = useCallback((signal: AbortSignal) => courierService.list(page, status || undefined, signal), [page, status]);
  const { data, loading, error, reload } = useRemote(load);
  return <><PageHeader title="Repartidores" description="Coordiná tu equipo y consultá su disponibilidad.">{hasRole('ADMIN') && <button className="button" onClick={() => setCreating(true)}>+ Nuevo repartidor</button>}</PageHeader>{creating && <CourierForm onClose={() => setCreating(false)} onCreated={() => { setCreating(false); setPage(0); reload(); }} />}<section className="card"><div className="toolbar"><Select label="Disponibilidad" value={status} onChange={event => { setStatus(event.target.value as CourierApiStatus | ''); setPage(0); }}><option value="">Todos los estados</option>{courierStatuses.map(value => <option key={value} value={value}>{value}</option>)}</Select></div>{error ? <ErrorState retry={reload} /> : loading ? <p role="status">Cargando repartidores…</p> : <><div className="table-scroll"><table><thead><tr><th>Repartidor</th><th>DNI</th><th>Vehículo</th><th>Estado</th><th /></tr></thead><tbody>{data?.content.map(courier => <tr key={courier.id}><td className="strong">{courier.name}</td><td>{courier.dni}</td><td>{courier.vehicleType}</td><td><Badge status={courier.status} /></td><td><Link href={`/couriers/${courier.id}`}>Ver detalle →</Link></td></tr>)}</tbody></table></div>{!data?.content.length && <p className="empty">No hay repartidores para esta selección.</p>}{data && <Pagination page={data} onChange={setPage} />}</>}</section></>;
}
export default function Page() { return <Access roles={['ADMIN', 'REPARTIDOR']}><Couriers /></Access>; }
