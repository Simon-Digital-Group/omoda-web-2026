"use client";

import { motion } from "framer-motion";
import { ArrowDown, Calendar } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import OptimizedImage from "@/components/OptimizedImage";

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
      {/* Background image — served from Contentful CDN, optimized via next/image */}
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src={heroImage}
          alt={name}
          preset="hero"
          fill
          objectFit="cover"
          priority
          sizes="100vw"
        />
        {/* Fallback gradient (visible while loading or if no image) */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0d1117] to-[#0a1628] -z-10" />

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
          {/* Model name */}
          <motion.h1
            variants={fadeInUp}
            className="text-[clamp(2rem,6vw,5rem)] font-michroma font-bold text-white uppercase mb-3 whitespace-nowrap"
          >
            {name}
          </motion.h1>

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
