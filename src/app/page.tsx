"use client";
import Link from "next/link";
import { withBasePath } from "@/lib/deployment";
import {
  TrackingForm,
  SiteIcon,
  PackingSteps,
  ServiceCards,
  Faq,
  SiteFooter,
} from "@/components/site/PublicSite";
export default function Home() {
  return (
    <main className="cargo-site">
      <section
        className="cargo-hero"
        style={{
          backgroundImage: `linear-gradient(90deg,rgba(0,0,0,.72),rgba(0,0,0,.08)),url("${withBasePath("/images/warehouse.jpg")}")`,
        }}
      >
        <div className="cargo-hero-content">
          <span>LOGÍSTICA CONECTADA</span>
          <h1>
            ¿Querés saber
            <br />
            dónde está tu envío?
          </h1>
          <TrackingForm />
          <Link href="/ayuda">ⓘ Atención al cliente</Link>
        </div>
      </section>
      <div className="cargo-shortcuts">
        {[
          ["cotiza-envio", "Creá tu envío", "/shipments/new"],
          ["retiro-en-domicilio", "Gestioná tus entregas", "/dashboard"],
          ["entrega-en-agencia", "Consultá el seguimiento", "/seguimiento"],
        ].map(([icon, title, href]) => (
          <Link key={href} href={href}>
            <SiteIcon name={icon} />
            <strong>{title}</strong>
            <span>→</span>
          </Link>
        ))}
      </div>
      <section className="cargo-account-banner">
        <div>
          <p>TU OPERACIÓN, MÁS SIMPLE</p>
          <h2>
            Todos tus envíos.
            <br />
            Una sola cuenta.
          </h2>
          <span>
            Conectá clientes, repartidores y entregas en un mismo lugar.
          </span>
        </div>
        <Link className="button" href="/register">
          Creá tu cuenta →
        </Link>
      </section>
      <section className="cargo-section cargo-split">
        <div className="cargo-service-visual">
          <SiteIcon name="puerta-puerta" />
          <span>
            DEL ORIGEN
            <br />
            <strong>AL DESTINO.</strong>
          </span>
        </div>
        <div>
          <p className="cargo-eyebrow">TU CENTRO DE OPERACIONES</p>
          <h2>
            Tu logística,
            <br />
            bajo control.
          </h2>
          <p>
            Consultá paquetes, organizá clientes y coordiná a tu equipo. La
            información que necesitás, en el lugar donde trabajás.
          </p>
          <Link className="button" href="/dashboard">
            Ir a mi panel →
          </Link>
        </div>
      </section>
      <section className="cargo-section cargo-prepare">
        <h2>Cómo preparar tus envíos</h2>
        <PackingSteps />
        <Link href="/ayuda" className="cargo-more">
          Conocé más →
        </Link>
      </section>
      <section className="cargo-section">
        <h2>Servicios para cada etapa</h2>
        <ServiceCards />
      </section>
      <section className="cargo-business">
        <div>
          <p>UN EQUIPO. UNA OPERACIÓN CONECTADA.</p>
          <h2>
            Hacemos que cada
            <br />
            entrega cuente.
          </h2>
          <Link href="/nosotros" className="button">
            Conocé LogiTrack →
          </Link>
        </div>
        <SiteIcon name="agencia-agencia" />
      </section>
      <section className="cargo-section cargo-questions">
        <h2>¿Tenés preguntas?</h2>
        <Faq />
      </section>
      <SiteFooter />
    </main>
  );
}
