import { company } from "@/config/company";
import styles from "./Logo.module.css";

/**
 * Logotipo tipográfico provisório: a sigla dentro de uma "placa" mínima.
 * Substituir pelo logo oficial quando houver (SVG em /public e troque este componente).
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={[styles.logo, className].filter(Boolean).join(" ")}>
      <span className={styles.mark} aria-hidden>
        <span className={styles.band} />
        {company.logoMark}
      </span>
      <span className={styles.word}>{company.name.replace(company.logoMark, "").trim() || company.name}</span>
    </span>
  );
}
