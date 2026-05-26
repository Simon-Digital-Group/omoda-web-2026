import type { NetworkLocation } from "@/lib/network-data";

/**
 * Escape </script> sequences in JSON-LD to prevent script tag break-out.
 */
export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

const BASE_URL = "https://omodajaecoo.com.uy";

/**
 * Build AutoDealer / AutomotiveBusiness schema entries for each network
 * location. Returns an ItemList @graph suitable for a single JSON-LD block
 * per page (concesionarios or talleres).
 */
export function networkLocationsSchema(
  locations: NetworkLocation[],
  type: "AutoDealer" | "AutoRepair",
  pageUrl: string
) {
  if (!locations.length) return null;

  const items = locations.map((loc, i) => ({
    "@type": type,
    "@id": `${pageUrl}#loc-${i}`,
    name: loc.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: loc.address,
      addressLocality: loc.city || loc.department,
      addressRegion: loc.department,
      addressCountry: "UY",
    },
    telephone: loc.phone ? loc.phone.replace(/[^\d+]/g, "") : undefined,
    email: loc.email || undefined,
    openingHours: loc.hours || undefined,
    parentOrganization: {
      "@type": "AutoDealer",
      name: "OMODA | JAECOO Uruguay",
      url: BASE_URL,
    },
    areaServed: loc.department,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name:
      type === "AutoDealer"
        ? "Concesionarios OMODA y JAECOO en Uruguay"
        : "Talleres autorizados OMODA y JAECOO en Uruguay",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item,
    })),
  };
}

/**
 * Generic BreadcrumbList schema.
 */
export function breadcrumbSchema(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.url ? { item: it.url } : {}),
    })),
  };
}
