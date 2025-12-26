"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

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
          className="fixed top-0 left-0 z-50 w-full shadow-lg"
        >
          <Header isSticky />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
