"use client";

import { motion } from "framer-motion";
import { ArrowDown, Calendar } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";

interface ModelHeroProps {
  name: string;
  brand: "OMODA" | "JAECOO";
  tagline: string;
  description: string;
  heroImage: string;
  price: string;
}

/**
 * Full-viewport hero for individual model page.
 * Cinematic image background with model name overlay,
 * similar to OMODA UK but with our dark premium aesthetic.
 */
export default function ModelHero({
  name,
  brand,
  tagline,
  description,
  heroImage,
  price,
}: ModelHeroProps) {
  const brandColor = brand === "OMODA" ? "text-accent" : "text-accent-alt-light";

  return (
    <section className="relative min-h-screen flex items-end pb-20 md:pb-28 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {/* Fallback gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0d1117] to-[#0a1628]" />

        {/* Model name watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[15vw] font-bold text-white/[0.03] leading-none select-none">
            {name.split(" ")[1] || name}
          </span>
        </div>
      </div>

      {/* Overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent z-[1]" />

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 container-custom w-full"
      >
        <div className="max-w-2xl">
          {/* Brand badge */}
          <motion.div variants={fadeInUp} className="mb-4">
            <span className={`text-sm font-medium uppercase tracking-widest ${brandColor}`}>
              {brand}
            </span>
          </motion.div>

          {/* Model name */}
          <motion.h1
            variants={fadeInUp}
            className="text-hero font-bold text-white mb-3"
          >
            {name}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={fadeInUp}
            className="text-2xl md:text-3xl font-light text-text-secondary mb-4"
          >
            {tagline}
          </motion.p>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-text-secondary leading-relaxed mb-8 max-w-lg"
          >
            {description}
          </motion.p>

          {/* Price + CTAs */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
            <span className="text-xl font-semibold text-white">{price}</span>
            <a href="#contacto-modelo" className="btn-primary">
              <Calendar className="w-4 h-4" />
              Agendar Test Drive
            </a>
            <a href="#especificaciones" className="btn-outline">
              Ver Especificaciones
            </a>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ArrowDown className="w-5 h-5 text-text-muted" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
