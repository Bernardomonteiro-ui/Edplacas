"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import styles from "./PageTransition.module.css";

/** Abertura curta da página com uma cortina visual. */
export function PageTransition() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ onComplete: () => { gsap.set(ref.current, { display: "none" }); } });
        tl.fromTo(`.${styles.line}`, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "expo.inOut" })
          .to(`.${styles.label}`, { opacity: 0, duration: 0.2 }, "-=0.1")
          .to(ref.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "expo.inOut" });
      });
      mm.add(MQ.reduce, () => {
        gsap.set(ref.current, { display: "none" });
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
