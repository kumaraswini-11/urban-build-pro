"use client";

import { motion } from "motion/react";
import Image from "next/image";

import { ConstructionButton } from "@/components/construction-button";
import { Pretitle } from "@/components/pretitle";

export const About = () => {
  return (
    <section className="overflow-hidden py-16 xl:py-32" id="about">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-12 xl:flex-row xl:items-center xl:gap-24">
          {/* Text Content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="mx-auto max-w-2xl xl:mx-0">
              <Pretitle text="About our firm" />
              <h2 className="h2 mb-6 text-foreground">
                Focused on Excellence In Every Project
              </h2>
              <p className="mb-10 text-lg text-muted-foreground leading-relaxed">
                Our unwavering commitment to excellence drives every project we
                undertake. From concept to completion, we meticulously craft
                solutions that embody quality, precision, and innovation.
              </p>

              {/* CEO Signature Block */}
              <div className="mb-10 flex flex-col items-end gap-3">
                <Image
                  src="/assets/images/about/signature.svg"
                  width={154}
                  height={38}
                  alt="CEO Signature"
                  className="object-contain dark:invert"
                />
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-primary" />
                  <p className="font-bold text-foreground/60 text-sm uppercase tracking-widest">
                    Company CEO
                  </p>
                </div>
              </div>

              <ConstructionButton href="#contact" label="Get in touch" />
            </div>
          </motion.div>

          {/* Visual Side */}
          <motion.div
            className="flex flex-1 justify-center xl:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative aspect-444/492 w-full max-w-[480px]">
              {/* Decorative Background Frame */}
              <div className="absolute -top-6 -left-6 -z-10 hidden h-full w-full rounded-sm border-2 border-primary/20 xl:block" />
              <div className="absolute -right-4 -bottom-4 -z-10 hidden h-32 w-32 bg-primary xl:block" />

              <div className="relative h-full w-full overflow-hidden rounded-sm shadow-2xl">
                <Image
                  src="/assets/images/about/img.jpg"
                  fill
                  alt="Construction project management team"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1280px) 100vw, 500px"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
