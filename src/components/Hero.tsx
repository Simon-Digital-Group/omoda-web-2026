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
}

interface HeroProps {
  banners?: HeroBanner[];
}

const DEFAULT_BANNER: HeroBanner = {
  title: "SUVs Premium\nen Uruguay",
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
      className="relative min-h-screen flex items-end pb-20 md:pb-28 overflow-hidden"
    >
      {/* Background slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          {slide.backgroundUrl ? (
            slide.backgroundIsVideo ||
            slide.backgroundUrl.endsWith(".mp4") ||
            slide.backgroundUrl.endsWith(".webm") ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
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
      <AnimatePresence mode="wait">
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
              <a href={slide.ctaLink} className="btn-primary text-base">
                {slide.ctaText}
              </a>
              <a href="#contacto" className="btn-secondary text-base">
                Solicitar Cotización
              </a>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      {hasMultiple && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`Ir al slide ${idx + 1}`}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === current
                  ? "bg-accent w-8"
                  : "bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
