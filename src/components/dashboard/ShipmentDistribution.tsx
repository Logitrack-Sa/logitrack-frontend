"use client";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
export const shipmentStates = [
  {
    status: "PENDIENTE",
    label: "Pendientes",
    singular: "Pendiente",
    color: "#d5a253",
  },
  {
    status: "EN_RUTA",
    label: "En ruta",
    singular: "En ruta",
    color: "#6f9bb7",
  },
  {
    status: "ENTREGADO",
    label: "Entregados",
    singular: "Entregado",
    color: "#34866c",
  },
  {
    status: "CANCELADO",
    label: "Cancelados",
    singular: "Cancelado",
    color: "#bdc5c2",
  },
] as const;
export function ShipmentDistribution({
  counts,
  busy,
}: {
  counts: number[];
  busy: boolean;
}) {
  const total = counts.reduce((a, b) => a + b, 0);
  const data = total
    ? shipmentStates.map((s, i) => ({
        name: s.label,
        value: counts[i] || 0,
        fill: s.color,
      }))
    : [{ name: "Sin envíos", value: 1, fill: "#edf0ee" }];
  return (
    <section className="ops-panel ops-distribution">
      <div className="ops-section-title">
        <div>
          <h2>Estado de los envíos</h2>
          <p>Así se distribuye tu actividad.</p>
        </div>
      </div>
      <div className="ops-donut" aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={72}
              outerRadius={91}
              paddingAngle={total ? 5 : 0}
              cornerRadius={5}
              stroke="none"
              isAnimationActive={false}
            />
            {total > 0 && <Tooltip />}
          </PieChart>
        </ResponsiveContainer>
        <div className="ops-donut-center">
          <strong>{busy ? "—" : total}</strong>
          <span>envíos</span>
        </div>
      </div>
      <p className="sr-only">
        {busy ? "Cargando estados" : total + " envíos en total"}
      </p>
      <div className="ops-chart-legend">
        {shipmentStates.map((s, i) => (
          <div key={s.status}>
            <span>
              <i style={{ background: s.color }} />
              {s.label}
            </span>
            <strong>{busy ? "—" : counts[i] || 0}</strong>
            <small>
              {!busy && total
                ? Math.round(((counts[i] || 0) / total) * 100)
                : 0}
              %
            </small>
          </div>
        ))}
      </div>
    </section>
  );
}
