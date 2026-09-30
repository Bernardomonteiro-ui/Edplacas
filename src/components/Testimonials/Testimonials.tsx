import { company } from "@/config/company";
import { isDev } from "@/lib/contact";
import { RevealText } from "@/motion/RevealText";
import { ClipReveal } from "@/motion/ClipReveal";
import { Placeholder } from "@/components/ui/Placeholder";
import { Button } from "@/components/ui/Button";
import styles from "./Testimonials.module.css";

function Stars({ rating }: { rating: number }) {
  return (
    <span className={styles.stars} role="img" aria-label={`Avaliação ${rating} de 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 12 12" width="12" height="12" aria-hidden data-on={i < rating || undefined}>
          <path d="M6 .8 7.6 4.2l3.6.4-2.7 2.5.8 3.6L6 8.9 2.7 10.7l.8-3.6L.8 4.6l3.6-.4Z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * "QUEM FAZ, RECOMENDA." — somente avaliações reais de company.testimonials.
 * Sem avaliações: em produção a seção some (ou vira um link para as avaliações, se houver reviewsUrl).
 */
export function Testimonials() {
  const list = company.testimonials;
  if (!list.length && !company.reviewsUrl && !isDev) return null;

  return (
    <section id="confianca" className={styles.section} aria-labelledby="confianca-title">
      <div className="container">
        <header className={styles.head}>
          <p className="mono accent">Confiança</p>
          <RevealText as="h2" id="confianca-title" className="h2" text={"Quem faz,\nrecomenda."} />
        </header>

        {list.length > 0 ? (
          <ol className={styles.list}>
            {list.map((t, i) => (
              <li key={`${t.name}-${i}`} className={styles.item}>
                <span className={`${styles.index} mono`}>{String(i + 1).padStart(2, "0")}</span>
                <figure className={styles.figure}>
                  <ClipReveal>
                    <blockquote className={styles.quote}>
                      <p>“{t.comment}”</p>
                    </blockquote>
                  </ClipReveal>
                  <figcaption className={styles.meta}>
                    <Stars rating={t.rating} />
                    <span className={styles.name}>{t.name}</span>
                    {t.vehicle && <span className="mono faint">{t.vehicle}</span>}
                    {t.source && <span className="mono faint">via {t.source}</span>}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ol>
        ) : (
          <div className={styles.empty}>
            <Placeholder field="testimonials" hint="adicione avaliações reais (nome, veículo, nota, comentário)" />
          </div>
        )}

        {company.reviewsUrl ? (
          <div className={styles.more}>
            <Button href={company.reviewsUrl} variant="ghost">
              Ver todas as avaliações
            </Button>
          </div>
        ) : (
          <Placeholder field="reviewsUrl" hint="link do perfil de avaliações (Google)" />
        )}
      </div>
    </section>
  );
}
