import Link from "next/link";
import { ArrowRight, Box, MapPin, ShieldCheck } from "lucide-react";
import { withBasePath } from "@/lib/deployment";
interface AuthSplitLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  badgeText?: string;
  variant?: "login" | "register";
}
export function AuthSplitLayout({
  children,
  title,
  subtitle,
  badgeText = "MI LOGITRACK",
  variant = "login",
}: AuthSplitLayoutProps) {
  return (
    <main className={"auth-page auth-page-" + variant}>
      <header className="auth-header">
        <Link href="/" className="auth-brand" aria-label="LogiTrack - Inicio">
          <img
            src={withBasePath("/LOGO_GENERAL.png")}
            alt="LogiTrack"
            className="auth-brand-logo"
          />
        </Link>
      </header>
      <div className="auth-layout">
        <aside className="auth-photo-panel">
          <img
            src={withBasePath(
              variant === "register"
                ? "/images/warehouse.jpg"
                : "/images/dispatch.jpg",
            )}
            alt={
              variant === "register"
                ? "Centro de distribución de paquetes"
                : "Paquetes preparados para su próximo recorrido"
            }
          />
          <div className="auth-photo-overlay" />
          <span className="auth-photo-tag">
            <span />
            CONECTAMOS CADA ENTREGA
          </span>
          <div className="auth-photo-copy">
            <span>MENOS VUELTAS. MÁS DESTINOS.</span>
            <h2>
              {variant === "register"
                ? "Organizá tus envíos."
                : "Tu logística, en un solo lugar."}
            </h2>
            <p>
              Desde el primer paquete hasta su destino. Organizá, consultá y
              acompañá cada entrega con LogiTrack.
            </p>
            <div className="auth-photo-line">
              <Box size={17} />
              <i />
              <MapPin size={17} />
            </div>
          </div>
          <Link className="auth-photo-link" href="/seguimiento">
            ¿Ya tenés un código? Seguí tu envío
            <ArrowRight size={16} />
          </Link>
        </aside>
        <section className="auth-form-panel">
          <div className="auth-form-inner">
            <p className="auth-eyebrow">
              <ShieldCheck size={14} />
              {badgeText}
            </p>
            <h1>{title}</h1>
            <p className="auth-subtitle">{subtitle}</p>
            {children}
          </div>
          <footer className="auth-form-footer">
            <span>© {new Date().getFullYear()} LogiTrack</span>
            <Link href="/">
              Volver al sitio
              <ArrowRight size={13} />
            </Link>
          </footer>
        </section>
      </div>
    </main>
  );
}
