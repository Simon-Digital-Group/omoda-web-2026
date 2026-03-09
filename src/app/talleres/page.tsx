import type { Metadata } from "next";
import { Wrench, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkGrid from "@/components/network/NetworkGrid";
import { TALLERES, TALLER_DEPARTMENTS } from "@/lib/network-data";
import { SITE_CONFIG } from "@/lib/data";

export const metadata: Metadata = {
  title: "Talleres Autorizados | OMODA JAECOO Uruguay",
  description:
    "Encontrá los talleres de servicio autorizados OMODA y JAECOO en todo Uruguay. Atención profesional y repuestos originales.",
};

export default function TalleresPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        {/* Ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/[0.10] border border-accent/[0.20]">
              <Wrench className="w-5 h-5 text-accent" />
            </span>
            <span className="text-sm font-medium text-accent uppercase tracking-widest">
              Red de Servicio
            </span>
          </div>

          <h1 className="text-hero font-bold text-white mb-4 max-w-2xl leading-tight">
            Talleres<br />
            <span className="gradient-text">Autorizados</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl leading-relaxed mb-8">
            {TALLERES.length} talleres en todo el país. Técnicos certificados,
            diagnóstico oficial y repuestos originales OMODA y JAECOO.
          </p>

          {/* Schedule CTA */}
          <div className="flex flex-wrap gap-3">
            <a
              href={`${SITE_CONFIG.whatsapp}?text=Hola! Quisiera agendar un service`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <MessageCircle className="w-4 h-4" />
              Agendar service por WhatsApp
            </a>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/[0.06]">
            <div>
              <p className="text-2xl font-bold text-white">{TALLERES.length}</p>
              <p className="text-xs text-text-muted uppercase tracking-widest mt-0.5">Talleres</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{TALLER_DEPARTMENTS.length}</p>
              <p className="text-xs text-text-muted uppercase tracking-widest mt-0.5">Departamentos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Lun–Vie</p>
              <p className="text-xs text-text-muted uppercase tracking-widest mt-0.5">9:00 – 18:30</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="pb-28 md:pb-40">
        <div className="container-custom">
          <NetworkGrid
            locations={TALLERES}
            departments={TALLER_DEPARTMENTS}
            accentClass="text-accent"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
