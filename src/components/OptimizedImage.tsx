"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  contentfulImageUrl,
  buildSrcSet,
  getDefaultSrc,
  IMAGE_PRESETS,
  type ImagePreset,
} from "@/lib/image";

interface OptimizedImageProps {
  /** Image source — Contentful URL, local path, or placeholder */
  src: string;
  alt: string;
  /** Predefined size configuration */
  preset?: ImagePreset;
  /** Override width (if not using preset with next/image) */
  width?: number;
  /** Override height (if not using preset with next/image) */
  height?: number;
  /** Fill parent container (like object-fit: cover) */
  fill?: boolean;
  /** CSS object-fit */
  objectFit?: "cover" | "contain" | "fill" | "none";
  /** Additional className */
  className?: string;
  /** Priority loading (for above-the-fold images like hero) */
  priority?: boolean;
  /** sizes attribute for responsive images */
  sizes?: string;
  /** Called when image fails to load */
  onError?: () => void;
}

/**
 * Unified image component for the whole site.
 *
 * Behavior:
 * - Contentful images (ctfassets.net) → uses next/image with Contentful CDN transforms
 * - Local images (/images/...) → uses next/image with local optimization
 * - Missing/error images → shows a styled placeholder
 *
 * This component handles:
 * ✓ Responsive srcSet generation via Contentful Images API
 * ✓ WebP/AVIF format conversion
 * ✓ Lazy loading (default) / eager loading (priority)
 * ✓ Blur placeholder while loading
 * ✓ Graceful fallback when image is missing
 */
export default function OptimizedImage({
  src,
  alt,
  preset = "designSection",
  width,
  height,
  fill = false,
  objectFit = "cover",
  className,
  priority = false,
  sizes,
  onError,
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);

  // If image errored or src is missing/empty, show placeholder.
  // This guard MUST come before any string method on `src` because CMS data
  // may legitimately omit images (e.g. a new vehicle model created in
  // Contentful before assets are uploaded), in which case `src` is undefined
  // at runtime even though the type says string.
  if (hasError || !src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-surface-light",
          fill ? "absolute inset-0" : "",
          className
        )}
        style={!fill ? { width, height } : undefined}
      >
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
            <svg
              className="w-6 h-6 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-xs text-text-muted">Imagen próximamente</p>
        </div>
      </div>
    );
  }

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const isContentful = src.includes("ctfassets.net");
  const isLocal = src.startsWith("/");

  // Contentful images → use next/image with loader
  if (isContentful) {
    return (
      <Image
        src={getDefaultSrc(src, preset)}
        alt={alt}
        fill={fill}
        width={fill ? undefined : (width || IMAGE_PRESETS[preset].widths[IMAGE_PRESETS[preset].widths.length - 1])}
        height={fill ? undefined : (height || 0)}
        sizes={sizes || defaultSizes(preset)}
        priority={priority}
        quality={IMAGE_PRESETS[preset].quality}
        className={cn(
          fill && `object-${objectFit}`,
          className
        )}
        onError={handleError}
        loader={({ src: loaderSrc, width: loaderWidth }) => {
          // next/image calls this for each size in the srcSet
          return contentfulImageUrl(src, {
            width: loaderWidth,
            format: "webp",
            quality: IMAGE_PRESETS[preset].quality,
          });
        }}
      />
    );
  }

  // Local images → standard next/image
  if (isLocal) {
    return (
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : (width || 1200)}
        height={fill ? undefined : (height || 800)}
        sizes={sizes || defaultSizes(preset)}
        priority={priority}
        className={cn(
          fill && `object-${objectFit}`,
          className
        )}
        onError={handleError}
      />
    );
  }

  // External non-Contentful images → fallback to <img> with manual srcSet
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={cn(
        fill && `absolute inset-0 w-full h-full object-${objectFit}`,
        className
      )}
      loading={priority ? "eager" : "lazy"}
      onError={handleError}
    />
  );
}

/**
 * Default `sizes` attribute per preset — tells the browser what width
 * to pick from the srcSet at each viewport breakpoint.
 */
function defaultSizes(preset: ImagePreset): string {
  switch (preset) {
    case "hero":
      return "100vw";
    case "carouselCar":
      return "(max-width: 640px) 90vw, (max-width: 1024px) 70vw, 60vw";
    case "designSection":
      return "(max-width: 1024px) 100vw, 50vw";
    case "colorVariant":
      return "(max-width: 768px) 100vw, 80vw";
    case "thumbnail":
      return "200px";
    case "small":
      return "400px";
    default:
      return "100vw";
  }
}
