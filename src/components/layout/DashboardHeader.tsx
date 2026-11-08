"use client";
// Adaptado de DevsProject: cabecera y sesión conectadas a la autenticación de Logitrack.
import { LogOut, UserRound, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { shipmentService } from "@/services/shipment-service";
import { handleApiError } from "@/types/api-error";
import type { FormEvent } from "react";
export function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  async function search(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = String(
      new FormData(e.currentTarget).get("tracking") || "",
    ).trim();
    if (!code) return;
    try {
      const shipment = await shipmentService.tracking(code);
      router.push("/shipments/" + shipment.id);
    } catch (error) {
      handleApiError(error);
    }
  }
  return (
    <header className="topbar">
      <form className="dashboard-search" onSubmit={search}>
        <Search size={17} />
        <input
          name="tracking"
          aria-label="Buscar envío por seguimiento"
          placeholder="Buscar un envío por seguimiento"
        />
        <button type="submit">Buscar</button>
      </form>
      <div className="dashboard-session">
        <span className="session-avatar">
          <UserRound size={18} />
        </span>
        <div>
          <strong>
            {user?.name || user?.username || user?.email || "Mi cuenta"}
          </strong>
          <small>{user?.roles.join(" · ")}</small>
        </div>
        <button
          className="text-button"
          aria-label="Cerrar sesión"
          onClick={logout}
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
