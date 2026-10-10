import Image from "next/image";

import { ConstructionButton } from "@/components/construction-button";
import { Pretitle } from "@/components/pretitle";
import { Slider } from "@/components/slider";
import { SECTION_IDS } from "@/lib/section-ids";

export const Testimonials = () => {
  return (
    <section
      id={SECTION_IDS.testimonials}
      className="overflow-hidden bg-muted py-16 xl:py-32"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-16 xl:flex-row">
          <div className="max-w-[500px] flex-1">
            <Pretitle text="Client Success" />
            <h2 className="h2 mb-6 text-foreground">
              Built On Trust, Proven By Results
            </h2>
            <p className="mb-10 text-foreground/80 text-lg">
              We take pride in our long-standing relationships with developers
              and homeowners alike. Our reputation is built one brick at a time
              through transparency and quality.
            </p>
            <ConstructionButton
              href={`#${SECTION_IDS.contact}`}
              label="Partner with us"
            />
          </div>

          <div className="relative w-full flex-1">
            <div className="relative ml-auto h-[400px] w-full md:h-[500px] xl:w-[600px]">
              <Image
                src="/assets/images/testimonials/img.jpg"
                fill
                sizes="(min-width: 1280px) 600px, 100vw"
                className="rounded-sm object-cover grayscale-50"
                alt="Client meeting on site"
              />

              <div className="absolute -bottom-10 left-0 z-20 w-full max-w-[450px] border-primary border-l-4 bg-card p-10 shadow-2xl md:-left-20">
                <Image
                  src="/assets/images/testimonials/quote.svg"
                  width={40}
                  height={30}
                  alt=""
                  className="mb-6 opacity-20"
                />
                <Slider />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
