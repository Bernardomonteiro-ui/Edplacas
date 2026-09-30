import { Button } from "./Button";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { whatsappHref } from "@/lib/contact";

/**
 * "Falar no WhatsApp". Com número configurado vira link wa.me;
 * sem número, leva à seção de contato (nunca um link quebrado).
 */
export function WhatsAppButton({
  message,
  className,
  label = "Falar no WhatsApp",
  number,
  hideIfMissing = false,
}: {
  message?: string;
  className?: string;
  label?: string;
  number?: string;
  /** Na própria seção de contato não faz sentido apontar para #contato: oculta. */
  hideIfMissing?: boolean;
}) {
  const wa = whatsappHref(message, number);
  if (!wa && hideIfMissing) return null;
  const href = wa ?? "#contato";
  return (
    <Button href={href} variant="whatsapp" icon={<WhatsAppIcon />} className={className}>
      {label}
    </Button>
  );
}
