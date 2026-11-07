// src/types/domain.ts

// ==========================================
// Enumeraciones de Dominio y Normalización
// ==========================================
export type RoleName = "ADMIN" | "CLIENTE" | "REPARTIDOR";
export type SpringSecurityRole =
  | "ROLE_ADMIN"
  | "ROLE_CLIENTE"
  | "ROLE_REPARTIDOR";
export type AnyRole = RoleName | SpringSecurityRole;

export type CourierStatus = "AVAILABLE" | "BUSY" | "INACTIVE";
export type LegacyCourierStatus = "ACTIVO" | "INACTIVO";
export type CourierApiStatus = CourierStatus | LegacyCourierStatus;

export type ShipmentStatus =
  | "PENDIENTE"
  | "EN_RUTA"
  | "ENTREGADO"
  | "CANCELADO";

export function normalizeRole(role: string): RoleName {
  const clean = role.startsWith("ROLE_") ? role.substring(5) : role;
  return clean.toUpperCase() as RoleName;
}

// ==========================================
// Módulo de Seguridad y Usuarios
// ==========================================
export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
  name?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username?: string;
  name?: string;
  roles: AnyRole[];
  enabled: boolean;
  customerId?: string | null;
  courierId?: string | null;
}

// ==========================================
// Módulo de Repartidores (Couriers)
// ==========================================
export interface CourierRequest {
  name: string;
  dni: string;
  vehicleType: string;
}

export interface CourierStatusRequest {
  status: CourierApiStatus;
}

export interface CourierResponse {
  id: string;
  name: string;
  dni: string;
  vehicleType: string;
  status: CourierApiStatus;
  createdAt: string;
}

// ==========================================
// Módulo de Clientes (Customers)
// ==========================================
export interface CustomerRequest {
  name: string;
  email: string;
  phone?: string;
}

export interface CustomerResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

// ==========================================
// Módulo de Envíos (Shipments)
// ==========================================
export interface AddressDto {
  street: string;
  number: string;
  city: string;
  postalCode: string;
}

export interface CreateShipmentRequest {
  customerId: string;
  origin: AddressDto;
  destination: AddressDto;
  weightKg: number;
  widthCm: number;
  heightCm: number;
  lengthCm: number;
}

export interface ChangeStatusRequest {
  status: ShipmentStatus;
  observation?: string;
}

export interface AssignCourierRequest {
  courierId: string;
}

export interface ShipmentResponse {
  id: string;
  trackingCode: string;
  customerId: string;
  origin: AddressDto;
  destination: AddressDto;
  weightKg: number;
  widthCm: number;
  heightCm: number;
  lengthCm: number;
  fee: number;
  status: ShipmentStatus;
  courierId?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  version: number;
}

// ==========================================
// Envolturas de Paginación
// ==========================================
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface SpringPagedModel<T> {
  _embedded?: {
    [key: string]: T[];
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
