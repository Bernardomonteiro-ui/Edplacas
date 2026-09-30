"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import Image from "next/image";
import heroImg from "@/assets/images/hero.jpg";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Plate } from "@/components/Plate/Plate";
import { RevealText } from "@/motion/RevealText";
import styles from "./BeforeAfter.module.css";

/**
 * "O DETALHE MUDA TUDO." — comparação arrastável.
 * As duas camadas usam o mesmo enquadramento (para-choque do hero, aproximado),
 * então só a placa e o acabamento mudam. Controle = role="slider" (setas, Home/End, PageUp/Down).
 * touch-action: pan-y mantém a rolagem vertical no celular; o arraste horizontal move a divisão.
 */
export function BeforeAfter() {
  const root = useRef<HTMLElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [touched, setTouched] = useState(false);
  const dragging = useRef(false);

  const apply = useCallback((v: number) => {
    const clamped = Math.min(100, Math.max(0, v));
    frame.current?.style.setProperty("--pos", `${clamped}%`);
    setPos(Math.round(clamped));
  }, []);

  const fromPointer = (e: PointerEvent) => {
    const r = frame.current!.getBoundingClientRect();
    apply(((e.clientX - r.left) / r.width) * 100);
  };

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging.current = true;
    setTouched(true);
    gsap.killTweensOf(proxy.current);
    frame.current!.setPointerCapture(e.pointerId);
    fromPointer(e);
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) fromPointer(e);
  };

  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (frame.current!.hasPointerCapture(e.pointerId)) frame.current!.releasePointerCapture(e.pointerId);
  };

  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    const map: Record<string, number> = {
      ArrowLeft: pos - step,
      ArrowDown: pos - step,
      ArrowRight: pos + step,
      ArrowUp: pos + step,
      PageDown: pos - 10,
      PageUp: pos + 10,
      Home: 0,
      End: 100,
    };
    if (e.key in map) {
      e.preventDefault();
      setTouched(true);
      apply(map[e.key]);
    }
  };

  // Demonstração automática ao entrar na tela (uma vez), mostrando que é arrastável.
  const proxy = useRef({ v: 50 });
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: frame.current, start: "top 65%", once: true } })
          .from(frame.current, { clipPath: "inset(12% 12% 12% 12%)", duration: 1.3, ease: "expo.inOut" })
          .to(proxy.current, { v: 72, duration: 0.9, ease: "power2.inOut", onUpdate: () => apply(proxy.current.v) }, "-=0.3")
          .to(proxy.current, { v: 32, duration: 1.1, ease: "power2.inOut", onUpdate: () => apply(proxy.current.v) })
          .to(proxy.current, { v: 50, duration: 0.8, ease: "power2.inOut", onUpdate: () => apply(proxy.current.v) });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.section} aria-labelledby="detalhe-title">
      <div className={`${styles.head} container`}>
        <RevealText as="h2" id="detalhe-title" className="h2" text={"O detalhe\nmuda tudo."} />
        <p className={`${styles.lead} lead`}>
          Placa gasta e torta de um lado. Placa nova, alinhada e bem fixada do outro. Mesmo carro.
        </p>
      </div>

      <div className={styles.wrap}>
        <div
          ref={frame}
          className={styles.frame}
          style={{ ["--pos" as string]: "50%" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          data-cursor="drag"
        >
          {/* DEPOIS (base) */}
          <div className={styles.layer} aria-hidden>
            <div className={styles.stage}>
              <Image src={heroImg} alt="" fill sizes="300vw" className={styles.img} placeholder="blur" />
              <div className={styles.mount}>
                <Plate code="EDP2A26" />
              </div>
            </div>
          </div>

          {/* ANTES (recortado pela divisão) */}
          <div className={`${styles.layer} ${styles.before}`} aria-hidden>
            <div className={styles.stage}>
              <Image src={heroImg} alt="" fill sizes="300vw" className={`${styles.img} ${styles.imgBefore}`} placeholder="blur" />
              <div className={`${styles.mount} ${styles.mountBefore}`}>
                <Plate code="EDP2A26" condition="worn" />
              </div>
            </div>
          </div>

          <span className={`${styles.tag} ${styles.tagL} mono`} aria-hidden>
            Antes
          </span>
          <span className={`${styles.tag} ${styles.tagR} mono`} aria-hidden>
            Depois
          </span>

          <div
            className={styles.handle}
            role="slider"
            tabIndex={0}
            aria-label="Comparar antes e depois"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pos}
            aria-valuetext={`${pos}% mostrando a placa antiga`}
            onKeyDown={onKey}
          >
            <span className={styles.knob} aria-hidden>
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M9 6 3 12l6 6M15 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </div>

          <p className={`${styles.hint} mono`} data-hidden={touched || undefined} aria-hidden>
            Arraste para comparar
          </p>
        </div>

        <p className={`${styles.caption} mono faint`}>
          <span className="sr-only">
            Comparação ilustrativa: à esquerda, placa amarelada, riscada, torta e sem um parafuso; à direita, placa nova,
            limpa, alinhada e bem fixada.{" "}
          </span>
          Imagem ilustrativa
        </p>
      </div>
    </section>
  );
}
