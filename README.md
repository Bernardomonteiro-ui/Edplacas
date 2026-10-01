# ED Placas — site institucional

Next.js 16 (App Router) · React 19 · TypeScript · CSS Modules · GSAP + ScrollTrigger · lucide-react.

```bash
npm install
npm run dev        # http://localhost:3000 — mostra marcadores [PREENCHER: …]
npm run build      # gera o site estático em out/
npm start          # serve out/ localmente
npm run typecheck
```

## Publicação (GitHub Pages)

O site é exportado como HTML estático e publicado pelo workflow
[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) a cada push na `main`.

Configuração única no GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
Sem isso, o GitHub Pages continua mostrando apenas este README.

Endereço: `https://<usuario>.github.io/<repositorio>/`. O subcaminho e a URL pública são
definidos automaticamente pelo workflow (`NEXT_PUBLIC_BASE_PATH` / `NEXT_PUBLIC_SITE_URL`).
Com domínio próprio, deixe `NEXT_PUBLIC_BASE_PATH` vazio.

As fotos de `src/assets/images` viram WebP responsivos em `public/img` (`scripts/build-images.mjs`,
roda sozinho antes do build), porque hospedagem estática não otimiza imagens sob demanda.

## 1. Preencher os dados da empresa

Todo o conteúdo fica em [`src/config/company.ts`](src/config/company.ts). Nenhum dado comercial foi inventado:
os campos `null` ou as listas vazias são placeholders.

- **Em desenvolvimento**, cada dado ausente aparece no site como `[PREENCHER: company.campo]`.
- **Em produção**, o bloco correspondente é omitido (nunca aparece "[X] min" para o visitante).

| Campo | Efeito |
|---|---|
| `contact.whatsapp` | Número único (DDI+DDD, só dígitos). Ativa todos os botões de WhatsApp, a barra fixa no mobile e o envio do formulário. |
| `contact.phone`, `email`, `instagram` | Rodapé, menu mobile, contato. |
| `units[]` | Endereço, horário, mapa, "Como chegar" e o schema `AutomotiveBusiness` (um por unidade). |
| `speed.attendanceMinutes` / `installMinutes` | Indicadores com contador animado. Use só números medidos. |
| `testimonials[]` / `reviewsUrl` | Seção "Quem faz, recomenda" (oculta em produção enquanto vazia). |
| `name`, `logoMark` | Nome inferido da pasta do projeto: **confirme a grafia oficial**. |

Exemplo de unidade:

```ts
units: [
  {
    id: "matriz",
    name: "ED Placas — Centro",
    street: "Rua Exemplo, 123",
    district: "Centro",
    city: "Sua Cidade",
    state: "UF",
    postalCode: "00000-000",
    geo: { lat: -23.0, lng: -46.0 },        // opcional
    hours: [
      { days: ["Mo", "Tu", "We", "Th", "Fr"], opens: "08:00", closes: "18:00" },
      { days: ["Sa"], opens: "08:00", closes: "12:00" },
    ],
  },
],
```

Com a cidade preenchida, título, descrição e textos de localização passam a citá-la (SEO local, sem repetição de palavras-chave).

## 2. Produção

Fora do GitHub Pages, defina `NEXT_PUBLIC_SITE_URL` (veja `.env.example`). Sem ela, o build de produção não emite canonical, sitemap, URLs de Open Graph nem JSON-LD, para não publicar URLs erradas.

## 3. Identidade visual

- Tokens em [`src/styles/globals.css`](src/styles/globals.css). `--accent` (laranja de sinalização) é **provisório**: troque pela cor da marca.
- O logotipo em [`src/components/Logo`](src/components/Logo/Logo.tsx) é tipográfico e provisório.
- As fotos em `src/assets/images` são de banco de imagem (Unsplash), com tratamento escuro e placas estrangeiras desfocadas.
  Para substituir pelas fotos reais, coloque os originais numa pasta e rode `node scripts/optimize-images.mjs <pasta>`
  (mesmos nomes de arquivo). O hero e o antes/depois posicionam a placa no para-choque da foto atual
  (`left 50%` / `top 65%` / `width 11.75%` em `Hero.module.css` e `BeforeAfter.module.css`): ajuste esses valores se trocar a foto.
- A placa é um SVG próprio em medidas reais (400 × 130 mm / moto 200 × 170 mm): [`src/components/Plate`](src/components/Plate/Plate.tsx). Os códigos exibidos (EDP2A26…) são ilustrativos.

## Estrutura

```
src/
  app/                layout, página, robots, sitemap, manifest, ícones, /api/og
  config/company.ts   dados centrais
  components/         Navbar, Hero, PrecisionSection, PlateAnatomy, ProductsHorizontal,
                      BeforeAfter, ProcessTimeline, SpeedSection, Testimonials, Location,
                      FinalCTA, Footer, Plate, Request (formulário), Cursor, MobileWhatsApp
  motion/             RevealText, RevealImage, ParallaxImage, HorizontalScroll,
                      AnimatedCounter, MagneticButton, ClipReveal, PageTransition, ScrollRefresh
  lib/                gsap (registro + media queries), contact (links e formatação)
```

## Motion e acessibilidade

Todas as animações passam por `gsap.matchMedia()`: com `prefers-reduced-motion: reduce` não há pin, parallax,
scrub nem scroll horizontal, e todo o conteúdo fica visível no estado final. No mobile, os modelos usam
swipe nativo com scroll-snap no lugar do pin horizontal. O cursor customizado só existe com ponteiro fino.

O formulário "Solicitar minha placa" não tem backend: valida os campos e abre o WhatsApp da empresa com o pedido já preenchido.
