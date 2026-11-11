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
        eyebrow="PRODUCTOS Y SERVICIOS"
        title="Una solución para tus envíos"
      >
        <p>Del registro del paquete al seguimiento de su entrega.</p>
      </SiteIntro>
      <section className="cargo-section">
        <ServiceCards />
      </section>
      <SiteFooter />
    </main>
  );
}
