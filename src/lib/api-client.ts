// src/lib/api-client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { ProblemDetail } from '@/types/api-error';

export const AUTH_TOKEN_COOKIE = 'auth_token';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Petición: adjunta token Bearer automáticamente
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get(AUTH_TOKEN_COOKIE);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// Interceptor de Respuesta: captura y gestiona globalmente 401, 403, 400 y 422
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ProblemDetail>) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        const isLoginPage =
          typeof window !== 'undefined' &&
          window.location.pathname.startsWith('/login');

        Cookies.remove(AUTH_TOKEN_COOKIE, { path: '/' });

        if (isLoginPage) {
          toast.error('Credenciales inválidas. Verifica tu usuario y contraseña.');
        } else {
          toast.error(
            'Sesión vencida o credenciales inválidas. Redirigiendo a inicio de sesión...'
          );
          if (typeof window !== 'undefined') {
            const currentPath = `${window.location.pathname}${window.location.search}`;
            setTimeout(() => {
              window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            }, 1200);
          }
        }
      } else if (status === 403) {
        if (data?.code === 'ACCOUNT_NOT_VERIFIED') {
          toast.error(
            data.detail ||
              'Debes verificar tu correo electrónico para habilitar esta operación.'
          );
        } else {
          toast.error(
            data?.detail ||
              'Acceso denegado: no dispones de los permisos requeridos.'
          );
        }
      } else if (status === 400 || status === 422) {
        // Solo mostramos Toast automático si no es un error de validación de campos (violations),
        // o si el caller no lo maneja por separado; aunque para cumplir el criterio de aceptación
        // de notificar mediante Toasts ante 400/422, emitimos el mensaje de ProblemDetail.
        if (data && !data.violations?.length) {
          toast.error(
            data.detail ||
              data.title ||
              'La solicitud contiene datos inválidos.'
          );
        } else if (data?.violations?.length) {
          toast.error(
            data.detail ||
              'Por favor revisa los campos señalados en el formulario.'
          );
        }
      }
    }

    return Promise.reject(error);
  }
);
