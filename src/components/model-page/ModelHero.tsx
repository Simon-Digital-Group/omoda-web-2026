"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import OptimizedImage from "@/components/OptimizedImage";

/**
 * Hero background video with reliable autoplay on iOS Safari.
 *
 * The `autoPlay` attribute alone is unreliable on iOS — Safari frequently
 * ignores it (especially with preload="metadata", in low-power scenarios, or
 * when the element mounts before the source is ready). We call play()
 * explicitly after mount and again on `canplay`/`loadeddata`; since the video
 * is muted + playsInline this is allowed by the autoplay policy. `preload="auto"`
 * makes the (small, web-optimized) hero buffer enough to start without a tap.
 */
function HeroVideo({
  url,
  videoType,
  posterUrl,
  title,
  className,
}: {
  url: string;
  videoType?: string;
  posterUrl?: string;
  title: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    tryPlay();
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    return () => {
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
    };
  }, [url]);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={posterUrl || undefined}
      aria-label={title}
      className={`w-full h-full object-cover ${className || ""}`}
      style={{ backgroundColor: "#0a1628" }}
    >
      {/* Omit `type` when the real MIME is unknown — declaring the wrong type
          (e.g. video/mp4 for a QuickTime file) can make Safari refuse it. */}
      <source src={url} type={videoType || undefined} />
    </video>
  );
}

interface ModelHeroProps {
  name: string;
  brand: "OMODA" | "JAECOO";
  tagline: string;
  description: string;
  heroImage: string;
  heroIsVideo?: boolean;
  /** Real MIME type of the desktop hero asset (e.g. "video/mp4"). */
  heroVideoType?: string;
  /** Optional mobile-specific hero. Falls back to heroImage when empty. */
  heroImageMobile?: string;
  heroIsVideoMobile?: boolean;
  heroVideoTypeMobile?: string;
  /** Optional poster images shown while a hero video buffers. */
  heroPoster?: string;
  heroPosterMobile?: string;
  price: string;
  primaryCtaLabel?: string;
}

/**
 * Renders a single hero background (image or video). Extracted so the mobile
 * and desktop variants share identical markup and only differ in source.
 * Mirrors the BackgroundMedia helper used by the home Hero.
 */
function BackgroundMedia({
  url,
  isVideo,
  videoType,
  posterUrl,
  title,
  priority,
  className,
}: {
  url: string;
  isVideo: boolean;
  videoType?: string;
  posterUrl?: string;
  title: string;
  priority: boolean;
  className?: string;
}) {
  if (isVideo) {
    return (
      <HeroVideo
        url={url}
        videoType={videoType}
        posterUrl={posterUrl}
        title={title}
        className={className}
      />
    );
  }
  return (
    <OptimizedImage
      src={url}
      alt={title}
      preset="hero"
      fill
      objectFit="cover"
      priority={priority}
      sizes="100vw"
      className={className}
    />
  );
}

/**
 * Full-viewport hero for individual model page.
 * Cinematic image background with model name overlay,
 * similar to OMODA UK but with our dark premium aesthetic.
 */
export default function ModelHero({
  name,
  brand,
  tagline,
  description,
  heroImage,
  heroIsVideo,
  heroVideoType,
  heroImageMobile,
  heroIsVideoMobile,
  heroVideoTypeMobile,
  heroPoster,
  heroPosterMobile,
  price,
  primaryCtaLabel,
}: ModelHeroProps) {
  const brandColor = brand === "OMODA" ? "text-accent" : "text-accent-alt-light";
  const title = `${brand} ${name} — ${tagline}`;

  // Mobile background falls back to the desktop asset when no mobile-specific
  // one is provided, so older models keep working unchanged. Type and poster
  // follow the same fallback so they always match the asset being shown.
  const hasMobileBg = Boolean(heroImageMobile);
  const mobileUrl = heroImageMobile || heroImage;
  const mobileIsVideo = hasMobileBg ? Boolean(heroIsVideoMobile) : Boolean(heroIsVideo);
  const mobileVideoType = hasMobileBg ? heroVideoTypeMobile : heroVideoType;
  const mobilePoster = heroPosterMobile || heroPoster;

  return (
    <section className="relative min-h-[100svh] flex items-end pb-20 md:pb-28 overflow-hidden">
      {/* Background — served from Contentful CDN, optimized via next/image */}
      <div className="absolute inset-0 z-0">
        {/* Fallback gradient (visible while loading or if no image) */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0d1117] to-[#0a1628]" />

        {hasMobileBg ? (
          <>
            {/* Mobile background (below md). Falls back to desktop asset above. */}
            <BackgroundMedia
              url={mobileUrl}
              isVideo={mobileIsVideo}
              videoType={mobileVideoType}
              posterUrl={mobilePoster}
              title={title}
              priority
              className="md:hidden"
            />
            {/* Desktop background (md and up). */}
            <BackgroundMedia
              url={heroImage}
              isVideo={Boolean(heroIsVideo)}
              videoType={heroVideoType}
              posterUrl={heroPoster}
              title={title}
              priority
              className="hidden md:block"
            />
          </>
        ) : (
          <BackgroundMedia
            url={heroImage}
            isVideo={Boolean(heroIsVideo)}
            videoType={heroVideoType}
            posterUrl={heroPoster}
            title={title}
            priority
          />
        )}
      </div>

      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent z-[1]" />

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 container-custom w-full"
      >
        <div className="max-w-2xl">
          {/* Model name */}
          <motion.h1
            variants={fadeInUp}
            className="text-[clamp(1.75rem,8vw,5rem)] font-michroma font-bold text-white uppercase mb-3 break-words md:whitespace-nowrap"
          >
            {name}
          </motion.h1>

          {/* Price + CTAs */}
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-xl text-white">
              <span className="font-light">Desde </span>
              <span className="font-semibold">{price}</span>
            </span>
            <a
              href="#contacto-modelo"
              className="btn-primary"
              data-event="test_drive_click"
              data-event-location="model_hero"
              data-event-model={name}
            >
              {primaryCtaLabel || "Agendar Test Drive"}
            </a>
            <a
              href="#especificaciones"
              className="btn-outline"
              data-event="specs_click"
              data-event-model={name}
            >
              Ver Especificaciones
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown className="w-5 h-5 text-text-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}
