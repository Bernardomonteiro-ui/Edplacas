import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#071331" }}>
        <div style={{ display: "flex", flexDirection: "column", width: 146, height: 84, background: "#ffffff", borderRadius: 6, overflow: "hidden" }}>
          <div style={{ height: 18, background: "#1640d6", display: "flex" }} />
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, fontWeight: 900, color: "#071331" }}>ED</div>
        </div>
      </div>
    ),
    size,
  );
}
