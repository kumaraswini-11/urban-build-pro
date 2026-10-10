"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { Header } from "./header";

export const StickyHeader = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          // width-before-scroll-bar: Radix scroll-lock (Select, Sheet) hides the
          // scrollbar and pads <body>; this class gives the fixed header the same
          // compensation so it does not jump. inset-x-0 (not w-full) lets the
          // margin shrink it.
          className="width-before-scroll-bar fixed inset-x-0 top-0 z-50 shadow-lg"
        >
          <Header isSticky />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
