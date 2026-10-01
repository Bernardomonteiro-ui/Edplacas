import { company, siteUrl } from "@/config/company";

/**
 * schema.org em JSON-LD.
 * - WebSite + Organization sempre;
 * - um AutomotiveBusiness por unidade, SOMENTE quando há endereço cadastrado
 *   (dados incompletos em LocalBusiness prejudicam mais do que ajudam).
 * Avaliações não são marcadas como AggregateRating: o Google não exibe
 * avaliações autodeclaradas de LocalBusiness e isso pode gerar ação manual.
 */
export function StructuredData() {
  if (!siteUrl) return null;

  const org = {
    "@type": "Organization",
    "@id": `${siteUrl}/#org`,
    name: company.name,
    ...(company.legalName ? { legalName: company.legalName } : {}),
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    description: company.description,
    ...(company.contact.instagram ? { sameAs: [company.contact.instagram] } : {}),
  };

  const offers = company.products.map((p) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Product", name: p.name, description: p.description },
  }));

  const businesses = company.units.map((u) => ({
    "@type": "AutomotiveBusiness",
    "@id": `${siteUrl}/#${u.id}`,
    name: u.name,
    parentOrganization: { "@id": `${siteUrl}/#org` },
    url: siteUrl,
    image: `${siteUrl}/og.png`,
    telephone: u.phone ?? company.contact.phone ?? undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: u.street,
      addressLocality: u.city,
      addressRegion: u.state,
      postalCode: u.postalCode,
      addressCountry: "BR",
    },
    ...(u.geo ? { geo: { "@type": "GeoCoordinates", latitude: u.geo.lat, longitude: u.geo.lng } } : {}),
    areaServed: { "@type": "City", name: u.city },
    openingHoursSpecification: u.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map(
        (d) => `https://schema.org/${({ Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday", Fr: "Friday", Sa: "Saturday", Su: "Sunday" } as const)[d]}`,
      ),
      opens: h.opens,
      closes: h.closes,
    })),
    hasOfferCatalog: { "@type": "OfferCatalog", name: "Placas automotivas", itemListElement: offers },
    ...(u.mapsUrl ? { hasMap: u.mapsUrl } : {}),
  }));

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${siteUrl}/#site`, url: siteUrl, name: company.name, inLanguage: "pt-BR", publisher: { "@id": `${siteUrl}/#org` } },
      org,
      ...businesses,
    ],
  };

  const jsonLd = JSON.stringify(data).replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />;
}
