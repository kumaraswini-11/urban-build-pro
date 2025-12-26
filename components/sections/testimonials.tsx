"use client";

import { motion } from "motion/react";
import Image from "next/image";

import { ConstructionButton } from "@/components/construction-button";
import { Pretitle } from "@/components/pretitle";
import { Slider } from "@/components/slider";

export const Testimonials = () => {
  return (
    <section className="bg-muted overflow-hidden py-16 xl:py-32">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-16 xl:flex-row">
          {/* Text Content */}
          <div className="max-w-[500px] flex-1">
            <Pretitle text="Client Success" />
            <h2 className="h2 text-foreground mb-6">
              Built On Trust, Proven By Results
            </h2>
            <p className="text-muted-foreground mb-10 text-lg">
              We take pride in our long-standing relationships with developers
              and homeowners alike. Our reputation is built one brick at a time
              through transparency and quality.
            </p>
            <ConstructionButton label="Partner With Us" />
          </div>

          {/* Slider Display Area */}
          <div className="relative w-full flex-1">
            <div className="relative ml-auto h-[400px] w-full md:h-[500px] xl:w-[600px]">
              <Image
                src="/assets/images/testimonials/img.jpg"
                fill
                className="rounded-sm object-cover grayscale-50"
                alt="Client meeting on site"
              />

              {/* Floating Quote Card */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="border-primary absolute -bottom-10 left-0 z-20 w-full max-w-[450px] border-l-4 bg-white p-10 shadow-2xl md:-left-20"
              >
                <Image
                  src="/assets/images/testimonials/quote.svg"
                  width={40}
                  height={30}
                  alt="Quote"
                  className="mb-6 opacity-20"
                />
                <Slider />
                {/* This component iterates through your client quotes */}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
