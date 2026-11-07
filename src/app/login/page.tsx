'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { decodeSession, setToken } from '@/lib/session';
import { Field, PageHeader } from '@/components/ui';
import { handleApiError } from '@/types/api-error';
import type { LoginResponse } from '@/types/domain';

export default function LoginPage() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const { data } = await apiClient.post<LoginResponse>('/api/v1/auth/login', { email: form.get('email'), password: form.get('password') });
      if (!decodeSession(data.accessToken) || !Number.isFinite(data.expiresIn) || data.expiresIn <= 0) throw new Error('Sesión inválida');
      setToken(data.accessToken, data.expiresIn);
      const redirect = new URLSearchParams(window.location.search).get('redirect');
      router.replace(redirect?.startsWith('/') && !redirect.startsWith('//') && !redirect.startsWith('/login') && !redirect.includes('\\') ? redirect : '/shipments');
    } catch (error) { handleApiError(error); } finally { setBusy(false); }
  }
  return <><PageHeader title="Bienvenido a LogiTrack" description="Ingresá para gestionar tu operación logística." /><form className="card form narrow" onSubmit={submit}><h2>Iniciar sesión</h2><Field label="Correo electrónico" name="email" type="email" autoComplete="username" required /><Field label="Contraseña" name="password" type="password" autoComplete="current-password" required /><button className="button" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar →'}</button></form></>;
}
