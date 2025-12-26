"use client";

import { motion, AnimatePresence } from "motion/react";
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
            "text-lg font-bold tracking-tight uppercase transition-colors duration-300",
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
              ? "bg-background text-foreground rotate-180"
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
            <p className="text-muted-foreground max-w-[90%] pt-4 leading-relaxed">
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
