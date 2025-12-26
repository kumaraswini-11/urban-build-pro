import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Stats } from "@/components/sections/stats";
import { StickyHeader } from "@/components/sections/sticky-header";
import { Testimonials } from "@/components/sections/testimonials";
import { Topbar } from "@/components/sections/topbar";
import { Work } from "@/components/sections/work";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <Topbar />

      {/* Static Header for initial load */}
      <Header />

      {/* Client-side Sticky Header handles the scroll logic independently */}
      <StickyHeader />

      <Hero />
      <About />
      <Stats />
      <Services />
      <Work />
      <Testimonials />
      <Faq />
      <Contact />
      <Footer />
    </main>
  );
}
