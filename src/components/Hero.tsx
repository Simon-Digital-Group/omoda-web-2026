"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import OptimizedImage from "@/components/OptimizedImage";

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundUrl?: string;
}

export default function Hero({
  title = "OMODA 5",
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
            <OptimizedImage
              src={backgroundUrl}
              alt="OMODA JAECOO"
              preset="hero"
              fill
              objectFit="cover"
              priority
              sizes="100vw"
            />
          )
        ) : (
          /* Default: dark cinematic gradient placeholder */
          <div className="w-full h-full bg-gradient-to-br from-background via-[#0d1117] to-[#0a1628]" />
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
{/* Title */}
          <motion.h1
            variants={fadeInUp}
            className="text-hero font-michroma font-bold text-white uppercase whitespace-pre-line mb-6"
          >
            {title}
          </motion.h1>

          {/* CTAs */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
            <a href={ctaLink} className="btn-primary text-base">
              {ctaText}
            </a>
            <a href="#contacto" className="btn-secondary text-base">
              Solicitar Cotización
            </a>
          </motion.div>
        </div>

      </motion.div>
    </section>
  );
}
