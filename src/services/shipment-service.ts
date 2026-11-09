import axios from "axios";
import { apiClient, gatewayUrl } from "@/lib/api-client";
import type {
  AssignCourierRequest,
  ChangeStatusRequest,
  CreateShipmentRequest,
  PageResponse,
  ShipmentResponse,
  ShipmentStatus,
  PublicTrackingResponse,
} from "@/types/domain";
export const shipmentService = {
  async publicTracking(code: string, signal?: AbortSignal) {
    return (
      await axios.get<PublicTrackingResponse>(
        `${gatewayUrl}/api/v1/shipments/public-tracking/${encodeURIComponent(code)}`,
        { signal, timeout: 15000, headers: { Accept: "application/json" } },
      )
    ).data;
  },
  async list(page = 0, status?: ShipmentStatus, signal?: AbortSignal) {
    return (
      await apiClient.get<PageResponse<ShipmentResponse>>("/api/v1/shipments", {
        params: { page, size: 10, status: status || undefined },
        signal,
      })
    ).data;
  },
  async get(id: string, signal?: AbortSignal) {
    return (
      await apiClient.get<ShipmentResponse>(
        `/api/v1/shipments/${encodeURIComponent(id)}`,
        { signal },
      )
    ).data;
  },
  async tracking(code: string) {
    return (
      await apiClient.get<ShipmentResponse>(
        `/api/v1/shipments/tracking/${encodeURIComponent(code)}`,
      )
    ).data;
  },
  async create(request: CreateShipmentRequest) {
    return (
      await apiClient.post<ShipmentResponse>("/api/v1/shipments", request)
    ).data;
  },
  async assign(id: string, request: AssignCourierRequest) {
    return (
      await apiClient.put<ShipmentResponse>(
        `/api/v1/shipments/${encodeURIComponent(id)}/courier`,
        request,
      )
    ).data;
  },
  async transition(id: string, request: ChangeStatusRequest) {
    return (
      await apiClient.patch<ShipmentResponse>(
        `/api/v1/shipments/${encodeURIComponent(id)}/status`,
        request,
      )
    ).data;
  },
  async cancel(id: string) {
    return (
      await apiClient.post<ShipmentResponse>(
        `/api/v1/shipments/${encodeURIComponent(id)}/cancellation`,
      )
    ).data;
  },
};
