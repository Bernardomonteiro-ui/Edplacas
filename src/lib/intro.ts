/** Executa `cb` quando a abertura da página terminar (ou imediatamente, se já terminou). */
export function onIntroDone(cb: () => void) {
  const w = window as Window & { __introDone?: boolean };
  if (w.__introDone) {
    cb();
    return () => {};
  }
  const h = () => cb();
  window.addEventListener("intro:done", h, { once: true });
  return () => window.removeEventListener("intro:done", h);
}
