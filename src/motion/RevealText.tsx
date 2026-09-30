"use client";

import { createElement, useRef, type ElementType } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

interface Props {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
  /** Atraso inicial (s). */
  delay?: number;
  stagger?: number;
  /** "scroll": revela ao entrar na viewport. "scrub": acompanha o scroll. */
  mode?: "scroll" | "scrub";
  start?: string;
}

/**
 * Divide o texto em palavras mascaradas e as revela de baixo para cima.
 * A divisão acontece no JSX (determinística), então não há risco de hydration mismatch.
 * Quebras de linha explícitas: use "\n" no texto.
 */
export function RevealText({
  text,
  as = "p",
  className,
  id,
  delay = 0,
  stagger = 0.06,
  mode = "scroll",
  start = "top 85%",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const words = ref.current!.querySelectorAll<HTMLElement>(".mask > span");
        gsap.from(words, {
          yPercent: 108,
          rotate: 2,
          duration: 1.1,
          ease: "expo.out",
          stagger,
          delay,
          scrollTrigger:
            mode === "scrub"
              ? { trigger: ref.current, start, end: "bottom 55%", scrub: 0.8 }
              : { trigger: ref.current, start, once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const lines = text.split("\n");
  return createElement(
    as,
    { ref, className, id },
    lines.map((line, li) => (
      <span key={li} style={{ display: "block" }}>
        {line.split(" ").map((w, wi, arr) => (
          <span key={wi}>
            <span className="mask">
              <span>{w}</span>
            </span>
            {wi < arr.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    )),
  );
}
