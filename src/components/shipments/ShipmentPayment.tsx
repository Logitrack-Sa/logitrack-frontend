"use client";
import { useCallback, useState } from "react";
import axios from "axios";
import { CreditCard, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRemote } from "@/hooks/useRemote";
import { amount } from "@/components/ui";
import {
  paymentService,
  isMercadoPagoCheckout,
} from "@/services/payment-service";
import type { ShipmentResponse } from "@/types/domain";

const labels = {
  NOT_STARTED: "Sin pago online",
  PENDING: "Pendiente de confirmación",
  APPROVED: "Pago aprobado",
  REJECTED: "Pago rechazado",
  REFUNDED: "Pago devuelto",
  CHARGED_BACK: "Contracargo",
  CANCELLED: "Pago cancelado",
  REVIEW_REQUIRED: "Pago en revisión",
};

export function ShipmentPayment({
  shipment,
  enabled = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "true",
}: {
  shipment: ShipmentResponse;
  enabled?: boolean;
}) {
  const { hasRole, user } = useAuth();
  const canView = hasRole("ADMIN") || hasRole("CLIENTE");
  const load = useCallback(
    (signal: AbortSignal) =>
      enabled && canView
        ? paymentService.get(shipment.id, signal)
        : Promise.resolve(null),
    [enabled, canView, shipment.id],
  );
  const { data, error, loading, reload } = useRemote(load);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  if (!canView) return null;
  async function pay() {
    setBusy(true);
    setMessage("");
    try {
      const result = await paymentService.checkout(shipment.id);
      if (!result.checkoutUrl || !isMercadoPagoCheckout(result.checkoutUrl))
        throw new Error("Invalid checkout");
      window.location.assign(result.checkoutUrl);
    } catch (failure) {
      const detail =
        axios.isAxiosError(failure) &&
        typeof failure.response?.data?.message === "string"
          ? failure.response.data.message
          : "No pudimos iniciar el pago. Actualizá el estado antes de intentarlo nuevamente.";
      setMessage(detail);
      reload();
    } finally {
      setBusy(false);
    }
  }
  const available = enabled && data?.enabled;
  const stateAllowsPayment =
    data &&
    ["NOT_STARTED", "PENDING", "REJECTED", "CANCELLED"].includes(data.status) &&
    !["CREATING", "REVIEW_REQUIRED", "AWAITING_CONFIRMATION"].includes(
      data.checkoutState || "",
    );
  return (
    <section className="card shipment-payment" aria-label="Pago del envío">
      <div className="payment-heading">
        <CreditCard size={25} />
        <div>
          <h2>Pago del envío</h2>
          <p>Aboná tu envío con Mercado Pago.</p>
        </div>
      </div>
      <p className="payment-amount">{amount(data?.amount ?? shipment.fee)}</p>
      {!enabled || (data && !data.enabled) ? (
        <p>
          El pago online todavía no está disponible. Consultá con
          administración.
        </p>
      ) : loading ? (
        <p role="status">Consultando el pago…</p>
      ) : error ? (
        <p role="alert">
          No pudimos consultar el pago. Volvé a actualizar su estado.
        </p>
      ) : (
        data && (
          <>
            {data.sandbox && (
              <p className="payment-test-mode">
                Modo de prueba: no se cobra dinero real.
              </p>
            )}
            <p
              className={`payment-state payment-state-${data.status.toLowerCase()}`}
            >
              {labels[data.status]}
            </p>
            {["CREATING", "REVIEW_REQUIRED"].includes(
              data.checkoutState || "",
            ) && (
              <p>
                Estamos verificando una solicitud anterior. Contactá a
                administración antes de intentar otro pago.
              </p>
            )}
            {data.status === "PENDING" && (
              <p>
                El resultado se confirmará con Mercado Pago. Volver a esta
                página no significa que el pago esté aprobado.
              </p>
            )}
          </>
        )
      )}
      {user?.email_verified !== true && (
        <p>Verificá tu correo para habilitar el pago online.</p>
      )}
      {shipment.status !== "PENDIENTE" && (
        <p>Este envío ya no admite un nuevo pago online.</p>
      )}
      {message && <p role="alert">{message}</p>}
      <div className="actions">
        <button
          type="button"
          className="button"
          disabled={
            !available ||
            !stateAllowsPayment ||
            shipment.status !== "PENDIENTE" ||
            user?.email_verified !== true ||
            busy
          }
          onClick={pay}
        >
          {busy ? "Preparando pago…" : "Pagar con Mercado Pago"}
        </button>
        {enabled && (
          <button
            type="button"
            className="button secondary"
            disabled={loading || busy}
            onClick={reload}
          >
            Actualizar estado
          </button>
        )}
      </div>
      <p className="payment-privacy">
        <ShieldCheck size={16} /> Los datos de tu tarjeta se ingresan en Mercado
        Pago.
      </p>
    </section>
  );
}
