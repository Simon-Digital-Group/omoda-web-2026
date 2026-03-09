"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, MessageCircle, ArrowRight } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { SITE_CONFIG } from "@/lib/data";

interface ModelCTAProps {
  modelName: string;
  price: string;
  brand: "OMODA" | "JAECOO";
}

/**
 * Bottom CTA section — drives to test drive booking or WhatsApp chat.
 * Full-width ambient glow, strong visual hierarchy.
 */
export default function ModelCTA({ modelName, price, brand }: ModelCTAProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="contacto-modelo"
      className="section-padding relative overflow-hidden"
    >
      {/* Strong ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/[0.04] via-transparent to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/[0.05] rounded-full blur-[200px]" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative container-custom text-center"
      >
        {/* Big price callout */}
        <motion.div variants={fadeInUp} className="mb-6">
          <span className="text-sm text-text-muted uppercase tracking-widest">
            {brand} {modelName}
          </span>
        </motion.div>

        <motion.h2
          variants={fadeInUp}
          className="text-section font-bold text-white mb-3"
        >
          {price}
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="text-subtitle text-text-secondary max-w-xl mx-auto mb-10"
        >
          Viví la experiencia {modelName}. Agendá tu test drive o chateá con un asesor para conocer las opciones de financiamiento.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a href="/#contacto" className="btn-primary text-base">
            <Calendar className="w-5 h-5" />
            Agendar Test Drive
          </a>
          <a
            href={`${SITE_CONFIG.whatsapp}?text=Hola! Me interesa el ${modelName}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline text-base"
          >
            <MessageCircle className="w-5 h-5" />
            Chatear por WhatsApp
          </a>
        </motion.div>

        {/* Back to models */}
        <motion.div variants={fadeInUp} className="mt-12">
          <a
            href="/#modelos"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Ver todos los modelos
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
