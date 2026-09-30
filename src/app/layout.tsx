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
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s · ${company.name}` },
  description,
  applicationName: company.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: company.name,
    title,
    description,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/*
  Marca .js antes da pintura (pré-estados de animação sem flash).
  Rede de segurança: se o JS não concluir a abertura em 4s, remove a classe e mostra tudo.
*/
const bootScript = `document.documentElement.classList.add('js');setTimeout(function(){if(!window.__introDone)document.documentElement.classList.remove('js')},4000);`;

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
