import Image from "next/image";

import { ConstructionButton } from "@/components/construction-button";
import { SECTION_IDS } from "@/lib/section-ids";
import heroImage from "@/public/assets/images/hero/bg.jpg";

// Server Component: the LCP image is an optimised next/image (was a 7.8 MB
// CSS background, P1) and the heading renders visible without JavaScript.
export const Hero = () => {
  return (
    <section
      id={SECTION_IDS.home}
      className="relative flex h-[85vh] min-h-150 items-center overflow-hidden"
    >
      <Image
        src={heroImage}
        alt=""
        fill
        preload
        sizes="100vw"
        placeholder="blur"
        className="object-cover object-center"
      />
      {/* High-contrast overlay for readability */}
      <div
        className="absolute inset-0 z-10 bg-linear-to-r from-black/80 via-black/40 to-transparent"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4">
        <div className="relative z-20 max-w-175">
          <h1 className="h1 text-on-inverse">
            <span className="text-primary">Building</span> robust, lasting
            solutions
          </h1>

          <p className="mt-6 mb-10 max-w-140 text-lg text-on-inverse/80 leading-relaxed md:text-xl">
            From initial concept to final completion, we meticulously optimize
            every detail for strength and longevity, crafting solutions that
            instill confidence.
          </p>

          <ConstructionButton
            href={`#${SECTION_IDS.work}`}
            label="See our work"
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 z-20 h-2 w-full bg-primary md:w-1/3" />
    </section>
  );
};
