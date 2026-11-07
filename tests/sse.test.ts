import { expect, it } from 'vitest';
import { consumeSse, createSseParser, type SseEvent } from '@/lib/sse';
it('reconstruye eventos cortados, CRLF, comentarios y datos multilínea', () => {
  const events: SseEvent[] = [];
  const parser = createSseParser(event => events.push(event));
  ['data: Ho', 'la\r', '\n\r\n:keepalive\n\ndata: uno\ndata:', ' dos\n\n'].forEach(chunk => parser.push(chunk));
  parser.finish();
  expect(events).toEqual([{ event: 'message', data: 'Hola' }, { event: 'message', data: 'uno\ndos' }]);
});
it('reconstruye UTF-8 cuando se divide en medio de una letra', async () => {
  const bytes = new TextEncoder().encode('data: envío\n\ndata: [DONE]\n\ndata: ignorar\n\n');
  const stream = new ReadableStream<Uint8Array>({ start(controller) { for (const byte of bytes) controller.enqueue(Uint8Array.of(byte)); controller.close(); } });
  let text = '';
  await consumeSse(stream, chunk => { text += chunk; }, new AbortController().signal);
  expect(text).toBe('envío');
});
it('rechaza eventos de error y cancela el lector', async () => {
  const stream = new ReadableStream<Uint8Array>({ start(controller) { controller.enqueue(new TextEncoder().encode('event: error\ndata: fallo\n\n')); } });
  await expect(consumeSse(stream, () => {}, new AbortController().signal)).rejects.toThrow('no pudo completar');
});
it('libera el stream al cancelar mientras espera datos', async () => {
  const controller = new AbortController();
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({ cancel() { cancelled = true; } });
  const result = consumeSse(stream, () => {}, controller.signal);
  controller.abort();
  await expect(result).rejects.toMatchObject({ name: 'AbortError' });
  expect(cancelled).toBe(true);
});
