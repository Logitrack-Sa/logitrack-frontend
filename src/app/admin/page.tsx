"use client";
import { useCallback, useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { Access, PageHeader, Pagination, ErrorState } from "@/components/ui";
import { useRemote } from "@/hooks/useRemote";
import { userService, type AccountRole } from "@/services/user-service";
import { handleApiError } from "@/types/api-error";
import type { UserResponse } from "@/types/domain";
function Accounts() {
  const [page, setPage] = useState(0);
  const load = useCallback(
    (s: AbortSignal) => userService.list(page, s),
    [page],
  );
  const { data, loading, error, reload } = useRemote(load);
  const [selected, setSelected] = useState<UserResponse | null>(null);
  const [role, setRole] = useState<AccountRole>("CLIENTE");
  const [busy, setBusy] = useState(false);
  const [formKey, setFormKey] = useState(0);
  function edit(user: UserResponse) {
    setSelected(user);
    setRole(
      user.roles.some((r) => r.endsWith("REPARTIDOR"))
        ? "REPARTIDOR"
        : "CLIENTE",
    );
    setFormKey((v) => v + 1);
  }
  function reset() {
    setSelected(null);
    setRole("CLIENTE");
    setFormKey((v) => v + 1);
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const id = String(f.get("identity") || "").trim();
    setBusy(true);
    try {
      if (selected) await userService.link(selected.id, role, id);
      else
        await userService.create({
          name: String(f.get("name")),
          email: String(f.get("email")),
          username: String(f.get("username") || "") || undefined,
          password: String(f.get("password")),
          roles: [role],
          ...(role === "CLIENTE" ? { customerId: id } : { courierId: id }),
        });
      toast.success(
        selected
          ? "Vínculo actualizado. La persona debe volver a iniciar sesión."
          : "Cuenta creada y vinculada.",
      );
      reset();
      reload();
    } catch (err) {
      handleApiError(err);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeader
        title="Cuentas y vínculos"
        description="Conectá las cuentas de acceso con las fichas de clientes y repartidores."
      />
      <div className="account-layout">
        <section className="card">
          <h2>Cuentas del sistema</h2>
          {loading ? (
            <p role="status">Cargando cuentas…</p>
          ) : error ? (
            <ErrorState retry={reload} />
          ) : (
            data && (
              <>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Cuenta</th>
                        <th>Rol y verificación</th>
                        <th>Vínculo</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {data.content.map((u) => (
                        <tr key={u.id}>
                          <td>
                            <strong>{u.name || u.username || u.email}</strong>
                            <p>{u.email}</p>
                          </td>
                          <td>
                            {u.roles.join(" · ")}
                            <p>
                              {u.emailVerified
                                ? "Verificada"
                                : "Pendiente de verificación"}
                            </p>
                          </td>
                          <td className="account-identity">
                            {u.customerId || u.courierId || "Sin vínculo"}
                          </td>
                          <td>
                            {u.roles.some(
                              (r) =>
                                r.endsWith("CLIENTE") ||
                                r.endsWith("REPARTIDOR"),
                            ) && (
                              <button
                                className="text-button"
                                onClick={() => edit(u)}
                              >
                                Vincular
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination page={data} onChange={setPage} />
              </>
            )
          )}
        </section>
        <section className="card">
          <h2>{selected ? "Vincular cuenta" : "Nueva cuenta vinculada"}</h2>
          <p>
            {selected
              ? selected.email
              : "Primero creá la ficha en Clientes o Repartidores y copiá su identificador."}
          </p>
          <form className="form" key={formKey} onSubmit={submit}>
            {!selected && (
              <>
                <label>
                  Nombre
                  <input name="name" required maxLength={200} />
                </label>
                <label>
                  Correo electrónico
                  <input name="email" type="email" required maxLength={254} />
                </label>
                <label>
                  Usuario (opcional)
                  <input name="username" maxLength={100} />
                </label>
                <label>
                  Contraseña inicial
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    maxLength={100}
                    autoComplete="new-password"
                  />
                </label>
              </>
            )}
            <label>
              Tipo de cuenta
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AccountRole)}
              >
                {(!selected ||
                  selected.roles.some((r) => r.endsWith("CLIENTE"))) && (
                  <option value="CLIENTE">Cliente</option>
                )}
                {(!selected ||
                  selected.roles.some((r) => r.endsWith("REPARTIDOR"))) && (
                  <option value="REPARTIDOR">Repartidor</option>
                )}
              </select>
            </label>
            <label>
              {role === "CLIENTE" ? "ID de cliente" : "ID de repartidor"}
              <input
                key={role}
                name="identity"
                required
                defaultValue={
                  selected
                    ? (role === "CLIENTE"
                        ? selected.customerId
                        : selected.courierId) || ""
                    : ""
                }
                placeholder="UUID de la ficha existente"
                pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}"
              />
            </label>
            <p className="muted">
              Se comprueba que la ficha exista antes de guardar. Los vínculos
              nuevos requieren volver a iniciar sesión.
            </p>
            <div className="actions">
              <button className="button" disabled={busy}>
                {busy
                  ? "Guardando…"
                  : selected
                    ? "Guardar vínculo"
                    : "Crear cuenta"}
              </button>
              {selected && (
                <button
                  className="button secondary"
                  type="button"
                  disabled={busy}
                  onClick={reset}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
export default function Page() {
  return (
    <Access roles={["ADMIN"]}>
      <Accounts />
    </Access>
  );
}
