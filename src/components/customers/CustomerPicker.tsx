'use client';
import { useCallback, useState } from 'react';
import { useRemote } from '@/hooks/useRemote';
import { customerService } from '@/services/customer-service';
import { ErrorState, Pagination, Select } from '@/components/ui';
export function CustomerPicker({ value, onChange, error }: { value: string; onChange: (id: string) => void; error?: string }) {
  const [page, setPage] = useState(0);
  const load = useCallback((signal: AbortSignal) => customerService.list(page, signal), [page]);
  const { data, loading, error: loadError, reload } = useRemote(load);
  return <div>{loadError ? <ErrorState retry={reload} /> : <><Select label="Cliente" name="customerId" required value={value} disabled={loading} onChange={event => onChange(event.target.value)}><option value="">Seleccioná un cliente</option>{value && !data?.content.some(customer => customer.id === value) && <option value={value}>Cliente seleccionado ({value})</option>}{data?.content.map(customer => <option key={customer.id} value={customer.id}>{customer.name} · {customer.email}</option>)}</Select>{loading && <p role="status">Cargando clientes…</p>}{data && <Pagination page={data} onChange={setPage} />}</>}{error && <p role="alert">{error}</p>}</div>;
}
