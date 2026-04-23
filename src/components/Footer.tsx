import Image from "next/image";
import { NAV_LINKS, SITE_CONFIG, VEHICLE_MODELS } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.06]">

      <div className="container-custom py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Image
              src="/images/omoda-jaecoo-logo.svg"
              alt="OMODA | JAECOO Uruguay"
              width={120}
              height={20}
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

          {/* Red */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Red
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/concesionarios"
                  className="text-sm text-text-secondary hover:text-white transition-colors duration-300"
                >
                  Concesionarios
                </a>
              </li>
              <li>
                <a
                  href="/talleres"
                  className="text-sm text-text-secondary hover:text-white transition-colors duration-300"
                >
                  Talleres Autorizados
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contacto
            </h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>{SITE_CONFIG.address}</li>
              <li>
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                  className="hover:text-white transition-colors"
                >
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="hover:text-white transition-colors break-all"
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
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-text-muted">
            <a
              href="/politica-de-privacidad"
              className="hover:text-white transition-colors"
            >
              Política de Privacidad
            </a>
            <span className="text-white/[0.1]">|</span>
            <span>Representante oficial: Santa Rosa Automotores</span>
            <span className="text-white/[0.1]">|</span>
            <a
              href="https://simondigitalgroup.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Desarrollado por Simon
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
