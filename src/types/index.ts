/**
 * Type definitions for the OMODA JAECOO Uruguay site.
 * These mirror the Contentful content types.
 */

export interface HeroBanner {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundMedia?: ContentfulMedia;
  overlayOpacity?: number;
}

export interface VehicleModel {
  name: string;
  slug: string;
  brand: "OMODA" | "JAECOO";
  tagline: string;
  description: string;
  sideImage: ContentfulMedia;
  galleryImages?: ContentfulMedia[];
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  wheelbaseMm: number;
  price: string;
  fuelType: "Nafta" | "Eléctrico" | "Híbrido";
  highlighted: boolean;
}

export interface SiteSettings {
  siteName: string;
  logo?: ContentfulMedia;
  phone: string;
  email: string;
  address: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
}

export interface ContentfulMedia {
  fields: {
    title: string;
    file: {
      url: string;
      contentType: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
    };
  };
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  model: string;
  message?: string;
}

/** Navigation link */
export interface NavLink {
  label: string;
  href: string;
}
