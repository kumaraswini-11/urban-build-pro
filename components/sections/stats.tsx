"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import CountUp from "react-countup";

import { statistics } from "@/lib/constants";

export const Stats = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="bg-primary mt-16 py-16 xl:mt-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 xl:grid-cols-4">
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center text-center xl:items-start xl:text-left"
            >
              <div className="flex items-baseline gap-1 text-5xl font-extrabold text-white md:text-6xl">
                {isInView ? (
                  <CountUp end={stat.value} duration={2.5} />
                ) : (
                  <span>0</span>
                )}
                <span className="text-accent">{stat.suffix}</span>
              </div>
              <p className="mt-2 max-w-45 text-sm font-medium tracking-wide text-white/70 uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
