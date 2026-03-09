"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundUrl?: string;
}

export default function Hero({
  title = "La nueva satisfacción\nde conducir",
  subtitle = "Descubrí OMODA & JAECOO: la generación de SUVs premium que combina diseño audaz, tecnología de vanguardia y rendimiento excepcional.",
  ctaText = "Explorar Modelos",
  ctaLink = "#modelos",
  backgroundUrl,
}: HeroProps) {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-end pb-20 md:pb-28 overflow-hidden"
    >
      {/* Background video/image */}
      <div className="absolute inset-0 z-0">
        {/* Placeholder gradient — replace with video/image from Contentful */}
        {backgroundUrl ? (
          // If a video URL
          backgroundUrl.endsWith(".mp4") || backgroundUrl.endsWith(".webm") ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={backgroundUrl} type="video/mp4" />
            </video>
          ) : (
            <img
              src={backgroundUrl}
              alt="OMODA JAECOO"
              className="w-full h-full object-cover"
            />
          )
        ) : (
          /* Default: dark cinematic gradient placeholder */
          <div className="w-full h-full bg-gradient-to-br from-background via-[#0d1117] to-[#0a1628]">
            {/* Subtle ambient light effect */}
            <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[150px]" />
            <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-accent-alt/[0.03] rounded-full blur-[120px]" />
          </div>
        )}

        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 container-custom w-full"
      >
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-sm text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Nuevos modelos disponibles en Uruguay
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeInUp}
            className="text-hero font-display font-bold text-white whitespace-pre-line mb-6"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-subtitle text-text-secondary max-w-xl mb-10"
          >
            {subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
            <a href={ctaLink} className="btn-primary text-base">
              {ctaText}
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#contacto" className="btn-outline text-base">
              Solicitar Cotización
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-text-muted uppercase tracking-widest">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5 text-text-muted" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
