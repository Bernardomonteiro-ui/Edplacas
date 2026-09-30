import { company } from "@/config/company";
import { whatsappHref, telHref } from "@/lib/contact";
import { Logo } from "@/components/Logo/Logo";
import styles from "./Footer.module.css";

const LINKS = [
  { href: "#anatomia", label: "Placas" },
  { href: "#modelos", label: "Modelos" },
  { href: "#processo", label: "Processo" },
  { href: "#empresa", label: "Empresa" },
  { href: "#contato", label: "Contato" },
];

export function Footer() {
  const wa = whatsappHref();
  const tel = telHref();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`${styles.grid} container`}>
        <div className={styles.brand}>
          <Logo />
          <p className="dim">{company.description}</p>
        </div>

        <nav aria-label="Rodapé">
          <ul className={styles.list}>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="link mono">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul className={styles.list}>
          {wa && (
            <li>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="link mono">
                WhatsApp
              </a>
            </li>
          )}
          {tel && (
            <li>
              <a href={tel} className="link mono">
                {company.contact.phone}
              </a>
            </li>
          )}
          {company.contact.email && (
            <li>
              <a href={`mailto:${company.contact.email}`} className="link mono">
                {company.contact.email}
              </a>
            </li>
          )}
          {company.contact.instagram && (
            <li>
              <a href={company.contact.instagram} target="_blank" rel="noopener noreferrer" className="link mono">
                Instagram
              </a>
            </li>
          )}
        </ul>
      </div>

      <div className={`${styles.legal} container mono faint`}>
        <span>
          © {year} {company.legalName ?? company.name}
          {company.cnpj ? ` · CNPJ ${company.cnpj}` : ""}
        </span>
        <a href="#top" className="link">
          Voltar ao topo ↑
        </a>
      </div>
    </footer>
  );
}
