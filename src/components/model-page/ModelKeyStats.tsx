"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import type { KeyStat } from "@/lib/models-data";

interface ModelKeyStatsProps {
  stats: KeyStat[];
  brand: "OMODA" | "JAECOO";
}

/**
 * Prominent key stats bar — inspired by OMODA UK's large-number spec callouts.
 * Displays 4 key metrics as large figures with unit and label.
 * Sits directly below the hero as a visual anchor before deeper sections.
 */
export default function ModelKeyStats({ stats, brand }: ModelKeyStatsProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const accentColor = brand === "OMODA" ? "text-accent" : "text-accent-alt-light";

  return (
    <section
      ref={ref}
      className="border-y border-white/[0.06] bg-surface/40 backdrop-blur-sm"
    >
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
              className={cn(
                "py-10 px-6 flex flex-col items-center md:items-start text-center md:text-left",
                i < stats.length - 1 && "border-r border-white/[0.06]",
                i >= 2 && "border-t border-white/[0.06] md:border-t-0"
              )}
            >
              {/* Value + unit */}
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-[clamp(1.5rem,5vw,3.25rem)] font-michroma font-bold text-white leading-none tracking-tight">
                  {stat.value}
                </span>
                <span className={cn("text-lg md:text-xl font-semibold", accentColor)}>
                  {stat.unit}
                </span>
              </div>

              {/* Label */}
              <p className="text-xs uppercase tracking-[0.12em] text-text-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
