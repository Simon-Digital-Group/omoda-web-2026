"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
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
    <section ref={ref} id={id} className="section-padding relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/[0.02] rounded-full blur-[120px]" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative container-custom"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-sm text-text-muted uppercase tracking-widest mb-4">
            <span className="w-8 h-[1px] bg-accent" />
            {sectionLabel}
            <span className="w-8 h-[1px] bg-accent" />
          </span>
          <h2 className="text-section font-bold text-white">
            {heading}{" "}
            <span className="gradient-text">{headingAccent}</span>
          </h2>
        </motion.div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {features.map((feature, i) => {
            // Dynamically resolve icon from lucide-react
            const IconComponent =
              (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[
                feature.icon
              ] || LucideIcons.Star;

            return (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="glass group p-8 hover:bg-white/[0.06] transition-all duration-500
                           hover:border-white/[0.12]"
              >
                <div
                  className="w-12 h-12 rounded-xl bg-accent/[0.08] border border-accent/[0.15]
                             flex items-center justify-center mb-5
                             group-hover:bg-accent/[0.15] transition-colors duration-300"
                >
                  <IconComponent className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
