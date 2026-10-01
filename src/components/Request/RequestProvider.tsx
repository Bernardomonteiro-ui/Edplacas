"use client";

import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { X } from "lucide-react";
import { company } from "@/config/company";
import { whatsappHref, telHref, isDev } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import styles from "./Request.module.css";

interface Ctx {
  open: (productId?: string) => void;
}

const RequestContext = createContext<Ctx>({ open: () => {} });
export const useRequest = () => useContext(RequestContext);

const SERVICES = [
  { value: "padrao", label: "Placa padrão Mercosul (carro)" },
  { value: "personalizada", label: "Placa personalizada" },
  { value: "moto", label: "Placa para moto" },
  { value: "outros", label: "Outro modelo / reposição" },
];

/** Aceita Mercosul (ABC1D23) e o padrão antigo (ABC1234 / ABC-1234). */
const PLATE_RE = /^[A-Z]{3}-?\d[A-Z0-9]\d{2}$/;

type Errors = Partial<Record<"name" | "service" | "plate", string>>;

/**
 * Formulário de solicitação em <dialog> nativo (foco preso, Esc fecha, backdrop).
 * Sem backend: monta a mensagem e abre o WhatsApp da empresa com o pedido preenchido.
 */
export function RequestProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const firstField = useRef<HTMLInputElement>(null);
  const [service, setService] = useState("padrao");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sent" | "unavailable">("idle");
  const uid = useId();
  const fid = (s: string) => `${uid}-${s}`;

  const open = useCallback((productId?: string) => {
    if (productId) setService(productId);
    setErrors({});
    setStatus("idle");
    dialog.current?.showModal();
    document.documentElement.dataset.dialog = "open";
    requestAnimationFrame(() => firstField.current?.focus());
  }, []);

  const close = () => dialog.current?.close();

  useEffect(() => {
    const d = dialog.current!;
    const onClose = () => delete document.documentElement.dataset.dialog;
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const plate = String(data.get("plate") ?? "").trim().toUpperCase().replace(/\s/g, "");
    const vehicle = String(data.get("vehicle") ?? "").trim();
    const notes = String(data.get("notes") ?? "").trim();
    const svc = SERVICES.find((s) => s.value === data.get("service"));

    const next: Errors = {};
    if (name.length < 2) next.name = "Informe seu nome.";
    if (!svc) next.service = "Escolha o tipo de placa.";
    if (plate && !PLATE_RE.test(plate)) next.plate = "Use o formato ABC1D23 ou ABC-1234.";
    setErrors(next);
    if (Object.keys(next).length) {
      const firstInvalid = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`);
      firstInvalid?.focus();
      return;
    }

    const lines = [
      `Olá! Meu nome é ${name}. Vim pelo site e gostaria de solicitar uma placa.`,
      `• Modelo: ${svc!.label}`,
      vehicle && `• Veículo: ${vehicle}`,
      plate && `• Placa atual: ${plate}`,
      notes && `• Observações: ${notes}`,
    ].filter(Boolean);

    const href = whatsappHref(lines.join("\n"));
    if (!href) {
      if (isDev) console.warn("[company.contact.whatsapp] não configurado — o formulário não tem para onde enviar.");
      setStatus("unavailable");
      return;
    }
    window.open(href, "_blank", "noopener,noreferrer");
    setStatus("sent");
  }

  const phone = telHref();

  return (
    <RequestContext.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby={fid("title")}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className={styles.panel}>
          <header className={styles.head}>
            <p className="faint">Conte o que precisa. A gente confirma pelo WhatsApp.</p>
            <h2 id={fid("title")} className={styles.title}>
              Solicitar minha placa
            </h2>
            <button type="button" className={styles.close} onClick={close} aria-label="Fechar">
              <X size={20} strokeWidth={1.5} aria-hidden />
            </button>
          </header>

          {status === "sent" ? (
            <div className={styles.result} role="status">
              <p className={styles.resultTitle}>Pedido pronto no WhatsApp.</p>
              <p className="dim">
                Abrimos uma conversa com a sua solicitação preenchida. Se a janela não abriu, verifique o bloqueador de pop-ups e
                tente novamente.
              </p>
              <button type="button" className="btn btn--ghost" onClick={() => setStatus("idle")}>
                <span>Editar pedido</span>
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={submit} noValidate>
              <div className={styles.field}>
                <label htmlFor={fid("name")}>Seu nome</label>
                <input
                  ref={firstField}
                  id={fid("name")}
                  name="name"
                  autoComplete="name"
                  required
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? fid("name-err") : undefined}
                />
                {errors.name && (
                  <p id={fid("name-err")} className={styles.error}>
                    {errors.name}
                  </p>
                )}
              </div>

              <fieldset className={styles.field}>
                <legend>Tipo de placa</legend>
                <div className={styles.options}>
                  {SERVICES.map((s) => (
                    <label key={s.value} className={styles.option}>
                      <input
                        type="radio"
                        name="service"
                        value={s.value}
                        checked={service === s.value}
                        onChange={() => setService(s.value)}
                      />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>
                {errors.service && <p className={styles.error}>{errors.service}</p>}
              </fieldset>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor={fid("vehicle")}>
                    Veículo <span className="faint">(opcional)</span>
                  </label>
                  <input id={fid("vehicle")} name="vehicle" placeholder="Ex.: Onix 2021" />
                </div>
                <div className={styles.field}>
                  <label htmlFor={fid("plate")}>
                    Placa atual <span className="faint">(opcional)</span>
                  </label>
                  <input
                    id={fid("plate")}
                    name="plate"
                    placeholder="ABC1D23"
                    autoCapitalize="characters"
                    spellCheck={false}
                    maxLength={8}
                    aria-invalid={!!errors.plate}
                    aria-describedby={errors.plate ? fid("plate-err") : undefined}
                  />
                  {errors.plate && (
                    <p id={fid("plate-err")} className={styles.error}>
                      {errors.plate}
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor={fid("notes")}>
                  Observações <span className="faint">(opcional)</span>
                </label>
                <textarea id={fid("notes")} name="notes" rows={3} />
              </div>

              <p className={styles.note}>{company.legalNote}</p>

              {status === "unavailable" && (
                <p className={styles.error} role="alert">
                  O canal de WhatsApp ainda não está disponível.
                  {phone ? (
                    <>
                      {" "}
                      Ligue para <a href={phone} className="link">{company.contact.phone}</a>.
                    </>
                  ) : isDev ? (
                    " Configure company.contact.whatsapp em src/config/company.ts."
                  ) : null}
                </p>
              )}

              <button type="submit" className="btn btn--primary" data-cursor="cta">
                <span>Enviar pelo WhatsApp</span>
                <span className="btn__arrow" aria-hidden>
                  <WhatsAppIcon />
                  <WhatsAppIcon />
                </span>
              </button>
            </form>
          )}
        </div>
      </dialog>
    </RequestContext.Provider>
  );
}
