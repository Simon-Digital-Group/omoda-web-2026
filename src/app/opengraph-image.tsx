import { ImageResponse } from "next/og";

export const alt = "OMODA | JAECOO Uruguay — SUVs Premium";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0A0A0A 0%, #0d1117 50%, #0a1628 100%)",
          padding: 80,
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: "0.4em", color: "#00C9B7", textTransform: "uppercase", fontWeight: 600 }}>
          OMODA | JAECOO
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em" }}>
            SUVs Premium
          </div>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: "#00C9B7" }}>
            en Uruguay
          </div>
        </div>
        <div style={{ fontSize: 22, color: "#999", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>omodajaecoo.com.uy</div>
          <div style={{ display: "flex", gap: 16 }}>
            <span>Test drive</span>
            <span style={{ color: "#555" }}>·</span>
            <span>Concesionarios en todo el país</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
