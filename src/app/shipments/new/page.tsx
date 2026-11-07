"use client";
import Link from "next/link";
import { Access, PageHeader } from "@/components/ui";
import { ShipmentForm } from "@/components/shipments/ShipmentForm";
export default function Page() {
  return (
    <Access roles={["ADMIN", "CLIENTE"]}>
      <Link href="/shipments">← Envíos</Link>
      <PageHeader
        title="Nuevo envío"
        description="Completá el recorrido y los datos del paquete."
      />
      <ShipmentForm />
    </Access>
  );
}
