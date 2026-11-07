import { apiClient } from '@/lib/api-client';
import type { AssignCourierRequest, ChangeStatusRequest, CreateShipmentRequest, PageResponse, ShipmentResponse, ShipmentStatus } from '@/types/domain';
export const shipmentService = {
  async list(page = 0, status?: ShipmentStatus, signal?: AbortSignal) {
    return (await apiClient.get<PageResponse<ShipmentResponse>>('/api/v1/shipments', { params: { page, size: 10, status: status || undefined }, signal })).data;
  },
  async get(id: string, signal?: AbortSignal) { return (await apiClient.get<ShipmentResponse>(`/api/v1/shipments/${encodeURIComponent(id)}`, { signal })).data; },
  async tracking(code: string) { return (await apiClient.get<ShipmentResponse>(`/api/v1/shipments/tracking/${encodeURIComponent(code)}`)).data; },
  async create(request: CreateShipmentRequest) { return (await apiClient.post<ShipmentResponse>('/api/v1/shipments', request)).data; },
  async assign(id: string, request: AssignCourierRequest) { return (await apiClient.put<ShipmentResponse>(`/api/v1/shipments/${encodeURIComponent(id)}/courier`, request)).data; },
  async transition(id: string, request: ChangeStatusRequest) { return (await apiClient.patch<ShipmentResponse>(`/api/v1/shipments/${encodeURIComponent(id)}/status`, request)).data; },
  async cancel(id: string) { return (await apiClient.post<ShipmentResponse>(`/api/v1/shipments/${encodeURIComponent(id)}/cancellation`)).data; },
};
