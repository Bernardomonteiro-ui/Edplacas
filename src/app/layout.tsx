import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { company, siteUrl } from "@/config/company";
import { primaryCity } from "@/lib/contact";
import { RequestProvider } from "@/components/Request/RequestProvider";
import { Navbar } from "@/components/Navbar/Navbar";
import { Cursor } from "@/components/Cursor/Cursor";
import { MobileWhatsApp } from "@/components/MobileWhatsApp/MobileWhatsApp";
import { AnchorScroll } from "@/components/AnchorScroll";
import { PageTransition } from "@/motion/PageTransition";
import { ScrollRefresh } from "@/motion/ScrollRefresh";
import "@/styles/globals.css";

/* Archivo variável com eixo de largura: expandida nos títulos, condensada na placa. */
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-jetbrains", display: "swap" });

const where = primaryCity ? ` em ${primaryCity}` : "";
const title = `${company.name} — Placas automotivas Mercosul${where}`;
const description = `Venda e instalação de placas automotivas Mercosul para carros e motos${where}. Acabamento profissional, atendimento rápido e instalação especializada.`;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl), alternates: { canonical: "/" } } : {}),
  title: { default: title, template: `%s · ${company.name}` },
  description,
  applicationName: company.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    ...(siteUrl
      ? {
          url: "/",
          images: [{ url: "/api/og", width: 1200, height: 630, alt: `${company.name} — placas automotivas` }],
        }
      : {}),
    siteName: company.name,
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    ...(siteUrl ? { images: [`${siteUrl}/api/og`] } : {}),
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#071331",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/* A classe habilita a cortina e se remove após alguns segundos como fallback. */
const bootScript = `document.documentElement.classList.add('js');setTimeout(function(){document.documentElement.classList.remove('js')},4000);`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a href="#conteudo" className="skip-link">
          Pular para o conteúdo
        </a>
        <RequestProvider>
          <PageTransition />
          <Navbar />
          {children}
          <MobileWhatsApp />
        </RequestProvider>
        <Cursor />
        <AnchorScroll />
        <ScrollRefresh />
      </body>
    </html>
  );
}
