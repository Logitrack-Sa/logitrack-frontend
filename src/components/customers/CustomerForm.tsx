'use client';
import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { customerService } from '@/services/customer-service';
import { handleApiError } from '@/types/api-error';
import { Field } from '@/components/ui';
export function CustomerForm({ onCreated, onClose }: { onCreated: () => void; onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setErrors({});
    const form = new FormData(event.currentTarget);
    try {
      await customerService.create({ name: String(form.get('name')).trim(), email: String(form.get('email')).trim(), phone: String(form.get('phone')).trim() });
      toast.success('Cliente registrado'); onCreated();
    } catch (error) { handleApiError(error, setErrors); } finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="card form"><h2>Nuevo cliente</h2><div className="form-grid"><Field label="Nombre completo" name="name" required maxLength={120} error={errors.name} /><Field label="Correo electrónico" name="email" type="email" required error={errors.email} /><Field label="Teléfono" name="phone" type="tel" error={errors.phone} /></div><div className="actions"><button className="button" disabled={busy}>{busy ? 'Guardando…' : 'Guardar cliente'}</button><button type="button" className="button secondary" disabled={busy} onClick={onClose}>Volver</button></div></form>;
}
