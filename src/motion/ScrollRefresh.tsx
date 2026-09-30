"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * Recalcula os ScrollTriggers quando fontes e imagens terminam de carregar
 * (mudanças de altura depois do primeiro cálculo desalinhariam pins e scrubs).
 * Também marca <html> com .js para os pré-estados de animação.
 */
export function ScrollRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });
    return () => window.removeEventListener("load", refresh);
  }, []);
  return null;
}
