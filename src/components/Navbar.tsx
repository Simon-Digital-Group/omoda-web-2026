"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  const orderedModels = [...OMODA_MODELS, ...JAECOO_MODELS];

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modelsOpen, setModelsOpen] = useState(false);
  const [mobileModelsOpen, setMobileModelsOpen] = useState(false);

  const modelsRef = useRef<HTMLDivElement>(null);
  const modelsTriggerRef = useRef<HTMLButtonElement>(null);
  const modelsMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  // rAF-debounced scroll listener (was re-rendering on every scroll frame)
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ===== Desktop "Modelos" dropdown =====

  const closeModels = useCallback((refocus = false) => {
    setModelsOpen(false);
    if (refocus) modelsTriggerRef.current?.focus();
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!modelsOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (modelsRef.current && !modelsRef.current.contains(e.target as Node)) {
        setModelsOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [modelsOpen]);

  // Focus first item on open
  useEffect(() => {
    if (!modelsOpen) return;
    const first = modelsMenuRef.current?.querySelector<HTMLElement>('[role="menuitem"]');
    first?.focus();
  }, [modelsOpen]);

  // Keyboard handler inside the menu
  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    const items = Array.from(
      modelsMenuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') || []
    );
    if (!items.length) return;
    const currentIdx = items.indexOf(document.activeElement as HTMLElement);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        items[(currentIdx + 1 + items.length) % items.length]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        items[(currentIdx - 1 + items.length) % items.length]?.focus();
        break;
      case "Home":
        e.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case "Escape":
        e.preventDefault();
        closeModels(true);
        break;
      case "Tab":
        // Tab exits the menu naturally; close on focus leaving
        setModelsOpen(false);
        break;
    }
  };

  // ===== Mobile menu =====

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    setMobileModelsOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  // Lock body scroll + Escape + focus management while open
  useEffect(() => {
    if (!mobileOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus first link on open
    const first = mobilePanelRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMobile();
        return;
      }
      if (e.key === "Tab") {
        const focusables = Array.from(
          mobilePanelRef.current?.querySelectorAll<HTMLElement>(
            'a,button,[tabindex]:not([tabindex="-1"])'
          ) || []
        ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
        if (!focusables.length) return;
        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen, closeMobile]);

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
          <Link href="/" className="group" aria-label="OMODA | JAECOO Uruguay — Inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/omoda-jaecoo-logo.svg"
              alt=""
              width={140}
              height={16}
              className="h-4 md:h-4 w-auto transition-opacity duration-300 group-hover:opacity-75"
            />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center" aria-label="Navegación principal">
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-500",
                scrolled
                  ? "bg-transparent border border-transparent"
                  : "bg-white/[0.04] backdrop-blur-md border border-white/[0.06]"
              )}
            >
              <Link href="/#inicio" className={LINK_CLASS}>
                Inicio
              </Link>

              {/* Modelos dropdown */}
              <div ref={modelsRef} className="relative">
                <button
                  ref={modelsTriggerRef}
                  onClick={() => setModelsOpen((p) => !p)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setModelsOpen(true);
                    } else if (e.key === "Escape") {
                      closeModels();
                    }
                  }}
                  aria-expanded={modelsOpen}
                  aria-haspopup="menu"
                  aria-controls="models-menu"
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
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence>
                  {modelsOpen && (
                    <motion.div
                      ref={modelsMenuRef}
                      id="models-menu"
                      role="menu"
                      aria-label="Modelos OMODA y JAECOO"
                      onKeyDown={handleMenuKeyDown}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72
                                 bg-background/90 backdrop-blur-xl rounded-2xl p-4
                                 border border-white/[0.08] shadow-2xl"
                    >
                      {OMODA_MODELS.length > 0 && (
                        <>
                          <p className="text-[10px] font-semibold tracking-[0.15em] text-text-muted uppercase px-2 mb-2">
                            OMODA
                          </p>
                          <div className="space-y-0.5 mb-4" role="none">
                            {OMODA_MODELS.map((model) => (
                              <Link
                                key={model.slug}
                                href={`/modelos/${model.slug}`}
                                role="menuitem"
                                onClick={() => setModelsOpen(false)}
                                className="flex items-center justify-between px-3 py-2.5 rounded-xl
                                           hover:bg-white/[0.06] transition-colors duration-200 group
                                           focus-visible:outline-none focus-visible:bg-white/[0.08] focus-visible:ring-1 focus-visible:ring-accent"
                              >
                                <p className="text-sm font-medium text-white">
                                  {model.name}
                                  {model.fuelType === "Eléctrico" && (
                                    <span className="ml-2 text-[10px] font-semibold tracking-wider text-accent">EV</span>
                                  )}
                                </p>
                                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-accent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity" aria-hidden="true" />
                              </Link>
                            ))}
                          </div>
                        </>
                      )}

                      {OMODA_MODELS.length > 0 && JAECOO_MODELS.length > 0 && (
                        <div className="border-t border-white/[0.06] mb-4" role="separator" />
                      )}

                      {JAECOO_MODELS.length > 0 && (
                        <>
                          <p className="text-[10px] font-semibold tracking-[0.15em] text-text-muted uppercase px-2 mb-2">
                            JAECOO
                          </p>
                          <div className="space-y-0.5" role="none">
                            {JAECOO_MODELS.map((model) => (
                              <Link
                                key={model.slug}
                                href={`/modelos/${model.slug}`}
                                role="menuitem"
                                onClick={() => setModelsOpen(false)}
                                className="flex items-center justify-between px-3 py-2.5 rounded-xl
                                           hover:bg-white/[0.06] transition-colors duration-200 group
                                           focus-visible:outline-none focus-visible:bg-white/[0.08] focus-visible:ring-1 focus-visible:ring-accent"
                              >
                                <p className="text-sm font-medium text-white">
                                  {model.name}
                                  {model.fuelType === "Eléctrico" && (
                                    <span className="ml-2 text-[10px] font-semibold tracking-wider text-accent">EV</span>
                                  )}
                                </p>
                                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-accent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity" aria-hidden="true" />
                              </Link>
                            ))}
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link href="/concesionarios" className={LINK_CLASS}>
                Concesionarios
              </Link>
              <Link href="/talleres" className={LINK_CLASS}>
                Talleres
              </Link>
            </div>
          </nav>

          {/* Right side */}
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
              data-event="test_drive_click"
              data-event-location="navbar"
            >
              Test Drive
            </Link>
            <button
              ref={hamburgerRef}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-3 text-white hover:text-accent transition-colors"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            ref={mobilePanelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú principal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden overflow-y-auto"
          >
            <nav className="flex flex-col items-center justify-center min-h-full gap-6 py-24" aria-label="Navegación móvil">
              <MobileItem delay={0.05}>
                <Link href="/#inicio" onClick={closeMobile} className="mobile-link">
                  Inicio
                </Link>
              </MobileItem>

              <MobileItem delay={0.1}>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setMobileModelsOpen((p) => !p)}
                    className="flex items-center gap-2 mobile-link"
                    aria-expanded={mobileModelsOpen}
                    aria-controls="mobile-models-submenu"
                  >
                    Modelos
                    <ChevronDown
                      className={cn("w-6 h-6 transition-transform duration-300", mobileModelsOpen && "rotate-180")}
                      aria-hidden="true"
                    />
                  </button>

                  <AnimatePresence>
                    {mobileModelsOpen && (
                      <motion.div
                        id="mobile-models-submenu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden mt-4"
                      >
                        <div className="flex flex-col items-center gap-1">
                          {OMODA_MODELS.length > 0 && (
                            <>
                              <p className="text-[10px] tracking-[0.2em] text-text-muted uppercase mb-1">OMODA</p>
                              {OMODA_MODELS.map((model) => (
                                <Link
                                  key={model.slug}
                                  href={`/modelos/${model.slug}`}
                                  onClick={closeMobile}
                                  className="text-lg text-text-secondary hover:text-accent transition-colors py-1 min-h-[44px] flex items-center"
                                >
                                  {model.name}
                                  {model.fuelType === "Eléctrico" && (
                                    <span className="ml-2 text-xs font-semibold text-accent">EV</span>
                                  )}
                                </Link>
                              ))}
                            </>
                          )}
                          {OMODA_MODELS.length > 0 && JAECOO_MODELS.length > 0 && (
                            <div className="border-t border-white/[0.08] w-16 my-2" />
                          )}
                          {JAECOO_MODELS.length > 0 && (
                            <>
                              <p className="text-[10px] tracking-[0.2em] text-text-muted uppercase mb-1">JAECOO</p>
                              {JAECOO_MODELS.map((model) => (
                                <Link
                                  key={model.slug}
                                  href={`/modelos/${model.slug}`}
                                  onClick={closeMobile}
                                  className="text-lg text-text-secondary hover:text-accent transition-colors py-1 min-h-[44px] flex items-center"
                                >
                                  {model.name}
                                  {model.fuelType === "Eléctrico" && (
                                    <span className="ml-2 text-xs font-semibold text-accent">EV</span>
                                  )}
                                </Link>
                              ))}
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </MobileItem>

              <MobileItem delay={0.15}>
                <Link href="/concesionarios" onClick={closeMobile} className="mobile-link">
                  Concesionarios
                </Link>
              </MobileItem>

              <MobileItem delay={0.2}>
                <Link href="/talleres" onClick={closeMobile} className="mobile-link">
                  Talleres
                </Link>
              </MobileItem>

              <MobileItem delay={0.25}>
                <Link href="/#contacto" onClick={closeMobile} className="mobile-link">
                  Contacto
                </Link>
              </MobileItem>

              <MobileItem delay={0.3}>
                <Link
                  href="/#contacto"
                  onClick={closeMobile}
                  className="btn-primary mt-2"
                  data-event="test_drive_click"
                  data-event-location="mobile_menu"
                >
                  Solicitar Test Drive
                </Link>
              </MobileItem>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        :global(.mobile-link) {
          font-size: 1.5rem;
          line-height: 1.2;
          font-weight: 300;
          color: #fff;
          transition: color 0.2s;
        }
        :global(.mobile-link:hover) {
          color: #00c9b7;
        }
        @media (min-width: 640px) {
          :global(.mobile-link) {
            font-size: 1.875rem;
          }
        }
      `}</style>
    </>
  );
}

function MobileItem({ delay, children }: { delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
