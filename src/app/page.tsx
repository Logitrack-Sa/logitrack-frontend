"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  Package,
  Route,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
const features = [
  {
    Icon: Package,
    title: "Tus envíos, organizados",
    text: "Creá, consultá y gestioná el estado de cada paquete sin perder de vista los detalles.",
  },
  {
    Icon: Truck,
    title: "Un equipo conectado",
    text: "Coordiná repartidores y consultá su disponibilidad desde tu espacio de trabajo.",
  },
  {
    Icon: ShieldCheck,
    title: "Cada perfil, su espacio",
    text: "Clientes, repartidores y administradores acceden a las operaciones de su rol.",
  },
];
export default function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <main className="marketing-home">
      <section className="home-hero">
        <div>
          <p className="home-kicker">
            <span /> LOGÍSTICA QUE TE CONECTA
          </p>
          <h1>
            Cada entrega,
            <br />
            un nuevo <em>destino.</em>
          </h1>
          <p className="hero-description">
            Tu operación logística merece un lugar donde todo encaje. Organizá
            tus envíos, conectá a tu equipo y seguí cada paso desde una sola
            plataforma.
          </p>
          <div className="hero-buttons">
            <Link
              className="button"
              href={isAuthenticated ? "/dashboard" : "/login"}
            >
              {isAuthenticated ? "Abrir mi panel" : "Entrar a LogiTrack"}
              <ArrowUpRight size={18} />
            </Link>
            <Link
              className="home-secondary"
              href={isAuthenticated ? "/shipments" : "/register"}
            >
              {isAuthenticated ? "Consultar envíos" : "Crear mi cuenta"}{" "}
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-points">
            <span>
              <CheckCircle2 size={16} /> Seguimiento centralizado
            </span>
            <span>
              <CheckCircle2 size={16} /> Acceso por roles
            </span>
          </div>
        </div>
        <div
          className="route-illustration"
          aria-label="Ilustración del recorrido de un envío"
        >
          <span className="illustration-caption">DE PUNTO A PUNTO</span>
          <div className="route-map">
            <div className="route-line" />
            <div className="map-point point-origin">
              <Package />
              <span>Origen</span>
            </div>
            <div className="map-truck">
              <Truck size={36} />
            </div>
            <div className="map-point point-destination">
              <CheckCircle2 />
              <span>Destino</span>
            </div>
          </div>
          <div className="route-caption">
            <span className="route-caption-icon">
              <Route size={24} />
            </span>
            <div>
              <strong>Visibilidad en todo el recorrido</strong>
              <p>Del primer registro a la entrega final.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="home-features">
        <div className="features-heading">
          <p className="eyebrow">MENOS FRICCIÓN. MÁS CONTROL.</p>
          <h2>
            Todo lo que necesitás
            <br />
            para llegar más lejos.
          </h2>
        </div>
        <div className="features-grid">
          {features.map(({ Icon, title, text }) => (
            <article key={title}>
              <span className="feature-icon">
                <Icon size={24} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="home-cta">
        <div>
          <p className="eyebrow">TU PRÓXIMA ENTREGA EMPIEZA ACÁ</p>
          <h2>Hagamos que las cosas lleguen.</h2>
        </div>
        <Link
          href={isAuthenticated ? "/dashboard" : "/login"}
          className="button"
        >
          Ir a mi espacio <ArrowUpRight size={18} />
        </Link>
      </section>
      <footer className="home-footer">
        <strong>LogiTrack.</strong>
        <span>Una operación conectada. Un equipo que avanza.</span>
        <span>© {new Date().getFullYear()} LogiTrack</span>
      </footer>
    </main>
  );
}
