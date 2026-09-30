"use client";

import { useRef } from "react";
import { company } from "@/config/company";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { Plate } from "@/components/Plate/Plate";
import styles from "./PlateAnatomy.module.css";

/*
  Prancha técnica em coordenadas fixas (viewBox 1000 × 560).
  A placa ocupa x 150–850 · y 165–392.5 (escala 1,75 unidade/mm),
  então pontos, linhas e rótulos ficam alinhados em qualquer largura.
*/
const GEOMETRY: Record<string, { hotspot: [number, number]; path: string; label: { left: string; top: string; align?: "right" } }> = {
  acabamento: { hotspot: [815, 235], path: "M815 235 V118 H800", label: { left: "80.5%", top: "13%" } },
  identificacao: { hotspot: [552, 330], path: "M552 330 V458", label: { left: "43%", top: "83%" } },
  fixacao: { hotspot: [325, 188], path: "M325 188 V118 H222", label: { left: "0%", top: "13%", align: "right" } },
  alinhamento: { hotspot: [150, 279], path: "M150 279 H92 V458", label: { left: "0%", top: "83%" } },
  instalacao: { hotspot: [850, 392], path: "M850 392 V458 H872", label: { left: "80.5%", top: "83%" } },
};

export function PlateAnatomy() {
  const root = useRef<HTMLElement>(null);
  const items = company.anatomy;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            onUpdate: (self) => {
              const i = Math.min(items.length - 1, Math.floor(self.progress * items.length * 0.999));
              root.current!.dataset.active = String(i);
              const n = q("[data-counter]")[0];
              if (n) n.textContent = String(Math.max(1, i + 1)).padStart(2, "0");
            },
          },
        });

        // Entrada da placa
        tl.from(q("[data-plate]"), { scale: 0.86, opacity: 0, duration: 0.5, ease: "power2.out" }, 0);

        items.forEach((item, i) => {
          const at = 0.4 + i;
          tl.from(q(`[data-hot="${item.id}"]`), { scale: 0, transformOrigin: "50% 50%", duration: 0.15 }, at)
            .from(q(`[data-line="${item.id}"]`), { strokeDashoffset: 1, duration: 0.3 }, at + 0.05)
            .from(q(`[data-label="${item.id}"]`), { opacity: 0, x: -10, duration: 0.25 }, at + 0.2)
            .fromTo(q(`[data-hl="${item.id}"]`), { opacity: 0 }, { opacity: 1, duration: 0.2 }, at + 0.1);

          if (i < items.length - 1) {
            tl.to(q(`[data-hl="${item.id}"]`), { opacity: 0, duration: 0.2 }, at + 0.85).to(
              q(`[data-label="${item.id}"]`),
              { opacity: 0.38, duration: 0.2 },
              at + 0.85,
            );
          }
        });

        // Alinhamento: a placa sai do eixo e volta ao nível.
        const a = 0.4 + items.findIndex((x) => x.id === "alinhamento");
        tl.to(q("[data-plate]"), { rotate: -2.4, duration: 0.12, ease: "power1.out" }, a)
          .to(q("[data-plate]"), { rotate: 0, duration: 0.45, ease: "power2.inOut" }, a + 0.18)
          .fromTo(q("[data-angle]"), { textContent: 2.4 }, { textContent: 0, duration: 0.45, snap: { textContent: 0.1 } }, a + 0.18);

        // Instalação: placa assenta no suporte.
        const s = 0.4 + items.findIndex((x) => x.id === "instalacao");
        tl.fromTo(q("[data-plate]"), { y: 0 }, { y: -6, duration: 0.15 }, s).to(q("[data-plate]"), { y: 0, duration: 0.25, ease: "bounce.out" }, s + 0.15);

        tl.to({}, { duration: 0.4 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="anatomia" className={styles.section} aria-labelledby="anatomia-title" data-active="0">
      <div className={styles.stage}>
        <header className={`${styles.head} container`}>
          <p className="mono accent">Anatomia da placa</p>
          <h2 id="anatomia-title" className={`${styles.title} h3`}>
            Cinco pontos que separam uma placa bem instalada de uma placa qualquer.
          </h2>
          <p className={`${styles.counter} mono`} aria-hidden>
            <span data-counter>01</span> / {String(items.length).padStart(2, "0")}
          </p>
        </header>

        <div className={styles.board}>
          <div className={styles.plate} data-plate>
            <Plate code="EDP2A26" label="Placa Mercosul ilustrativa com código EDP2A26" />
          </div>

          <svg className={styles.overlay} viewBox="0 0 1000 560" aria-hidden>
            {/* Destaques de área */}
            <rect data-hl="acabamento" className={styles.hl} x="146" y="161" width="708" height="235.5" rx="12" />
            <rect data-hl="identificacao" className={`${styles.hl} ${styles.dash}`} x="206" y="212" width="640" height="168" />
            <g data-hl="fixacao" className={styles.hl}>
              <circle cx="325" cy="188" r="24" />
              <circle cx="675" cy="188" r="24" />
            </g>
            <g data-hl="alinhamento" className={styles.hl}>
              <line x1="60" y1="279" x2="940" y2="279" className={styles.dash} />
              <text x="940" y="266" textAnchor="end" className={styles.svgMono}>
                NÍVEL <tspan data-angle>0</tspan>°
              </text>
            </g>
            <rect data-hl="instalacao" className={`${styles.hl} ${styles.dash}`} x="132" y="147" width="736" height="263.5" />

            {/* Pontos e linhas-guia */}
            {items.map((it, i) => {
              const g = GEOMETRY[it.id];
              if (!g) return null;
              return (
                <g key={it.id}>
                  <path data-line={it.id} d={g.path} pathLength={1} className={styles.line} />
                  <g data-hot={it.id}>
                    <circle cx={g.hotspot[0]} cy={g.hotspot[1]} r="15" className={styles.hot} />
                    <text x={g.hotspot[0]} y={g.hotspot[1] + 5} textAnchor="middle" className={styles.hotNum}>
                      {i + 1}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Rótulos (desktop) */}
          <ol className={styles.labels}>
            {items.map((it) => {
              const g = GEOMETRY[it.id];
              return (
                <li
                  key={it.id}
                  data-label={it.id}
                  className={styles.label}
                  style={{ left: g?.label.left, top: g?.label.top, textAlign: g?.label.align ?? "left" }}
                >
                  <h3 className="mono">
                    <span className="accent">{it.number}</span> — {it.title}
                  </h3>
                  <p>{it.text}</p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Legenda ativa (mobile) */}
        <ol className={`${styles.captions} container`}>
          {items.map((it, i) => (
            <li key={it.id} data-caption={i}>
              <p className="mono">
                <span className="accent">{it.number}</span> — {it.title}
              </p>
              <p className={styles.capText}>{it.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
