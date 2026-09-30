import { useId } from "react";
import styles from "./Plate.module.css";

interface PlateProps {
  /** Código ilustrativo no formato Mercosul (ABC1D23). Não representa um veículo real. */
  code?: string;
  variant?: "car" | "moto";
  condition?: "new" | "worn";
  className?: string;
  /** Texto alternativo. Se omitido, a placa é decorativa (aria-hidden). */
  label?: string;
}

/** Padrão fixo do QR Code ilustrativo (8×8). */
const QR = [
  "11101011",
  "10100010",
  "11101110",
  "00010100",
  "10111011",
  "01000101",
  "11101010",
  "10101111",
];

/**
 * Placa Mercosul desenhada em SVG com as medidas reais em milímetros
 * (carro 400 × 130 mm, moto 200 × 170 mm) — escala infinita, sem imagem.
 * Os grupos têm data-part para a seção de anatomia destacar cada área.
 */
export function Plate({ code = "EDP2A26", variant = "car", condition = "new", className, label }: PlateProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (s: string) => `${s}-${uid}`;
  const worn = condition === "worn";
  const car = variant === "car";

  const W = car ? 400 : 200;
  const H = car ? 130 : 170;
  const band = car ? 26 : 30;

  const colors = worn
    ? { body: `url(#${id("bodyWorn")})`, band: "#34507f", ink: "#3b3834", border: "#4a4640" }
    : { body: `url(#${id("body")})`, band: "var(--plate-blue)", ink: "var(--plate-ink)", border: "var(--plate-ink)" };

  const screws = car
    ? [
        { x: 100, y: band / 2 },
        { x: 300, y: band / 2 },
      ]
    : [
        { x: 40, y: band / 2 },
        { x: 160, y: band / 2 },
      ];

  const qrX = car ? 11 : 10;
  const qrY = car ? 36 : 38;
  const cell = car ? 2.1 : 1.9;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={[styles.plate, className].filter(Boolean).join(" ")}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      data-plate={variant}
    >
      <defs>
        <clipPath id={id("clip")}>
          <rect width={W} height={H} rx="6" />
        </clipPath>
        <linearGradient id={id("body")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="var(--plate-white)" />
          <stop offset="1" stopColor="#e6e6e1" />
        </linearGradient>
        <linearGradient id={id("bodyWorn")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e4dcc3" />
          <stop offset="0.6" stopColor="#d6ccb0" />
          <stop offset="1" stopColor="#bdb193" />
        </linearGradient>
        <linearGradient id={id("sheen")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id("screw")} cx="0.35" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#fafafa" />
          <stop offset="0.6" stopColor="#a9a9a9" />
          <stop offset="1" stopColor="#5b5b5b" />
        </radialGradient>
        <radialGradient id={id("rust")} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#5a3417" stopOpacity="0.9" />
          <stop offset="1" stopColor="#8a5a2b" stopOpacity="0" />
        </radialGradient>
        <filter id={id("grime")} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.09" numOctaves="3" seed="7" />
          <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.13  0 0 0 -1.6 1.05" />
        </filter>
      </defs>

      <g clipPath={`url(#${id("clip")})`}>
        {/* Superfície / película refletiva */}
        <rect data-part="surface" width={W} height={H} fill={colors.body} />

        {/* Faixa Mercosul */}
        <g data-part="band">
          <rect width={W} height={band} fill={colors.band} />
          <text
            x={W / 2}
            y={band * 0.7}
            textAnchor="middle"
            className={styles.bandText}
            fontSize={car ? 13 : 12}
            fill={worn ? "#dcdcd2" : "#fff"}
          >
            BRASIL
          </text>
          {/* Emblema simplificado (Cruzeiro do Sul) */}
          <g transform={`translate(${car ? 22 : 18} ${band / 2})`} fill="#fff" opacity={worn ? 0.7 : 1}>
            <path d="M-9 4 Q0 -2 9 4" stroke="#fff" strokeWidth="1.1" fill="none" />
            <circle cx="0" cy="-6" r="1.2" />
            <circle cx="-4" cy="-2.5" r="1" />
            <circle cx="4" cy="-2.5" r="1" />
            <circle cx="0" cy="1.2" r="0.9" />
          </g>
          {/* Bandeira simplificada */}
          <g transform={`translate(${car ? W - 38 : W - 32} ${band / 2 - 7})`} opacity={worn ? 0.75 : 1}>
            <rect width="22" height="14" fill="#009b3a" />
            <polygon points="11,1.6 20.4,7 11,12.4 1.6,7" fill="#fedf00" />
            <circle cx="11" cy="7" r="3.2" fill="#002776" />
          </g>
        </g>

        {/* Identificação: QR Code + BR + caracteres */}
        <g data-part="qr" fill={colors.ink}>
          {QR.flatMap((row, r) =>
            row.split("").map((c, k) =>
              c === "1" ? <rect key={`${r}-${k}`} x={qrX + k * cell} y={qrY + r * cell} width={cell} height={cell} /> : null,
            ),
          )}
          <text x={qrX + cell * 4} y={H - 12} textAnchor="middle" className={styles.br} fontSize={car ? 12 : 11}>
            BR
          </text>
        </g>

        <g data-part="chars" fill={colors.ink}>
          {car ? (
            <text x="214" y="110" textAnchor="middle" textLength="332" lengthAdjust="spacingAndGlyphs" className={styles.chars} fontSize="80">
              {code}
            </text>
          ) : (
            <>
              <text x="112" y="92" textAnchor="middle" textLength="118" lengthAdjust="spacingAndGlyphs" className={styles.chars} fontSize="58">
                {code.slice(0, 3)}
              </text>
              <text x="100" y="158" textAnchor="middle" textLength="160" lengthAdjust="spacingAndGlyphs" className={styles.chars} fontSize="58">
                {code.slice(3)}
              </text>
            </>
          )}
        </g>

        {/* Desgaste */}
        {worn && (
          <g data-part="wear">
            <rect width={W} height={H} filter={`url(#${id("grime")})`} opacity="0.55" />
            <g stroke="#fffdf4" strokeOpacity="0.55" strokeWidth="0.7" fill="none">
              <path d={`M${W * 0.18} ${H * 0.42} l${W * 0.2} ${H * 0.18}`} />
              <path d={`M${W * 0.55} ${H * 0.3} l${W * 0.07} ${H * 0.4}`} />
              <path d={`M${W * 0.7} ${H * 0.75} l${W * 0.18} -${H * 0.1}`} />
            </g>
            <ellipse cx={screws[1].x} cy={screws[1].y + 10} rx="10" ry="14" fill={`url(#${id("rust")})`} />
            <path d={`M${W} ${H - 18} L${W - 14} ${H} L${W} ${H} Z`} fill="#1a1a1a" />
          </g>
        )}

        {/* Reflexo que percorre a película (animado via CSS/GSAP) */}
        {!worn && (
          <rect data-part="sheen" className={styles.sheen} x={-W * 0.4} y={-H * 0.2} width={W * 0.28} height={H * 1.4} fill={`url(#${id("sheen")})`} transform="skewX(-18)" />
        )}
      </g>

      {/* Borda */}
      <rect data-part="border" x="1.2" y="1.2" width={W - 2.4} height={H - 2.4} rx="5" fill="none" stroke={colors.border} strokeWidth="1.8" />

      {/* Fixação */}
      <g data-part="screws">
        {screws.map((s, i) =>
          worn && i === 1 ? (
            <circle key={i} cx={s.x} cy={s.y} r="3.4" fill="#141414" />
          ) : (
            <g key={i} transform={`translate(${s.x} ${s.y})`}>
              <circle r="4.6" fill={`url(#${id("screw")})`} stroke="rgba(0,0,0,.45)" strokeWidth="0.5" />
              <path d="M-2.6 0 H2.6 M0 -2.6 V2.6" stroke="#3a3a3a" strokeWidth="0.9" transform={worn ? "rotate(28)" : undefined} />
            </g>
          ),
        )}
      </g>
    </svg>
  );
}
