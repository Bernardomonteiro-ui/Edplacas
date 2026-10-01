"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import heroImg from "@/assets/images/hero.jpg";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Plate } from "@/components/Plate/Plate";
import { RequestButton } from "@/components/Request/RequestButton";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/motion/MagneticButton";
import styles from "./Hero.module.css";

const LINE_1 = ["Sua", "placa."];
const LINE_2 = ["O", "acabamento", "do", "seu", "carro."];

/**
 * HERO — a placa como elemento de precisão.
 * A foto é montada num "palco" com a proporção exata da imagem, então a placa SVG
 * fica presa ao para-choque em qualquer viewport (posição em %).
 * Scroll: o stage é sticky dentro de uma seção mais alta; a timeline "scrub"
 * aproxima a câmera da placa, apaga o texto e acende as marcações técnicas.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // Entrada: palavras em stagger, técnica em sequência, CTA por último.
        const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
        intro
          .from(q("[data-hero-word] > span"), { yPercent: 105, duration: 1.3, stagger: 0.07, immediateRender: false }, 0.15)
          .fromTo(q("[data-tech]"), { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.08, ease: "none", immediateRender: false }, 0.6)
          .fromTo(q("[data-hero-fade]"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1, stagger: 0.1, immediateRender: false }, 0.8);

        // Movimento contínuo extremamente sutil da câmera.
        gsap.to(q("[data-drift]"), { scale: 1.025, xPercent: -0.6, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });

        // Scroll: zoom na placa, texto sai, marcações entram.
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${window.innerHeight}`, scrub: 0.8, invalidateOnRefresh: true },
          defaults: { ease: "none" },
        });
        tl.to(q("[data-zoom]"), { scale: 1.9, duration: 1 }, 0)
          .to(q("[data-copy]"), { yPercent: -35, opacity: 0, duration: 0.45 }, 0)
          .to(q("[data-scroll-hint]"), { opacity: 0, duration: 0.15 }, 0)
          .to(q("[data-vignette]"), { opacity: 1, duration: 0.6 }, 0.1)
          .fromTo(q("[data-plate-focus]"), { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 0.4 }, 0.35)
          .fromTo(q("[data-plate-label]"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25 }, 0.55);

      });

      // Sem movimento: tudo visível no estado final de leitura.
      mm.add(MQ.reduce, () => {
        gsap.set(q("[data-hero-word] > span, [data-hero-fade], [data-tech]"), { clearProps: "all", opacity: 1 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.stage}>
        <div className={styles.media} data-zoom>
          <div className={styles.drift} data-drift>
            <div className={styles.frame}>
              <Image
                src={heroImg}
                alt="Frente de um esportivo grafite em um estacionamento aberto, com a placa Mercosul instalada no para-choque"
                fill
                priority
                fetchPriority="high"
                placeholder="blur"
                sizes="(max-aspect-ratio: 3/2) 150vh, 100vw"
                className={styles.img}
              />
              <div className={styles.plateMount}>
                <Plate code="EDP2A26" />
                <span className={styles.plateFocus} data-plate-focus aria-hidden>
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.shade} aria-hidden />
        <div className={styles.vignette} data-vignette aria-hidden />

        {/* Marcações técnicas discretas */}
        <div className={styles.tech} aria-hidden>
          <span className={`${styles.techTL} mono`} data-tech>
            REF. MERCOSUL
          </span>
          <span className={`${styles.techTR} mono`} data-tech>
            400 × 130 MM
          </span>
          <span className={styles.crossH} data-tech />
          <span className={styles.crossV} data-tech />
          <span className={`${styles.plateLabel} mono`} data-plate-label>
            <b>01</b> Placa instalada · eixo nivelado
          </span>
        </div>

        <div className={`${styles.copy} container`} data-copy>
          <p className={`${styles.eyebrow} mono`} data-hero-fade>
            Precisão para o seu carro
          </p>
          <h1 id="hero-title" className={`${styles.title} display`}>
            <span className={styles.line}>
              {LINE_1.map((w, i) => (
                <span key={w}>
                  <span className="mask" data-hero-word>
                    <span>{w}</span>
                  </span>
                  {i < LINE_1.length - 1 ? " " : null}
                </span>
              ))}
            </span>{" "}
            <span className={`${styles.line} ${styles.line2}`}>
              {LINE_2.map((w, i) => (
                <span key={w}>
                  <span className="mask" data-hero-word>
                    <span>{w}</span>
                  </span>
                  {i < LINE_2.length - 1 ? " " : null}
                </span>
              ))}
            </span>
          </h1>

          <div className={styles.bottom}>
            <p className={`${styles.sub} lead`} data-hero-fade>
              Placas automotivas com acabamento profissional, atendimento rápido e instalação especializada.
            </p>
            <div className={styles.ctas} data-hero-fade>
              <MagneticButton>
                <RequestButton>Solicitar minha placa</RequestButton>
              </MagneticButton>
              <Button href="#modelos" variant="ghost" icon={<ArrowDown strokeWidth={1.6} aria-hidden />}>
                Ver modelos
              </Button>
            </div>
          </div>
        </div>

        <a href="#precisao" className={`${styles.scroll} mono`} data-scroll-hint data-hero-fade>
          Scroll to explore <span aria-hidden>↓</span>
        </a>
      </div>
    </section>
  );
}
