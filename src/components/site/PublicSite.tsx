"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { withBasePath } from "@/lib/deployment";
export function SiteIcon({ name }: { name: string }) {
  return (
    <img
      className="cargo-icon"
      src={withBasePath("/reference-icons/" + name + ".svg")}
      alt=""
      width={62}
      height={62}
    />
  );
}
export function TrackingForm() {
  const router = useRouter();
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("code") || "").trim();
    if (code) router.push("/seguimiento?codigo=" + encodeURIComponent(code));
  }
  return (
    <form className="cargo-tracking" onSubmit={submit}>
      <label className="sr-only" htmlFor="tracking-public">
        Código de seguimiento
      </label>
      <input
        id="tracking-public"
        name="code"
        placeholder="Ingresá tu código de seguimiento"
        required
        maxLength={50}
      />
      <button type="submit">Seguí tu envío</button>
    </form>
  );
}
export function ServiceCards() {
  return (
    <div className="cargo-products">
      {[
        {
          icon: "puerta-puerta",
          title: "Envíos de origen a destino",
          text: "Registrá las direcciones de origen y destino, el peso y las dimensiones de tu paquete.",
          href: "/shipments/new",
        },
        {
          icon: "agencia-agencia",
          title: "Gestión de entregas",
          text: "Coordiná repartidores y consultá el estado de las entregas desde el panel de operaciones.",
          href: "/dashboard",
        },
        {
          icon: "entrega",
          title: "Seguimiento e historial",
          text: "Consultá el estado actual y los movimientos registrados de los envíos de tu cuenta.",
          href: "/seguimiento",
        },
      ].map((s) => (
        <article key={s.title}>
          <SiteIcon name={s.icon} />
          <h3>{s.title}</h3>
          <p>{s.text}</p>
          <Link href={s.href} className="cargo-more">
            Ver más →
          </Link>
        </article>
      ))}
    </div>
  );
}
export function PackingSteps() {
  return (
    <div className="cargo-steps">
      {[
        [
          "metodo",
          "Registrá tu envío",
          "Completá los datos de origen, destino y del paquete.",
        ],
        [
          "seguro",
          "Prepará tu paquete",
          "Usá una caja resistente y protegé el contenido.",
        ],
        [
          "agencia",
          "Coordiná la entrega",
          "Un administrador puede asignar un repartidor.",
        ],
        [
          "entrega",
          "Guardá tu seguimiento",
          "Consultá el estado y el historial desde tu cuenta.",
        ],
      ].map(([icon, title, text], i) => (
        <article key={icon}>
          <SiteIcon name={icon} />
          <span>PASO 0{i + 1}</span>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
    </div>
  );
}
export function Faq() {
  return (
    <div className="cargo-faq">
      {[
        [
          "¿Cómo consulto mi envío?",
          "Ingresá el código de seguimiento e iniciá sesión. Podrás consultar los envíos a los que tiene acceso tu cuenta.",
        ],
        [
          "¿Cómo conozco el costo?",
          "Al registrar un envío, el sistema calcula su tarifa a partir de los datos del paquete. El importe queda disponible en el detalle del envío.",
        ],
        [
          "¿Qué necesito para preparar el paquete?",
          "Protegé el contenido, utilizá un embalaje resistente y verificá que los datos de origen y destino estén completos.",
        ],
        [
          "¿Qué hago si no veo un envío?",
          "Revisá el código y la cuenta con la que ingresaste. Cada cliente puede acceder a sus propios envíos; la administración gestiona las asignaciones.",
        ],
      ].map(([q, a]) => (
        <details key={q}>
          <summary>
            {q}
            <span>+</span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
export function SiteFooter() {
  return (
    <footer className="cargo-footer">
      <div>
        <Link href="/" className="cargo-logo">
          LogiTrack.
        </Link>
        <p>Conectamos la información de cada entrega.</p>
      </div>
      {[
        [
          "ACCESOS",
          ["Seguimiento", "/seguimiento"],
          ["Crear envío", "/shipments/new"],
          ["Mi cuenta", "/dashboard"],
        ],
        [
          "SERVICIOS",
          ["Envíos", "/servicios"],
          ["Operaciones", "/dashboard"],
          ["Repartidores", "/couriers"],
        ],
        [
          "SOPORTE",
          ["Preparar un envío", "/ayuda"],
          ["Preguntas frecuentes", "/ayuda#preguntas"],
          ["Sobre LogiTrack", "/nosotros"],
        ],
      ].map(([title, ...links]) => (
        <div key={String(title)}>
          <h3>{String(title)}</h3>
          {(links as string[][]).map(([text, href]) => (
            <Link key={text} href={href}>
              {text}
            </Link>
          ))}
        </div>
      ))}
      <small>
        © {new Date().getFullYear()} LogiTrack · Plataforma de gestión
        logística.
      </small>
    </footer>
  );
}
export function SiteIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cargo-intro">
      <p>{eyebrow}</p>
      <h1>{title}</h1>
      {children}
    </section>
  );
}
