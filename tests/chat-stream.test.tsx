import { act, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useChatStream } from "@/hooks/useChatStream";
vi.mock("@/lib/session", () => ({
  getToken: () => "test-only-token",
  clearSession: vi.fn(),
}));
afterEach(() => vi.unstubAllGlobals());
it("permite consultas públicas sin enviar el token de la cuenta", async () => {
  const fetchMock = vi
    .fn()
    .mockResolvedValue(
      new Response(
        JSON.stringify({ message: "Usá Seguimiento con tu código." }),
        { headers: { "Content-Type": "application/json" } },
      ),
    );
  vi.stubGlobal("fetch", fetchMock);
  const { result } = renderHook(() => useChatStream(true));
  await act(async () => {
    await result.current.send("¿Cómo sigo un envío?");
  });
  expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined();
  expect(fetchMock.mock.calls[0][1].method).toBe("POST");
  expect(new URL(fetchMock.mock.calls[0][0]).pathname).toBe(
    "/api/v1/chat/public/message",
  );
  expect(result.current.messages.at(-1)?.text).toContain("Seguimiento");
});
it("envía Bearer por fetch y reconstruye el mensaje sin mostrar marcadores SSE", async () => {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(
        new TextEncoder().encode(
          "data: Hola\n\ndata:  mundo\n\ndata: [DONE]\n\n",
        ),
      );
      controller.close();
    },
  });
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(stream, {
      headers: { "content-type": "text/event-stream" },
    }),
  );
  vi.stubGlobal("fetch", fetchMock);
  const { result } = renderHook(() => useChatStream());
  await act(async () => {
    await result.current.send("¿Dónde está mi envío?");
  });
  expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
    "Bearer test-only-token",
  );
  expect(new URL(fetchMock.mock.calls[0][0]).pathname).toBe(
    "/api/v1/chat/stream",
  );
  expect(result.current.messages.at(-1)?.text).toBe("Hola mundo");
  expect(result.current.loading).toBe(false);
});
it("muestra indisponibilidad sin presentar un error HTTP como respuesta del asistente", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response("{}", { status: 503 })),
  );
  const { result } = renderHook(() => useChatStream());
  await act(async () => {
    await result.current.send("Consultar");
  });
  expect(result.current.error).toContain("no está disponible");
  expect(result.current.messages.at(-1)?.text).toBe("");
});
