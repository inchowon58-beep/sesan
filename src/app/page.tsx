import Hero from "./components/Hero";
import About from "./components/About";
import Services, { GuideSection } from "./components/Services";
import Gallery from "./components/Gallery";
import Reviews from "./components/Reviews";
import FAQ from "./components/FAQ";
import ArticlesScroll from "./components/ArticlesScroll";
import ContactSection from "./components/ContactSection";
import { listPages } from "@/lib/seo-pages";

export default async function HomePage() {
  const pages = await listPages();
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Gallery />
      <GuideSection />
      <Reviews />
      <ArticlesScroll pages={pages} />
      <FAQ />
      <ContactSection />
    </>
  );
}
