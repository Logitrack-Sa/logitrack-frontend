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
        eyebrow="ATENCIÓN AL CLIENTE"
        title="Te acompañamos en cada paso"
      >
        <p>Conocé cómo preparar y consultar tus envíos.</p>
      </SiteIntro>
      <section className="cargo-section">
        <h2>Prepará tu envío</h2>
        <PackingSteps />
      </section>
      <section id="preguntas" className="cargo-section">
        <h2>Preguntas frecuentes</h2>
        <Faq />
      </section>
      <SiteFooter />
    </main>
  );
}
