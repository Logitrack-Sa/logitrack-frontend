import { expect, it } from 'vitest';
import { shipmentPermissions } from '@/lib/shipment-permissions';
import type { Session } from '@/lib/session';
import type { ShipmentResponse } from '@/types/domain';
const shipment = { status: 'PENDIENTE', customerId: 'c', courierId: 'r' } as ShipmentResponse;
it('solo ofrece transición al repartidor asignado', () => {
  expect(shipmentPermissions({ roles: ['REPARTIDOR'], courierId: 'otro' } as Session, shipment).nextStatus).toBeUndefined();
  expect(shipmentPermissions({ roles: ['REPARTIDOR'], courierId: 'r' } as Session, shipment).nextStatus).toBe('EN_RUTA');
});
it('exige habilitación explícita y pertenencia para cancelación del cliente', () => {
  const own = { roles: ['CLIENTE'], customerId: 'c' } as Session;
  expect(shipmentPermissions(own, shipment).cancel).toBe(false);
  expect(shipmentPermissions(own, shipment, true).cancel).toBe(true);
  expect(shipmentPermissions({ ...own, customerId: 'otro' }, shipment, true).cancel).toBe(false);
});
it.each(['ENTREGADO', 'CANCELADO'] as const)('no ofrece operaciones sobre estado terminal %s', status => {
  expect(shipmentPermissions({ roles: ['ADMIN'] } as Session, { ...shipment, status }))
    .toEqual({ assign: false, cancel: false, nextStatus: undefined });
});
it('no permite iniciar el recorrido sin repartidor', () => {
  expect(shipmentPermissions({ roles: ['ADMIN'] } as Session, { ...shipment, courierId: null }).nextStatus).toBeUndefined();
});
