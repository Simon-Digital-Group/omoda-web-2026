"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Cpu, Battery, Gauge, Wifi, Eye } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

const FEATURES = [
  {
    icon: Cpu,
    title: "Tecnología Inteligente",
    description:
      "Pantallas de alta resolución, asistente de voz AI y conectividad total con tu smartphone.",
  },
  {
    icon: Shield,
    title: "Seguridad Avanzada",
    description:
      "Suite completa de asistencias a la conducción: ADAS nivel 2, frenado autónomo y más.",
  },
  {
    icon: Battery,
    title: "Eficiencia Superior",
    description:
      "Motorizaciones eficientes con opciones eléctricas e híbridas para cada necesidad.",
  },
  {
    icon: Gauge,
    title: "Rendimiento Premium",
    description:
      "Suspensión independiente, dirección precisa y potencia que se siente en cada curva.",
  },
  {
    icon: Wifi,
    title: "Conectividad Total",
    description:
      "App CarLink-O para controlar tu vehículo desde el teléfono. Carga, clima, ubicación y más.",
  },
  {
    icon: Eye,
    title: "Diseño Audaz",
    description:
      "Líneas que definen una nueva era. Diseño que genera impacto en cada ángulo.",
  },
];

export default function Features() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding relative overflow-hidden border-t border-white/[0.06]">

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative container-custom"
      >
        {/* Header — left-aligned, editorial */}
        <motion.div variants={fadeInUp} className="mb-16 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted mb-4">
            Características
          </p>
          <h2 className="text-section font-michroma font-bold text-white mb-4">
            Tecnología que inspira confianza
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Cada modelo integra lo último en innovación automotriz, diseño y seguridad.
          </p>
        </motion.div>

        {/* Feature cards — 2x3 grid, solid surfaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              className="group p-8 bg-surface border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
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
