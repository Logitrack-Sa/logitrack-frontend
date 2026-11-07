import { apiClient } from "@/lib/api-client";
import { normalizePage } from "@/lib/pagination";
import type {
  CourierApiStatus,
  CourierRequest,
  CourierResponse,
} from "@/types/domain";
export const modernCourierStatuses =
  process.env.NEXT_PUBLIC_COURIER_STATUS_MODEL === "sprint4";
export const courierStatuses: CourierApiStatus[] = modernCourierStatuses
  ? ["AVAILABLE", "BUSY", "INACTIVE"]
  : ["ACTIVO", "INACTIVO"];
export const availableStatus = modernCourierStatuses ? "AVAILABLE" : "ACTIVO";
export const courierService = {
  async list(page = 0, status?: CourierApiStatus, signal?: AbortSignal) {
    const { data } = await apiClient.get("/api/v1/couriers", {
      params: { page, size: 10, status: status || undefined },
      signal,
    });
    return normalizePage<CourierResponse>(data);
  },
  async get(id: string, signal?: AbortSignal) {
    return (
      await apiClient.get<CourierResponse>(
        `/api/v1/couriers/${encodeURIComponent(id)}`,
        { signal },
      )
    ).data;
  },
  async create(request: CourierRequest) {
    return (await apiClient.post<CourierResponse>("/api/v1/couriers", request))
      .data;
  },
  async changeStatus(id: string, status: CourierApiStatus) {
    return (
      await apiClient.patch<CourierResponse>(
        `/api/v1/couriers/${encodeURIComponent(id)}/status`,
        { status },
      )
    ).data;
  },
};
