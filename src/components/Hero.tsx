"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import OptimizedImage from "@/components/OptimizedImage";

interface HeroBanner {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundUrl: string;
  backgroundIsVideo: boolean;
  /** Optional poster image shown while the video loads (mobile 4G can take 2-4s) */
  posterUrl?: string;
}

interface HeroProps {
  banners?: HeroBanner[];
}

const DEFAULT_BANNER: HeroBanner = {
  title: "SUVs Premium\en Uruguay",
  subtitle: "",
  ctaText: "Explorar Modelos",
  ctaLink: "#modelos",
  backgroundUrl: "",
  backgroundIsVideo: false,
};

const INTERVAL_MS = 6000;

export default function Hero({ banners }: HeroProps) {
  const slides = banners && banners.length > 0 ? banners : [DEFAULT_BANNER];
  const [current, setCurrent] = useState(0);
  const hasMultiple = slides.length > 1;

  const goTo = useCallback(
    (idx: number) => setCurrent(idx),
    [],
  );

  // Auto-rotate
  useEffect(() => {
    if (!hasMultiple) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [hasMultiple, slides.length]);

  const slide = slides[current];

  return (
    <section
      id="inicio"
      className="relative min-h-screen min-h-[100svh] flex items-end pb-20 md:pb-28 overflow-hidden"
    >
      {/* Background slides */}
      {/* initial={false}: first paint renders the LCP image/video without an
          opacity fade-in. Slide rotations still crossfade because subsequent
          key changes trigger the enter animation. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          {slide.backgroundUrl ? (
            slide.backgroundIsVideo ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={slide.posterUrl || undefined}
                aria-label={slide.title}
                className="w-full h-full object-cover"
                style={{ backgroundColor: "#0a1628" }}
              >
                <source src={slide.backgroundUrl} type="video/mp4" />
              </video>
            ) : (
              <OptimizedImage
                src={slide.backgroundUrl}
                alt={slide.title}
                preset="hero"
                fill
                objectFit="cover"
                priority={current === 0}
                sizes="100vw"
              />
            )
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-background via-[#0d1117] to-[#0a1628]" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Overlay gradients (always visible) */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent z-[1]" />

      {/* Content */}
      {/* initial={false}: h1 + CTAs render visible on first paint (LCP win).
          Slide rotations still stagger in. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0 }}
          className="relative z-10 container-custom w-full"
        >
          <div className="max-w-3xl">
            <motion.h1
              variants={fadeInUp}
              className="text-[clamp(1.75rem,8vw,7rem)] leading-[1.05] tracking-tight font-michroma font-bold text-white uppercase mb-6 break-words md:whitespace-nowrap"
            >
              {slide.title}
            </motion.h1>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href={slide.ctaLink}
                className="btn-primary text-base"
                data-event="hero_cta_primary"
                data-event-label={slide.ctaText}
              >
                {slide.ctaText}
              </a>
              <a
                href="#contacto"
                className="btn-secondary text-base"
                data-event="hero_cta_quote"
              >
                Solicitar Cotización
              </a>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      {hasMultiple && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2"
          role="tablist"
          aria-label="Paginación del hero"
        >
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              role="tab"
              aria-selected={idx === current}
              aria-current={idx === current ? "true" : undefined}
              aria-label={`Ir al slide ${idx + 1} de ${slides.length}`}
              className={`h-2.5 rounded-full transition-all duration-300 min-w-[10px] min-h-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${idx === current
                  ? "bg-accent w-8"
                  : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
