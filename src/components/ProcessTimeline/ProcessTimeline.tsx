"use client";

import { useRef } from "react";
import { company } from "@/config/company";
import { gsap, useGSAP, MQ, ScrollTrigger } from "@/lib/gsap";
import { RevealText } from "@/motion/RevealText";
import styles from "./ProcessTimeline.module.css";

/**
 * "DO PEDIDO À INSTALAÇÃO." — acompanhamento de processo.
 * Coluna esquerda presa (sticky) com o número da etapa atual em grande escala;
 * à direita, a linha vertical se preenche com o scroll e cada etapa acende ao cruzar o centro da tela.
 */
export function ProcessTimeline() {
  const root = useRef<HTMLElement>(null);
  const steps = company.process;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q("[data-fill]"),
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: q("[data-list]")[0], start: "top 50%", end: "bottom 50%", scrub: true } },
        );

        const big = q("[data-big] span");
        q("[data-step]").forEach((el, i) => {
          const num = el.querySelector("[data-num]");
          const body = el.querySelector("[data-body]");
          gsap.set([num, body], { opacity: 0.22 });
          gsap.set(num, { scale: 0.7, transformOrigin: "left center" });

          ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              gsap.to(num, { opacity: self.isActive ? 1 : 0.22, scale: self.isActive ? 1 : 0.7, duration: 0.6, ease: "expo.out" });
              gsap.to(body, { opacity: self.isActive ? 1 : 0.22, duration: 0.6 });
              el.toggleAttribute("data-active", self.isActive);
              if (self.isActive) {
                // Troca do número grande: sai para cima, entra por baixo.
                gsap
                  .timeline()
                  .to(big, { yPercent: self.direction > 0 ? -100 : 100, opacity: 0, duration: 0.25, ease: "power2.in" })
                  .add(() => big.forEach((b) => (b.textContent = steps[i].number)))
                  .fromTo(big, { yPercent: self.direction > 0 ? 100 : -100 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "expo.out" });
              }
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="processo" className={styles.section} aria-labelledby="processo-title">
      <div className={`${styles.grid} container`}>
        <div className={styles.aside}>
          <div className={styles.sticky}>
            <p className="mono accent">Processo</p>
            <RevealText as="h2" id="processo-title" className={`${styles.title} h2`} text={"Do pedido\nà instalação."} />
            <p className={styles.big} data-big aria-hidden>
              <span>01</span>
            </p>
          </div>
        </div>

        <div className={styles.list} data-list>
          <span className={styles.track} aria-hidden>
            <span className={styles.fill} data-fill />
          </span>
          <ol>
          {steps.map((s) => (
            <li key={s.number} className={styles.step} data-step>
              <span className={styles.dot} aria-hidden />
              <span className={`${styles.num} mono`} data-num>
                {s.number}
              </span>
              <div data-body>
                <h3 className={`${styles.stepTitle} h3`}>{s.title}</h3>
                <p className={styles.text}>{s.text}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
