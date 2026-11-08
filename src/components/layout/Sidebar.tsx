"use client";
// Adaptado de 4lexxe/DevsProject dashboard-admin/src/dashboard/layout/Sidebar.tsx.
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Truck,
  Package,
  MessageSquare,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
export function Sidebar() {
  const pathname = usePathname();
  const { hasRole } = useAuth();
  const items = [
    {
      icon: ShieldCheck,
      label: "Cuentas",
      path: "/admin",
      show: hasRole("ADMIN"),
    },
    { icon: LayoutDashboard, label: "Resumen", path: "/dashboard", show: true },
    { icon: Package, label: "Envíos", path: "/shipments", show: true },
    {
      icon: Users,
      label: "Clientes",
      path: "/customers",
      show: hasRole("ADMIN"),
    },
    {
      icon: Truck,
      label: "Repartidores",
      path: "/couriers",
      show: hasRole("ADMIN"),
    },
    { icon: MessageSquare, label: "LogiBot", path: "/chat", show: true },
  ];
  return (
    <aside className="sidebar">
      <Link href="/" className="brand">
        <span className="brand-icon">
          <Package size={22} />
        </span>
        LogiTrack<span className="brand-dot">.</span>
      </Link>
      <p className="sidebar-caption">ESPACIO DE TRABAJO</p>
      <nav aria-label="Navegación principal">
        {items
          .filter((i) => i.show)
          .map(({ icon: Icon, ...item }) => (
            <Link
              key={item.path}
              href={item.path}
              className={pathname.startsWith(item.path) ? "active" : ""}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          ))}
      </nav>
      <div className="sidebar-footer">
        <p>
          Todo tu recorrido,
          <br />
          <strong>en un solo lugar.</strong>
        </p>
        <Link href="/" className="sidebar-home">
          Ver sitio web <ArrowUpRight size={15} />
        </Link>
      </div>
    </aside>
  );
}
