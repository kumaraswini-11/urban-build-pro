"use client";

import { motion } from "motion/react";

import { ConstructionButton } from "@/components/construction-button";
import { cn } from "@/lib/utils";

export const Hero = () => {
  return (
    <section
      className={cn(
        "relative flex h-[85vh] min-h-150 items-center overflow-hidden",
        "bg-hero bg-cover bg-center bg-no-repeat",
      )}
    >
      {/* High-Contrast Overlay for Readability */}
      <div
        className="absolute inset-0 z-10 bg-linear-to-r from-black/80 via-black/40 to-transparent"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4">
        <div className="relative z-20 max-w-175">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl leading-[1.1] font-extrabold text-white md:text-7xl lg:text-8xl">
              <span className="text-accent">Building</span> robust, lasting
              solutions
            </h1>

            <p className="mt-6 mb-10 max-w-135 text-lg leading-relaxed text-white/80 md:text-xl">
              From initial concept to final completion, we meticulously optimize
              every detail for strength and longevity, crafting solutions that
              instill confidence.
            </p>

            <div className="flex flex-wrap gap-4">
              <ConstructionButton
                label="See our work"
                onClick={() =>
                  document
                    .getElementById("work")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Visual Decoration: Industrial Accent Line */}
      <div className="bg-accent absolute bottom-0 left-0 z-20 h-2 w-full md:w-1/3" />
    </section>
  );
};
