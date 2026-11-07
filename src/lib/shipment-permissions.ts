import type { Session } from './session';
import type { ShipmentResponse, ShipmentStatus } from '@/types/domain';
export function shipmentPermissions(user: Session | null, shipment: ShipmentResponse, clientCancellation = false) {
  const admin = user?.roles.includes('ADMIN') ?? false;
  const assigned = !!user?.courierId && user.roles.includes('REPARTIDOR') && user.courierId === shipment.courierId;
  const ownCustomer = !!user?.customerId && user.roles.includes('CLIENTE') && user.customerId === shipment.customerId;
  const nextStatus: ShipmentStatus | undefined = shipment.status === 'PENDIENTE' && shipment.courierId ? 'EN_RUTA' : shipment.status === 'EN_RUTA' ? 'ENTREGADO' : undefined;
  return { assign: admin && shipment.status === 'PENDIENTE',
    cancel: shipment.status === 'PENDIENTE' && (admin || (clientCancellation && ownCustomer)),
    nextStatus: (admin || assigned) ? nextStatus : undefined };
}
