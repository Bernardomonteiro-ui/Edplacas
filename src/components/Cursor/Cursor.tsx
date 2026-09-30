"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import styles from "./Cursor.module.css";

const LABELS: Record<string, string> = { view: "Ver", drag: "Arraste", cta: "" };

/**
 * Cursor discreto (só ponteiro fino + movimento permitido). O cursor nativo
 * continua visível; este anel apenas acompanha e muda de estado em
 * [data-cursor="view|drag|cta"]. Desativado por completo no touch.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(`${MQ.finePointer} and ${MQ.motion}`, () => {
      const el = ring.current!;
      el.style.display = "grid";
      const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" });
      let state = "";

      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        xTo(e.clientX);
        yTo(e.clientY);
        const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
        const next = t?.dataset.cursor ?? "";
        if (next !== state) {
          state = next;
          el.dataset.state = next || "idle";
          label.current!.textContent = LABELS[next] ?? "";
        }
        el.dataset.hidden = "false";
      };
      const leave = () => (el.dataset.hidden = "true");
      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      return () => {
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", leave);
        el.style.display = "none";
      };
    });
    return () => mm.revert();
  });

  return (
    <div ref={ring} className={styles.ring} data-state="idle" data-hidden="true" aria-hidden>
      <span ref={label} className="mono" />
    </div>
  );
}
