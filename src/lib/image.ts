/**
 * Contentful Images API helper.
 *
 * Contentful serves all media through its CDN (images.ctfassets.net).
 * The Images API allows on-the-fly transforms via URL query parameters:
 *
 *   ?w=1920       → resize width
 *   ?h=1080       → resize height
 *   ?fit=fill     → crop mode (pad | fill | scale | crop | thumb)
 *   ?f=face       → focus area for crop (center | face | top | bottom | left | right)
 *   ?fm=webp      → format (jpg | png | webp | gif | avif)
 *   ?q=80         → quality 1–100
 *   ?r=20         → corner radius
 *   ?fl=progressive → progressive JPEG
 *
 * Docs: https://www.contentful.com/developers/docs/references/images-api/
 *
 * This helper centralizes transform logic so we can swap CDN providers
 * later without touching every component.
 */

interface ImageTransformOptions {
  /** Desired width in pixels */
  width?: number;
  /** Desired height in pixels */
  height?: number;
  /** Output format — webp is recommended for browsers that support it */
  format?: "jpg" | "png" | "webp" | "avif";
  /** Quality 1-100 (default 80) */
  quality?: number;
  /** Crop fitting mode */
  fit?: "pad" | "fill" | "scale" | "crop" | "thumb";
  /** Focus point for cropping */
  focus?: "center" | "face" | "top" | "bottom" | "left" | "right";
}

/**
 * Build optimized Contentful image URL with transforms.
 *
 * @example
 * contentfulImageUrl("//images.ctfassets.net/xxx/yyy/zzz/hero.jpg", { width: 1920, format: "webp", quality: 80 })
 * → "https://images.ctfassets.net/xxx/yyy/zzz/hero.jpg?w=1920&fm=webp&q=80&fl=progressive"
 */
export function contentfulImageUrl(
  rawUrl: string,
  options: ImageTransformOptions = {}
): string {
  // Contentful URLs sometimes start with "//" — normalize to https
  const url = rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl;

  // Only transform Contentful-hosted images
  if (!url.includes("ctfassets.net")) return url;

  const params = new URLSearchParams();

  if (options.width) params.set("w", String(options.width));
  if (options.height) params.set("h", String(options.height));
  if (options.format) params.set("fm", options.format);
  if (options.quality) params.set("q", String(options.quality));
  if (options.fit) params.set("fit", options.fit);
  if (options.focus) params.set("f", options.focus);

  // Progressive JPEG for jpg format
  if (options.format === "jpg" || !options.format) {
    params.set("fl", "progressive");
  }

  const query = params.toString();
  return query ? `${url}?${query}` : url;
}

/**
 * Preset configurations for common image sizes across the site.
 * Use these with <OptimizedImage preset="..." /> for consistency.
 */
export const IMAGE_PRESETS = {
  /** Hero backgrounds — full viewport width */
  hero: {
    widths: [640, 1024, 1440, 1920, 2560],
    quality: 80,
    format: "webp" as const,
  },
  /** Model side-view in carousel */
  carouselCar: {
    widths: [400, 640, 960, 1280],
    quality: 85,
    format: "webp" as const,
  },
  /** Design section images (exterior/interior) */
  designSection: {
    widths: [480, 768, 1024, 1440],
    quality: 82,
    format: "webp" as const,
  },
  /** Color variant car images */
  colorVariant: {
    widths: [480, 768, 1200],
    quality: 85,
    format: "webp" as const,
  },
  /** Gallery thumbnails */
  thumbnail: {
    widths: [200, 400],
    quality: 75,
    format: "webp" as const,
  },
  /** Feature/card icons or small images */
  small: {
    widths: [200, 400],
    quality: 80,
    format: "webp" as const,
  },
} as const;

export type ImagePreset = keyof typeof IMAGE_PRESETS;

/**
 * Generate srcSet string for responsive images from Contentful.
 * Used by OptimizedImage component.
 */
export function buildSrcSet(
  rawUrl: string,
  preset: ImagePreset
): string {
  const config = IMAGE_PRESETS[preset];

  return config.widths
    .map((w) => {
      const url = contentfulImageUrl(rawUrl, {
        width: w,
        format: config.format,
        quality: config.quality,
      });
      return `${url} ${w}w`;
    })
    .join(", ");
}

/**
 * Get the default src (largest size) for a preset.
 */
export function getDefaultSrc(rawUrl: string, preset: ImagePreset): string {
  const config = IMAGE_PRESETS[preset];
  const maxWidth = config.widths[config.widths.length - 1];

  return contentfulImageUrl(rawUrl, {
    width: maxWidth,
    format: config.format,
    quality: config.quality,
  });
}
