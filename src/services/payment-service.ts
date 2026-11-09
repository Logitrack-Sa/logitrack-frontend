import { apiClient } from "@/lib/api-client";

export interface PaymentResponse {
  id: string | null;
  shipmentId: string;
  status:
    | "NOT_STARTED"
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "REFUNDED"
    | "CHARGED_BACK"
    | "CANCELLED"
    | "REVIEW_REQUIRED";
  amount: number;
  currency: string;
  checkoutState: string | null;
  checkoutUrl: string | null;
  enabled: boolean;
  sandbox: boolean;
  updatedAt: string | null;
}

export const paymentService = {
  async get(shipmentId: string, signal?: AbortSignal) {
    return (
      await apiClient.get<PaymentResponse>(
        `/api/v1/payments/shipments/${encodeURIComponent(shipmentId)}`,
        { signal },
      )
    ).data;
  },
  async checkout(shipmentId: string) {
    return (
      await apiClient.post<PaymentResponse>(
        `/api/v1/payments/shipments/${encodeURIComponent(shipmentId)}/checkout`,
      )
    ).data;
  },
};

export function isMercadoPagoCheckout(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      (!url.port || url.port === "443") &&
      [
        "www.mercadopago.com.ar",
        "mercadopago.com.ar",
        "sandbox.mercadopago.com",
        "sandbox.mercadopago.com.ar",
        "www.mercadopago.com",
        "mercadopago.com",
      ].includes(url.hostname)
    );
  } catch {
    return false;
  }
}
