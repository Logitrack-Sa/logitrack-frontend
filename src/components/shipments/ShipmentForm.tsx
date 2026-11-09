"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { shipmentService } from "@/services/shipment-service";
import { handleApiError } from "@/types/api-error";
import type { AddressDto } from "@/types/domain";
import { Field, Notice } from "@/components/ui";
import { CustomerPicker } from "@/components/customers/CustomerPicker";

function AddressFields({
  prefix,
  label,
  errors,
}: {
  prefix: string;
  label: string;
  errors: Record<string, string>;
}) {
  return (
    <fieldset className="form">
      <legend>{label}</legend>
      <div className="form-grid">
        {[
          ["street", "Calle"],
          ["number", "Número"],
          ["city", "Ciudad"],
          ["postalCode", "Código postal"],
        ].map(([key, text]) => (
          <Field
            key={key}
            label={text}
            name={`${prefix}.${key}`}
            required
            maxLength={120}
            error={errors[`${prefix}.${key}`]}
          />
        ))}
      </div>
    </fieldset>
  );
}
export function ShipmentForm() {
  const { user, hasRole, logout } = useAuth();
  const [customerId, setCustomerId] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const blocked =
    user?.email_verified === false || (!hasRole("ADMIN") && !user?.customerId);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (blocked) return;
    const form = new FormData(event.currentTarget);
    const address = (prefix: string) =>
      Object.fromEntries(
        ["street", "number", "city", "postalCode"].map((key) => [
          key,
          String(form.get(`${prefix}.${key}`)).trim(),
        ]),
      ) as unknown as AddressDto;
    setBusy(true);
    setErrors({});
    try {
      const result = await shipmentService.create({
        customerId: hasRole("ADMIN") ? customerId : user!.customerId!,
        origin: address("origin"),
        destination: address("destination"),
        weightKg: Number(form.get("weightKg")),
        widthCm: Number(form.get("widthCm")),
        heightCm: Number(form.get("heightCm")),
        lengthCm: Number(form.get("lengthCm")),
      });
      toast.success("Envío creado correctamente");
      router.push(`/shipments/${result.id}`);
    } catch (error) {
      handleApiError(error, setErrors);
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="card form" onSubmit={submit}>
      {user?.email_verified === false && (
        <Notice>Confirmá tu correo para crear envíos.</Notice>
      )}
      {!hasRole("ADMIN") && !user?.customerId && (
        <Notice>
          Tu cuenta todavía no tiene un cliente vinculado. Contactá al
          administrador.
        </Notice>
      )}
      {hasRole("ADMIN") ? (
        <CustomerPicker
          value={customerId}
          onChange={setCustomerId}
          error={errors.customerId}
        />
      ) : (
        <p>El envío quedará asociado a tu cuenta de cliente.</p>
      )}
      <AddressFields
        prefix="origin"
        label="Dirección de origen"
        errors={errors}
      />
      <AddressFields
        prefix="destination"
        label="Dirección de destino"
        errors={errors}
      />
      <fieldset className="form">
        <legend>Características del paquete</legend>
        <div className="form-grid">
          {[
            ["weightKg", "Peso (kg)"],
            ["widthCm", "Ancho (cm)"],
            ["heightCm", "Alto (cm)"],
            ["lengthCm", "Largo (cm)"],
          ].map(([key, label]) => (
            <Field
              key={key}
              label={label}
              name={key}
              type="number"
              min="0.01"
              step="0.01"
              required
              error={errors[key]}
            />
          ))}
        </div>
      </fieldset>
      <p>
        La tarifa se calcula al registrar el envío, según el peso y las
        dimensiones.
      </p>
      <button
        className="button"
        disabled={busy || blocked || (hasRole("ADMIN") && !customerId)}
      >
        {busy ? "Creando envío…" : "Crear envío →"}
      </button>
    </form>
  );
}
