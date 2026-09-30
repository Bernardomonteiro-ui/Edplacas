"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

interface Props {
  children: ReactNode;
  className?: string;
  /** Direção de abertura do clip-path. */
  from?: "bottom" | "left" | "center";
  delay?: number;
  duration?: number;
  start?: string;
  scrub?: boolean | number;
}

const shapes = {
  bottom: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  center: "inset(50% 50% 50% 50%)",
};

/** Revela o conteúdo com clip-path (máscara geométrica, não opacidade). */
export function ClipReveal({ children, className, from = "bottom", delay = 0, duration = 1.3, start = "top 80%", scrub }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          ref.current,
          { clipPath: shapes[from] },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "expo.inOut",
            duration,
            delay,
            scrollTrigger: scrub
              ? { trigger: ref.current, start, end: "top 30%", scrub }
              : { trigger: ref.current, start, once: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
