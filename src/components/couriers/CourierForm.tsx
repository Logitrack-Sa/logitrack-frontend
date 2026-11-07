'use client';
import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { courierService } from '@/services/courier-service';
import { handleApiError } from '@/types/api-error';
import { Field } from '@/components/ui';
export function CourierForm({ onCreated, onClose }: { onCreated: () => void; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setErrors({});
    const form = new FormData(event.currentTarget);
    try {
      await courierService.create({ name: String(form.get('name')).trim(), dni: String(form.get('dni')).trim(), vehicleType: String(form.get('vehicleType')).trim() });
      toast.success('Repartidor registrado'); onCreated();
    } catch (error) { handleApiError(error, setErrors); } finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="card form"><h2>Nuevo repartidor</h2><div className="form-grid"><Field label="Nombre completo" name="name" required maxLength={120} error={errors.name} /><Field label="DNI" name="dni" inputMode="numeric" pattern="[0-9]{7,8}" required maxLength={8} error={errors.dni} /><Field label="Tipo de vehículo" name="vehicleType" required maxLength={50} placeholder="Ej.: moto" error={errors.vehicleType} /></div><div className="actions"><button className="button" disabled={busy}>{busy ? 'Guardando…' : 'Guardar repartidor'}</button><button type="button" className="button secondary" disabled={busy} onClick={onClose}>Volver</button></div></form>;
}
