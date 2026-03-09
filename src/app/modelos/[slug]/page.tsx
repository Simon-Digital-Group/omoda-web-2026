import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MODEL_PAGES, ALL_MODEL_SLUGS } from "@/lib/models-data";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ModelHero from "@/components/model-page/ModelHero";
import ModelKeyStats from "@/components/model-page/ModelKeyStats";
import ModelDesignSection from "@/components/model-page/ModelDesignSection";
import ModelColors from "@/components/model-page/ModelColors";
import ModelFeatureGrid from "@/components/model-page/ModelFeatureGrid";
import ModelSpecs from "@/components/model-page/ModelSpecs";
import ModelPowertrain from "@/components/model-page/ModelPowertrain";
import ModelCTA from "@/components/model-page/ModelCTA";

/**
 * Dynamic model detail page.
 *
 * Route: /modelos/[slug]
 *
 * Section flow (based on omodaauto.co.uk/omoda-7):
 * 1. Hero          — cinematic full-screen
 * 2. Key Stats     — 4 large metrics (OMODA UK signature)
 * 3. Exterior      — full-bleed image + text
 * 4. Interior      — reversed layout
 * 5. Colors        — crystal palette (right after design, as on OMODA UK)
 * 6. Technology    — feature grid
 * 7. Safety        — feature grid
 * 8. Powertrain    — engine options
 * 9. Specs         — full technical table
 * 10. CTA          — test drive + WhatsApp
 */

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return ALL_MODEL_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const model = MODEL_PAGES[params.slug];
  if (!model) return {};

  return {
    title: `${model.name} — ${model.tagline} | OMODA JAECOO Uruguay`,
    description: model.heroDescription,
    openGraph: {
      title: `${model.name} — ${model.tagline}`,
      description: model.heroDescription,
      images: [model.heroImage],
    },
  };
}

export default function ModelPage({ params }: PageProps) {
  const model = MODEL_PAGES[params.slug];

  if (!model) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* 1. Hero */}
      <ModelHero
        name={model.name}
        brand={model.brand}
        tagline={model.tagline}
        description={model.heroDescription}
        heroImage={model.heroImage}
        price={model.price}
      />

      {/* 2. Key Stats — large numbers, OMODA UK signature */}
      <ModelKeyStats stats={model.keyStats} brand={model.brand} />

      {/* 3. Exterior Design */}
      <ModelDesignSection
        id="exterior"
        heading={model.exteriorHeading}
        description={model.exteriorDescription}
        images={model.exteriorImages}
        highlights={model.exteriorHighlights}
      />

      {/* 4. Interior Design */}
      <ModelDesignSection
        id="interior"
        heading={model.interiorHeading}
        description={model.interiorDescription}
        images={model.interiorImages}
        highlights={model.interiorHighlights}
        reverse
      />

      {/* 5. Colors — right after design sections, as per OMODA UK */}
      <ModelColors
        colors={model.colors}
        modelName={model.name}
        brand={model.brand}
      />

      {/* 6. Technology */}
      <ModelFeatureGrid
        id="tecnologia"
        sectionLabel="Tecnología"
        heading="Innovación que"
        headingAccent="conecta"
        features={model.technologyFeatures}
      />

      {/* 7. Safety */}
      <ModelFeatureGrid
        id="seguridad"
        sectionLabel="Seguridad"
        heading="Protección que"
        headingAccent="inspira confianza"
        features={model.safetyFeatures}
      />

      {/* 8. Powertrain */}
      <ModelPowertrain options={model.powertrainOptions} />

      {/* 9. Specs */}
      <ModelSpecs specs={model.specs} modelName={model.name} />

      {/* 10. CTA */}
      <ModelCTA
        modelName={model.name}
        price={model.price}
        brand={model.brand}
      />

      <Footer />
    </main>
  );
}
