"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

interface Props {
  children: ReactNode;
  className?: string;
  start?: string;
}

/**
 * Revela a imagem por máscara (clip-path) enquanto ela desacelera de uma escala maior.
 * O filho direto deve ser a imagem/figura.
 */
export function RevealImage({ children, className, start = "top 85%" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start, once: true } });
        tl.fromTo(ref.current, { clipPath: "inset(18% 8% 18% 8%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" }).from(
          ref.current!.firstElementChild,
          { scale: 1.25, duration: 1.8, ease: "expo.out" },
          0,
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden" }} data-cursor="view">
      {children}
    </div>
  );
}
