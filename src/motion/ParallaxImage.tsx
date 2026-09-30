"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

interface Props {
  children: ReactNode;
  className?: string;
  /** Intensidade em % da altura (desktop). No mobile é reduzida à metade. */
  amount?: number;
}

/** Parallax vertical: o conteúdo interno (com 1 + 2·amount de altura) desliza dentro da janela. */
export function ParallaxImage({ children, className, amount = 10 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const run = (a: number) => {
        gsap.fromTo(
          inner.current,
          { yPercent: -a },
          { yPercent: a, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      };
      mm.add(MQ.desktop, () => run(amount));
      mm.add(MQ.mobile, () => run(amount / 2));
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className} style={{ overflow: "hidden", position: "relative" }}>
      <div ref={inner} style={{ position: "absolute", inset: `-${amount}% 0`, willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}
