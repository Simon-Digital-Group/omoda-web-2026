import type { MetadataRoute } from "next";
import { ALL_MODEL_SLUGS } from "@/lib/models-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://omodajaecoo.com.uy";

  const modelPages = ALL_MODEL_SLUGS.map((slug) => ({
    url: `${baseUrl}/modelos/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/concesionarios`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/talleres`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...modelPages,
  ];
}
