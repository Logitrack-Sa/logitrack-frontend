// src/lib/auth-utils.ts
import { RoleName, normalizeRole as normalizeDomainRole } from '@/types/domain';

export type NormalizedRole = RoleName;

export function normalizeRole(role: string): NormalizedRole {
  return normalizeDomainRole(role);
}

export function hasRequiredRole(
  userRoles: string[] | undefined,
  requiredRole: NormalizedRole
): boolean {
  if (!userRoles) return false;
  return userRoles.map(normalizeRole).includes(requiredRole);
}
