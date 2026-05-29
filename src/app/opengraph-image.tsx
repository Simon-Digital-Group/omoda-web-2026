import { ImageResponse } from "next/og";

export const alt = "OMODA | JAECOO Uruguay — SUVs Premium";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const runtime = "edge";

export default async function OGImage() {
  const heroData = await fetch(new URL("./og-hero.jpg", import.meta.url)).then(
    (r) => r.arrayBuffer()
  );

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex" }}>
        <img
          // @ts-expect-error next/og accepts ArrayBuffer
          src={heroData}
          width={1200}
          height={630}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    ),
    size
  );
}
