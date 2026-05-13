import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MODEL_PAGES, ALL_MODEL_SLUGS } from "@/lib/models-data";
import { getVehicleModelBySlug, getVehicleModels } from "@/lib/contentful";

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
import ModelFAQSection from "@/components/model-page/ModelFAQ";
import ModelSEOContent from "@/components/model-page/ModelSEOContent";
import { getModelFaqs, faqsJsonLd } from "@/lib/model-faqs";
import { getSeoContent } from "@/lib/model-seo-content";

// ISR window: 5 min. Model pages are stable; cuts 2 Contentful fetches per
// request and improves TTFB for mobile users on slower networks.
export const revalidate = 300;

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  // Merge static slugs with CMS-managed slugs so any new model added in
  // Contentful is prerendered at build time. Falls back gracefully if the CMS
  // is unreachable during build (still ships the static set).
  const cmsModels = await getVehicleModels().catch(() => []);
  const cmsSlugs = cmsModels.map((m) => m.slug).filter(Boolean);
  const all = Array.from(new Set([...ALL_MODEL_SLUGS, ...cmsSlugs]));
  return all.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const fallback = MODEL_PAGES[params.slug];
  const cms = await getVehicleModelBySlug(params.slug).catch(() => null);
  if (!fallback && !cms) return {};

  const name = cms?.name || fallback?.name || "";
  const tagline = cms?.tagline || fallback?.tagline || "";
  const description = cms?.description || fallback?.heroDescription || "";
  const image = (cms?.heroIsVideo ? "" : cms?.heroImage) || fallback?.heroImage || "";
  const canonical = `/modelos/${params.slug}`;

  return {
    title: `${name} — ${tagline} | OMODA JAECOO Uruguay`,
    description: description.slice(0, 160),
    alternates: { canonical },
    openGraph: {
      title: `${name} — ${tagline}`,
      description,
      url: canonical,
      type: "website",
      images: image ? [{ url: image, width: 1200, height: 630, alt: name }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — ${tagline}`,
      description,
      images: image ? [image] : [],
    },
    robots: { index: true, follow: true },
  };
}

// Escape </script> inside JSON-LD to prevent breaking out of <script> block
function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

// Parse price string like "USD 29.990" → { value: 29990, currency: "USD" }
function parsePrice(raw: string): { value: number; currency: string } | null {
  if (!raw) return null;
  const match = raw.match(/([A-Z]{3})?\s*([\d.,]+)/);
  if (!match) return null;
  const currency = (match[1] || "USD").toUpperCase();
  const num = Number(match[2].replace(/\./g, "").replace(/,/g, "."));
  if (!Number.isFinite(num) || num <= 0) return null;
  return { value: num, currency };
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
  const [cms, cmsModels] = await Promise.all([
    getVehicleModelBySlug(params.slug),
    getVehicleModels(),
  ]);

  // Need at least static data to render
  if (!staticModel && !cms) {
    notFound();
  }

  // Merge: CMS overrides static where data exists
  const s = staticModel;
  const name = pick(cms?.name, s?.name || "");
  const brand = pick(cms?.brand, s?.brand || "OMODA") as "OMODA" | "JAECOO";

  return (
    <main id="main-content" className="min-h-screen">
      <Navbar cmsModels={cmsModels.length > 0 ? cmsModels : undefined} />

      <ModelHero
        name={name}
        brand={brand}
        tagline={pick(cms?.tagline, s?.tagline || "")}
        description={pick(cms?.description, s?.heroDescription || "")}
        heroImage={pick(cms?.heroImage, s?.heroImage || "")}
        heroIsVideo={cms?.heroIsVideo}
        heroPoster={cms?.heroPoster}
        price={pick(cms?.price, s?.price || "")}
        primaryCtaLabel={cms?.ctaLabel}
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
        heading="Seguridad de"
        headingAccent="vanguardia"
        features={pick(cms?.safetyFeatures, s?.safetyFeatures || [])}
      />

      <ModelSpecs
        specs={pick(cms?.specs, s?.specs || [])}
        modelName={name}
      />

      <ModelSEOContent content={(() => {
        const staticSeo = getSeoContent(params.slug);
        const cmsParagraphs = (cms?.seoBody || "")
          .split(/\n\s*\n+/)
          .map((p: string) => p.trim())
          .filter(Boolean);
        const sectionLabel = pick(cms?.seoSectionLabel, staticSeo?.sectionLabel || "");
        const heading = pick(cms?.seoHeading, staticSeo?.heading || "");
        const paragraphs = cmsParagraphs.length > 0 ? cmsParagraphs : (staticSeo?.paragraphs || []);
        if (!sectionLabel && !heading && paragraphs.length === 0) return null;
        return { sectionLabel, heading, paragraphs };
      })()} />

      <ModelFAQSection
        faqs={getModelFaqs({
          name,
          brand,
          price: pick(cms?.price, s?.price || ""),
          fuelType: cms?.fuelType,
        })}
        modelName={name}
      />

      <ModelCTA
        modelName={name}
        price={pick(cms?.price, s?.price || "")}
        brand={brand}
        brochureUrl={cms?.brochureUrl}
        primaryCtaLabel={cms?.ctaLabel}
      />

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(buildJsonLd()) }}
      />
    </main>
  );

  function buildJsonLd() {
    const priceRaw = pick(cms?.price, s?.price || "");
    const priceParsed = parsePrice(priceRaw);
    const imageUrl = cms?.heroIsVideo ? "" : pick(cms?.heroImage, s?.heroImage || "");
    const descriptionText = pick(cms?.description, s?.heroDescription || "");
    const url = `https://omodajaecoo.com.uy/modelos/${params.slug}`;
    const faqs = getModelFaqs({ name, brand, price: priceRaw, fuelType: cms?.fuelType });
    const faqSchema = faqsJsonLd(faqs);

    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Vehicle",
          "@id": `${url}#vehicle`,
          name,
          brand: { "@type": "Brand", name: brand },
          description: descriptionText,
          url,
          image: imageUrl || undefined,
          bodyType: "SUV",
          fuelType: cms?.fuelType || "Nafta",
          vehicleModelDate: new Date().getFullYear().toString(),
          offers: priceParsed
            ? {
                "@type": "Offer",
                price: priceParsed.value,
                priceCurrency: priceParsed.currency,
                availability: "https://schema.org/InStock",
                url,
              }
            : undefined,
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: "https://omodajaecoo.com.uy" },
            { "@type": "ListItem", position: 2, name: "Modelos", item: "https://omodajaecoo.com.uy/#modelos" },
            { "@type": "ListItem", position: 3, name },
          ],
        },
        {
          "@type": faqSchema["@type"],
          mainEntity: faqSchema.mainEntity,
        },
      ],
    };
  }
}
