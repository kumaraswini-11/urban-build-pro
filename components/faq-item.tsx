"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { RiAddLine, RiSubtractLine } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FaqItemProps {
  title: string;
  description: string;
}

export const FaqItem = ({ title, description }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-6">
      <Button
        variant="link"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full items-center justify-between px-0 text-left hover:no-underline"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "font-bold text-lg uppercase tracking-tight transition-colors duration-300",
            isOpen
              ? "text-foreground"
              : "text-foreground group-hover:text-foreground/65",
          )}
        >
          {title}
        </span>
        <div
          className={cn(
            "flex size-8 items-center justify-center transition-all duration-300",
            isOpen
              ? "rotate-180 bg-background text-foreground"
              : "bg-primary text-foreground",
          )}
        >
          {isOpen ? <RiSubtractLine /> : <RiAddLine />}
        </div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="max-w-[90%] pt-4 text-muted-foreground leading-relaxed">
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
