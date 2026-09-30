"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

interface Props {
  /** Valor real. O contador só deve ser usado com números fornecidos pela empresa. */
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}

/**
 * Conta de 0 até o valor ao entrar na viewport.
 * O HTML do servidor já contém o valor final (SEO, sem JS e reduced-motion veem o número real).
 */
export function AnimatedCounter({ value, suffix = "", className, duration = 1.6 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const obj = { v: 0 };
        const el = ref.current!;
        el.textContent = `0${suffix}`;
        gsap.to(obj, {
          v: value,
          duration,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.v)}${suffix}`;
          },
        });
        return () => {
          el.textContent = `${value}${suffix}`;
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [value] },
  );

  return (
    <span ref={ref} className={className} aria-label={`${value}${suffix}`}>
      {value}
      {suffix}
    </span>
  );
}
