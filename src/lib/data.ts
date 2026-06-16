/**
 * Static fallback data.
 * Used when Contentful is not configured yet.
 * Replace with CMS data once Contentful is set up.
 */

import type { VehicleModel, NavLink } from "@/types";

export const NAV_LINKS: NavLink[] = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Modelos", href: "/#modelos" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Contacto", href: "/#contacto" },
];

export const VEHICLE_MODELS: VehicleModel[] = [
  {
    name: "OMODA 5",
    slug: "omoda-5",
    brand: "OMODA",
    tagline: "Diseño que inspira",
    description:
      "El SUV compacto que redefine la categoría. Tecnología de vanguardia, diseño audaz y rendimiento excepcional en un paquete premium.",
    sideImage: { fields: { title: "OMODA 5", file: { url: "/images/omoda-5.png", contentType: "image/png", details: { size: 0 } } } },
    lengthMm: 4400,
    widthMm: 1830,
    heightMm: 1588,
    wheelbaseMm: 2630,
    price: "Desde USD 29.990",
    fuelType: "Nafta",
    highlighted: true,
  },
  {
    name: "OMODA E5",
    slug: "omoda-e5",
    brand: "OMODA",
    tagline: "Energía sin límites",
    description:
      "100% eléctrico, 100% OMODA. Autonomía excepcional, carga rápida y la misma experiencia premium que define a la marca.",
    sideImage: { fields: { title: "OMODA E5", file: { url: "/images/omoda-e5.png", contentType: "image/png", details: { size: 0 } } } },
    lengthMm: 4424,
    widthMm: 1830,
    heightMm: 1588,
    wheelbaseMm: 2630,
    price: "Desde USD 35.990",
    fuelType: "Eléctrico",
    highlighted: true,
  },
  {
    name: "JAECOO 5",
    slug: "jaecoo-5",
    brand: "JAECOO",
    tagline: "Aventura premium",
    description:
      "Robusto, elegante y capaz. El JAECOO 5 combina lo mejor del off-road con el confort de un SUV premium.",
    sideImage: { fields: { title: "JAECOO 5", file: { url: "/images/jaecoo-5.png", contentType: "image/png", details: { size: 0 } } } },
    lengthMm: 4400,
    widthMm: 1860,
    heightMm: 1680,
    wheelbaseMm: 2672,
    price: "Desde USD 33.990",
    fuelType: "Nafta",
    highlighted: true,
  },
  {
    name: "JAECOO 6",
    slug: "jaecoo-6",
    brand: "JAECOO",
    tagline: "Potencia y estilo",
    description:
      "Un SUV que no hace concesiones. Potencia, espacio y tecnología en cada detalle.",
    sideImage: { fields: { title: "JAECOO 6", file: { url: "/images/jaecoo-6.png", contentType: "image/png", details: { size: 0 } } } },
    lengthMm: 4605,
    widthMm: 1890,
    heightMm: 1720,
    wheelbaseMm: 2745,
    price: "Desde USD 38.990",
    fuelType: "Nafta",
    highlighted: true,
  },
  {
    name: "JAECOO 7",
    slug: "jaecoo-7",
    brand: "JAECOO",
    tagline: "El insignia",
    description:
      "El SUV insignia de JAECOO. Máximo espacio, máxima tecnología, máximo confort.",
    sideImage: { fields: { title: "JAECOO 7", file: { url: "/images/jaecoo-7.png", contentType: "image/png", details: { size: 0 } } } },
    lengthMm: 4780,
    widthMm: 1920,
    heightMm: 1750,
    wheelbaseMm: 2820,
    price: "Desde USD 44.990",
    fuelType: "Nafta",
    highlighted: true,
  },
];

export const SITE_CONFIG = {
  siteName: "OMODA | JAECOO Uruguay",
  phone: "+598 92 001 372",
  email: "ventas@omodajaecoo.com.uy",
  address: "Galicia 908, Montevideo, Uruguay",
  instagram: "https://instagram.com/omodajaecoo.uy",
  facebook: "https://facebook.com/omodajaecoouy",
  whatsapp: "https://wa.me/59892001372",
};
