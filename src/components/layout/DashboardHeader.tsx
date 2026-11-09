"use client";
import {
  ChevronDown,
  ChevronRight,
  CircleHelp,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { shipmentService } from "@/services/shipment-service";
import { handleApiError } from "@/types/api-error";
import { Sidebar } from "./Sidebar";
export function DashboardHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const name = user?.name || user?.username || "Mi cuenta";
  const section =
    (
      {
        dashboard: "Resumen",
        shipments: "Envíos",
        customers: "Clientes",
        couriers: "Repartidores",
        admin: "Cuentas y accesos",
        chat: "LogiBot",
      } as Record<string, string>
    )[pathname.split("/")[1]] || "Mi espacio";
  const roles = user?.roles || [];
  const role = roles.includes("ADMIN")
    ? "Administración"
    : roles.includes("REPARTIDOR")
      ? "Repartidor"
      : "Cliente";
  async function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = String(
      new FormData(e.currentTarget).get("tracking") || "",
    ).trim();
    if (!code || searching) return;
    setSearching(true);
    try {
      const shipment = await shipmentService.tracking(code);
      router.push("/shipments/" + shipment.id);
    } catch (error) {
      handleApiError(error);
    } finally {
      setSearching(false);
    }
  }
  return (
    <header className="ops-header">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button
            className="ops-icon-button ops-mobile-menu"
            aria-label="Abrir menú"
          >
            <Menu size={20} />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="ops-menu-overlay" />
          <Dialog.Content className="ops-mobile-panel">
            <Dialog.Title className="sr-only">Menú de LogiTrack</Dialog.Title>
            <Dialog.Description className="sr-only">
              Navegá por los envíos y las opciones de tu cuenta.
            </Dialog.Description>
            <Sidebar onNavigate={() => setOpen(false)} />
            <Dialog.Close className="ops-menu-close" aria-label="Cerrar menú">
              <X size={20} />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div className="ops-breadcrumb">
        <span>Mi espacio</span>
        <ChevronRight size={14} />
        <strong>{section}</strong>
      </div>
      <form className="ops-search" onSubmit={search}>
        <Search size={17} />
        <input
          name="tracking"
          aria-label="Buscar envío por seguimiento"
          placeholder="Buscar por código de seguimiento"
          maxLength={50}
        />
        <button disabled={searching} aria-label="Buscar envío">
          {searching ? "Buscando…" : <span>↵</span>}
        </button>
      </form>
      <Link
        href="/ayuda"
        className="ops-icon-button ops-header-help"
        aria-label="Centro de ayuda"
      >
        <CircleHelp size={19} />
      </Link>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="ops-account">
          <span className="ops-avatar">{name.slice(0, 1).toUpperCase()}</span>
          <span className="ops-account-name">
            <strong>{name}</strong>
            <small>{role}</small>
          </span>
          <ChevronDown size={14} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="ops-account-menu"
            align="end"
            sideOffset={10}
          >
            <DropdownMenu.Label className="ops-account-label">
              {user?.email || name}
            </DropdownMenu.Label>
            <DropdownMenu.Separator className="ops-menu-separator" />
            <DropdownMenu.Item asChild>
              <Link href="/ayuda">
                <CircleHelp size={16} /> Ayuda y consultas
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={logout}>
              <LogOut size={16} /> Cerrar sesión
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </header>
  );
}
