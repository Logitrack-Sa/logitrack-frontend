import Link from "next/link";
import { PageHeader } from "@/components/ui";
export default function HomePage() {
  return (
    <>
      <PageHeader
        title="Cada entrega, bajo control."
        description="Un solo lugar para seguir envíos, organizar clientes y coordinar tu equipo."
      />
      <section className="card">
        <h2>Tu centro de operaciones</h2>
        <p>
          Consultá el recorrido de tus envíos y gestioná las operaciones
          habilitadas para tu cuenta.
        </p>
        <Link className="button" href="/shipments">
          Ir a envíos →
        </Link>
      </section>
    </>
  );
}
