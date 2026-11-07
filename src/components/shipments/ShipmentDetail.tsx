"use client";
import type { ShipmentResponse } from "@/types/domain";
import { amount, Badge, date } from "@/components/ui";
export function ShipmentDetail({
  shipment: s,
}: {
  shipment: ShipmentResponse;
}) {
  return (
    <dl className="card detail-grid">
      <div>
        <dt>Seguimiento</dt>
        <dd className="strong">{s.trackingCode}</dd>
      </div>
      <div>
        <dt>Estado</dt>
        <dd>
          <Badge status={s.status} />
        </dd>
      </div>
      {(
        [
          ["Origen", s.origin],
          ["Destino", s.destination],
        ] as const
      ).map(([label, address]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>
            {address.street} {address.number}
            <br />
            {address.city} · CP {address.postalCode}
          </dd>
        </div>
      ))}
      <div>
        <dt>Peso y dimensiones</dt>
        <dd>
          {s.weightKg} kg · {s.widthCm} × {s.heightCm} × {s.lengthCm} cm
        </dd>
      </div>
      <div>
        <dt>Tarifa</dt>
        <dd className="strong">{amount(s.fee)}</dd>
      </div>
      <div>
        <dt>Cliente</dt>
        <dd className="mono">{s.customerId}</dd>
      </div>
      <div>
        <dt>Repartidor asignado</dt>
        <dd className="mono">{s.courierId || "Sin asignar"}</dd>
      </div>
      <div>
        <dt>Creado</dt>
        <dd>{date(s.createdAt)}</dd>
      </div>
      <div>
        <dt>Última actualización</dt>
        <dd>{date(s.updatedAt)}</dd>
      </div>
    </dl>
  );
}
