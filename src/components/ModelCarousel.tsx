"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { carouselImageVariants, fadeInUp, staggerContainer } from "@/lib/motion";
import AnimatedNumber from "./AnimatedNumber";
import OptimizedImage from "./OptimizedImage";
import { VEHICLE_MODELS } from "@/lib/data";
import type { VehicleModel } from "@/types";

/**
 * Model Carousel section.
 * Inspired by omodajaecoo.com global site: horizontal tabs, lateral car photo,
 * big model name watermark behind, specs with animated numbers, and navigation arrows.
 *
 * Enhanced with: Framer Motion crossfade, counter-up specs, brand-colored backgrounds.
 */
interface ModelCarouselProps {
  cmsModels?: VehicleModel[];
}

export default function ModelCarousel({ cmsModels }: ModelCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const models = cmsModels && cmsModels.length > 0 ? cmsModels : VEHICLE_MODELS;
  const active = models[activeIndex];

  const navigate = useCallback(
    (newIndex: number) => {
      setDirection(newIndex > activeIndex ? 1 : -1);
      setActiveIndex(newIndex);
    },
    [activeIndex]
  );

  const prev = () => navigate(activeIndex === 0 ? models.length - 1 : activeIndex - 1);
  const next = () => navigate(activeIndex === models.length - 1 ? 0 : activeIndex + 1);

  // Brand-specific background tint
  const bgTint =
    active.brand === "OMODA"
      ? "from-accent/[0.03] via-transparent to-transparent"
      : "from-accent-alt/[0.03] via-transparent to-transparent";

  return (
    <section
      ref={sectionRef}
      id="modelos"
      className="section-padding relative overflow-hidden"
    >
      {/* Subtle background gradient based on brand */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-all duration-700",
          bgTint
        )}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative container-custom"
      >
        {/* Section header — centered, clean */}
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted mb-4">
            Nuestra gama
          </p>
          <h2 className="text-section font-michroma font-bold text-white">
            Elegí tu próximo vehículo
          </h2>
        </motion.div>

        {/* Model tabs */}
        <motion.div
          variants={fadeInUp}
          className="flex justify-center gap-1 mb-16 overflow-x-auto no-scrollbar px-4"
        >
          {models.map((model, i) => (
            <button
              key={model.slug}
              onClick={() => navigate(i)}
              className={cn(
                "relative px-5 py-3 text-sm font-medium whitespace-nowrap rounded-full transition-all duration-300",
                i === activeIndex
                  ? "text-white"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              {i === activeIndex && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/[0.08] border border-white/[0.1] rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{model.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Carousel body */}
        <div className="relative">
          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute -left-2 lg:-left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full
                       bg-white/[0.05] border border-white/[0.08] text-white/60
                       hover:bg-white/[0.1] hover:text-white transition-all duration-300
                       hidden md:flex items-center justify-center"
            aria-label="Modelo anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute -right-2 lg:-right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full
                       bg-white/[0.05] border border-white/[0.08] text-white/60
                       hover:bg-white/[0.1] hover:text-white transition-all duration-300
                       hidden md:flex items-center justify-center"
            aria-label="Modelo siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Car image with watermark name */}
          <div className="relative aspect-[4/3] sm:aspect-auto sm:h-[440px] md:h-[520px] mx-4 md:mx-20
                          rounded-[24px] overflow-hidden
                          bg-white/[0.02] border border-white/[0.06]
                          flex items-center justify-center">
            {/* Model name watermark behind */}
            <AnimatePresence mode="wait">
              <motion.span
                key={`watermark-${active.slug}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.04, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center text-[10rem] sm:text-[16rem] md:text-[20rem]
                           font-bold text-white select-none pointer-events-none leading-none"
              >
                {active.name.split(" ")[1] || active.name}
              </motion.span>
            </AnimatePresence>

            {/* Car image */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active.slug}
                variants={carouselImageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative w-full h-full"
              >
                <OptimizedImage
                  src={active.sideImage?.fields?.file?.url || ""}
                  alt={active.name}
                  preset="carouselCar"
                  fill
                  objectFit="cover"
                  className="drop-shadow-2xl"
                  sizes="(max-width: 768px) 90vw, (max-width: 1280px) 60vw, 720px"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Specs bar */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-6 md:gap-10 lg:gap-14 mt-8"
          >
            {/* Specs block */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-0">
              <SpecItem label="LARGO" value={active.lengthMm} suffix="mm" />
              <SpecDivider />
              <SpecItem label="ANCHO" value={active.widthMm} suffix="mm" />
              <SpecDivider />
              <SpecItem label="ALTO" value={active.heightMm} suffix="mm" />
              <SpecDivider />
              <SpecItem label="DISTANCIA ENTRE EJES" value={active.wheelbaseMm} suffix="mm" />
            </div>

            {/* Price + CTA block — stacked on mobile, inline on desktop */}
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
              <span className="text-xl md:text-2xl font-semibold text-white">{active.price}</span>
              <a
                href={`/modelos/${active.slug}`}
                className="inline-flex justify-center items-center gap-1.5 px-4 py-2 rounded-[12px]
                           border border-white/20 text-sm text-white hover:bg-white/[0.05]
                           transition-all duration-300 w-full md:w-auto"
              >
                Ver Modelo
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>

          {/* Mobile swipe dots */}
          <div className="flex justify-center gap-2 mt-8 md:hidden">
            {models.map((_, i) => (
              <button
                key={i}
                onClick={() => navigate(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i === activeIndex
                    ? "bg-accent w-6"
                    : "bg-white/20 hover:bg-white/40"
                )}
                aria-label={`Modelo ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/** Individual spec display with animated number */
function SpecItem({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="text-center px-4 md:px-8">
      <p className="text-2xl md:text-3xl font-light text-white">
        <AnimatedNumber value={value} suffix={suffix} />
      </p>
      <p className="text-[10px] uppercase tracking-widest text-text-muted mt-1">
        {label}
      </p>
    </div>
  );
}

/** Vertical divider between specs */
function SpecDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={cn("hidden md:block w-[1px] h-10 bg-white/[0.08]", className)}
    />
  );
}
