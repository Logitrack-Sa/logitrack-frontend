"use client";
import axios from "axios";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { shipmentService } from "@/services/shipment-service";
import type { PublicTrackingResponse } from "@/types/domain";
import { Badge, date } from "@/components/ui";
import {
  SiteIntro,
  TrackingForm,
  SiteFooter,
} from "@/components/site/PublicSite";

function Tracking() {
  const params = useSearchParams();
  const code = (params.get("codigo") || "").trim().toUpperCase();
  const [result, setResult] = useState<{
    code: string;
    data?: PublicTrackingResponse;
    error?: string;
  }>();
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    setResult(undefined);
    if (!code) return;
    if (!/^LT-[A-Z0-9]{10}$/.test(code)) {
      setResult({
        code,
        error:
          "Revisá el código: debe comenzar con LT- y tener 10 letras o números después del guion.",
      });
      return;
    }
    const controller = new AbortController();
    shipmentService
      .publicTracking(code, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult({ code, data });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        const status = axios.isAxiosError(error)
          ? error.response?.status
          : undefined;
        setResult({
          code,
          error:
            status === 404
              ? "No encontramos un envío con ese código. Revisá que esté escrito correctamente."
              : status === 429
                ? "Hay muchas consultas. Esperá un minuto y volvé a intentar."
                : "No pudimos consultar el envío. Volvé a intentar en unos momentos.",
        });
      });
    return () => controller.abort();
  }, [code, attempt]);
  const current = result?.code === code ? result : undefined;
  return (
    <main className="cargo-site">
      <SiteIntro eyebrow="SEGUIMIENTO DE ENVÍOS" title="Tu envío, más cerca.">
        <p>
          Consultá el estado y los movimientos con tu código. Sin iniciar
          sesión.
        </p>
      </SiteIntro>
      <section className="cargo-section cargo-tracking-page">
        <TrackingForm />
        {!code ? (
          <p>
            Encontrá el código en el comprobante o pedíselo a quien te envió el
            paquete.
          </p>
        ) : !current ? (
          <p role="status">Consultando el envío…</p>
        ) : current.error ? (
          <div>
            <p role="alert">{current.error}</p>
            <button
              type="button"
              className="button secondary"
              onClick={() => setAttempt((value) => value + 1)}
            >
              Volver a consultar
            </button>
          </div>
        ) : (
          current.data && (
            <article
              className="card public-tracking-result"
              aria-label="Resultado del seguimiento"
            >
              <p className="eyebrow">TU ENVÍO</p>
              <h2>{current.data.trackingCode}</h2>
              <Badge status={current.data.status} />
              <p>Registrado el {date(current.data.createdAt)}</p>
              <h3>Movimientos del envío</h3>
              {current.data.movements.length ? (
                <ol className="public-tracking-timeline">
                  {current.data.movements.map((movement, index) => (
                    <li key={`${movement.changedAt}-${index}`}>
                      <Badge status={movement.status} />
                      <time dateTime={movement.changedAt}>
                        {date(movement.changedAt)}
                      </time>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>
                  El envío fue registrado. Todavía no tiene movimientos
                  adicionales.
                </p>
              )}
              <p>
                Por privacidad, esta consulta no muestra datos personales ni
                direcciones.
              </p>
            </article>
          )
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
