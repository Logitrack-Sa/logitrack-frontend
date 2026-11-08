"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { VerificationBanner } from "@/components/auth/VerificationBanner";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, hasRole } = useAuth();
  if (
    ["/", "/login", "/register", "/verify-email", "/unauthorized"].includes(
      pathname,
    )
  )
    return (
      <div className="public-page">
        <Navbar />
        {children}
      </div>
    );
  const links = [
    { href: "/shipments", text: "Envíos", show: true },
    { href: "/customers", text: "Clientes", show: hasRole("ADMIN") },
    {
      href: "/couriers",
      text: "Repartidores",
      show: hasRole("ADMIN") || hasRole("REPARTIDOR"),
    },
  ];
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand">
          <span className="brand-icon">L</span>LogiTrack
          <span className="brand-dot">.</span>
        </Link>
        <p className="sidebar-caption">GESTIÓN LOGÍSTICA</p>
        <nav aria-label="Navegación principal">
          {links
            .filter((link) => link.show)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname.startsWith(link.href) ? "active" : ""}
              >
                {link.text}
                <span>↗</span>
              </Link>
            ))}
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot" />
          Tu operación, conectada.
        </div>
      </aside>
      <div className="workspace">
        <div className="topbar">
          <span>
            LogiTrack <span className="muted">/ Plataforma de gestión</span>
          </span>
          {user ? (
            <div className="actions">
              <span className="session-role">{user.roles.join(" · ")}</span>
              <button className="text-button" onClick={logout}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link href="/login">Iniciar sesión →</Link>
          )}
        </div>
        <main className="main-content">
          <VerificationBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
