"use client";

import { motion } from "framer-motion";
import { Instagram, Facebook, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG, VEHICLE_MODELS } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.06]">
      {/* Top glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg font-bold tracking-wider text-white">OMODA</span>
              <span className="text-text-muted font-light">|</span>
              <span className="text-lg font-bold tracking-wider text-white">JAECOO</span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              La nueva generación de SUVs premium en Uruguay. Diseño, tecnología
              y rendimiento excepcional.
            </p>
            <div className="flex gap-3">
              <a
                href={SITE_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]
                           hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-text-secondary" />
              </a>
              <a
                href={SITE_CONFIG.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]
                           hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-text-secondary" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navegación
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Models */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Modelos
            </h3>
            <ul className="space-y-3">
              {VEHICLE_MODELS.map((model) => (
                <li key={model.slug}>
                  <a
                    href={`/modelos/${model.slug}`}
                    className="text-sm text-text-secondary hover:text-white transition-colors duration-300
                               inline-flex items-center gap-1"
                  >
                    {model.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>{SITE_CONFIG.address}</li>
              <li>{SITE_CONFIG.phone}</li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="hover:text-accent transition-colors"
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {year} OMODA | JAECOO Uruguay. Todos los derechos reservados.
          </p>
          <p className="text-xs text-text-muted">
            Representante oficial: Santa Rosa Automotores
          </p>
        </div>
      </div>
    </footer>
  );
}
