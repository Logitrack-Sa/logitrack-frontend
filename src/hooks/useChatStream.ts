"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { gatewayUrl } from "@/lib/api-client";
import { clearSession, getToken } from "@/lib/session";
import { consumeSse } from "@/lib/sse";
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
}
export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);
  const cancel = useCallback(() => {
    controller.current?.abort();
  }, []);
  useEffect(() => cancel, [cancel]);
  const send = async (prompt: string) => {
    if (controller.current || !prompt.trim()) return;
    const token = getToken();
    if (!token) {
      setError("Iniciá sesión para consultar al asistente.");
      return;
    }
    const request = new AbortController();
    controller.current = request;
    const timeout = setTimeout(() => {
      setError("El asistente tardó demasiado. Intentá nuevamente.");
      request.abort();
    }, 90000);
    const id = crypto.randomUUID();
    let received = 0;
    setMessages((previous) => [
      ...previous,
      { id: crypto.randomUUID(), role: "user", text: prompt.trim() },
      { id, role: "assistant", text: "" },
    ]);
    setLoading(true);
    setError("");
    try {
      const url = new URL("/api/v1/chat/stream", gatewayUrl);
      url.searchParams.set("prompt", prompt.trim());
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
        signal: request.signal,
        cache: "no-store",
      });
      if (response.status === 401) {
        clearSession();
        throw new Error("Tu sesión venció. Volvé a iniciar sesión.");
      }
      if (response.status === 403)
        throw new Error("Tu cuenta no tiene permiso para usar el asistente.");
      if (
        !response.ok ||
        !response.body ||
        !response.headers.get("content-type")?.includes("text/event-stream")
      )
        throw new Error("El asistente no está disponible. Intentá nuevamente.");
      await consumeSse(
        response.body,
        (text) => {
          received += text.length;
          if (received > 200000)
            throw new Error("La respuesta superó el límite permitido.");
          setMessages((previous) =>
            previous.map((message) =>
              message.id === id
                ? { ...message, text: message.text + text }
                : message,
            ),
          );
        },
        request.signal,
      );
    } catch (reason) {
      if (!request.signal.aborted)
        setError(
          reason instanceof Error
            ? reason.message
            : "No pudimos conectar con el asistente.",
        );
    } finally {
      clearTimeout(timeout);
      controller.current = null;
      setLoading(false);
    }
  };
  return { messages, loading, error, send, cancel };
}
