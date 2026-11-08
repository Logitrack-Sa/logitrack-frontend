"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { shipmentService } from "@/services/shipment-service";
import {
  SiteIntro,
  TrackingForm,
  SiteFooter,
} from "@/components/site/PublicSite";
function Tracking() {
  const params = useSearchParams();
  const code = (params.get("codigo") || "").trim();
  const { user, ready } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!ready || !user || !code) return;
    let active = true;
    setError(false);
    shipmentService
      .tracking(code)
      .then((s) => {
        if (active) router.push("/shipments/" + s.id);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [code, ready, user?.sub, router]);
  const destination =
    "/seguimiento" + (code ? "?codigo=" + encodeURIComponent(code) : "");
  return (
    <main className="cargo-site">
      <SiteIntro eyebrow="SEGUIMIENTO DE ENVÍOS" title="Tu envío, más cerca.">
        <p>Ingresá tu código para consultar su estado e historial.</p>
      </SiteIntro>
      <section className="cargo-section cargo-tracking-page">
        <TrackingForm />
        {!ready ? (
          <p role="status">Comprobando tu sesión…</p>
        ) : !user ? (
          <div className="cargo-login-note">
            <h2>Consultá de forma segura</h2>
            <p>
              Iniciá sesión con la cuenta vinculada a tu envío para acceder a su
              información.
            </p>
            <Link
              className="button"
              href={"/login?redirect=" + encodeURIComponent(destination)}
            >
              Iniciar sesión →
            </Link>
          </div>
        ) : code ? (
          <p role={error ? "alert" : "status"}>
            {error
              ? "No pudimos consultar ese envío. Revisá el código y que pertenezca a tu cuenta."
              : "Consultando el envío " + code + "…"}
          </p>
        ) : (
          <p>Encontrá el código en el detalle del envío registrado.</p>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
export default function Page() {
  return (
    <Suspense fallback={<p>Cargando seguimiento…</p>}>
      <Tracking />
    </Suspense>
  );
}
