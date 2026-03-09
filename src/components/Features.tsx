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
    <section ref={ref} className="section-padding relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/[0.02] rounded-full blur-[150px]" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative container-custom"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm text-text-muted uppercase tracking-widest mb-4">
            <span className="w-8 h-[1px] bg-accent" />
            Características
            <span className="w-8 h-[1px] bg-accent" />
          </span>
          <h2 className="text-section font-bold text-white mb-4">
            Tecnología que{" "}
            <span className="gradient-text">inspira confianza</span>
          </h2>
          <p className="text-subtitle text-text-secondary max-w-2xl mx-auto">
            Cada modelo integra lo último en innovación automotriz, diseño y seguridad.
          </p>
        </motion.div>

        {/* Feature cards grid — glassmorphism style like Landio */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              className="glass group p-8 hover:bg-white/[0.06] transition-all duration-500
                         hover:border-white/[0.12] hover:shadow-lg hover:shadow-accent/[0.02]"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/[0.08] border border-accent/[0.15]
                              flex items-center justify-center mb-5
                              group-hover:bg-accent/[0.12] transition-colors duration-300">
                <feature.icon className="w-5 h-5 text-accent" />
              </div>
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
