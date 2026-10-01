/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CONFIGURAÇÃO CENTRAL DA EMPRESA
 * ─────────────────────────────────────────────────────────────────────────────
 *  Todo o conteúdo do site sai deste arquivo.
 *
 *  REGRA: nenhum dado comercial foi inventado. Campos com `null` ou listas
 *  vazias são PLACEHOLDERS — o site os trata assim:
 *    • em desenvolvimento (`npm run dev`) aparece um marcador tracejado
 *      "[PREENCHER: campo]" no lugar exato onde o dado será exibido;
 *    • em produção o bloco correspondente é omitido (nunca aparece "[X] min").
 *
 *  Procure por "PLACEHOLDER" para ver tudo o que falta preencher.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Weekday = "Mo" | "Tu" | "We" | "Th" | "Fr" | "Sa" | "Su";

export interface OpeningHours {
  days: Weekday[];
  opens: string; // "08:00"
  closes: string; // "18:00"
}

export interface Unit {
  id: string;
  name: string;
  street: string; // "Rua Exemplo, 123"
  district: string; // bairro
  city: string;
  state: string; // UF, ex.: "SP"
  postalCode: string;
  /** Coordenadas melhoram o schema.org e o mapa. Opcional. */
  geo?: { lat: number; lng: number };
  /** Se a unidade tiver telefone/WhatsApp próprios; senão usa os gerais. */
  phone?: string;
  whatsapp?: string;
  hours: OpeningHours[];
  /** Link do perfil no Google Maps (opcional). Sem ele, o link é montado pelo endereço. */
  mapsUrl?: string;
}

export interface Product {
  id: string;
  number: string;
  name: string;
  description: string;
  image: "padrao" | "personalizada" | "moto" | "outros";
  imageAlt: string;
  /** Placa exibida sobre a foto (opcional). Código ilustrativo, não é placa real. */
  plate?: { code: string; variant: "car" | "moto" };
}

export interface Testimonial {
  name: string;
  vehicle?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  /** Origem da avaliação, ex.: "Google". */
  source?: string;
}

