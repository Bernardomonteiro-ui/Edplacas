import { isDev } from "@/lib/contact";

/**
 * Marcador visível SOMENTE em desenvolvimento, apontando o campo de
 * src/config/company.ts que precisa ser preenchido. Em produção não renderiza nada.
 */
export function Placeholder({ field, hint }: { field: string; hint?: string }) {
  if (!isDev) return null;
  return (
    <span className="placeholder" data-placeholder={field}>
      [PREENCHER: company.{field}]{hint ? ` — ${hint}` : ""}
    </span>
  );
}
