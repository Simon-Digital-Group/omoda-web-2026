"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Globe, Users, Award, TrendingUp } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import AnimatedNumber from "./AnimatedNumber";

const STATS = [
  { icon: Globe, value: 40, suffix: "+", label: "Países" },
  { icon: Users, value: 260, suffix: "K+", label: "Unidades vendidas" },
  { icon: Award, value: 2, suffix: "", label: "Años de crecimiento global" },
  { icon: TrendingUp, value: 1, suffix: "°", label: "Marca de mayor crecimiento" },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="nosotros" className="section-padding relative">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="container-custom"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — text */}
          <div>
            <motion.span
              variants={fadeInUp}
              className="text-xs uppercase tracking-[0.2em] text-text-muted mb-4 block"
            >
              Sobre la marca
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="text-section font-michroma font-bold text-white mb-6"
            >
              Una nueva era{" "}
              <span className="gradient-text">automotriz</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-text-secondary leading-relaxed mb-6"
            >
              OMODA & JAECOO nacen en una era de transformación. El automóvil
              ya no es solo un medio de transporte, es el símbolo de un estilo
              de vida. Integramos tecnologías innovadoras en dos líneas
              principales: OMODA, orientada al diseño juvenil y audaz, y
              JAECOO, enfocada en la robustez premium y la aventura.
            </motion.p>
            <motion.p
              variants={fadeInUp}
              className="text-text-secondary leading-relaxed mb-8"
            >
              Presentes en más de 40 países, somos una de las marcas de más
              rápido crecimiento a escala mundial. Ahora, en Uruguay, con el
              respaldo de Santa Rosa Automotores.
            </motion.p>
            <motion.a
              variants={fadeInUp}
              href="#contacto"
              className="btn-outline"
            >
              Conocé más
            </motion.a>
          </div>

          {/* Right — stats grid */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-2 gap-5"
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="glass p-4 sm:p-6 text-center group hover:bg-white/[0.06] transition-all duration-500"
              >
                <p className="text-2xl md:text-4xl font-michroma font-bold text-white mb-1">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-text-muted uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