export const company = {
  /** Nome inferido da pasta do projeto — CONFIRMAR grafia oficial. */
  name: "ED Placas",
  /** Sigla usada no logotipo tipográfico. */
  logoMark: "ED",
  legalName: null as string | null, // PLACEHOLDER: razão social
  cnpj: null as string | null, // PLACEHOLDER

  description:
    "Venda e instalação de placas automotivas para carros e motos, no padrão Mercosul.",

  contact: {
    /** Somente dígitos com DDI+DDD, ex.: "5511999999999". */
    whatsapp: null as string | null, // PLACEHOLDER — número único usado em todo o site
    /** Formato livre para exibição, ex.: "(11) 3333-3333". */
    phone: null as string | null, // PLACEHOLDER
    email: null as string | null, // PLACEHOLDER
    instagram: null as string | null, // PLACEHOLDER — URL completa do perfil
  },

  /** Mensagem inicial padrão do WhatsApp. */
  whatsappMessage: "Olá! Vim pelo site e gostaria de solicitar uma placa.",

  /**
   * Unidades físicas. Com mais de uma, o site lista todas e gera um
   * AutomotiveBusiness (schema.org) por unidade.
   */
  units: [] as Unit[], // PLACEHOLDER — exemplo de preenchimento no README

  /** Dados de agilidade. Só preencher com números reais medidos pela empresa. */
  speed: {
    attendanceMinutes: null as number | null, // PLACEHOLDER: tempo médio de atendimento
    installMinutes: null as number | null, // PLACEHOLDER: tempo médio de instalação
  },

  /** Avaliações reais (ex.: copiadas do perfil no Google, com autorização). */
  testimonials: [] as Testimonial[], // PLACEHOLDER
  /** Link para todas as avaliações (Google Business Profile). */
  reviewsUrl: null as string | null, // PLACEHOLDER

  /** Informação regulatória exibida no formulário de solicitação. */
  legalNote:
    "Os documentos necessários podem variar conforme o serviço e as regras do seu estado. Fale com a equipe para confirmar o que levar.",

  services: [
    "Venda de placas automotivas padrão Mercosul",
    "Instalação de placas",
    "Placas para motos",
    "Reposição de placas",
  ],

  products: [
    {
      id: "padrao",
      number: "01",
      name: "Placa padrão",
      description:
        "O modelo Mercosul para carros, 400 × 130 mm. Estampada e instalada no seu veículo.",
      image: "padrao",
      imageAlt: "Traseira de um sedã escuro em movimento, ao entardecer",
      plate: { code: "EDP2A26", variant: "car" },
    },
    {
      id: "personalizada",
      number: "02",
      name: "Placa personalizada",
      description:
        "Opções de acabamento para quem quer um conjunto mais cuidado, dentro das regras do Detran.",
      image: "personalizada",
      imageAlt: "Esportivo vermelho estacionado diante de portões metálicos",
      plate: { code: "EDP7C19", variant: "car" },
    },
    {
      id: "moto",
      number: "03",
      name: "Placa para motos",
      description: "Formato compacto Mercosul, 200 × 170 mm, com fixação própria para motocicletas.",
      image: "moto",
      imageAlt: "Motocicleta esportiva vermelha em uma garagem escura",
      plate: { code: "EDP4B31", variant: "moto" },
    },
    {
      id: "outros",
      number: "04",
      name: "Outros modelos",
      description: "Reboques, reposição e outras necessidades. Fale com a equipe e confirme o modelo.",
      image: "outros",
      imageAlt: "Esportivo cinza fosco em uma estrada ao pôr do sol",
    },
  ] as Product[],

  /** Seção "Anatomia da placa". */
  anatomy: [
    {
      id: "acabamento",
      number: "01",
      title: "Acabamento",
      text: "Superfície, bordas e película refletiva. É o que se vê primeiro — e o que mais denuncia uma placa mal feita.",
    },
    {
      id: "identificacao",
      number: "02",
      title: "Identificação",
      text: "Caracteres, QR Code e faixa Mercosul, cada elemento na posição prevista pelo padrão.",
    },
    {
      id: "fixacao",
      number: "03",
      title: "Fixação",
      text: "Parafusos certos e bem apertados. Placa solta vibra, marca a pintura e pode se perder.",
    },
    {
      id: "alinhamento",
      number: "04",
      title: "Alinhamento",
      text: "Nivelada com o para-choque e centralizada. Um grau fora do eixo já aparece.",
    },
    {
      id: "instalacao",
      number: "05",
      title: "Instalação",
      text: "O suporte adequado para cada veículo. Instalação sem improviso.",
    },
  ],

  /** Seção "Do pedido à instalação". */
  process: [
    {
      number: "01",
      title: "Você solicita",
      text: "Pelo WhatsApp, por telefone ou aqui no site. Conte qual é o veículo e o que precisa.",
    },
    {
      number: "02",
      title: "Confirmamos o modelo",
      text: "Conferimos o tipo de placa, a documentação necessária e combinamos o horário.",
    },
    {
      number: "03",
      title: "Preparamos sua placa",
      text: "Estampagem e conferência dos detalhes antes de a placa chegar ao carro.",
    },
    {
      number: "04",
      title: "Instalamos",
      text: "Fixação firme e alinhamento conferido no próprio veículo.",
    },
    {
      number: "05",
      title: "Você sai com o carro pronto",
      text: "Placa instalada, alinhada e pronta para rodar.",
    },
  ],
} as const;

export type Company = typeof company;

/** URL pública. Defina NEXT_PUBLIC_SITE_URL no ambiente de produção. */
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
export const siteUrl =
  (configuredSiteUrl || (process.env.NODE_ENV === "production" ? null : "http://localhost:3000"))?.replace(/\/+$/, "") ?? null;
