"use client";

import { motion } from "framer-motion";
import { NAV_LINKS, SITE_CONFIG, VEHICLE_MODELS } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.06]">

      <div className="container-custom py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img
              src="/images/omoda-jaecoo-logo.svg"
              alt="OMODA | JAECOO Uruguay"
              className="h-5 w-auto mb-5"
            />
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              La nueva generación de SUVs premium en Uruguay. Diseño, tecnología
              y rendimiento excepcional.
            </p>
            <div className="flex gap-4">
              <a
                href={SITE_CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-white transition-colors duration-300"
              >
                Instagram
              </a>
              <a
                href={SITE_CONFIG.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-white transition-colors duration-300"
              >
                Facebook
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
