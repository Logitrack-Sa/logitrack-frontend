"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/auth-service";
import { handleApiError } from "@/types/api-error";
export function VerificationBanner() {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  if (user?.email_verified !== false) return null;
  async function resend() {
    if (!user?.email || busy) return;
    setBusy(true);
    try {
      const response = await authService.resendVerification(user.email);
      toast.success(response.message);
    } catch (error) {
      handleApiError(error);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="notice">
      Verificá tu correo electrónico antes de crear envíos. Si ya lo
      confirmaste, volvé a iniciar sesión para actualizar el token.{" "}
      {user.email && (
        <button className="text-button" disabled={busy} onClick={resend}>
          {busy ? "Reenviando…" : "Reenviar enlace de verificación"}
        </button>
      )}
    </div>
  );
}
