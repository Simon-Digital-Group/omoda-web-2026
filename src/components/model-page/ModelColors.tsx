"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import OptimizedImage from "@/components/OptimizedImage";
import type { ModelColor } from "@/lib/models-data";

interface ModelColorsProps {
  colors: ModelColor[];
  modelName: string;
  brand: "OMODA" | "JAECOO";
}

/**
 * Color showcase section — OMODA UK crystal palette style.
 * When a color has an image (side-view car shot), displays it full-width.
 * Falls back to an immersive color fill with the model silhouette area.
 */
export default function ModelColors({ colors, modelName, brand }: ModelColorsProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState(0);

  const isOmoda = brand === "OMODA";

  const activeColor = colors[selected];

  return (
    <section ref={ref} className="section-padding overflow-hidden">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container-custom"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-sm text-text-muted uppercase tracking-widest mb-4">
            <span className="w-8 h-[1px] bg-accent" />
            Colores disponibles
            <span className="w-8 h-[1px] bg-accent" />
          </span>
          <h2 className="text-section font-bold text-white">
            Elegí tu color
          </h2>
        </motion.div>

        {/* Color preview — full width with color name overlay */}
        <motion.div variants={fadeInUp} className="relative mb-8">
          <AnimatePresence mode="wait">
            {activeColor.image ? (
              /* Car side-view image — OMODA UK style */
              <motion.div
                key={`img-${selected}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden"
              >
                <OptimizedImage
                  src={activeColor.image}
                  alt={`${modelName} — ${activeColor.name}`}
                  preset="colorVariant"
                  fill
                  objectFit="contain"
                />
                {/* Subtle gradient at edges */}
                <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60 pointer-events-none" />
              </motion.div>
            ) : (
              /* Color fill fallback */
              <motion.div
                key={`fill-${selected}`}
                className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden"
              >
                {/* Animated color background */}
                <motion.div
                  animate={{ backgroundColor: activeColor.hex }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0"
                />
                {/* Metallic sheen overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30" />
                {/* Bottom vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-70" />
                {/* Placeholder text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-white/20 text-sm tracking-widest uppercase">
                    Imagen próximamente
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Color name — bottom left overlay */}
          <div className="absolute bottom-6 left-8 z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                  {activeColor.name}
                </p>
                <p className="text-xs text-white/60 mt-0.5 tracking-widest uppercase">
                  {activeColor.hex.toUpperCase()}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Color swatches row */}
        <motion.div
          variants={fadeInUp}
          className="flex justify-center items-center gap-3 md:gap-4"
        >
          {colors.map((color, i) => (
            <button
              key={color.name}
              onClick={() => setSelected(i)}
              title={color.name}
              aria-label={color.name}
              className={cn(
                "relative rounded-full transition-all duration-300 flex-shrink-0",
                i === selected
                  ? cn(
                      "w-12 h-12 ring-2 ring-offset-2 ring-offset-background",
                      isOmoda ? "ring-accent" : "ring-accent-alt"
                    )
                  : "w-9 h-9 hover:scale-110 opacity-70 hover:opacity-100"
              )}
              style={{ backgroundColor: color.hex }}
            >
              {/* Inner border for very light/white colors */}
              <span className="absolute inset-0 rounded-full border border-white/15" />
              {/* Selected indicator */}
              {i === selected && (
                <span className={cn(
                  "absolute inset-0 rounded-full border-2",
                  isOmoda ? "border-accent/40" : "border-accent-alt/40"
                )} />
              )}
            </button>
          ))}
        </motion.div>

        {/* Color names row */}
        <motion.div
          variants={fadeInUp}
          className="flex justify-center items-center gap-3 md:gap-4 mt-4"
        >
          {colors.map((color, i) => (
            <p
              key={color.name}
              className={cn(
                "text-xs transition-colors duration-300 text-center min-w-[2.25rem]",
                i === selected ? "text-white" : "text-text-muted"
              )}
            >
              {color.name}
            </p>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
