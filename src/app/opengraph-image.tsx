import { ImageResponse } from "next/og";
import { company } from "@/config/company";

export const alt = `${company.name} — Placas automotivas Mercosul`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento gerada no build: placa Mercosul + título. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#080808", color: "#f4f4f1", padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#ff5a1f" }}>PRECISÃO PARA O SEU CARRO</div>
        <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
          <div style={{ display: "flex", flexDirection: "column", width: 440, height: 143, background: "#f7f7f4", borderRadius: 8, border: "3px solid #111", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 30, background: "#003399", color: "#fff", fontSize: 16, letterSpacing: 6, fontWeight: 700 }}>BRASIL</div>
            <div style={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center", color: "#111", fontSize: 84, fontWeight: 800, letterSpacing: 4 }}>EDP2A26</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 900, lineHeight: 0.95, letterSpacing: -2 }}>
            <span>SUA PLACA.</span>
            <span style={{ fontSize: 34, fontWeight: 700, marginTop: 16, letterSpacing: 0 }}>O ACABAMENTO DO SEU CARRO.</span>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "rgba(244,244,241,.65)" }}>
          <span>{company.name}</span>
          <span>Venda e instalação de placas</span>
        </div>
      </div>
    ),
    size,
  );
}
