import { createClient } from "contentful";

/**
 * Contentful client for fetching CMS content.
 *
 * Content Types to create in Contentful:
 *
 * 1. "heroBanner" — Hero section content
 *    - title: Short Text
 *    - subtitle: Short Text
 *    - ctaText: Short Text
 *    - ctaLink: Short Text
 *    - backgroundMedia: Media (image or video)
 *    - overlayOpacity: Number (0-1)
 *
 * 2. "vehicleModel" — Car models
 *    - name: Short Text (e.g. "OMODA 5")
 *    - slug: Short Text (e.g. "omoda-5")
 *    - brand: Short Text ["OMODA" | "JAECOO"]
 *    - tagline: Short Text
 *    - description: Long Text
 *    - sideImage: Media (lateral photo for carousel)
 *    - galleryImages: Media (multiple)
 *    - lengthMm: Number
 *    - widthMm: Number
 *    - heightMm: Number
 *    - wheelbaseMm: Number
 *    - price: Short Text (e.g. "Desde USD 29.990")
 *    - fuelType: Short Text ["Nafta" | "Eléctrico" | "Híbrido"]
 *    - highlighted: Boolean (show in carousel)
 *
 * 3. "siteSettings" — General site config
 *    - siteName: Short Text
 *    - logo: Media
 *    - phone: Short Text
 *    - email: Short Text
 *    - address: Long Text
 *    - instagram: Short Text
 *    - facebook: Short Text
 *    - whatsapp: Short Text
 */

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
 * Fetch hero banner content
 */
export async function getHeroBanner() {
  try {
    const entries = await client.getEntries({
      content_type: "heroBanner",
      limit: 1,
    });
    return entries.items[0]?.fields ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetch all vehicle models (for carousel)
 */
export async function getVehicleModels() {
  try {
    const entries = await client.getEntries({
      content_type: "vehicleModel",
      order: ["fields.name"],
    });
    return entries.items.map((item) => item.fields);
  } catch {
    return [];
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
    });
    return entries.items[0]?.fields ?? null;
  } catch {
    return null;
  }
}
