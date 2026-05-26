import type { MetadataRoute } from "next";
import { ALL_MODEL_SLUGS } from "@/lib/models-data";
import { getVehicleModels } from "@/lib/contentful";

const BASE = "https://omodajaecoo.com.uy";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cmsModels = await getVehicleModels().catch(() => []);
  const slugs = cmsModels.length > 0
    ? Array.from(new Set(cmsModels.map((m) => m.slug).filter(Boolean)))
    : ALL_MODEL_SLUGS;

  const now = new Date();

  const modelPages = slugs.map((slug) => ({
    url: `${BASE}/modelos/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/concesionarios`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/talleres`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/politica-de-privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...modelPages,
  ];
}
