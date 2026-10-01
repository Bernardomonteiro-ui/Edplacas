"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { company } from "@/config/company";
import { whatsappHref, telHref } from "@/lib/contact";
import { Logo } from "@/components/Logo/Logo";
import { useRequest } from "@/components/Request/RequestProvider";
import styles from "./Navbar.module.css";

const LINKS = [
  { href: "#anatomia", label: "Placas" },
  { href: "#modelos", label: "Modelos" },
  { href: "#processo", label: "Processo" },
  { href: "#empresa", label: "Empresa" },
  { href: "#contato", label: "Contato" },
];

export function Navbar() {
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(true);
  const [open, setOpen] = useState(false);
  const { open: openRequest } = useRequest();

  // Estado "scrolled": fundo sólido discreto e altura reduzida.
  useEffect(() => {
    // Tom da barra: segue a seção que está sob ela (escura = texto branco; clara = azul-marinho).
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const under = document
        .elementsFromPoint(window.innerWidth / 2, 40)
        .find((el) => !header.current?.contains(el));
      setDark(!!under?.closest(".theme-dark"));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Timeline do menu mobile: expansão por clip-path a partir do botão + links em stagger.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        tl.current = gsap
          .timeline({ paused: true })
          .fromTo(
            menu.current,
            { clipPath: "circle(0% at calc(100% - 40px) 40px)" },
            { clipPath: "circle(150% at calc(100% - 40px) 40px)", duration: 0.9, ease: "expo.inOut" },
          )
          .from(`.${styles.mLink} > span`, { yPercent: 110, stagger: 0.06, duration: 0.8, ease: "expo.out" }, "-=0.45")
          .from(`.${styles.mFoot}`, { opacity: 0, y: 12, duration: 0.5 }, "-=0.5");
      });
      return () => mm.revert();
    },
    { scope: header },
  );

  useEffect(() => {
    const el = menu.current!;
    if (open) {
      el.hidden = false;
      document.documentElement.dataset.menu = "open";
      tl.current ? tl.current.timeScale(1).play() : null;
      el.querySelector<HTMLElement>("a")?.focus();
    } else {
      delete document.documentElement.dataset.menu;
      if (tl.current && tl.current.progress() > 0) {
        tl.current.timeScale(1.6).reverse().eventCallback("onReverseComplete", () => {
          el.hidden = true;
        });
      } else {
        el.hidden = true;
      }
    }
  }, [open]);

  // Esc fecha; Tab fica preso entre o botão e o menu enquanto aberto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const f = [toggle.current!, ...Array.from(menu.current!.querySelectorAll<HTMLElement>("a, button"))];
        const i = f.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const wa = whatsappHref();
  const tel = telHref();

  return (
    <header ref={header} className={`${styles.header}${dark ? " theme-dark" : ""}`} data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <div className={styles.bar}>
        <a href="#top" className={styles.logo} aria-label={`${company.name} — início`} onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <nav aria-label="Principal" className={styles.desktopNav}>
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={`${styles.navLink} link`}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button type="button" className={`${styles.cta} btn btn--primary`} onClick={() => openRequest()} aria-haspopup="dialog" data-cursor="cta">
          <span>Solicitar placa</span>
        </button>

        <button
          ref={toggle}
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div ref={menu} id="menu-mobile" className={styles.menu} hidden>
        <nav aria-label="Menu mobile">
          <ul className={styles.mList}>
            {LINKS.map((l, i) => (
              <li key={l.href}>
                <a href={l.href} className={styles.mLink} onClick={() => setOpen(false)}>
                  <span>
                    <small className="mono">{String(i + 1).padStart(2, "0")}</small>
                    {l.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.mFoot}>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => {
              setOpen(false);
              openRequest();
            }}
          >
            <span>Solicitar minha placa</span>
          </button>
          <div className={styles.mContacts}>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="link mono">
                WhatsApp
              </a>
            )}
            {tel && (
              <a href={tel} className="link mono">
                {company.contact.phone}
              </a>
            )}
            {company.contact.instagram && (
              <a href={company.contact.instagram} target="_blank" rel="noopener noreferrer" className="link mono">
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
