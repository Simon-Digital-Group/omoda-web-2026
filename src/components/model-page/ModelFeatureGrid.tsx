"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
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
          {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                className="glass group p-5 md:p-8 hover:border-white/[0.12] transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
