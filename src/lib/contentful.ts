import { createClient } from "contentful";
import { unstable_cache } from "next/cache";

// SECURITY: These env vars must NEVER be prefixed with NEXT_PUBLIC_. They are
// server-only secrets; the Contentful SDK is only imported in server components
// and API routes. Verify: grep -r "NEXT_PUBLIC_CONTENTFUL" src/ should return nothing.
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
});

// SECURITY: The preview client uses CONTENTFUL_PREVIEW_TOKEN which has access to
// unpublished (draft) content. It must only be instantiated server-side and must
// never be called from a route that isn't protected by the preview secret guard
// in src/middleware.ts.
const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN || "",
  host: "preview.contentful.com",
});

export function getClient(preview = false) {
  // SECURITY: Extra runtime guard — if preview is requested but no preview token
  // is configured, fall back to the public client rather than erroring with an
  // unhelpful message or leaking that the feature exists.
  if (preview && !process.env.CONTENTFUL_PREVIEW_TOKEN) {
    console.warn("[contentful] Preview requested but CONTENTFUL_PREVIEW_TOKEN is not set; falling back to public client.");
    return client;
  }
  return preview ? previewClient : client;
}

// SECURITY: Sanitize any URL that comes from Contentful CMS fields before use
// in href attributes. Accepts only http/https/tel/mailto schemes and Contentful
// CDN URLs. Rejects javascript:, data:, vbscript:, and anything else.
export function sanitizeCmsUrl(raw: string | undefined | null): string {
  if (!raw || typeof raw !== "string") return "";
  const trimmed = raw.trim();
  // Allow safe schemes and Contentful CDN paths
  if (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("#")
  ) {
    return trimmed;
  }
  // Block everything else (javascript:, data:, vbscript:, etc.)
  console.warn("[contentful] sanitizeCmsUrl: rejected URL scheme:", trimmed.slice(0, 40));
  return "";
}

/**
 * Cross-request cache window (seconds).
 *
 * The Contentful SDK uses axios, so its requests bypass Next.js' fetch-based
 * Data Cache entirely. Without this wrapper each route (homepage + every model
 * page) re-hits the Contentful API on regeneration. `unstable_cache` persists
 * the *resolved* result in the Data Cache so identical queries (e.g. the nav
 * models, site settings) are shared across routes and only refetched once the
 * window elapses. Matches the page-level `export const revalidate = 3600`.
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
 * Real MIME type of a Contentful media asset (e.g. "video/mp4",
 * "video/quicktime"). Used so the <source type> reflects the actual file
 * instead of a hardcoded guess — declaring the wrong type can make Safari
 * refuse to play an otherwise-decodable asset.
 */
