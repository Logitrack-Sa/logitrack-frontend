import Link from "next/link";
import { Package, ShieldCheck, ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site/PublicSite";
import { withBasePath } from "@/lib/deployment";
interface AuthSplitLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  badgeText?: string;
}
export function AuthSplitLayout({
  children,
  title,
  subtitle,
  badgeText = "Mi LogiTrack",
}: AuthSplitLayoutProps) {
  return (
    <main className="cargo-site">
      <section className="cargo-auth">
        <aside
          className="cargo-auth-picture"
          style={{
            backgroundImage: `linear-gradient(180deg,rgba(10,53,25,.7),rgba(9,49,24,.85)),url("${withBasePath("/logistics-banner.jpg")}")`,
          }}
        >
          <span className="auth-picture-mark">
            <Package size={25} /> LogiTrack
          </span>
          <div>
            <p>TU OPERACIÓN, CONECTADA</p>
            <h2>
              Todo empieza
              <br />
              con una entrega.
            </h2>
            <span>
              Gestioná tus envíos, consultá su recorrido y acompañá cada paso
              desde tu cuenta.
            </span>
          </div>
          <Link href="/seguimiento">
            Consultá tu seguimiento <ArrowRight size={17} />
          </Link>
        </aside>
        <div className="cargo-auth-card">
          <div className="cargo-auth-top">
            <span>
              <ShieldCheck size={14} />
              {badgeText}
            </span>
            <Link href="/">← Volver al inicio</Link>
          </div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
          {children}
          <div className="cargo-auth-help">
            ¿Necesitás ayuda?{" "}
            <Link href="/ayuda">Consultá nuestras preguntas frecuentes →</Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
