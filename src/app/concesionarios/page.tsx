import type { Metadata } from "next";
import { Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkGrid from "@/components/network/NetworkGrid";
import { CONCESIONARIOS, CONCESIONARIO_DEPARTMENTS } from "@/lib/network-data";
import { SITE_CONFIG } from "@/lib/data";

export const metadata: Metadata = {
  title: "Concesionarios | OMODA JAECOO Uruguay",
  description:
    "Encontrá el concesionario OMODA y JAECOO más cercano en Uruguay. Toda la red de ventas autorizada.",
};

export default function ConcesionariosPage() {
  return (
    <main id="main-content" className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        {/* Ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent-alt/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="container-custom relative z-10">
          <h1 className="text-section font-michroma font-bold text-white uppercase mb-6 max-w-2xl leading-tight">
            Concesionarios<br />
            Autorizados
          </h1>
          <p className="text-text-secondary text-lg max-w-xl leading-relaxed mb-8">
            {CONCESIONARIOS.length} puntos de venta en todo Uruguay.
            Encontrá el concesionario más cercano y agendá tu prueba de manejo.
          </p>

          {/* Contact CTA */}
          <div className="flex flex-wrap gap-3">
            <a href="tel:+59899100331" className="btn-primary">
              <Phone className="w-4 h-4" />
              +598 99 100 331
            </a>
            <a
              href={`${SITE_CONFIG.whatsapp}?text=Hola! Me gustaría conocer un concesionario cercano`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Consultar por WhatsApp
            </a>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/[0.06]">
            <div>
              <p className="text-2xl font-bold text-white">{CONCESIONARIOS.length}</p>
              <p className="text-xs text-text-muted uppercase tracking-widest mt-0.5">Concesionarios</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{CONCESIONARIO_DEPARTMENTS.length}</p>
              <p className="text-xs text-text-muted uppercase tracking-widest mt-0.5">Departamentos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">5</p>
              <p className="text-xs text-text-muted uppercase tracking-widest mt-0.5">Modelos disponibles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-28 md:pb-40">
        <div className="container-custom">
          <NetworkGrid
            locations={CONCESIONARIOS}
            departments={CONCESIONARIO_DEPARTMENTS}
            accentClass="text-accent-alt"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
