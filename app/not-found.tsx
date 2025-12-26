"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { RiAlertFill, RiArrowLeftLine, RiHome4Line } from "react-icons/ri";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="bg-background relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* BLUEPRINT GRID PATTERN - Uses CSS linear-gradients to create a technical architectural grid linked to your border color variable. */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(var(--border) 1px, transparent 1px), 
            linear-gradient(90deg, var(--border) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative z-10 container mx-auto text-center">
        {/* Animated Icon Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <RiAlertFill className="text-primary text-8xl md:text-9xl" />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-primary absolute inset-0 text-8xl blur-2xl md:text-9xl"
            >
              <RiAlertFill />
            </motion.div>
          </div>
        </motion.div>

        {/* 404 Header - Linked to DM Sans */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-dm-sans text-foreground text-8xl leading-none font-black tracking-tighter uppercase md:text-[12rem]"
        >
          404
        </motion.h1>

        {/* Content Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-6 max-w-lg"
        >
          <h2 className="font-barlow text-primary text-2xl font-bold tracking-widest uppercase md:text-3xl">
            Area Restricted: Blueprint Missing
          </h2>
          <p className="text-muted-foreground mt-4 font-medium">
            You&apos;ve wandered off the job site. The page you are looking for
            has been demolished or was never in the plans.
          </p>
        </motion.div>

        {/* Action Buttons - Fully Integrated with Shadcn Theme */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="h-14 rounded-none px-10 text-base font-bold tracking-widest uppercase shadow-lg transition-transform hover:opacity-80"
          >
            <Link href="/">
              <RiHome4Line className="size-4" />
              Return to Site
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => window.history.back()}
            className="border-primary text-primary hover:bg-primary h-14 rounded-none border-2 bg-transparent px-10 text-base font-bold tracking-widest uppercase transition-all hover:text-white"
          >
            <RiArrowLeftLine className="size-4" />
            Previous Zone
          </Button>
        </motion.div>
      </div>

      {/* INDUSTRIAL CAUTION STRIPES - This visually anchors the page to the
      construction theme. */}
      <div
        className="absolute bottom-0 left-0 h-6 w-full opacity-20"
        style={{
          backgroundColor: "var(--primary)",
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 20px, var(--foreground) 20px, var(--foreground) 40px)",
        }}
      />
    </main>
  );
}
