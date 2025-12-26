"use client";

import { motion } from "motion/react";

import { FaqItem } from "@/components/faq-item";
import { Pretitle } from "@/components/pretitle";
import { FAQ } from "@/lib/constants";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Staggers the animation of each FaqItem
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] as const }, // as const tells TypeScript to treat this as a tuple (fixed-length array with specific types) rather than a generic number[] array
  },
};

export const Faq = () => {
  return (
    <section id="faq" className="bg-background py-16 xl:py-32">
      <div className="container mx-auto px-4">
        {/* Header Text */}
        <div className="mx-auto mb-12 max-w-[540px] text-center xl:mb-20">
          <Pretitle text="Common Questions" center />
          <h2 className="h2 text-foreground mb-4">
            Got Questions? We&apos;ve Got You Covered
          </h2>
          <p className="text-muted-foreground">
            From project timelines to safety protocols, we&apos;ve compiled the
            most frequent inquiries to help you understand our process.
          </p>
        </div>

        {/* FAQ List */}
        <motion.div
          className="mx-auto max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <ul className="border-border/30 flex flex-col border-t">
            {FAQ.map((item, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                className="border-border/30 border-b"
              >
                <FaqItem title={item.question} description={item.answer} />
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};
