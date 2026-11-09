"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChevronRight,
  CircleHelp,
  LayoutGrid,
  MessageSquare,
  Package,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { withBasePath } from "@/lib/deployment";
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { hasRole } = useAuth();
  const groups = [
    {
      label: "TU ESPACIO",
      items: [
        { icon: LayoutGrid, label: "Resumen", path: "/dashboard" },
        { icon: Package, label: "Envíos", path: "/shipments" },
        { icon: MessageSquare, label: "LogiBot", path: "/chat" },
      ],
    },
    ...(hasRole("ADMIN")
      ? [
          {
            label: "ADMINISTRACIÓN",
            items: [
              { icon: Users, label: "Clientes", path: "/customers" },
              { icon: Truck, label: "Repartidores", path: "/couriers" },
              { icon: ShieldCheck, label: "Cuentas y accesos", path: "/admin" },
            ],
          },
        ]
      : []),
  ];
  return (
    <aside className="ops-sidebar">
      <Link href="/dashboard" className="ops-brand" onClick={onNavigate} aria-label="LogiTrack - Dashboard">
        <img
          src={withBasePath("/LOGO_GENERAL.png")}
          alt="LogiTrack"
          className="ops-brand-logo"
        />
      </Link>
      <div className="ops-workspace-label">
        <span className="ops-workspace-icon">L</span>
        <div>
          <strong>Mi espacio de trabajo</strong>
          <small>Gestión logística</small>
        </div>
        <ChevronRight size={14} />
      </div>
      <nav aria-label="Navegación principal">
        {groups.map((group) => (
          <div className="ops-nav-group" key={group.label}>
            <p>{group.label}</p>
            {group.items.map(({ icon: Icon, label, path }) => {
              const active =
                pathname === path || pathname.startsWith(path + "/");
              return (
                <Link
                  key={path}
                  href={path}
                  aria-current={active ? "page" : undefined}
                  className={active ? "is-active" : ""}
                  onClick={onNavigate}
                >
                  <Icon size={18} strokeWidth={1.7} />
                  <span>{label}</span>
                  {active && <ChevronRight size={14} />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="ops-sidebar-bottom">
        <div className="ops-help-card">
          <CircleHelp size={22} />
          <strong>Estamos para ayudarte</strong>
          <p>Encontrá respuestas y prepará tu próximo envío.</p>
          <Link href="/ayuda" onClick={onNavigate}>
            Centro de ayuda <ArrowUpRight size={14} />
          </Link>
        </div>
        <Link className="ops-back-site" href="/" onClick={onNavigate}>
          Ir al sitio web <ArrowUpRight size={16} />
        </Link>
        <span className="ops-sidebar-footnote">CADA ENTREGA NOS CONECTA</span>
      </div>
    </aside>
  );
}
