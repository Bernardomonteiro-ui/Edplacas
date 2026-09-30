"use client";

import { useRef } from "react";
import Image from "next/image";
import finalImg from "@/assets/images/final.jpg";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { RequestButton } from "@/components/Request/RequestButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { MagneticButton } from "@/motion/MagneticButton";
import styles from "./FinalCTA.module.css";

const LINES = ["Seu carro merece", "o acabamento", "certo."];

/**
 * CTA final: ao chegar, a seção anterior recua e escurece, a imagem aproxima,
 * o título abre linha a linha por clip-path e os CTAs entram por último.
 */
export function FinalCTA() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Elementos anteriores desaparecem
        const prev = document.querySelector<HTMLElement>("[data-fade-target] > *");
        if (prev) {
          gsap.to(prev, {
            opacity: 0.15,
            y: -80,
            scale: 0.97,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 20%", scrub: true },
          });
        }

        gsap.fromTo(
          q("[data-img]"),
          { scale: 1.22 },
          { scale: 1.04, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true } },
        );

        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 45%", once: true } });
        tl.fromTo(
          q("[data-line]"),
          { clipPath: "inset(0% 0% 100% 0%)", yPercent: 30 },
          { clipPath: "inset(0% 0% 0% 0%)", yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.12 },
        )
          .from(q("[data-sub]"), { opacity: 0, y: 16, duration: 0.8 }, "-=0.6")
          .from(q("[data-cta] > *"), { opacity: 0, y: 24, stagger: 0.1, duration: 0.8 }, "-=0.4");
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={styles.section} aria-labelledby="final-title">
      <div className={styles.media} aria-hidden>
        <div className={styles.imgWrap} data-img>
          <Image src={finalImg} alt="" fill sizes="100vw" placeholder="blur" className={styles.img} />
        </div>
        <div className={styles.shade} />
      </div>

      <div className={`${styles.content} container`}>
        <h2 id="final-title" className={`${styles.title} display`}>
          {LINES.map((l) => (
            <span key={l} className={styles.line} data-line>
              {l}
            </span>
          ))}
        </h2>
        <p className={`${styles.sub} lead`} data-sub>
          Solicite sua placa e fale com nossa equipe.
        </p>
        <div className={styles.ctas} data-cta>
          <MagneticButton>
            <RequestButton>Solicitar minha placa</RequestButton>
          </MagneticButton>
          <WhatsAppButton />
        </div>
      </div>
    </section>
  );
}
