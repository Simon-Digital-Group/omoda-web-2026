"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import type { PowertrainOption } from "@/lib/models-data";

interface ModelPowertrainProps {
  options: PowertrainOption[];
}

/**
 * Powertrain options section — one card per option.
 * Inspired by OMODA UK's "Choose your power" section.
 */
export default function ModelPowertrain({ options }: ModelPowertrainProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });


  return (
    <section ref={ref} className="section-padding">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container-custom"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-14">
          <h2 className="text-section font-michroma font-bold text-white mb-4">
            Elegí tu <span className="gradient-text">potencia</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Cada trayecto es diferente. Elegí la motorización que se adapta a tu estilo de conducción.
          </p>
        </motion.div>

        {/* Option cards */}
        <div className={cn(
          "grid gap-6 max-w-4xl mx-auto",
          options.length === 1 ? "grid-cols-1 max-w-lg" : "md:grid-cols-2"
        )}>
          {options.map((option) => (
              <motion.div
                key={option.name}
                variants={fadeInUp}
                className="glass-strong p-5 md:p-8 hover:border-white/[0.15] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">{option.name}</h3>
                  <span className="text-xs text-text-muted uppercase tracking-wider">
                    {option.type}
                  </span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4">
                  <StatItem label="Potencia" value={option.power} />
                  <StatItem label="Torque" value={option.torque} />
                  {option.acceleration && (
                    <StatItem label="Aceleración" value={option.acceleration} />
                  )}
                  {option.consumption && (
                    <StatItem label="Consumo" value={option.consumption} />
                  )}
                  {option.range && (
                    <StatItem label="Autonomía" value={option.range} />
                  )}
                  <StatItem label="Transmisión" value={option.transmission} />
                </div>
              </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-text-muted uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm text-white font-medium">{value}</p>
    </div>
  );
}
