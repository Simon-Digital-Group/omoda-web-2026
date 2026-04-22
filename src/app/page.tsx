import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ModelCarousel from "@/components/ModelCarousel";
import Features from "@/components/Features";
import About from "@/components/About";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { getHeroBanners, getVehicleModels } from "@/lib/contentful";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "OMODA | JAECOO Uruguay — SUVs Premium",
  description:
    "Concesionario oficial OMODA y JAECOO en Uruguay. SUVs premium con diseño, tecnología y rendimiento excepcional. Agendá tu test drive.",
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [banners, cmsModels] = await Promise.all([
    getHeroBanners(),
    getVehicleModels(),
  ]);

  return (
    <main id="main-content" className="min-h-screen">
      <Navbar cmsModels={cmsModels.length > 0 ? cmsModels : undefined} />
      <Hero banners={banners.length > 0 ? banners : undefined} />
      <ModelCarousel cmsModels={cmsModels.length > 0 ? cmsModels : undefined} />
      <Features />
      <About />
      <ContactForm />
      <Footer />
    </main>
  );
}
