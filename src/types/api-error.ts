// src/types/api-error.ts
import { toast } from 'react-hot-toast';

export interface ProblemDetailViolation {
  field: string;
  rejectedValue: unknown;
  message: string;
}

export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  code: string;
  timestamp: string;
  violations?: ProblemDetailViolation[];
  email_verified?: boolean;
}

export function handleApiError(
  error: unknown,
  setFormErrors?: (fields: Record<string, string>) => void
): void {
  const err = error as { response?: { data?: ProblemDetail } };
  const problem: ProblemDetail | undefined = err?.response?.data;

  if (!problem) {
    toast.error('Error de conexión con el servidor o servicio no disponible.');
    return;
  }

  if (problem.violations && setFormErrors) {
    const fieldMap: Record<string, string> = {};
    problem.violations.forEach((v) => {
      fieldMap[v.field] = v.message;
    });
    setFormErrors(fieldMap);
    toast.error('Por favor revisa los campos señalados en el formulario.');
    return;
  }

  toast.error(problem.detail || problem.title || 'Ocurrió un error al procesar la solicitud.');
}
