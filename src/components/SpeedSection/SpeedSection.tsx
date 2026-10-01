"use client";

import { useRef, type ReactNode } from "react";
import { company } from "@/config/company";
import { isDev } from "@/lib/contact";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { AnimatedCounter } from "@/motion/AnimatedCounter";
import { Placeholder } from "@/components/ui/Placeholder";
import styles from "./SpeedSection.module.css";

interface Row {
  label: string;
  value: ReactNode;
  note?: string;
}

/**
 * "SEM COMPLICAÇÃO." — título gigante que desliza na horizontal com o scroll.
 * Os indicadores só aparecem com dados reais de company.speed / company.units;
 * em desenvolvimento, placeholders mostram onde cada dado entra.
 */
export function SpeedSection() {
  const root = useRef<HTMLElement>(null);
  const { attendanceMinutes, installMinutes } = company.speed;
  const unit = company.units[0];

  const rows: Row[] = [];
  if (attendanceMinutes != null)
    rows.push({ label: "Atendimento", value: <AnimatedCounter value={attendanceMinutes} suffix=" min" />, note: "tempo médio" });
  else if (isDev) rows.push({ label: "Atendimento", value: <Placeholder field="speed.attendanceMinutes" /> });

  if (installMinutes != null)
    rows.push({ label: "Instalação", value: <AnimatedCounter value={installMinutes} suffix=" min" />, note: "tempo médio" });
  else if (isDev) rows.push({ label: "Instalação", value: <Placeholder field="speed.installMinutes" /> });

  if (unit) rows.push({ label: "Localização", value: unit.district, note: `${unit.city}/${unit.state}` });
  else if (isDev) rows.push({ label: "Localização", value: <Placeholder field="units[0]" hint="bairro / cidade" /> });

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          q("[data-slide]"),
          { xPercent: 6 },
          { xPercent: -38, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
        const rows = q("[data-row]");
        const rowsTrigger = q("[data-rows]")[0];
        if (rows.length && rowsTrigger) {
          const scrollTrigger = { trigger: rowsTrigger, start: "top 80%", once: true };
          gsap.from(rows, {
            opacity: 0,
            y: 40,
            stagger: 0.12,
            duration: 1,
            ease: "expo.out",
            scrollTrigger,
          });
          gsap.from(q("[data-row-line]"), {
            scaleX: 0,
            transformOrigin: "left",
            stagger: 0.12,
            duration: 1.2,
            ease: "expo.inOut",
            scrollTrigger,
          });
        }
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="empresa" className={styles.section} aria-labelledby="empresa-title">
      <h2 id="empresa-title" className={styles.huge}>
        <span data-slide>Sem complicação.</span>
      </h2>

      <div className={`${styles.body} container`} data-rows-count={rows.length}>
        <div className={styles.intro}>
          <p className={`${styles.desc} lead`}>{company.description}</p>
          <ul className={styles.services}>
            {company.services.map((s) => (
              <li key={s} className="mono">
                {s}
              </li>
            ))}
          </ul>
        </div>

        {rows.length > 0 && (
          <dl className={styles.rows} data-rows>
            {rows.map((r) => (
              <div key={r.label} className={styles.row} data-row>
                <span className={styles.rowLine} data-row-line aria-hidden />
                <dt className="mono dim">{r.label}</dt>
                <dd className={styles.value}>{r.value}</dd>
                {r.note && <dd className={`${styles.note} mono faint`}>{r.note}</dd>}
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
