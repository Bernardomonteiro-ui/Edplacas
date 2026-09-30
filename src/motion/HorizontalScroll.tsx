"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

/** Expõe a animação horizontal para que filhos criem efeitos atrelados a ela (containerAnimation). */
const HorizontalContext = createContext<gsap.core.Tween | null>(null);
export const useHorizontalAnimation = () => useContext(HorizontalContext);

interface Props {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  /** Elemento que recebe a largura do progresso (0–1) como --progress. */
  onProgress?: (p: number) => void;
  /** Conteúdo fixo que fica visível durante o pin (título, contador…). */
  header?: ReactNode;
}

/**
 * Prende a seção e converte o scroll vertical em deslocamento horizontal da trilha.
 * Só ativa em desktop com movimento permitido; no mobile/reduced-motion a trilha
 * vira uma lista com scroll horizontal nativo (scroll-snap), definida no CSS do consumidor.
 */
export function HorizontalScroll({ children, className, trackClassName, onProgress, header }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [tween, setTween] = useState<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        // Troca o CSS para o modo "pinned" antes de medir.
        root.current!.dataset.horizontal = "pinned";
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const t = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => onProgress?.(self.progress),
          },
        });
        setTween(t);
        return () => {
          setTween(null);
          root.current && (root.current.dataset.horizontal = "native");
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <HorizontalContext.Provider value={tween}>
      <div
        ref={root}
        className={className}
        data-horizontal="native"
        onFocusCapture={(e) => {
          // Teclado: ao focar um item fora da tela, rola a página até a posição correspondente.
          const st = tween?.scrollTrigger;
          if (!st || !track.current) return;
          root.current!.scrollLeft = 0;
          const item = (e.target as HTMLElement).closest<HTMLElement>(`.${trackClassName} > *`) ?? (e.target as HTMLElement);
          const max = track.current.scrollWidth - window.innerWidth;
          const p = Math.min(1, Math.max(0, (item.offsetLeft - 40) / max));
          window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: "auto" });
        }}
      >
        {header}
        <div ref={track} className={trackClassName}>
          {children}
        </div>
      </div>
    </HorizontalContext.Provider>
  );
}
