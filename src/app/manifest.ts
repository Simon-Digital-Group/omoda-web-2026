import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OMODA | JAECOO Uruguay",
    short_name: "OMODA JAECOO",
    description: "SUVs premium OMODA y JAECOO en Uruguay.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#0A0A0A",
    orientation: "portrait",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
    lang: "es-UY",
    categories: ["business", "automotive"],
  };
}
