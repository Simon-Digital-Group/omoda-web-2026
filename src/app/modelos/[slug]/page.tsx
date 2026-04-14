import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MODEL_PAGES, ALL_MODEL_SLUGS, type PowertrainOption } from "@/lib/models-data";
import { getVehicleModelBySlug } from "@/lib/contentful";

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

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return ALL_MODEL_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const fallback = MODEL_PAGES[params.slug];
  if (!fallback) return {};

  return {
    title: `${fallback.name} — ${fallback.tagline} | OMODA JAECOO Uruguay`,
    description: fallback.heroDescription,
    openGraph: {
      title: `${fallback.name} — ${fallback.tagline}`,
      description: fallback.heroDescription,
      images: [fallback.heroImage],
    },
  };
}

/**
 * Helper: use CMS value if it has content, otherwise fallback to static
 */
function pick<T>(cms: T | undefined | null, fallback: T): T {
  if (cms === undefined || cms === null || cms === "") return fallback;
  if (Array.isArray(cms) && cms.length === 0) return fallback;
  return cms;
}

export default async function ModelPage({ params }: PageProps) {
  const staticModel = MODEL_PAGES[params.slug];
  const cms = await getVehicleModelBySlug(params.slug);

  // Need at least static data to render
  if (!staticModel && !cms) {
    notFound();
  }

  // Merge: CMS overrides static where data exists
  const s = staticModel;
  const name = pick(cms?.name, s?.name || "");
  const brand = pick(cms?.brand, s?.brand || "OMODA") as "OMODA" | "JAECOO";

  return (
    <main className="min-h-screen">
      <Navbar />

      <ModelHero
        name={name}
        brand={brand}
        tagline={pick(cms?.tagline, s?.tagline || "")}
        description={pick(cms?.description, s?.heroDescription || "")}
        heroImage={pick(cms?.heroImage, s?.heroImage || "")}
        price={pick(cms?.price, s?.price || "")}
      />

      <ModelKeyStats
        stats={pick(cms?.keyStats, s?.keyStats || [])}
        brand={brand}
      />

      <ModelDesignSection
        id="exterior"
        heading={pick(cms?.exteriorHeading, s?.exteriorHeading || "")}
        description={pick(cms?.exteriorDescription, s?.exteriorDescription || "")}
        images={pick(cms?.exteriorImages, s?.exteriorImages || [])}
        highlights={pick(cms?.exteriorHighlights, s?.exteriorHighlights || [])}
      />

      <ModelDesignSection
        id="interior"
        heading={pick(cms?.interiorHeading, s?.interiorHeading || "")}
        description={pick(cms?.interiorDescription, s?.interiorDescription || "")}
        images={pick(cms?.interiorImages, s?.interiorImages || [])}
        highlights={pick(cms?.interiorHighlights, s?.interiorHighlights || [])}
        reverse
      />

      <ModelColors
        colors={pick(cms?.colors, s?.colors || [])}
        modelName={name}
        brand={brand}
      />

      <ModelFeatureGrid
        id="tecnologia"
        sectionLabel="Tecnología"
        heading="Innovación que"
        headingAccent="conecta"
        features={pick(cms?.technologyFeatures, s?.technologyFeatures || [])}
      />

      <ModelFeatureGrid
        id="seguridad"
        sectionLabel="Seguridad"
        heading="Protección que"
        headingAccent="inspira confianza"
        features={pick(cms?.safetyFeatures, s?.safetyFeatures || [])}
      />

      <ModelPowertrain
        options={pick<PowertrainOption[]>(cms?.powertrainOptions as PowertrainOption[] | undefined, s?.powertrainOptions || [])}
      />

      <ModelSpecs
        specs={pick(cms?.specs, s?.specs || [])}
        modelName={name}
      />

      <ModelCTA
        modelName={name}
        price={pick(cms?.price, s?.price || "")}
        brand={brand}
      />

      <Footer />
    </main>
  );
}
