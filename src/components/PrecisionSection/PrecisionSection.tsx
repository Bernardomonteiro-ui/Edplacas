"use client";

import { useRef } from "react";
import Image from "next/image";
import inspectImg from "@/assets/images/inspect.jpg";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Plate } from "@/components/Plate/Plate";
import styles from "./PrecisionSection.module.css";

/**
 * "NÃO É SÓ UMA PLACA." — sensação de inspeção.
 * O CSS descreve o estado final (legível sem JS e com reduced-motion);
 * a timeline parte de uma janela pequena que se abre até ocupar a tela,
 * enquanto título e texto trocam de posição e as marcações de medição entram.
 */
export function PrecisionSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add({ desktop: MQ.desktop, mobile: MQ.mobile }, (ctx) => {
        const desktop = ctx.conditions!.desktop;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.9 },
        });

        tl.fromTo(
          q("[data-window]"),
          { clipPath: desktop ? "inset(26% 34% 26% 34%)" : "inset(30% 14% 34% 14%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5 },
          0,
        )
          .fromTo(q("[data-window] img"), { scale: 1.35 }, { scale: 1.02, duration: 0.8 }, 0)
          .fromTo(
            q("[data-marks]"),
            desktop ? { top: "26%", bottom: "26%", left: "34%", right: "34%" } : { top: "30%", bottom: "34%", left: "14%", right: "14%" },
            { top: "14%", bottom: "12%", left: "6%", right: "6%", duration: 0.5 },
            0,
          )
          .from(q("[data-title]"), { y: () => window.innerHeight * (desktop ? 0.3 : 0.12), scale: desktop ? 1.18 : 1, duration: 0.5 }, 0)
          .from(q("[data-text]"), { opacity: 0, y: 40, duration: 0.2 }, 0.32)
          .from(q("[data-rule]"), { scaleX: 0, duration: 0.25 }, 0.42)
          .from(q("[data-rule-v]"), { scaleY: 0, duration: 0.25 }, 0.45)
          .from(q("[data-readout]"), { opacity: 0, x: 12, stagger: 0.04, duration: 0.12 }, 0.5)
          .from(q("[data-cross]"), { scale: 0, opacity: 0, duration: 0.15 }, 0.55)
          .fromTo(q("[data-loupe]"), { clipPath: "inset(50% 50% 50% 50%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.22, ease: "power2.out" }, 0.68)
          .from(q("[data-loupe] svg"), { scale: 1.3, rotate: -2, duration: 0.3 }, 0.68)
          .from(q("[data-leader]"), { strokeDashoffset: 1, duration: 0.14 }, 0.62)
          .to({}, { duration: 0.1 });

        // Contadores dos eixos: valores ilustrativos convergindo para zero (calibração).
        q("[data-count]").forEach((el) => {
          const from = Number(el.dataset.count);
          const o = { v: from };
          tl.to(o, { v: 0, duration: 0.3, onUpdate: () => (el.textContent = o.v.toFixed(el.dataset.fixed ? 1 : 2)) }, 0.5);
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="precisao" className={styles.section} aria-labelledby="precisao-title">
      <div className={styles.stage}>
        <div className={styles.window} data-window data-cursor="view">
          <Image
            src={inspectImg}
            alt="Frente de um superesportivo prateado fotografada de frente, simétrica, à noite"
            fill
            sizes="100vw"
            placeholder="blur"
            className={styles.img}
          />
          <div className={styles.tint} />
        </div>

        {/* Marcações de inspeção */}
        <div className={styles.marks} data-marks aria-hidden>
          <i className={styles.c1} />
          <i className={styles.c2} />
          <i className={styles.c3} />
          <i className={styles.c4} />
          <span className={styles.rule} data-rule>
            <span className="mono">Eixo X</span>
          </span>
          <span className={styles.ruleV} data-rule-v />
          <span className={styles.cross} data-cross />
        </div>

        <dl className={`${styles.readouts} mono`} aria-hidden>
          <div data-readout>
            <dt>Eixo X</dt>
            <dd data-count="3.42">0.00</dd>
          </div>
          <div data-readout>
            <dt>Eixo Y</dt>
            <dd data-count="-1.87">0.00</dd>
          </div>
          <div data-readout>
            <dt>Nível</dt>
            <dd>
              <span data-count="2.4" data-fixed="1">
                0.0
              </span>
              °
            </dd>
          </div>
        </dl>

        <svg className={styles.leaderSvg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          <path data-leader d="M50 80 H78 L83.5 76" pathLength={1} className={styles.leader} />
        </svg>

        <figure className={styles.loupe} data-loupe>
          <Plate code="EDP2A26" />
          <figcaption className="mono">
            <span className="accent">Detalhe</span> · 400 × 130 mm
          </figcaption>
        </figure>

        <div className={`${styles.content} container`}>
          <h2 id="precisao-title" className={`${styles.title} h2`} data-title>
            Não é só
            <br />
            uma placa.
          </h2>
          <p className={`${styles.text} lead`} data-text>
            A placa faz parte do conjunto visual do veículo. Por isso, acabamento, alinhamento e instalação fazem diferença.
          </p>
        </div>
      </div>
    </section>
  );
}
