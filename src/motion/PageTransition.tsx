"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import styles from "./PageTransition.module.css";

/**
 * Abertura curta da página: uma linha de calibração percorre a tela e a
 * cortina se abre por clip-path. ~0,9s, sem bloquear interação, ignorada com reduced-motion.
 * Dispara o evento "intro:done" para o Hero iniciar sua sequência.
 */
export function PageTransition() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const done = () => {
        (window as Window & { __introDone?: boolean }).__introDone = true;
        window.dispatchEvent(new CustomEvent("intro:done"));
      };
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ onComplete: () => { gsap.set(ref.current, { display: "none" }); } });
        tl.fromTo(`.${styles.line}`, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "expo.inOut" })
          .to(`.${styles.label}`, { opacity: 0, duration: 0.2 }, "-=0.1")
          .to(ref.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "expo.inOut" })
          .add(done, "-=0.45");
      });
      mm.add(MQ.reduce, () => {
        gsap.set(ref.current, { display: "none" });
        done();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={styles.curtain} aria-hidden="true">
      <span className={`${styles.label} mono`}>400 × 130 mm</span>
      <span className={styles.line} />
    </div>
  );
}
