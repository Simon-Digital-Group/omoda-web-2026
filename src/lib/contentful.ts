import { createClient } from "contentful";
import { unstable_cache } from "next/cache";

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
 * Cross-request cache window (seconds).
 *
 * The Contentful SDK uses axios, so its requests bypass Next.js' fetch-based
 * Data Cache entirely. Without this wrapper each route (homepage + every model
 * page) re-hits the Contentful API on regeneration. `unstable_cache` persists
 * the *resolved* result in the Data Cache so identical queries (e.g. the nav
 * models, site settings) are shared across routes and only refetched once the
 * window elapses. Matches the page-level `export const revalidate = 60`.
 *
 * Every entry is tagged "contentful" so a webhook can revalidate the whole CMS
 * layer with `revalidateTag("contentful")` on publish.
 */
const REVALIDATE = 3600;
const CMS_TAG = "contentful";

/**
 * Helper: extract image URL from a Contentful media field.
 * Returns the protocol-relative URL prefixed with https.
 */
function mediaUrl(field: any): string {
  const url = field?.fields?.file?.url;
  if (!url) return "";
  return url.startsWith("//") ? `https:${url}` : url;
}

function isVideo(field: any): boolean {
  const ct = field?.fields?.file?.contentType || "";
  return ct.startsWith("video/");
}

/**
 * Fetch all hero banners (for rotating carousel on homepage)
 */
export const getHeroBanners = unstable_cache(
  async function getHeroBanners() {
    try {
      const entries = await client.getEntries({
        content_type: "heroBanner",
        include: 2,
      });
      if (!entries.items.length) return [];

      return entries.items.map((item) => {
        const f = item.fields as any;
        return {
          title: f.title || "",
          subtitle: f.subtitle || "",
          ctaText: f.ctaText || "Explorar Modelos",
          ctaLink: f.ctaLink || "#modelos",
          // backgroundMedia is now the poster image (legacy: could still be a video asset).
          backgroundUrl: mediaUrl(f.backgroundMedia),
          backgroundIsVideo: isVideo(f.backgroundMedia),
          // External video hosted on a CDN (e.g. Vercel Blob). Preferred over the
          // Contentful asset to keep video off Contentful's asset bandwidth.
          videoUrl: (f.backgroundVideoUrl || "").trim(),
          // Optional mobile-specific video; falls back to videoUrl when empty.
          videoUrlMobile: (f.backgroundVideoUrlMobile || "").trim(),
        };
      });
    } catch {
      return [];
    }
  },
  ["hero-banners"],
  { revalidate: REVALIDATE, tags: [CMS_TAG, "hero-banners"] }
);

/**
 * Fields needed to render a model in the homepage carousel + the navbar.
 * Everything else (colors, long descriptions, the linked feature graph) is
 * only consumed on the detail page, so we project just these to keep the
 * payload small. `sideImage` is a linked asset → needs include: 1.
 */
const MODEL_LIST_SELECT = [
  "fields.name",
  "fields.slug",
  "fields.brand",
  "fields.tagline",
  "fields.sideImage",
  "fields.lengthMm",
  "fields.widthMm",
  "fields.heightMm",
  "fields.wheelbaseMm",
  "fields.price",
];

/** Map a list-projected entry to the VehicleModel shape (defaults fill gaps). */
function mapListModel(f: any) {
  return {
    name: f.name || "",
    slug: f.slug || "",
    brand: f.brand || "OMODA",
    tagline: f.tagline || "",
    description: "",
    sideImage: f.sideImage || null,
    lengthMm: f.lengthMm || 0,
    widthMm: f.widthMm || 0,
    heightMm: f.heightMm || 0,
    wheelbaseMm: f.wheelbaseMm || 0,
    price: f.price || "",
    fuelType: f.fuelType || "Nafta",
    highlighted: f.highlighted ?? true,
  };
}

/**
 * Fetch all vehicle models (for the homepage carousel).
 * Projects only the fields the carousel/navbar render — no colors graph.
 */
export const getVehicleModels = unstable_cache(
  async function getVehicleModels() {
    try {
      const entries = await client.getEntries({
        content_type: "vehicleModel",
        order: ["fields.name"],
        select: MODEL_LIST_SELECT,
        include: 1,
      } as any);

      return entries.items.map((item) => mapListModel(item.fields));
    } catch {
      return [];
    }
  },
  ["vehicle-models"],
  { revalidate: REVALIDATE, tags: [CMS_TAG, "vehicle-models"] }
);

/**
 * Lightweight model list for the navbar menu — name/slug/brand only.
 * No linked assets, so include: 0. Used by model detail pages, which would
 * otherwise pull the full models list just to build nav links.
 */
