import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const runtime = "edge";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 120,
          background: "#0A0A0A",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#00C9B7",
          fontWeight: 700,
          letterSpacing: "-0.05em",
          borderRadius: 36,
        }}
      >
        OJ
      </div>
    ),
    size
  );
}
