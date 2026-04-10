import type { Metadata } from "next";
import { Inter, Raleway, Michroma } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "OMODA | JAECOO Uruguay — SUVs Premium",
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
  openGraph: {
    title: "OMODA | JAECOO Uruguay — SUVs Premium",
    description:
      "Descubrí la nueva generación de SUVs premium en Uruguay.",
    type: "website",
    locale: "es_UY",
    siteName: "OMODA | JAECOO Uruguay",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${raleway.variable} ${michroma.variable} ${neueHaas.variable}`}>
      <body className="bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
