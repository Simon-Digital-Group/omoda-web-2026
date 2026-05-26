import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrega de vehículo",
  description: "Formulario de entrega de vehículo OMODA | JAECOO Uruguay.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function EntregaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main id="main-content" className="min-h-screen bg-background text-text-primary">
      {children}
    </main>
  );
}
