import { company, type Unit, type Weekday } from "@/config/company";

export const isDev = process.env.NODE_ENV !== "production";

/** Link do WhatsApp com mensagem. Retorna null se o número não estiver configurado. */
export function whatsappHref(message: string = company.whatsappMessage, number?: string | null) {
  const n = (number ?? company.contact.whatsapp)?.replace(/\D/g, "");
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export function telHref(phone?: string | null) {
  const n = (phone ?? company.contact.phone)?.replace(/\D/g, "");
  return n ? `tel:+${n.startsWith("55") ? n : `55${n}`}` : null;
}

export function formatAddress(u: Unit) {
  return `${u.street} — ${u.district}, ${u.city}/${u.state}, ${u.postalCode}`;
}

export function directionsHref(u: Unit) {
  if (u.mapsUrl) return u.mapsUrl;
  const dest = u.geo ? `${u.geo.lat},${u.geo.lng}` : `${u.street}, ${u.district}, ${u.city} - ${u.state}, ${u.postalCode}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
}

export function mapEmbedSrc(u: Unit) {
  const q = u.geo ? `${u.geo.lat},${u.geo.lng}` : `${u.street}, ${u.district}, ${u.city} - ${u.state}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;
}

const dayNames: Record<Weekday, string> = {
  Mo: "Seg", Tu: "Ter", We: "Qua", Th: "Qui", Fr: "Sex", Sa: "Sáb", Su: "Dom",
};

export function formatHours(u: Unit) {
  return u.hours.map((h) => {
    const d = h.days.length > 2 ? `${dayNames[h.days[0]]}–${dayNames[h.days[h.days.length - 1]]}` : h.days.map((x) => dayNames[x]).join(", ");
    return { days: d, time: `${h.opens}–${h.closes}` };
  });
}

/** Cidade principal (primeira unidade), usada em textos de SEO local. */
export const primaryCity = company.units[0]?.city ?? null;
