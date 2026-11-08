import { apiClient } from "@/lib/api-client";
import { customerService } from "./customer-service";
import { courierService } from "./courier-service";
import type { PageResponse, UserResponse } from "@/types/domain";
export type AccountRole = "CLIENTE" | "REPARTIDOR";
export interface NewAccount {
  name: string;
  email: string;
  username?: string;
  password: string;
  roles: AccountRole[];
  customerId?: string;
  courierId?: string;
}
export async function validateIdentity(role: AccountRole, id: string) {
  if (!id.trim()) throw new Error("Seleccioná una ficha para vincular.");
  const record =
    role === "CLIENTE"
      ? await customerService.get(id)
      : await courierService.get(id);
  if (record.id !== id)
    throw new Error("La ficha recibida no corresponde a la selección.");
}
export const userService = {
  async list(page = 0, signal?: AbortSignal) {
    return (
      await apiClient.get<PageResponse<UserResponse>>("/api/v1/users", {
        params: { page, size: 20 },
        signal,
      })
    ).data;
  },
  async create(account: NewAccount) {
    const role = account.roles[0];
    const id = role === "CLIENTE" ? account.customerId : account.courierId;
    if (!id) throw new Error("Seleccioná una ficha de dominio.");
    await validateIdentity(role, id);
    return (await apiClient.post<UserResponse>("/api/v1/users", account)).data;
  },
  async link(userId: string, role: AccountRole, id: string) {
    await validateIdentity(role, id);
    const kind = role === "CLIENTE" ? "customer" : "courier";
    return (
      await apiClient.put<UserResponse>(
        `/api/v1/users/${encodeURIComponent(userId)}/${kind}-link`,
        { [kind + "Id"]: id },
      )
    ).data;
  },
};
