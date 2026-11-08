// src/app/verify-email/page.tsx
'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { authService } from '@/services/auth-service';
import { ProblemDetail, handleApiError } from '@/types/api-error';
import { AuthSplitLayout } from '@/components/auth/AuthSplitLayout';

type VerificationStatus =
  | 'loading'
  | 'success'
  | 'expired'
  | 'invalid'
  | 'missing_token';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<VerificationStatus>(
    token ? 'loading' : 'missing_token'
  );
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [resendEmail, setResendEmail] = useState<string>('');
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendCompleted, setResendCompleted] = useState<boolean>(false);

  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('missing_token');
      setStatusMessage(
        'No se encontró un token de verificación en el enlace proporcionado.'
      );
      return;
    }

    if (hasVerifiedRef.current) return;
    hasVerifiedRef.current = true;

    const verifyAccount = async () => {
      setStatus('loading');
      try {
        const res = await authService.verifyEmail(token);
        setStatus('success');
        setStatusMessage(
          res.message || 'Tu cuenta ha sido confirmada exitosamente.'
        );
        toast.success(
          'Cuenta confirmada exitosamente. Redirigiendo a inicio de sesión...'
        );

        setTimeout(() => {
          router.push('/login');
        }, 2500);
      } catch (err) {
        const axiosErr = err as AxiosError<ProblemDetail>;
        const httpStatus = axiosErr.response?.status;
        const problem = axiosErr.response?.data;

        if (
          httpStatus === 400 &&
          problem?.code === 'VERIFICATION_TOKEN_EXPIRED'
        ) {
          setStatus('expired');
          setStatusMessage(
            problem.detail ||
              'El enlace de verificación ha expirado (vigencia máxima de 24 horas).'
          );
        } else {
          setStatus('invalid');
          setStatusMessage(
            problem?.detail ||
              'El enlace de verificación es inválido, inexistente o ya fue utilizado.'
          );
        }
      }
    };

    verifyAccount();
  }, [token, router]);

  const handleResendSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanEmail = resendEmail.trim();
    if (!cleanEmail) {
      toast.error(
        'Por favor ingresa tu correo electrónico para reenviar el enlace.'
      );
      return;
    }

    setIsResending(true);
    try {
      const response = await authService.resendVerification(cleanEmail);
      setResendCompleted(true);
      toast.success(
        response.message || 'Se ha enviado un nuevo enlace de activación.'
      );
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      {/* Estado 1: Verificando token */}
      {status === 'loading' && (
        <div className="mt-6 flex flex-col items-center justify-center space-y-3 py-8 text-center">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-700">
            Validando tu enlace de activación...
          </p>
          <p className="text-xs text-slate-500">
            Por favor aguardá unos segundos mientras confirmamos tu identidad.
          </p>
        </div>
      )}

      {/* Estado 2: Verificación exitosa (200 OK) */}
      {status === 'success' && (
        <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-5 text-sm text-emerald-950">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </div>
              <p className="font-semibold text-base text-emerald-900">
                ¡Cuenta confirmada con éxito!
              </p>
            </div>
            <p className="mt-2.5 text-emerald-800">{statusMessage}</p>
            <p className="mt-2 text-xs text-emerald-700">
              Serás redirigido automáticamente a la pantalla de inicio de
              sesión...
            </p>
          </div>

          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Ir a Iniciar Sesión ahora
          </Link>
        </div>
      )}

      {/* Estado 3: Token Expirado (400 VERIFICATION_TOKEN_EXPIRED) */}
      {status === 'expired' && (
        <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Enlace de verificación expirado</p>
            <p className="mt-1 text-amber-800">{statusMessage}</p>
          </div>

          {resendCompleted ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-semibold">Nuevo enlace enviado</p>
              <p className="mt-1 text-emerald-800">
                Revisá tu bandeja de entrada en{' '}
                <span className="font-semibold underline">{resendEmail}</span> y
                hacé clic en el nuevo enlace de activación.
              </p>
            </div>
          ) : (
            <form onSubmit={handleResendSubmit} className="space-y-3" noValidate>
              <div>
                <label
                  htmlFor="resend-email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Ingresa tu correo electrónico para recibir un nuevo enlace
                </label>
                <input
                  id="resend-email"
                  type="email"
                  required
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="cliente.nuevo@gmail.com"
                  className="mt-1.5 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={isResending}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResending
                  ? 'Enviando nuevo enlace...'
                  : 'Reenviar enlace de verificación'}
              </button>
            </form>
          )}

          <div className="border-t border-slate-100 pt-4 text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Volver a Iniciar Sesión
            </Link>
          </div>
        </div>
      )}

      {/* Estado 4: Token inválido (404) o sin token en URL */}
      {(status === 'invalid' || status === 'missing_token') && (
        <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
            <p className="font-semibold">No se pudo verificar la cuenta</p>
            <p className="mt-1 text-rose-800">{statusMessage}</p>
          </div>

          {!resendCompleted ? (
            <form onSubmit={handleResendSubmit} className="space-y-3" noValidate>
              <div>
                <label
                  htmlFor="resend-email-invalid"
                  className="block text-sm font-medium text-slate-700"
                >
                  ¿Necesitás un nuevo enlace de activación? Ingresa tu correo:
                </label>
                <input
                  id="resend-email-invalid"
                  type="email"
                  required
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="cliente.nuevo@gmail.com"
                  className="mt-1.5 block w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:bg-white focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={isResending}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isResending
                  ? 'Enviando nuevo enlace...'
                  : 'Reenviar enlace de verificación'}
              </button>
            </form>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-semibold">Nuevo enlace enviado</p>
              <p className="mt-1 text-emerald-800">
                Revisá tu bandeja de entrada en{' '}
                <span className="font-semibold underline">{resendEmail}</span>.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-center text-sm">
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Ir a Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="text-slate-600 hover:text-slate-900 hover:underline"
            >
              Crear una cuenta nueva
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthSplitLayout
      badgeText="Activación por Email"
      title="Confirmación de Cuenta"
      subtitle="Validación del enlace transaccional de seguridad enviado a tu correo electrónico."
    >
      <Suspense
        fallback={
          <div className="mt-6 py-8 text-center text-sm text-slate-500">
            Cargando verificación de correo...
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </AuthSplitLayout>
  );
}
