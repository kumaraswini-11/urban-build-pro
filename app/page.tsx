import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Stats } from "@/components/sections/stats";
import { Testimonials } from "@/components/sections/testimonials";
import { Topbar } from "@/components/sections/topbar";
import { Work } from "@/components/sections/work";

export default function Home() {
  return (
    <>
      {/* Site chrome lives outside <main> so header/footer keep their
          banner/contentinfo landmark roles (A6). */}
      <Topbar />
      <Header />
      <main id="main" className="relative flex min-h-screen flex-col">
        <Hero />
        <About />
        <Stats />
        <Services />
        <Work />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
