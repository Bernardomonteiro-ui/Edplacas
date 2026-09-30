"use client";

import { useEffect, useState } from "react";
import { whatsappHref } from "@/lib/contact";
import { useRequest } from "@/components/Request/RequestProvider";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import styles from "./MobileWhatsApp.module.css";

/**
 * Barra fixa de WhatsApp no mobile. Aparece depois do hero (onde já há CTAs)
 * e some quando o CTA final está na tela. Sem número configurado, vira
 * "Solicitar minha placa" (abre o formulário) para nunca ser um link quebrado.
 */
export function MobileWhatsApp() {
  const [visible, setVisible] = useState(false);
  const { open } = useRequest();
  const href = whatsappHref();

  useEffect(() => {
    const final = document.getElementById("final-title")?.closest("section");
    let finalInView = false;
    const io = final
      ? new IntersectionObserver(([e]) => {
          finalInView = e.isIntersecting;
          update();
        })
      : null;
    if (final) io!.observe(final);
    function update() {
      setVisible(window.scrollY > window.innerHeight * 0.9 && !finalInView);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      io?.disconnect();
    };
  }, []);

  const content = (
    <>
      {href && <WhatsAppIcon size={18} />}
      <span>{href ? "Falar no WhatsApp" : "Solicitar minha placa"}</span>
    </>
  );

  return (
    <div className={styles.bar} data-visible={visible || undefined}>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={styles.btn} tabIndex={visible ? 0 : -1}>
          {content}
        </a>
      ) : (
        <button type="button" className={`${styles.btn} ${styles.alt}`} onClick={() => open()} tabIndex={visible ? 0 : -1}>
          {content}
        </button>
      )}
    </div>
  );
}
