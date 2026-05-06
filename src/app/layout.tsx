import type { Metadata, Viewport } from "next";
import { Inter, Raleway, Michroma } from "next/font/google";
import localFont from "next/font/local";
import dynamic from "next/dynamic";
import ReducedMotionProvider from "@/components/ReducedMotionProvider";
import "./globals.css";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-T2SRZ76G";

// Defer below-the-fold chrome; keeps framer-motion out of the critical path
const CookieBanner = dynamic(() => import("@/components/CookieBanner"), {
  ssr: false,
});
const WhatsAppFloat = dynamic(() => import("@/components/WhatsAppFloat"), {
  ssr: false,
});
const AnalyticsEvents = dynamic(() => import("@/components/AnalyticsEvents"), {
  ssr: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  display: "swap",
});

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-michroma",
  display: "swap",
});

const neueHaas = localFont({
  src: [
    { path: "../../public/fonts/NeueHaasDisplay-Roman.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/NeueHaasDisplay-Mediu.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/NeueHaasDisplay-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0A0A",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://omodajaecoo.com.uy"),
  title: {
    default: "OMODA | JAECOO Uruguay — SUVs Premium",
    template: "%s | OMODA JAECOO Uruguay",
  },
  description:
    "Descubrí la nueva generación de SUVs premium. OMODA y JAECOO llegan a Uruguay con diseño, tecnología y rendimiento excepcional. Solicitá tu test drive.",
  keywords: [
    "OMODA Uruguay",
    "JAECOO Uruguay",
    "SUV premium",
    "autos nuevos Uruguay",
    "OMODA 5",
    "OMODA E5",
    "JAECOO 7",
    "test drive Montevideo",
  ],
  applicationName: "OMODA | JAECOO Uruguay",
  authors: [{ name: "Simon Digital Group", url: "https://simondigitalgroup.com" }],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: {
    canonical: "/",
    languages: {
      "es-UY": "https://omodajaecoo.com.uy",
      "x-default": "https://omodajaecoo.com.uy",
    },
  },
  openGraph: {
    title: "OMODA | JAECOO Uruguay — SUVs Premium",
    description:
      "Descubrí la nueva generación de SUVs premium en Uruguay.",
    type: "website",
    locale: "es_UY",
    siteName: "OMODA | JAECOO Uruguay",
    url: "https://omodajaecoo.com.uy",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "OMODA | JAECOO Uruguay" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OMODA | JAECOO Uruguay — SUVs Premium",
    description: "La nueva generación de SUVs premium en Uruguay.",
    images: ["/opengraph-image"],
  },
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: true, email: true, address: false },
};

// Escape </script> inside JSON-LD
function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

const autoDealerSchema = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: "OMODA | JAECOO Uruguay",
  description:
    "Concesionario oficial OMODA y JAECOO en Uruguay. SUVs premium con tecnología de vanguardia.",
  url: "https://omodajaecoo.com.uy",
  logo: "https://omodajaecoo.com.uy/images/omoda-jaecoo-logo.svg",
  telephone: "+59899100331",
  email: "ventas@omodajaecoo.com.uy",
  brand: [
    { "@type": "Brand", name: "OMODA" },
    { "@type": "Brand", name: "JAECOO" },
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Galicia 908",
    addressLocality: "Montevideo",
    addressCountry: "UY",
  },
  geo: { "@type": "GeoCoordinates", latitude: -34.9011, longitude: -56.1645 },
  sameAs: [
    "https://instagram.com/omodajaecoo.uy",
    "https://facebook.com/omodajaecoouy",
  ],
  areaServed: { "@type": "Country", name: "Uruguay" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-UY" className={`${inter.variable} ${raleway.variable} ${michroma.variable} ${neueHaas.variable}`}>
      <head>
        {/* Google Consent Mode v2: default denied BEFORE GTM loads */}
        <script
          id="consent-default"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                analytics_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                functionality_storage: 'granted',
                security_storage: 'granted',
                wait_for_update: 500
              });
              gtag('set', 'ads_data_redaction', true);
              gtag('set', 'url_passthrough', true);
            `,
          }}
        />
        {/* Google Tag Manager */}
        <script
          id="gtm-script"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      </head>
      <body className="bg-background text-text-primary antialiased">
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-background focus:rounded"
        >
          Saltar al contenido
        </a>
        <ReducedMotionProvider>
          {children}
        </ReducedMotionProvider>
        <WhatsAppFloat />
        <CookieBanner />
        <AnalyticsEvents />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(autoDealerSchema) }}
        />
      </body>
    </html>
  );
}