function mediaType(field: any): string {
  return field?.fields?.file?.contentType || "";
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
          // SECURITY: sanitize CMS-supplied link before rendering into href
          ctaLink: sanitizeCmsUrl(f.ctaLink) || "#modelos",
          // backgroundMedia is the poster image (legacy: could still be a video asset).
          backgroundUrl: mediaUrl(f.backgroundMedia),
          backgroundIsVideo: isVideo(f.backgroundMedia),
          // Optional mobile-specific background asset (legacy Contentful-hosted path).
          backgroundUrlMobile:
            mediaUrl(f.backgroundMediaMobile) || mediaUrl(f.backgroundmediamobile) || "",
          backgroundIsVideoMobile:
            isVideo(f.backgroundMediaMobile) || isVideo(f.backgroundmediamobile),
          // Optional poster image (asset) shown while the video downloads.
          posterUrl: mediaUrl(f.posterMedia) || mediaUrl(f.postermedia) || "",
          // External video hosted on a CDN (e.g. Vercel Blob). Preferred over the
          // Contentful asset to keep video off Contentful's asset bandwidth.
          videoUrl: (f.backgroundVideoUrl || "").trim(),
          // Optional mobile-specific video; falls back to videoUrl when empty.
          videoUrlMobile: (f.backgroundVideoUrlMobile || "").trim(),
        };
      });
    } catch (err) {
      // SECURITY: Log errors so Contentful outages are visible in logs, but never
      // expose error details to the client — return safe empty fallback instead.
      console.error("[contentful] getHeroBanners failed:", (err as Error)?.message);
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
    } catch (err) {
      console.error("[contentful] getVehicleModels failed:", (err as Error)?.message);
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
    } catch (err) {
      console.error("[contentful] getNavModels failed:", (err as Error)?.message);
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
        // heroImage is the poster image (legacy: could still be a video asset).
        heroImage: mediaUrl(f.heroImage),
        heroIsVideo: isVideo(f.heroImage),
        // Real MIME type of the legacy hero asset, so a <source type> is accurate.
        heroVideoType: mediaType(f.heroImage),
        // External video hosted on a CDN (e.g. Vercel Blob). Preferred over the
        // Contentful asset to keep video off Contentful's asset bandwidth.
        heroVideoUrl: (f.heroVideoUrl || "").trim(),
        // Optional mobile-specific CDN video; falls back to heroVideoUrl when empty.
        heroVideoUrlMobile: (f.heroVideoUrlMobile || "").trim(),
        // Optional mobile-specific legacy hero asset (Contentful-hosted fallback).
        heroImageMobile:
          mediaUrl(f.heroImageMobile) || mediaUrl(f.heroimagemobile) || "",
        heroIsVideoMobile:
          isVideo(f.heroImageMobile) || isVideo(f.heroimagemobile),
        heroVideoTypeMobile:
          mediaType(f.heroImageMobile) || mediaType(f.heroimagemobile),
        // Optional poster images shown while a hero video buffers.
        heroPoster: mediaUrl(f.heroPoster) || mediaUrl(f.heroposter) || "",
        heroPosterMobile:
          mediaUrl(f.heroPosterMobile) || mediaUrl(f.heropostermobile) || "",
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

        // Technology Features (field may be techFeatures or technologyFeatures).
        // Each feature entry can include an optional `image` media reference — when
        // present it is rendered at the top of the card. Until uploaded, the card
        // gracefully falls back to title + description only.
        technologyFeatures: resolveRefs(f.techFeatures || f.technologyFeatures).map((feat: any) => {
          const img = mediaUrl(feat.image);
          return {
            icon: feat.icon || "Star",
            title: feat.title || "",
            description: feat.description || "",
            ...(img ? { image: img } : {}),
          };
        }),

        // Safety Features (field may be safetyFeatures or safeFeatures)
        safetyFeatures: resolveRefs(f.safaetyFeatures || f.safetyFeatures || f.safeFeatures).map((feat: any) => {
          const img = mediaUrl(feat.image);
          return {
            icon: feat.icon || "Shield",
            title: feat.title || "",
            description: feat.description || "",
            ...(img ? { image: img } : {}),
          };
        }),

        // Specs (referenced specGroup entries).
        // Tolerate two shapes in the JSON `items` field, because editors sometimes
        // paste the full specGroup JSON (with its own category+items wrapper) into
        // the items field instead of just the inner array:
        //   shape A (correct):  items: [ { label, value }, ... ]
        //   shape B (wrapped):  items: { category, items: [ { label, value }, ... ] }
        // We unwrap shape B so the page still renders without requiring the editor
        // to re-paste the JSON. Anything else falls back to an empty list.
        specs: resolveRefs(f.specs).map((group: any) => {
          const raw = group.items;
          const items = Array.isArray(raw)
            ? raw
            : Array.isArray(raw?.items)
              ? raw.items
              : [];
          return {
            category: group.category || raw?.category || "",
            items,
          };
        }),

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

        // Optional per-model override for the primary CTA label (Hero + bottom CTA).
        // Use it to switch a model into states like "Pre venta", "Próximamente",
        // etc. Empty falls back to the hard-coded "Agendar Test Drive".
        // Accepts both camelCase and lowercase Contentful IDs.
        ctaLabel:
          typeof f.ctaLabel === "string"
            ? f.ctaLabel
            : typeof f.ctalabel === "string"
              ? f.ctalabel
              : "",

        // SEO long-form content (optional from CMS). seoBody is plain long text;
        // paragraphs are split on blank lines. Each field falls back to static
        // copy in src/lib/model-seo-content.ts when empty.
        // Both camelCase and lowercase IDs are accepted because Contentful's
        // auto-generated IDs are inconsistent (e.g. seosectionlabel vs seoSectionLabel).
        seoSectionLabel:
          typeof f.seoSectionLabel === "string"
            ? f.seoSectionLabel
            : typeof f.seosectionlabel === "string"
              ? f.seosectionlabel
              : "",
        seoHeading:
          typeof f.seoHeading === "string"
            ? f.seoHeading
            : typeof f.seoheading === "string"
              ? f.seoheading
              : "",
        seoBody:
          typeof f.seoBody === "string"
            ? f.seoBody
            : typeof f.seobody === "string"
              ? f.seobody
              : "",
      };
    } catch (err) {
      console.error("[contentful] getVehicleModelBySlug failed:", (err as Error)?.message);
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
    } catch (err) {
      console.error("[contentful] getNetworkLocations failed:", (err as Error)?.message);
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
        // SECURITY: Social and WhatsApp URLs come from the CMS and are rendered
        // directly into href attributes — sanitize to allow only safe URL schemes.
        instagram: sanitizeCmsUrl(f.instagram),
        facebook: sanitizeCmsUrl(f.facebook),
        whatsapp: sanitizeCmsUrl(f.whatsapp),
      };
    } catch (err) {
      console.error("[contentful] getSiteSettings failed:", (err as Error)?.message);
      return null;
    }
  },
  ["site-settings"],
  { revalidate: REVALIDATE, tags: [CMS_TAG, "site-settings"] }
);
