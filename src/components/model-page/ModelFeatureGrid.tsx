"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import OptimizedImage from "@/components/OptimizedImage";
import type { ModelFeature } from "@/lib/models-data";

interface ModelFeatureGridProps {
  sectionLabel: string;
  heading: string;
  headingAccent: string;
  features: ModelFeature[];
  id?: string;
}

/**
 * Reusable feature grid section — used for both Technology and Safety.
 * Glassmorphism cards in a 2x2 grid, with Lucide icons resolved dynamically.
 */
export default function ModelFeatureGrid({
  sectionLabel,
  heading,
  headingAccent,
  features,
  id,
}: ModelFeatureGridProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id={id} className="section-padding relative overflow-hidden border-t border-white/[0.06]">

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative container-custom"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-14">
          <h2 className="text-section font-michroma font-bold text-white">
            {heading}{" "}
            <span className="gradient-text">{headingAccent}</span>
          </h2>
        </motion.div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="glass group overflow-hidden hover:border-white/[0.12] transition-all duration-300 flex flex-col"
              >
                {/* Image area — 16/9 ratio at the top of the card.
                    Renders the CMS image if present; otherwise a subtle dark
                    placeholder so the card layout stays consistent until the
                    client uploads the assets to Contentful. */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-white/[0.02] border-b border-white/[0.06]">
                  {feature.image ? (
                    <OptimizedImage
                      src={feature.image}
                      alt={feature.title}
                      preset="designSection"
                      fill
                      objectFit="cover"
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 420px"
                      className="group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                        <span className="text-text-muted text-[10px] uppercase tracking-widest">
                          Imagen
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Text area */}
                <div className="p-5 md:p-7 flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
