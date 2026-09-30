import { MapPin } from "lucide-react";
import { company } from "@/config/company";
import { directionsHref, formatAddress, formatHours, mapEmbedSrc, telHref, primaryCity } from "@/lib/contact";
import { RevealText } from "@/motion/RevealText";
import { Button } from "@/components/ui/Button";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Placeholder } from "@/components/ui/Placeholder";
import styles from "./Location.module.css";

/**
 * "ESTAMOS PERTO DE VOCÊ." — presença física e contato.
 * Uma <article> por unidade (estrutura pronta para várias lojas e SEO local).
 */
export function Location() {
  const units = company.units;
  const state = units[0]?.state;
  const tel = telHref();

  return (
    <section id="contato" className={styles.section} aria-labelledby="contato-title" data-fade-target>
      <div className="container">
        <header className={styles.head}>
          <p className="mono accent">Localização</p>
          <RevealText as="h2" id="contato-title" className="h2" text={"Estamos perto\nde você."} />
          <p className={`${styles.intro} lead`}>
            Venda e instalação de placas Mercosul para carros e motos
            {primaryCity ? ` em ${primaryCity}${state ? `/${state}` : ""}` : ""}. Fale com a equipe antes de vir e saia com a placa
            instalada.
          </p>
        </header>

        {units.length === 0 && (
          <div className={styles.unit}>
            <div className={styles.info}>
              <Placeholder field="units" hint="endereço, bairro, cidade, UF, CEP, horários" />
              <Placeholder field="contact.phone" />
              <Placeholder field="contact.whatsapp" />
            </div>
          </div>
        )}

        {units.map((u) => {
          const unitTel = telHref(u.phone);
          return (
            <article key={u.id} className={styles.unit} aria-labelledby={`u-${u.id}`}>
              <div className={styles.info}>
                <h3 id={`u-${u.id}`} className={`${styles.unitName} h3`}>
                  {u.name}
                </h3>

                <address className={styles.address}>
                  <MapPin size={18} strokeWidth={1.5} aria-hidden />
                  <span>{formatAddress(u)}</span>
                </address>

                <dl className={styles.facts}>
                  <div>
                    <dt className="mono faint">Horário</dt>
                    <dd>
                      {formatHours(u).map((h) => (
                        <span key={h.days} className={styles.hour}>
                          <span>{h.days}</span>
                          <span className={styles.time}>{h.time}</span>
                        </span>
                      ))}
                    </dd>
                  </div>
                  {(unitTel || tel) && (
                    <div>
                      <dt className="mono faint">Telefone</dt>
                      <dd>
                        <a href={(unitTel || tel)!} className="link">
                          {u.phone ?? company.contact.phone}
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>

                <div className={styles.ctas}>
                  <Button href={directionsHref(u)} variant="primary">
                    Como chegar
                  </Button>
                  <WhatsAppButton number={u.whatsapp} hideIfMissing />
                </div>
              </div>

              <div className={styles.map}>
                <iframe
                  title={`Mapa: ${u.name}, ${u.city}`}
                  src={mapEmbedSrc(u)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </article>
          );
        })}

        {units.length === 0 && (
          <div className={styles.ctas}>
            <WhatsAppButton hideIfMissing />
            {tel && (
              <Button href={tel} variant="ghost">
                Ligar {company.contact.phone}
              </Button>
            )}
          </div>
        )}

        {company.contact.instagram ? (
          <p className={styles.social}>
            <a href={company.contact.instagram} target="_blank" rel="noopener noreferrer" className="link mono">
              Instagram ↗
            </a>
          </p>
        ) : (
          <Placeholder field="contact.instagram" />
        )}
      </div>
    </section>
  );
}
