import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ModelCarousel from "@/components/ModelCarousel";
import Features from "@/components/Features";
import About from "@/components/About";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

/**
 * Main landing page — OMODA | JAECOO Uruguay
 *
 * Content flow:
 * 1. Hero (full-screen, video/image bg, CTA) — Motorflow-inspired
 * 2. Model Carousel (tabs + car + specs) — OMODA global-inspired
 * 3. Features (glassmorphism cards) — Landio-inspired
 * 4. About (brand story + stats)
 * 5. Contact Form (lead capture)
 * 6. Footer
 *
 * When Contentful is configured, the Hero and Models will pull from CMS.
 * For now, static data from lib/data.ts is used.
 */
export default function Home() {
  // TODO: When Contentful is ready, fetch here:
  // const hero = await getHeroBanner();
  // const models = await getVehicleModels();

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ModelCarousel />
      <Features />
      <About />
      <ContactForm />
      <Footer />
    </main>
  );
}
