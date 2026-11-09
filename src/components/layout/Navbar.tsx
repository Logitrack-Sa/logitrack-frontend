"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Package, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { withBasePath } from "@/lib/deployment";
export function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <header className="cargo-header">
      <div className="cargo-notice">
        <ShieldCheck size={14} /> Seguí tu envío sin iniciar sesión. Tus datos
        personales siguen protegidos.
      </div>
      <div className="cargo-utility">
        <Link href="/seguimiento">
          <img src={withBasePath("/reference-icons/agencias-1.svg")} alt="" />
          SEGUIMIENTO
        </Link>
        <Link href={isAuthenticated ? "/dashboard" : "/login"}>
          <img src={withBasePath("/reference-icons/ingresar.svg")} alt="" />
          MI LOGITRACK
        </Link>
        {isAuthenticated && <button onClick={logout}>SALIR</button>}
      </div>
      <div className="cargo-nav">
        <Link className="cargo-logo" href="/">
          <Package size={32} />
          <span>
            Logi<span>Track</span>
          </span>
        </Link>
        <button
          className="cargo-toggle"
          aria-label="Abrir navegación"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          className={open ? "is-open" : ""}
          aria-label="Navegación del sitio"
        >
          {[
            ["/servicios", "PRODUCTOS Y SERVICIOS"],
            ["/seguimiento", "SEGUÍ TU ENVÍO"],
            ["/ayuda", "ATENCIÓN AL CLIENTE"],
            ["/nosotros", "NOSOTROS"],
          ].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
