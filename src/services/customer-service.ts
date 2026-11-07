import { apiClient } from '@/lib/api-client';
import { normalizePage } from '@/lib/pagination';
import type { CustomerRequest, CustomerResponse } from '@/types/domain';
export const customerService = {
  async list(page = 0, signal?: AbortSignal) {
    const { data } = await apiClient.get('/api/v1/customers', { params: { page, size: 10 }, signal });
    return normalizePage<CustomerResponse>(data);
  },
  async get(id: string, signal?: AbortSignal) {
    return (await apiClient.get<CustomerResponse>(`/api/v1/customers/${encodeURIComponent(id)}`, { signal })).data;
  },
  async create(request: CustomerRequest) { return (await apiClient.post<CustomerResponse>('/api/v1/customers', request)).data; },
};