export const getNavModels = unstable_cache(
  async function getNavModels() {
    try {
      const entries = await client.getEntries({
        content_type: "vehicleModel",
        order: ["fields.name"],
        select: ["fields.name", "fields.slug", "fields.brand"],
        include: 0,
      } as any);

      return entries.items.map((item) => mapListModel(item.fields));
    } catch {
      return [];
    }
  },
  ["nav-models"],
  { revalidate: REVALIDATE, tags: [CMS_TAG, "vehicle-models", "nav-models"] }
);

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
export const getVehicleModelBySlug = unstable_cache(
  async function getVehicleModelBySlug(slug: string) {
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
      const parseHighlights = (val: any): string[] => {
        if (Array.isArray(val)) return val;
        if (typeof val === "string" && val.trim()) return val.split(/\s*,\s*|\s*\n\s*/);
        return [];
      };

      return {
        name: f.name || "",
        slug: f.slug || "",
        brand: f.brand || "OMODA",
        tagline: f.tagline || "",
        description: f.description || "",
        sideImage: f.sideImage || null,
        // heroImage is now the poster image (legacy: could still be a video asset).
        heroImage: mediaUrl(f.heroImage),
        heroIsVideo: isVideo(f.heroImage),
        // External video hosted on a CDN (e.g. Vercel Blob). Preferred over the
        // Contentful asset to keep video off Contentful's asset bandwidth.
        heroVideoUrl: (f.heroVideoUrl || "").trim(),
        // Optional mobile-specific video; falls back to heroVideoUrl when empty.
        heroVideoUrlMobile: (f.heroVideoUrlMobile || "").trim(),
        lengthMm: f.lengthMm || 0,
        widthMm: f.widthMm || 0,
        heightMm: f.heightMm || 0,
        wheelbaseMm: f.wheelbaseMm || 0,
        price: f.price || "",
        fuelType: f.fuelType || "Nafta",
        highlighted: f.highlighted ?? true,
        brochureUrl: mediaUrl(f.brochure),

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

        // Technology Features (field may be techFeatures or technologyFeatures)
        technologyFeatures: resolveRefs(f.techFeatures || f.technologyFeatures).map((feat: any) => ({
          icon: feat.icon || "Star",
          title: feat.title || "",
          description: feat.description || "",
        })),

        // Safety Features (field may be safetyFeatures or safeFeatures)
        safetyFeatures: resolveRefs(f.safaetyFeatures || f.safetyFeatures || f.safeFeatures).map((feat: any) => ({
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
  },
  ["vehicle-model-by-slug"],
  { revalidate: REVALIDATE, tags: [CMS_TAG, "vehicle-models"] }
);

/**
 * Fetch network locations (concesionarios or talleres) from Contentful.
 * Single content type `networkLocation` with a `type` field = "Concesionario" | "Taller".
 * Returns [] when there's no data or on error — never invents entries.
 *
 * The CMS stores the `type` value capitalized, so we filter server-side with
 * the capitalized form (the CDA has no case-insensitive operator). The JS
 * `.toLowerCase()` pass below stays as a defensive guard against stray casing.
 */
const NETWORK_SELECT = [
  "fields.name",
  "fields.department",
  "fields.city",
  "fields.address",
  "fields.phone",
  "fields.email",
  "fields.contact",
  "fields.hours",
  "fields.type",
];

export const getNetworkLocations = unstable_cache(
  async function getNetworkLocations(type: "concesionario" | "taller") {
    try {
      const cmsType = type === "taller" ? "Taller" : "Concesionario";
      const entries = await client.getEntries({
        content_type: "networdLocation",
        "fields.type": cmsType,
        order: ["fields.department", "fields.name"],
        select: NETWORK_SELECT,
        limit: 200,
      } as any);

      return entries.items
        .filter((item) => {
          const t = ((item.fields as any).type || "").toString().trim().toLowerCase();
          return t === type;
        })
        .map((item) => {
          const f = item.fields as any;
          return {
            name: f.name || "",
            department: f.department || "",
            city: f.city || undefined,
            address: f.address || "",
            phone: f.phone || "",
            email: f.email || "",
            contact: f.contact || undefined,
            hours: f.hours || undefined,
          };
        });
    } catch {
      return [];
    }
  },
  ["network-locations"],
  { revalidate: REVALIDATE, tags: [CMS_TAG, "network-locations"] }
);

/**
 * Fetch site settings
 */
export const getSiteSettings = unstable_cache(
  async function getSiteSettings() {
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
  },
  ["site-settings"],
  { revalidate: REVALIDATE, tags: [CMS_TAG, "site-settings"] }
);
