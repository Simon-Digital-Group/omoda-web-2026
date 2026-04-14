"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import type { SpecGroup } from "@/lib/models-data";

interface ModelSpecsProps {
  specs: SpecGroup[];
  modelName: string;
}

/**
 * Full technical specifications section.
 * Clean table layout grouped by category, dark glass style.
 * Like the OMODA UK "Standard Equipment" section but better structured.
 */
export default function ModelSpecs({ specs, modelName }: ModelSpecsProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="especificaciones" className="section-padding">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container-custom"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-14">
          <h2 className="text-section font-michroma font-bold text-white">
            Especificaciones
          </h2>
        </motion.div>

        {/* Spec groups */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {specs.map((group) => (
            <motion.div
              key={group.category}
              variants={fadeInUp}
              className="glass p-4 sm:p-6"
            >
              <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-5 pb-3 border-b border-white/[0.06]">
                {group.category}
              </h3>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between items-baseline gap-4"
                  >
                    <span className="text-sm text-text-muted">{item.label}</span>
                    <span className="text-sm text-white font-medium text-right">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
