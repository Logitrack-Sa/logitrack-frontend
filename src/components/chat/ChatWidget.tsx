"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useChatStream } from "@/hooks/useChatStream";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

/** Markdown básico con nodos React; nunca interpreta HTML recibido del modelo. */
function MessageText({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
        .map((part, index) =>
          part.startsWith("**") ? (
            <strong key={index}>{part.slice(2, -2)}</strong>
          ) : part.startsWith("`") ? (
            <code key={index}>{part.slice(1, -1)}</code>
          ) : (
            part
          ),
        )}
    </>
  );
}
export function ChatWidget() {
  const { user } = useAuth();
  const pathname = usePathname();
  const publicMode = [
    "/",
    "/servicios",
    "/ayuda",
    "/nosotros",
    "/seguimiento",
  ].includes(pathname);
  return publicMode || user ? (
    <ChatPanel
      key={publicMode ? "public" : user!.sub}
      publicMode={publicMode}
    />
  ) : null;
}
function ChatPanel({ publicMode }: { publicMode: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { messages, loading, error, send, cancel } = useChatStream(publicMode);
  const bottom = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pathname === "/chat") setOpen(true);
  }, [pathname]);
  useEffect(() => {
    if (open) bottom.current?.scrollIntoView({ block: "nearest" });
  }, [messages, open]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const prompt = String(new FormData(form).get("prompt") ?? "").trim();
    if (!prompt || loading) return;
    void send(prompt);
    form.reset();
  }
  return (
    <div className="chat-container">
      {open && (
        <section className="chat-panel" aria-label="Asistente LogiBot">
          <header>
            <div>
              <h2>LogiBot</h2>
              <span>Tu asistente de consultas logísticas</span>
            </div>
            <button
              className="text-button"
              aria-label="Cerrar asistente"
              onClick={() => {
                cancel();
                setOpen(false);
              }}
            >
              ✕
            </button>
          </header>
          <div className="chat-messages" role="log" aria-live="polite">
            {!messages.length && (
              <p>
                {publicMode
                  ? "Hola, ¿en qué te puedo ayudar?"
                  : "Hola. Consultame por el seguimiento de un envío o la disponibilidad de repartidores."}
              </p>
            )}
            {messages.map((message) => (
              <div key={message.id} className={`chat-message ${message.role}`}>
                <small>{message.role === "user" ? "Vos" : "LogiBot"}</small>
                <p>
                  <MessageText
                    text={
                      message.text ||
                      (loading ? "Consultando…" : "Respuesta interrumpida.")
                    }
                  />
                </p>
              </div>
            ))}
            <div ref={bottom} />
          </div>
          {error && (
            <p className="chat-error" role="alert">
              {error}
            </p>
          )}
          <form onSubmit={submit}>
            <input
              name="prompt"
              aria-label="Consulta al asistente"
              placeholder="Escribí tu consulta…"
              required
              maxLength={2000}
              disabled={loading}
            />
            <button className="button" disabled={loading}>
              {loading ? "…" : "Enviar"}
            </button>
          </form>
          {loading && (
            <button className="text-button" onClick={cancel}>
              Detener respuesta
            </button>
          )}
        </section>
      )}
      <button
        className="chat-trigger"
        aria-expanded={open}
        onClick={() => {
          if (open) cancel();
          setOpen(!open);
        }}
      >
        ✦ {open ? "Cerrar asistente" : "Consultar a LogiBot"}
      </button>
    </div>
  );
}
