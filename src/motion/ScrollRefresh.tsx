"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/** Atualiza ScrollTrigger quando fontes e imagens terminam de carregar. */
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
