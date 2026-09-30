import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#080808" }}>
        <div style={{ display: "flex", flexDirection: "column", width: 146, height: 84, background: "#f4f4f1", borderRadius: 6, overflow: "hidden" }}>
          <div style={{ height: 18, background: "#ff5a1f", display: "flex" }} />
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, fontWeight: 900, color: "#080808" }}>ED</div>
        </div>
      </div>
    ),
    size,
  );
}
