"use client";
import { Access, PageHeader } from "@/components/ui";
export default function Page() {
  return (
    <Access>
      <PageHeader
        title="Asistente LogiBot"
        description="Consultá por tus envíos y la disponibilidad de repartidores."
      />
      <section className="card">
        <h2>Consultas sobre datos reales</h2>
        <p>
          El asistente se abre en la esquina inferior derecha. Podés preguntar
          por un código de seguimiento o por el equipo de distribución.
        </p>
        <p>
          Las asignaciones y cambios de estado se realizan desde la sección
          Envíos, con los permisos de tu cuenta.
        </p>
      </section>
    </Access>
  );
}
