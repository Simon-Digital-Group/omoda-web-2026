import { createClient, Entry } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
});

const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN || "",
  host: "preview.contentful.com",
});

export function getClient(preview = false) {
  return preview ? previewClient : client;
}

/**
 * Helper: extract image URL from a Contentful media field.
 * Returns the protocol-relative URL prefixed with https.
 */
function mediaUrl(field: any): string {
  const url = field?.fields?.file?.url;
  if (!url) return "";
  return url.startsWith("//") ? `https:${url}` : url;
}

/**
 * Fetch hero banner content
 */
export async function getHeroBanner() {
  try {
    const entries = await client.getEntries({
      content_type: "heroBanner",
      limit: 1,
      include: 2,
    });
    if (!entries.items.length) return null;

    const f = entries.items[0].fields as any;
    return {
      title: f.title || "",
      subtitle: f.subtitle || "",
      ctaText: f.ctaText || "Explorar Modelos",
      ctaLink: f.ctaLink || "#modelos",
      backgroundUrl: mediaUrl(f.backgroundMedia),
    };
  } catch {
    return null;
  }
}

/**
 * Fetch all vehicle models (for carousel on homepage)
 */
export async function getVehicleModels() {
  try {
    const entries = await client.getEntries({
      content_type: "vehicleModel",
      order: ["fields.name"],
      include: 2,
    });

    return entries.items.map((item) => {
      const f = item.fields as any;
      return {
        name: f.name || "",
        slug: f.slug || "",
        brand: f.brand || "OMODA",
        tagline: f.tagline || "",
        description: f.description || "",
        sideImage: f.sideImage || null,
        lengthMm: f.lengthMm || 0,
        widthMm: f.widthMm || 0,
        heightMm: f.heightMm || 0,
        wheelbaseMm: f.wheelbaseMm || 0,
        price: f.price || "",
        fuelType: f.fuelType || "Nafta",
        highlighted: f.highlighted ?? true,
        // Colors from referenced modelColor entries
        colors: Array.isArray(f.colors)
          ? f.colors.map((colorEntry: any) => ({
              name: colorEntry.fields?.name || "",
              hex: colorEntry.fields?.hex || "#000000",
              image: mediaUrl(colorEntry.fields?.image),
            }))
          : [],
      };
    });
  } catch {
    return [];
  }
}

/**
 * Helper: extract referenced entries into a simple array of their fields
 */
function resolveRefs(refs: any[] | undefined): any[] {
  if (!Array.isArray(refs)) return [];
  return refs
    .filter((r) => r?.fields)
    .map((r) => r.fields);
}

/**
 * Helper: extract media array into URL strings
 */
function mediaUrls(mediaArray: any[] | undefined): string[] {
  if (!Array.isArray(mediaArray)) return [];
  return mediaArray.map((m) => mediaUrl(m)).filter(Boolean);
}

/**
 * Fetch a single vehicle model by slug — full page data
 */
export async function getVehicleModelBySlug(slug: string) {
  try {
    const entries = await client.getEntries({
      content_type: "vehicleModel",
      "fields.slug": slug,
      limit: 1,
      include: 3,
    });

    if (!entries.items.length) return null;

    const f = entries.items[0].fields as any;

    // keyStats can be named keyStats or keyStat, single ref or array
    const rawKeyStatsField = f.keyStats || f.keyStat;
    const rawKeyStats = Array.isArray(rawKeyStatsField) ? rawKeyStatsField : rawKeyStatsField ? [rawKeyStatsField] : [];

    // Highlights can be a string (comma/space separated) or array
    function parseHighlights(val: any): string[] {
      if (Array.isArray(val)) return val;
      if (typeof val === "string" && val.trim()) return val.split(/\s*,\s*|\s*\n\s*/);
      return [];
    }

    return {
      name: f.name || "",
      slug: f.slug || "",
      brand: f.brand || "OMODA",
      tagline: f.tagline || "",
      description: f.description || "",
      sideImage: f.sideImage || null,
      heroImage: mediaUrl(f.heroImage),
      lengthMm: f.lengthMm || 0,
      widthMm: f.widthMm || 0,
      heightMm: f.heightMm || 0,
      wheelbaseMm: f.wheelbaseMm || 0,
      price: f.price || "",
      fuelType: f.fuelType || "Nafta",
      highlighted: f.highlighted ?? true,

      // Colors
      colors: Array.isArray(f.colors)
        ? f.colors
            .filter((c: any) => c?.fields)
            .map((c: any) => ({
              name: c.fields.name || "",
              hex: c.fields.hex?.trim() || "#000000",
              image: mediaUrl(c.fields.image),
            }))
        : [],

      // Key Stats — single ref or array
      keyStats: rawKeyStats
        .filter((s: any) => s?.fields)
        .map((s: any) => ({
          value: s.fields.value || "",
          unit: s.fields.unit || "",
          label: s.fields.label || "",
        })),

      // Sección 1 (Exterior) — mapped from Contentful field names
      exteriorHeading: f.titulo1eraSeccin || f.exteriorHeading || "",
      exteriorDescription: f.desc1eraSeccin || f.exteriorDescription || "",
      exteriorImages: mediaUrls(f.img1eraSeccin) || mediaUrls(f.exteriorImages),
      exteriorHighlights: parseHighlights(f.highligh1eraSeccin || f.exteriorHighlights),

      // Sección 2 (Interior) — mapped from Contentful field names
      interiorHeading: f.titulo2daSeccin || f.interiorHeading || "",
      interiorDescription: f.des2daSeccin || f.interiorDescription || "",
      interiorImages: mediaUrls(f.iMg2daSeccin) || mediaUrls(f.interiorImages),
      interiorHighlights: parseHighlights(f.highligh2daSeccin || f.interiorHighlights),

      // Technology Features (referenced modelFeature entries)
      technologyFeatures: resolveRefs(f.technologyFeatures).map((feat: any) => ({
        icon: feat.icon || "Star",
        title: feat.title || "",
        description: feat.description || "",
      })),

      // Safety Features
      safetyFeatures: resolveRefs(f.safetyFeatures).map((feat: any) => ({
        icon: feat.icon || "Shield",
        title: feat.title || "",
        description: feat.description || "",
      })),

      // Specs (referenced specGroup entries)
      specs: resolveRefs(f.specs).map((group: any) => ({
        category: group.category || "",
        items: Array.isArray(group.items) ? group.items : [],
      })),

      // Powertrain Options (referenced powertrainOption entries)
      powertrainOptions: resolveRefs(f.powertrainOptions).map((opt: any) => ({
        name: opt.name || "",
        type: opt.type || "Nafta",
        power: opt.power || "",
        torque: opt.torque || "",
        acceleration: opt.acceleration || "",
        consumption: opt.consumption || "",
        range: opt.range || "",
        transmission: opt.transmission || "",
      })),
    };
  } catch {
    return null;
  }
}

/**
 * Fetch site settings
 */
export async function getSiteSettings() {
  try {
    const entries = await client.getEntries({
      content_type: "siteSettings",
      limit: 1,
      include: 2,
    });
    if (!entries.items.length) return null;

    const f = entries.items[0].fields as any;
    return {
      siteName: f.siteName || "",
      logo: mediaUrl(f.logo),
      phone: f.phone || "",
      email: f.email || "",
      address: f.address || "",
      instagram: f.instagram || "",
      facebook: f.facebook || "",
      whatsapp: f.whatsapp || "",
    };
  } catch {
    return null;
  }
}
