import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkGrid from "@/components/network/NetworkGrid";
import { getNetworkLocations } from "@/lib/contentful";

export const metadata: Metadata = {
  title: "Talleres Autorizados | OMODA JAECOO Uruguay",
  description:
    "Encontrá los talleres de servicio autorizados OMODA y JAECOO en todo Uruguay. Atención profesional y repuestos originales.",
};

export const revalidate = 60;

export default async function TalleresPage() {
  const talleres = await getNetworkLocations("taller");
  const departments = Array.from(
    new Set(talleres.map((t) => t.department))
  ).sort();

  return (
    <main id="main-content" className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        {/* Ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="container-custom relative z-10">
          <h1 className="text-section font-michroma font-bold text-white uppercase mb-6 max-w-2xl leading-tight">
            Talleres<br />
            Autorizados
          </h1>
          <p className="text-text-secondary text-lg max-w-xl leading-relaxed mb-8">
            {talleres.length > 0
              ? `${talleres.length} talleres en todo el país. Técnicos certificados, diagnóstico oficial y repuestos originales OMODA y JAECOO.`
              : "Red de talleres autorizados OMODA y JAECOO en todo Uruguay."}
          </p>

        </div>
      </section>

      {/* Grid */}
      <section className="pb-28 md:pb-40">
        <div className="container-custom">
          {talleres.length > 0 ? (
            <NetworkGrid
              locations={talleres}
              departments={departments}
              accentClass="text-accent"
            />
          ) : (
            <div className="text-center py-20 border border-white/[0.06] rounded-2xl bg-white/[0.02]">
              <p className="text-text-secondary text-lg">
                No hay talleres disponibles en este momento.
              </p>
              <p className="text-text-muted text-sm mt-2">
                Contactanos por WhatsApp para agendar un service.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
