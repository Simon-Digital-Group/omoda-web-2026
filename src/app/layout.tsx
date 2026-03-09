import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="es" className={`${inter.variable}`}>
      <body className="bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
