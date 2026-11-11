import {
  SiteIntro,
  ServiceCards,
  PackingSteps,
  Faq,
  SiteFooter,
} from "@/components/site/PublicSite";
export default function Page() {
  return (
    <main className="cargo-site">
      <SiteIntro
        eyebrow="SOBRE LOGITRACK"
        title="La información conecta las entregas"
      >
        <p>
          LogiTrack reúne a clientes, repartidores y administradores para
          organizar el recorrido de un envío, desde su registro hasta su
          entrega.
        </p>
      </SiteIntro>
      <section className="cargo-section">
        <h2>Un espacio para cada rol</h2>
        <div className="cargo-products">
          <article>
            <h3>Clientes</h3>
            <p>Registran envíos y consultan sus costos, estados e historial.</p>
          </article>
          <article>
            <h3>Repartidores</h3>
            <p>
              Acceden a los envíos que tienen asignados y a las operaciones
              permitidas para su rol.
            </p>
          </article>
          <article>
            <h3>Administración</h3>
            <p>
              Coordina clientes, repartidores y asignaciones desde el centro de
              operaciones.
            </p>
          </article>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
