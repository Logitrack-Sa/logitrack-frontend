export type SseEvent = { event: string; data: string };
export function createSseParser(emit: (event: SseEvent) => void) {
  let pending = '';
  let data: string[] = [];
  let event = 'message';
  const flush = () => {
    if (data.length) emit({ event, data: data.join('\n') });
    data = []; event = 'message';
  };
  function line(value: string) {
    value = value.replace(/\r$/, '');
    if (!value) { flush(); return; }
    if (value.startsWith(':')) return;
    const colon = value.indexOf(':');
    const field = colon < 0 ? value : value.slice(0, colon);
    const content = colon < 0 ? '' : value.slice(colon + 1).replace(/^ /, '');
    if (field === 'data') data.push(content);
    if (field === 'event') event = content || 'message';
    if (data.reduce((size, part) => size + part.length, 0) > 65536) throw new Error('Evento demasiado extenso');
  }
  return {
    push(chunk: string) {
      pending += chunk;
      let end: number;
      while ((end = pending.indexOf('\n')) >= 0) { line(pending.slice(0, end)); pending = pending.slice(end + 1); }
      if (pending.length > 65536) throw new Error('Evento demasiado extenso');
    },
    finish() { if (pending) line(pending); pending = ''; flush(); },
  };
}
export async function consumeSse(body: ReadableStream<Uint8Array>, emit: (text: string) => void, signal: AbortSignal) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let done = false;
  const cancel = () => { void reader.cancel().catch(() => {}); };
  const parser = createSseParser(message => {
    if (message.event === 'error') throw new Error('El asistente no pudo completar la respuesta.');
    if (message.data === '[DONE]') { done = true; return; }
    if (!done) emit(message.data);
  });
  signal.addEventListener('abort', cancel, { once: true });
  try {
    if (signal.aborted) throw new DOMException('Cancelado', 'AbortError');
    while (!done) {
      const chunk = await reader.read();
      if (signal.aborted) throw new DOMException('Cancelado', 'AbortError');
      if (chunk.done) { parser.push(decoder.decode()); parser.finish(); break; }
      parser.push(decoder.decode(chunk.value, { stream: true }));
    }
  } finally {
    signal.removeEventListener('abort', cancel);
    await reader.cancel().catch(() => {}); reader.releaseLock();
  }
}
