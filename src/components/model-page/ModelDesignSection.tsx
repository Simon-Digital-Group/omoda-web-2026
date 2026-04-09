"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import OptimizedImage from "@/components/OptimizedImage";

interface ModelDesignSectionProps {
  heading: string;
  description: string;
  images: string[];
  highlights: string[];
  /** Flip layout: text on left or right */
  reverse?: boolean;
  /** Section ID for anchor links */
  id?: string;
}

/**
 * Exterior / Interior design section.
 * Full-height image on one side, text + highlights on the other.
 * OMODA UK-inspired: editorial, full-bleed imagery, minimal chrome.
 */
export default function ModelDesignSection({
  heading,
  description,
  images,
  highlights,
  reverse = false,
  id,
}: ModelDesignSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [currentImage, setCurrentImage] = useState(0);

  const prevImage = () =>
    setCurrentImage((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () =>
    setCurrentImage((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <section ref={ref} id={id} className="overflow-hidden">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={cn(
          "flex flex-col lg:grid lg:grid-cols-2 min-h-[560px]",
          reverse && "lg:flex-row-reverse"
        )}
      >
        {/* Image — full-height, no card wrapper */}
        <motion.div
          variants={fadeInUp}
          className={cn(
            "relative h-[56vw] min-h-[320px] lg:h-auto overflow-hidden bg-surface",
            reverse ? "lg:order-2" : "lg:order-1"
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <OptimizedImage
                src={images[currentImage]}
                alt={`${heading} — ${currentImage + 1}`}
                preset="designSection"
                fill
                objectFit="cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Subtle vignette on the inner edge */}
          <div
            className={cn(
              "absolute inset-y-0 w-24 from-background to-transparent z-[1]",
              reverse
                ? "left-0 bg-gradient-to-r"
                : "right-0 bg-gradient-to-l"
            )}
          />

          {/* Image counter / dots */}
          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
              <button
                onClick={prevImage}
                className="p-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white transition-colors"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={cn(
                      "rounded-full transition-all duration-300",
                      i === currentImage
                        ? "w-5 h-1.5 bg-white"
                        : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                    )}
                  />
                ))}
              </div>
              <button
                onClick={nextImage}
                className="p-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white/80 hover:text-white transition-colors"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Text content */}
        <div
          className={cn(
            "flex items-center px-8 py-16 md:px-16 lg:py-24 bg-background",
            reverse ? "lg:order-1" : "lg:order-2"
          )}
        >
          <motion.div variants={staggerContainer} className="max-w-lg">
            <motion.h2
              variants={fadeInUp}
              className="text-section font-bold text-white mb-5 leading-tight"
            >
              {heading}
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-text-secondary leading-relaxed mb-10 text-base"
            >
              {description}
            </motion.p>

            {/* Highlights */}
            <div className="space-y-5">
              {highlights.map((highlight, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex items-start gap-4"
                >
                  <span className="w-[1px] h-5 bg-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary leading-relaxed">
                    {highlight}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
