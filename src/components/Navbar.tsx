"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { VEHICLE_MODELS } from "@/lib/data";
import type { VehicleModel } from "@/types";

interface NavbarProps {
  cmsModels?: VehicleModel[];
}

const LINK_CLASS =
  "relative px-4 py-2 text-sm text-white/80 hover:text-white transition-colors duration-300 rounded-full hover:bg-white/[0.05]";

export default function Navbar({ cmsModels }: NavbarProps) {
  const allModels = cmsModels && cmsModels.length > 0 ? cmsModels : VEHICLE_MODELS;
  const OMODA_MODELS = allModels.filter((m) => m.brand?.toUpperCase() === "OMODA");
  const JAECOO_MODELS = allModels.filter((m) => m.brand?.toUpperCase() === "JAECOO");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modelsOpen, setModelsOpen] = useState(false);
  const [mobileModelsOpen, setMobileModelsOpen] = useState(false);
  const modelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modelsRef.current && !modelsRef.current.contains(e.target as Node)) {
        setModelsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-background/70 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        )}
      >
        <div className="container-custom flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="group">
            <img
              src="/images/omoda-jaecoo-logo.svg"
              alt="OMODA | JAECOO Uruguay"
              className="h-4 md:h-4 w-auto transition-opacity duration-300 group-hover:opacity-75"
            />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center">
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-500",
                scrolled
                  ? "bg-transparent border border-transparent"
                  : "bg-white/[0.04] backdrop-blur-md border border-white/[0.06]"
              )}
            >
              {/* Inicio */}
              <Link href="/#inicio" className={LINK_CLASS}>
                Inicio
              </Link>

              {/* Modelos dropdown */}
              <div ref={modelsRef} className="relative">
                <button
                  onClick={() => setModelsOpen((p) => !p)}
                  onKeyDown={(e) => e.key === "Escape" && setModelsOpen(false)}
                  aria-expanded={modelsOpen}
                  aria-haspopup="true"
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-sm transition-colors duration-300 rounded-full",
                    modelsOpen
                      ? "text-white bg-white/[0.05]"
                      : "text-white/80 hover:text-white hover:bg-white/[0.05]"
                  )}
                >
                  Modelos
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-300",
                      modelsOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {modelsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72
                                 bg-background/90 backdrop-blur-xl rounded-2xl p-4
                                 border border-white/[0.08] shadow-2xl"
                    >
                      <p className="text-[10px] font-semibold tracking-[0.15em] text-text-muted uppercase px-2 mb-2">
                        OMODA
                      </p>
                      <div className="space-y-0.5 mb-4">
                        {OMODA_MODELS.map((model) => (
                          <Link
                            key={model.slug}
                            href={`/modelos/${model.slug}`}
                            onClick={() => setModelsOpen(false)}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl
                                       hover:bg-white/[0.06] transition-colors duration-200 group"
                          >
                            <div>
                              <p className="text-sm font-medium text-white">
                                {model.name}
                                {model.fuelType === "Eléctrico" && (
                                  <span className="ml-2 text-[10px] font-semibold tracking-wider text-accent">EV</span>
                                )}
                              </p>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ))}
                      </div>

                      <div className="border-t border-white/[0.06] mb-4" />

                      <p className="text-[10px] font-semibold tracking-[0.15em] text-text-muted uppercase px-2 mb-2">
                        JAECOO
                      </p>
                      <div className="space-y-0.5">
                        {JAECOO_MODELS.map((model) => (
                          <Link
                            key={model.slug}
                            href={`/modelos/${model.slug}`}
                            onClick={() => setModelsOpen(false)}
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl
                                       hover:bg-white/[0.06] transition-colors duration-200 group"
                          >
                            <div>
                              <p className="text-sm font-medium text-white">
                                {model.name}
                                {model.fuelType === "Eléctrico" && (
                                  <span className="ml-2 text-[10px] font-semibold tracking-wider text-accent">EV</span>
                                )}
                              </p>
                            </div>
                            <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Concesionarios */}
              <Link href="/concesionarios" className={LINK_CLASS}>
                Concesionarios
              </Link>

              {/* Talleres */}
              <Link href="/talleres" className={LINK_CLASS}>
                Talleres
              </Link>
            </div>
          </nav>

          {/* Right side: Contacto + Test Drive + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/#contacto"
              className="hidden lg:inline-flex items-center px-4 py-2 text-sm text-white/80
                         hover:text-white transition-colors duration-300 rounded-full hover:bg-white/[0.05]"
            >
              Contacto
            </Link>
            <Link
              href="/#contacto"
              className="hidden lg:inline-flex btn-primary text-sm"
            >
              Test Drive
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-3 text-white hover:text-accent transition-colors"
              aria-label="Menú"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden overflow-y-auto"
            onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          >
            <nav className="flex flex-col items-center justify-center min-h-full gap-6 py-24">
              {/* Inicio */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Link
                  href="/#inicio"
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl sm:text-3xl font-light text-white hover:text-accent transition-colors"
                >
                  Inicio
                </Link>
              </motion.div>

              {/* Modelos expandable */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center"
              >
                <button
                  onClick={() => setMobileModelsOpen((p) => !p)}
                  className="flex items-center gap-2 text-2xl sm:text-3xl font-light text-white hover:text-accent transition-colors"
                >
                  Modelos
                  <ChevronDown
                    className={cn(
                      "w-6 h-6 transition-transform duration-300",
                      mobileModelsOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {mobileModelsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-4"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <p className="text-[10px] tracking-[0.2em] text-text-muted uppercase mb-1">OMODA</p>
                        {OMODA_MODELS.map((model) => (
                          <Link
                            key={model.slug}
                            href={`/modelos/${model.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="text-lg text-text-secondary hover:text-accent transition-colors py-1"
                          >
                            {model.name}
                            {model.fuelType === "Eléctrico" && (
                              <span className="ml-2 text-xs font-semibold text-accent">EV</span>
                            )}
                          </Link>
                        ))}
                        <div className="border-t border-white/[0.08] w-16 my-2" />
                        <p className="text-[10px] tracking-[0.2em] text-text-muted uppercase mb-1">JAECOO</p>
                        {JAECOO_MODELS.map((model) => (
                          <Link
                            key={model.slug}
                            href={`/modelos/${model.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="text-lg text-text-secondary hover:text-accent transition-colors py-1"
                          >
                            {model.name}
                            {model.fuelType === "Eléctrico" && (
                              <span className="ml-2 text-xs font-semibold text-accent">EV</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Concesionarios */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Link
                  href="/concesionarios"
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl sm:text-3xl font-light text-white hover:text-accent transition-colors"
                >
                  Concesionarios
                </Link>
              </motion.div>

              {/* Talleres */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  href="/talleres"
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl sm:text-3xl font-light text-white hover:text-accent transition-colors"
                >
                  Talleres
                </Link>
              </motion.div>

              {/* Contacto */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Link
                  href="/#contacto"
                  onClick={() => setMobileOpen(false)}
                  className="text-2xl sm:text-3xl font-light text-white hover:text-accent transition-colors"
                >
                  Contacto
                </Link>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href="/#contacto"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary mt-2"
                >
                  Solicitar Test Drive
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
