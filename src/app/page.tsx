import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ModelCarousel from "@/components/ModelCarousel";
import Features from "@/components/Features";
import About from "@/components/About";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { getHeroBanner, getVehicleModels } from "@/lib/contentful";

export const revalidate = 60; // revalidate every 60 seconds

export default async function Home() {
  const hero = await getHeroBanner();
  const cmsModels = await getVehicleModels();

  return (
    <main id="main-content" className="min-h-screen">
      <Navbar cmsModels={cmsModels.length > 0 ? cmsModels : undefined} />
      <Hero
        {...(hero
          ? {
              title: hero.title,
              subtitle: hero.subtitle,
              ctaText: hero.ctaText,
              ctaLink: hero.ctaLink,
              backgroundUrl: hero.backgroundUrl,
            }
          : {})}
      />
      <ModelCarousel cmsModels={cmsModels.length > 0 ? cmsModels : undefined} />
      <Features />
      <About />
      <ContactForm />
      <Footer />
    </main>
  );
}
